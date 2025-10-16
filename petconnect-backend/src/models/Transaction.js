const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Transaction must belong to a user']
  },
  walkRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WalkRequest',
    default: null
  },
  type: {
    type: String,
    enum: ['payment', 'payout', 'refund', 'commission', 'withdrawal'],
    required: [true, 'Transaction type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'KES',
    enum: ['KES', 'USD']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'card', 'wallet', 'bank_transfer'],
    required: [true, 'Payment method is required']
  },
  reference: {
    type: String,
    required: [true, 'Transaction reference is required'],
    unique: true
  },
  mpesaDetails: {
    checkoutRequestId: String,
    merchantRequestId: String,
    phoneNumber: String,
    receiptNumber: String,
    transactionDate: Date,
    amount: Number
  },
  description: {
    type: String,
    required: [true, 'Transaction description is required']
  },
  commissionDeducted: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  fees: {
    platform: {
      type: Number,
      default: 0
    },
    payment: {
      type: Number,
      default: 0
    }
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ reference: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1, createdAt: -1 });

// Pre-save middleware to calculate net amount
transactionSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('commissionDeducted') || this.isModified('fees')) {
    const totalFees = (this.fees.platform || 0) + (this.fees.payment || 0);
    this.netAmount = this.amount - this.commissionDeducted - totalFees;
  }
  next();
});

// Method to mark transaction as completed
transactionSchema.methods.complete = function(mpesaDetails = null) {
  this.status = 'completed';
  if (mpesaDetails) {
    this.mpesaDetails = { ...this.mpesaDetails, ...mpesaDetails };
  }
  return this.save();
};

// Method to mark transaction as failed
transactionSchema.methods.fail = function(reason = null) {
  this.status = 'failed';
  if (reason) {
    this.metadata = this.metadata || new Map();
    this.metadata.set('failureReason', reason);
  }
  return this.save();
};

module.exports = mongoose.model('Transaction', transactionSchema);
