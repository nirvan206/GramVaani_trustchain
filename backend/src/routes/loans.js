const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect, verifiedOnly } = require('../middleware/auth');
const Loan = require('../models/Loan');
const User = require('../models/User');
const blockchainService = require('../config/blockchain');
const logger = require('../utils/logger');

// @route   POST /api/loans
// @desc    Create new loan request
// @access  Private (verified users only)
router.post(
  '/',
  [
    protect,
    verifiedOnly,
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('interestRate').isNumeric().withMessage('Interest rate must be a number'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
    body('purpose').notEmpty().withMessage('Purpose is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount, interestRate, duration, purpose, collateral } = req.body;

      // Check eligibility on blockchain
      const reputation = await blockchainService.getReputation(req.user.walletAddress);
      if (parseInt(reputation.trustScore) < 400) {
        return res.status(403).json({ 
          error: 'Trust score too low. Minimum 400 required.',
          trustScore: reputation.trustScore 
        });
      }

      // Create loan on blockchain
      const blockchainLoanId = await blockchainService.createLoan(
        amount,
        interestRate,
        duration,
        purpose,
        collateral || ''
      );

      // Create loan in database
      const loan = await Loan.create({
        blockchainLoanId,
        borrower: req.user._id,
        amount,
        interestRate,
        duration,
        purpose,
        collateral,
        status: 'pending',
      });

      await loan.populate('borrower', 'name walletAddress');

      // Emit socket event
      req.app.get('io').emit('new-loan-request', {
        loanId: loan._id,
        amount,
        borrower: req.user.name,
      });

      res.status(201).json({ success: true, loan });
    } catch (error) {
      logger.error('Create loan error:', error);
      res.status(500).json({ error: 'Failed to create loan' });
    }
  }
);

// @route   GET /api/loans
// @desc    Get all loans (with filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, role } = req.query;
    let query = {};

    // Filter by role
    if (role === 'borrower' || !role) {
      query.borrower = req.user._id;
    } else if (role === 'lender') {
      query.lender = req.user._id;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const loans = await Loan.find(query)
      .populate('borrower', 'name walletAddress')
      .populate('lender', 'name walletAddress')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: loans.length, loans });
  } catch (error) {
    logger.error('Get loans error:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
});

// @route   GET /api/loans/:id
// @desc    Get single loan
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('borrower', 'name walletAddress email phone')
      .populate('lender', 'name walletAddress email phone');

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Check if user is authorized to view this loan
    if (
      loan.borrower._id.toString() !== req.user._id.toString() &&
      (!loan.lender || loan.lender._id.toString() !== req.user._id.toString()) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ error: 'Not authorized to view this loan' });
    }

    // Get blockchain data
    try {
      const blockchainLoan = await blockchainService.getLoan(loan.blockchainLoanId);
      loan.blockchainData = blockchainLoan;
    } catch (error) {
      logger.error('Error fetching blockchain data:', error);
    }

    res.json({ success: true, loan });
  } catch (error) {
    logger.error('Get loan error:', error);
    res.status(500).json({ error: 'Failed to fetch loan' });
  }
});

// @route   PUT /api/loans/:id/approve
// @desc    Approve loan (lender only)
// @access  Private
router.put('/:id/approve', protect, verifiedOnly, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.status !== 'pending') {
      return res.status(400).json({ error: 'Loan is not pending' });
    }

    // Approve on blockchain
    await blockchainService.approveLoan(loan.blockchainLoanId, loan.amount);

    // Update database
    loan.status = 'approved';
    loan.lender = req.user._id;
    loan.approvedAt = new Date();
    loan.dueDate = new Date(Date.now() + loan.duration * 24 * 60 * 60 * 1000);
    loan.totalDue = loan.calculateTotalDue();
    await loan.save();

    await loan.populate('borrower lender', 'name walletAddress');

    // Emit socket event
    req.app.get('io').to(`user-${loan.borrower.walletAddress}`).emit('loan-approved', {
      loanId: loan._id,
      lender: req.user.name,
    });

    res.json({ success: true, loan });
  } catch (error) {
    logger.error('Approve loan error:', error);
    res.status(500).json({ error: 'Failed to approve loan' });
  }
});

// @route   POST /api/loans/:id/repay
// @desc    Make repayment
// @access  Private
router.post(
  '/:id/repay',
  [
    protect,
    body('amount').isNumeric().withMessage('Amount must be a number'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { amount } = req.body;
      const loan = await Loan.findById(req.params.id);

      if (!loan) {
        return res.status(404).json({ error: 'Loan not found' });
      }

      if (loan.status !== 'approved' && loan.status !== 'active') {
        return res.status(400).json({ error: 'Loan is not active' });
      }

      // Make repayment on blockchain
      await blockchainService.makeRepayment(loan.blockchainLoanId, amount);

      // Update database
      loan.repaidAmount += parseFloat(amount);
      if (loan.status === 'approved') {
        loan.status = 'active';
      }

      const remainingAmount = loan.getRemainingAmount();
      if (remainingAmount <= 0) {
        loan.status = 'repaid';
        loan.repaidAt = new Date();
      }

      await loan.save();
      await loan.populate('borrower lender', 'name walletAddress');

      // Emit socket event
      req.app.get('io').emit('repayment-made', {
        loanId: loan._id,
        amount,
        remainingAmount,
      });

      res.json({ 
        success: true, 
        loan,
        remainingAmount,
        message: remainingAmount <= 0 ? 'Loan fully repaid!' : 'Repayment successful'
      });
    } catch (error) {
      logger.error('Repayment error:', error);
      res.status(500).json({ error: 'Failed to process repayment' });
    }
  }
);

// @route   GET /api/loans/pending/all
// @desc    Get all pending loans (for lenders)
// @access  Private
router.get('/pending/all', protect, async (req, res) => {
  try {
    const loans = await Loan.find({ status: 'pending' })
      .populate('borrower', 'name walletAddress location')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, count: loans.length, loans });
  } catch (error) {
    logger.error('Get pending loans error:', error);
    res.status(500).json({ error: 'Failed to fetch pending loans' });
  }
});

module.exports = router;
