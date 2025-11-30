const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const blockchainService = require('../config/blockchain');
const logger = require('../utils/logger');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post(
  '/register',
  [
    body('walletAddress').isEthereumAddress().withMessage('Invalid wallet address'),
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('email').optional().isEmail().withMessage('Invalid email'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { walletAddress, name, email, phone, language, location } = req.body;

      // Check if user exists
      let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create user
      user = await User.create({
        walletAddress: walletAddress.toLowerCase(),
        name,
        email,
        phone,
        language: language || 'en',
        location,
      });

      // Initialize reputation on blockchain
      try {
        await blockchainService.initializeReputation(walletAddress);
        logger.info(`Reputation initialized for ${walletAddress}`);
      } catch (error) {
        logger.error('Error initializing reputation:', error);
        // Continue even if blockchain call fails
      }

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          name: user.name,
          role: user.role,
          kycStatus: user.kycStatus,
          language: user.language,
        },
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ error: 'Server error during registration' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [body('walletAddress').isEthereumAddress().withMessage('Invalid wallet address')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { walletAddress } = req.body;

      const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!user.isActive) {
        return res.status(401).json({ error: 'Account is deactivated' });
      }

      // Update last login
      await user.updateLastLogin();

      const token = generateToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          walletAddress: user.walletAddress,
          name: user.name,
          role: user.role,
          kycStatus: user.kycStatus,
          language: user.language,
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Server error during login' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-refreshToken');
    res.json({ success: true, user });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', require('../middleware/auth').protect, async (req, res) => {
  try {
    const { name, email, phone, language, location } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (language) user.language = language;
    if (location) user.location = location;

    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
