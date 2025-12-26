const mongoose = require('mongoose');

const temperamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Temperament name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  icon: {
    type: String,
    default: '😊'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for pet count
temperamentSchema.virtual('petCount', {
  ref: 'Pet',
  localField: '_id',
  foreignField: 'temperament',
  count: true
});

// Index for faster queries
temperamentSchema.index({ name: 1 });
temperamentSchema.index({ isActive: 1 });

// Static method to get active temperaments
temperamentSchema.statics.getActiveTemperaments = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

module.exports = mongoose.model('Temperament', temperamentSchema);
