const mongoose = require('mongoose');

const walkRequestSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Walk request must have an owner']
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: [true, 'Walk request must have a pet']
  },
  assignedWalker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'requested'
  },
  location: {
    pickup: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number], // [longitude, latitude]
      address: String,
      instructions: String
    },
    dropoff: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number],
      address: String,
      instructions: String
    }
  },
  scheduledTime: {
    type: Date,
    required: [true, 'Scheduled time is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Minimum duration is 15 minutes'],
    max: [120, 'Maximum duration is 120 minutes']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  walkDetails: {
    startTime: Date,
    endTime: Date,
    actualDuration: Number, // in minutes
    distance: Number, // in km
    route: [{
      latitude: Number,
      longitude: Number,
      timestamp: Date
    }],
    photos: [{
      url: String,
      caption: String,
      timestamp: Date
    }],
    notes: String,
    summary: String
  },
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    cancelledAt: Date,
    refundAmount: Number
  },
  isRated: {
    type: Boolean,
    default: false
  },
  specialInstructions: String,
  emergencyContact: {
    name: String,
    phone: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
walkRequestSchema.index({ owner: 1, status: 1 });
walkRequestSchema.index({ assignedWalker: 1, status: 1 });
walkRequestSchema.index({ status: 1, scheduledTime: 1 });
walkRequestSchema.index({ 'location.pickup': '2dsphere' });

// Virtual for calculating commission
walkRequestSchema.virtual('commission').get(function() {
  return this.price * 0.30; // 30% platform commission
});

walkRequestSchema.virtual('walkerEarnings').get(function() {
  return this.price * 0.70; // 70% walker earnings
});

// Method to update walk status
walkRequestSchema.methods.updateStatus = function(newStatus, updatedBy) {
  this.status = newStatus;
  
  if (newStatus === 'in_progress') {
    this.walkDetails.startTime = new Date();
  } else if (newStatus === 'completed') {
    this.walkDetails.endTime = new Date();
    if (this.walkDetails.startTime) {
      this.walkDetails.actualDuration = Math.round(
        (this.walkDetails.endTime - this.walkDetails.startTime) / (1000 * 60)
      );
    }
  } else if (newStatus === 'cancelled') {
    this.cancellation.cancelledBy = updatedBy;
    this.cancellation.cancelledAt = new Date();
  }
  
  return this.save();
};

// Method to add location point to route
walkRequestSchema.methods.addRoutePoint = function(latitude, longitude) {
  this.walkDetails.route.push({
    latitude,
    longitude,
    timestamp: new Date()
  });
  return this.save();
};

module.exports = mongoose.model('WalkRequest', walkRequestSchema);
