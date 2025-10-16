const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    enum: ['logout', 'password_change', 'security_breach', 'admin_action'],
    default: 'logout'
  },
  blacklistedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Create TTL index to automatically remove expired tokens
blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create index for faster lookups
blacklistedTokenSchema.index({ token: 1 });
blacklistedTokenSchema.index({ userId: 1 });

module.exports = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
