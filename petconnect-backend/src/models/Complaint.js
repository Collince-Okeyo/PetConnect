const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Complaint must have a reporter']
  },
  againstUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Complaint must have a target user']
  },
  walkRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WalkRequest',
    default: null
  },
  type: {
    type: String,
    enum: [
      'inappropriate_behavior',
      'safety_concern',
      'payment_issue',
      'service_quality',
      'communication_problem',
      'no_show',
      'other'
    ],
    required: [true, 'Complaint type is required']
  },
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Complaint description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  evidence: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'document']
    },
    url: String,
    description: String
  }],
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'dismissed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  adminNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    action: {
      type: String,
      enum: ['warning', 'suspension', 'ban', 'no_action', 'refund']
    },
    description: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
complaintSchema.index({ status: 1, createdAt: -1 });
complaintSchema.index({ againstUser: 1 });
complaintSchema.index({ fromUser: 1 });
complaintSchema.index({ type: 1 });

// Method to update complaint status
complaintSchema.methods.updateStatus = function(newStatus, adminId, notes = '') {
  this.status = newStatus;
  
  if (notes) {
    this.adminNotes.push({
      note: notes,
      addedBy: adminId
    });
  }
  
  if (newStatus === 'resolved' || newStatus === 'dismissed') {
    this.resolution.resolvedBy = adminId;
    this.resolution.resolvedAt = new Date();
  }
  
  return this.save();
};

module.exports = mongoose.model('Complaint', complaintSchema);
