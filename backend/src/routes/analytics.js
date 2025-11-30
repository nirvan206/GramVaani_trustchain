const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Loan = require('../models/Loan');
const User = require('../models/User');
const logger = require('../utils/logger');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private (admin)
router.get('/dashboard', protect, authorize('admin', 'arbitrator'), async (req, res) => {
  try {
    const totalLoans = await Loan.countDocuments();
    const activeLoans = await Loan.countDocuments({ status: 'active' });
    const repaidLoans = await Loan.countDocuments({ status: 'repaid' });
    const defaultedLoans = await Loan.countDocuments({ status: 'defaulted' });
    const pendingLoans = await Loan.countDocuments({ status: 'pending' });

    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ kycStatus: 'verified' });

    const totalDisbursed = await Loan.aggregate([
      { $match: { status: { $in: ['active', 'repaid'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalRepaid = await Loan.aggregate([
      { $group: { _id: null, total: { $sum: '$repaidAmount' } } }
    ]);

    res.json({
      success: true,
      analytics: {
        loans: {
          total: totalLoans,
          active: activeLoans,
          repaid: repaidLoans,
          defaulted: defaultedLoans,
          pending: pendingLoans,
        },
        users: {
          total: totalUsers,
          verified: verifiedUsers,
        },
        financial: {
          totalDisbursed: totalDisbursed[0]?.total || 0,
          totalRepaid: totalRepaid[0]?.total || 0,
        },
      },
    });
  } catch (error) {
    logger.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
