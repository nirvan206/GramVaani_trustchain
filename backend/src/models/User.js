const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      sparse: true,
      lowercase: true,
    },
    phone: {
      type: String,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['borrower', 'lender', 'admin', 'arbitrator'],
      default: 'borrower',
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    kycDocuments: {
      aadhaar: String,
      pan: String,
      photo: String,
    },
    biometricData: {
      faceDescriptor: [Number],
      fingerprint: String,
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu'],
    },
    location: {
      state: String,
      district: String,
      village: String,
      pincode: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ walletAddress: 1 });
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

// Virtual for full address
userSchema.virtual('fullAddress').get(function () {
  if (!this.location) return '';
  return `${this.location.village}, ${this.location.district}, ${this.location.state} - ${this.location.pincode}`;
});

// Method to check if user is verified
userSchema.methods.isVerified = function () {
  return this.kycStatus === 'verified';
};

// Method to update last login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
