const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const blockchainService = require('../config/blockchain');
const Loan = require('../models/Loan');
const logger = require('../utils/logger');

// @route   POST /api/disputes
// @desc    Create new dispute
// @access  Private
router.post(
  '/',
  [
    protect,
    body('loanId').notEmpty().withMessage('Loan ID is required'),
    body('reason').notEmpty().withMessage('Reason is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { loanId, reason } = req.body;

      const loan = await Loan.findById(loanId).populate('borrower lender');
      if (!loan) {
        return res.status(404).json({ error: 'Loan not found' });
      }

      // Verify user is part of the loan
      if (
        loan.borrower._id.toString() !== req.user._id.toString() &&
        (!loan.lender || loan.lender._id.toString() !== req.user._id.toString())
      ) {
        return res.status(403).json({ error: 'Not authorized to create dispute for this loan' });
      }

      // Create dispute on blockchain
      const disputeId = await blockchainService.createDispute(
        loan.blockchainLoanId,
        loan.borrower.walletAddress,
        loan.lender.walletAddress,
        reason
      );

      res.status(201).json({ 
        success: true, 
        disputeId,
        message: 'Dispute created successfully'
      });
    } catch (error) {
      logger.error('Create dispute error:', error);
      res.status(500).json({ error: 'Failed to create dispute' });
    }
  }
);

// @route   GET /api/disputes/:id
// @desc    Get dispute details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const dispute = await blockchainService.getDispute(req.params.id);

    res.json({ success: true, dispute });
  } catch (error) {
    logger.error('Get dispute error:', error);
    res.status(500).json({ error: 'Failed to fetch dispute' });
  }
});

module.exports = router;
