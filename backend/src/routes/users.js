const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const blockchainService = require('../config/blockchain');
const logger = require('../utils/logger');

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-refreshToken');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// @route   PUT /api/users/:id/verify
// @desc    Verify user KYC (admin only)
// @access  Private (admin)
router.put('/:id/verify', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.kycStatus = 'verified';
    await user.save();

    // Verify on blockchain
    await blockchainService.verifyUser(user.walletAddress);

    res.json({ success: true, user });
  } catch (error) {
    logger.error('Verify user error:', error);
    res.status(500).json({ error: 'Failed to verify user' });
  }
});

module.exports = router;
