const mongoose = require('mongoose');

const petTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet type name is required'],
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
    default: '🐾'
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
petTypeSchema.virtual('petCount', {
  ref: 'Pet',
  localField: '_id',
  foreignField: 'petType',
  count: true
});

// Index for faster queries
petTypeSchema.index({ name: 1 });
petTypeSchema.index({ isActive: 1 });

// Static method to get active types
petTypeSchema.statics.getActiveTypes = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

module.exports = mongoose.model('PetType', petTypeSchema);
