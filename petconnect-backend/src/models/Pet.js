const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Pet must belong to an owner']
  },
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true,
    maxlength: [30, 'Pet name cannot be more than 30 characters']
  },
  type: {
    type: String,
    required: [true, 'Pet type is required'],
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other']
  },
  breed: {
    type: String,
    required: [true, 'Pet breed is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Pet age is required'],
    min: [0, 'Age cannot be negative'],
    max: [30, 'Age cannot be more than 30 years']
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative'],
    max: [200, 'Weight cannot be more than 200kg']
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Pet gender is required']
  },
  photos: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  temperament: {
    type: String,
    enum: ['calm', 'energetic', 'aggressive', 'friendly', 'shy', 'playful'],
    default: 'friendly'
  },
  specialNeeds: [{
    type: String,
    description: String
  }],
  vaccinations: [{
    name: String,
    date: Date,
    nextDue: Date,
    veterinarian: String
  }],
  medicalHistory: [{
    condition: String,
    treatment: String,
    date: Date,
    veterinarian: String,
    notes: String
  }],
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  vetInfo: {
    name: String,
    phone: String,
    address: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  walkPreferences: {
    duration: {
      type: Number,
      default: 30, // minutes
      min: 15,
      max: 120
    },
    distance: {
      type: Number,
      default: 2, // km
      min: 0.5,
      max: 10
    },
    notes: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
petSchema.index({ owner: 1 });
petSchema.index({ type: 1 });
petSchema.index({ isActive: 1 });

module.exports = mongoose.model('Pet', petSchema);
