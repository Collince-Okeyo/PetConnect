const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Wallet must belong to a user'],
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  currency: {
    type: String,
    default: 'KES',
    enum: ['KES', 'USD']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  pendingWithdrawals: [{
    amount: Number,
    requestedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    reference: String
  }]
}, {
  timestamps: true
});

// Index for efficient queries
walletSchema.index({ user: 1 });
walletSchema.index({ lastUpdated: -1 });

// Method to add funds to wallet
walletSchema.methods.addFunds = function(amount, description = '') {
  this.balance += amount;
  this.lastUpdated = new Date();
  return this.save();
};

// Method to deduct funds from wallet
walletSchema.methods.deductFunds = function(amount, description = '') {
  if (this.balance < amount) {
    throw new Error('Insufficient wallet balance');
  }
  this.balance -= amount;
  this.lastUpdated = new Date();
  return this.save();
};

// Method to check if wallet has sufficient funds
walletSchema.methods.hasSufficientFunds = function(amount) {
  return this.balance >= amount;
};

// Method to request withdrawal
walletSchema.methods.requestWithdrawal = function(amount) {
  if (this.balance < amount) {
    throw new Error('Insufficient wallet balance for withdrawal');
  }
  
  const withdrawal = {
    amount,
    requestedAt: new Date(),
    status: 'pending',
    reference: `WTH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  
  this.pendingWithdrawals.push(withdrawal);
  this.balance -= amount; // Hold the amount
  this.lastUpdated = new Date();
  
  return this.save();
};

// Method to complete withdrawal
walletSchema.methods.completeWithdrawal = function(reference) {
  const withdrawal = this.pendingWithdrawals.find(w => w.reference === reference);
  if (!withdrawal) {
    throw new Error('Withdrawal request not found');
  }
  
  withdrawal.status = 'completed';
  this.lastUpdated = new Date();
  return this.save();
};

// Method to fail withdrawal (refund to balance)
walletSchema.methods.failWithdrawal = function(reference) {
  const withdrawal = this.pendingWithdrawals.find(w => w.reference === reference);
  if (!withdrawal) {
    throw new Error('Withdrawal request not found');
  }
  
  withdrawal.status = 'failed';
  this.balance += withdrawal.amount; // Refund the amount
  this.lastUpdated = new Date();
  return this.save();
};

module.exports = mongoose.model('Wallet', walletSchema);
