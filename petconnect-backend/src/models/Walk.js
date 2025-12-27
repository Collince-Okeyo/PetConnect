const mongoose = require('mongoose');

const walkSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: [true, 'Pet is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  walker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Walker is required']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Minimum duration is 15 minutes'],
    max: [120, 'Maximum duration is 120 minutes']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  pickupLocation: {
    type: String
  },
  dropoffLocation: {
    type: String
  },
  specialInstructions: {
    type: String,
    maxlength: [500, 'Instructions cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  actualDuration: {
    type: Number
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: [500, 'Review cannot exceed 500 characters']
  },
  cancellationReason: {
    type: String
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
walkSchema.index({ owner: 1, scheduledDate: -1 });
walkSchema.index({ walker: 1, scheduledDate: -1 });
walkSchema.index({ status: 1 });

// Virtual for formatted date
walkSchema.virtual('formattedDate').get(function() {
  return this.scheduledDate.toLocaleDateString();
});

module.exports = mongoose.model('Walk', walkSchema);
