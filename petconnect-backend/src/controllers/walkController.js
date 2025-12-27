const Walk = require('../models/Walk');
const Pet = require('../models/Pet');
const User = require('../models/User');

// @desc    Get available walkers
// @route   GET /api/walks/walkers/available
// @access  Private
const getAvailableWalkers = async (req, res) => {
  try {
    const walkers = await User.find({
      role: 'walker',
      isOnline: true,
      isDeleted: false,
      status: 'active'
    }).select('name email phone profileImage location rating totalWalks');

    res.json({
      success: true,
      data: {
        walkers
      }
    });
  } catch (error) {
    console.error('Get available walkers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching walkers'
    });
  }
};

// @desc    Create walk booking
// @route   POST /api/walks/book
// @access  Private/Owner
const createWalkBooking = async (req, res) => {
  try {
    const {
      petId,
      walkerId,
      scheduledDate,
      scheduledTime,
      duration,
      specialInstructions,
      pickupLocation,
      dropoffLocation
    } = req.body;

    // Validate pet belongs to user
    const pet = await Pet.findOne({
      _id: petId,
      owner: req.user.id,
      isActive: true
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found or does not belong to you'
      });
    }

    // Validate walker exists and is available
    const walker = await User.findOne({
      _id: walkerId,
      role: 'walker',
      isOnline: true,
      status: 'active'
    });

    if (!walker) {
      return res.status(404).json({
        success: false,
        message: 'Walker not found or not available'
      });
    }

    // Calculate price (base rate * duration multiplier)
    const baseRate = 300; // KES per 30 minutes
    const price = (baseRate / 30) * duration;

    // Create walk booking
    const walk = await Walk.create({
      pet: petId,
      owner: req.user.id,
      walker: walkerId,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      duration,
      specialInstructions,
      pickupLocation,
      dropoffLocation,
      price,
      status: 'pending'
    });

    // Populate the walk data
    await walk.populate([
      { path: 'pet', select: 'name breed petType' },
      { path: 'walker', select: 'name email phone profileImage rating' }
    ]);

    res.status(201).json({
      success: true,
      data: {
        walk
      },
      message: 'Walk booking created successfully'
    });
  } catch (error) {
    console.error('Create walk booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking'
    });
  }
};

// @desc    Get user's walks
// @route   GET /api/walks/my-walks
// @access  Private
const getUserWalks = async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = {
      $or: [
        { owner: req.user.id },
        { walker: req.user.id }
      ]
    };

    if (status) {
      query.status = status;
    }

    const walks = await Walk.find(query)
      .populate('pet', 'name breed petType photos')
      .populate('owner', 'name email phone profileImage')
      .populate('walker', 'name email phone profileImage rating')
      .sort({ scheduledDate: -1 });

    res.json({
      success: true,
      data: {
        walks
      }
    });
  } catch (error) {
    console.error('Get user walks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching walks'
    });
  }
};

// @desc    Get walk by ID
// @route   GET /api/walks/:id
// @access  Private
const getWalkById = async (req, res) => {
  try {
    const walk = await Walk.findById(req.params.id)
      .populate('pet', 'name breed petType photos')
      .populate('owner', 'name email phone profileImage')
      .populate('walker', 'name email phone profileImage rating');

    if (!walk) {
      return res.status(404).json({
        success: false,
        message: 'Walk not found'
      });
    }

    // Check if user is owner or walker
    if (walk.owner._id.toString() !== req.user.id && walk.walker._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this walk'
      });
    }

    res.json({
      success: true,
      data: {
        walk
      }
    });
  } catch (error) {
    console.error('Get walk by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching walk'
    });
  }
};

// @desc    Cancel walk
// @route   PUT /api/walks/:id/cancel
// @access  Private
const cancelWalk = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const walk = await Walk.findById(req.params.id);

    if (!walk) {
      return res.status(404).json({
        success: false,
        message: 'Walk not found'
      });
    }

    // Check if user is owner or walker
    if (walk.owner.toString() !== req.user.id && walk.walker.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this walk'
      });
    }

    // Check if walk can be cancelled
    if (['completed', 'cancelled'].includes(walk.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${walk.status} walk`
      });
    }

    walk.status = 'cancelled';
    walk.cancellationReason = cancellationReason;
    walk.cancelledBy = req.user.id;
    walk.cancelledAt = new Date();

    await walk.save();

    res.json({
      success: true,
      data: {
        walk
      },
      message: 'Walk cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel walk error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling walk'
    });
  }
};

module.exports = {
  getAvailableWalkers,
  createWalkBooking,
  getUserWalks,
  getWalkById,
  cancelWalk
};
