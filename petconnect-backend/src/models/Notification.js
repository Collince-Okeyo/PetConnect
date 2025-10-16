const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Notification must belong to a user']
  },
  type: {
    type: String,
    enum: [
      'walk_request',
      'walk_accepted',
      'walk_started',
      'walk_completed',
      'payment_received',
      'payment_failed',
      'rating_received',
      'complaint_filed',
      'account_verified',
      'account_suspended',
      'general',
      'promotion'
    ],
    required: [true, 'Notification type is required']
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  channels: [{
    type: String,
    enum: ['in_app', 'email', 'sms', 'push'],
    default: ['in_app']
  }],
  scheduledFor: {
    type: Date,
    default: null // For scheduled notifications
  },
  sentAt: {
    type: Date,
    default: null
  },
  deliveryStatus: {
    in_app: {
      type: String,
      enum: ['pending', 'delivered', 'failed'],
      default: 'delivered'
    },
    email: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed'],
      default: 'pending'
    },
    sms: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed'],
      default: 'pending'
    },
    push: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed'],
      default: 'pending'
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ createdAt: -1 });

// Method to mark notification as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Method to mark notification as sent
notificationSchema.methods.markAsSent = function(channel) {
  if (this.deliveryStatus[channel]) {
    this.deliveryStatus[channel] = 'delivered';
  }
  this.sentAt = new Date();
  return this.save();
};

// Static method to create notification
notificationSchema.statics.createNotification = function(userId, type, title, message, data = {}) {
  return this.create({
    user: userId,
    type,
    title,
    message,
    data,
    channels: ['in_app'] // Default to in-app notification
  });
};

module.exports = mongoose.model('Notification', notificationSchema);
