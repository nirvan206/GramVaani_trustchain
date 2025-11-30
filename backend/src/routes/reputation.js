const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const blockchainService = require('../config/blockchain');
const logger = require('../utils/logger');

// @route   GET /api/reputation/:address
// @desc    Get reputation for a user
// @access  Private
router.get('/:address', protect, async (req, res) => {
  try {
    const { address } = req.params;

    const reputation = await blockchainService.getReputation(address);

    res.json({ success: true, reputation });
  } catch (error) {
    logger.error('Get reputation error:', error);
    res.status(500).json({ error: 'Failed to fetch reputation' });
  }
});

// @route   GET /api/reputation/me/score
// @desc    Get current user's reputation
// @access  Private
router.get('/me/score', protect, async (req, res) => {
  try {
    const reputation = await blockchainService.getReputation(req.user.walletAddress);

    res.json({ success: true, reputation });
  } catch (error) {
    logger.error('Get user reputation error:', error);
    res.status(500).json({ error: 'Failed to fetch reputation' });
  }
});

module.exports = router;
