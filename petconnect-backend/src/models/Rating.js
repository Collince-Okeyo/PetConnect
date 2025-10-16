const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rating must have a reviewer']
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rating must have a recipient']
  },
  walkRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WalkRequest',
    required: [true, 'Rating must be associated with a walk']
  },
  rating: {
    type: Number,
    required: [true, 'Rating value is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot be more than 500 characters'],
    trim: true
  },
  categories: {
    punctuality: {
      type: Number,
      min: 1,
      max: 5
    },
    care: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  isVerified: {
    type: Boolean,
    default: true // Only verified transactions can be rated
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
ratingSchema.index({ toUser: 1, createdAt: -1 });
ratingSchema.index({ fromUser: 1, walkRequest: 1 });
ratingSchema.index({ walkRequest: 1 });

// Ensure one rating per walk per user
ratingSchema.index({ fromUser: 1, walkRequest: 1 }, { unique: true });

// Pre-save middleware to update user's average rating
ratingSchema.post('save', async function() {
  try {
    const User = mongoose.model('User');
    const user = await User.findById(this.toUser);
    
    if (user) {
      await user.updateRating(this.rating);
    }
  } catch (error) {
    console.error('Error updating user rating:', error);
  }
});

module.exports = mongoose.model('Rating', ratingSchema);
