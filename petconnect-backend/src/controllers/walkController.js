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
    }).select('name email phone profilePicture location rating totalWalks');

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

    // Validate walker if provided (walker is optional)
    let walker = null;
    if (walkerId) {
      walker = await User.findOne({
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
    }

    // Calculate price (base rate * duration multiplier)
    const baseRate = 300; // KES per 30 minutes
    const price = (baseRate / 30) * duration;

    // Create walk booking
    const walkData = {
      pet: petId,
      owner: req.user.id,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      duration,
      specialInstructions,
      pickupLocation,
      dropoffLocation,
      price,
      status: walkerId ? 'pending' : 'unassigned' // unassigned if no walker selected
    };

    // Only add walker if provided
    if (walkerId) {
      walkData.walker = walkerId;
    }

    const walk = await Walk.create(walkData);

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
    console.log('getUserWalks called - User:', req.user.id, 'Role:', req.user.role, 'Status filter:', status);
    
    // Build query based on user role
    let query = {};
    
    if (req.user.role === 'admin') {
      // Admins can see all walks
      if (status) {
        query.status = status;
      }
      // No user filter for admins
    } else if (req.user.role === 'walker') {
      // For walkers requesting pending status, show both assigned pending and unassigned walks
      if (status === 'pending') {
        query.$or = [
          { walker: req.user.id, status: 'pending' },
          { walker: null, status: 'unassigned' }
        ];
      } else if (status) {
        // For other statuses, only show walks assigned to this walker
        query.walker = req.user.id;
        query.status = status;
      } else {
        // No status filter - show assigned walks and unassigned walks
        query.$or = [
          { walker: req.user.id },
          { walker: null, status: 'unassigned' }
        ];
      }
    } else if (req.user.role === 'owner') {
      // Owners see their own walks
      query.owner = req.user.id;
      if (status) {
        query.status = status;
      }
    } else {
      // For other roles, show both owner and walker walks
      query.$or = [
        { owner: req.user.id },
        { walker: req.user.id }
      ];
      if (status) {
        query.status = status;
      }
    }

    console.log('Final query:', JSON.stringify(query, null, 2));

    const walks = await Walk.find(query)
      .populate('pet', 'name breed petType photos')
      .populate('owner', 'name email phone profilePicture')
      .populate('walker', 'name email phone profilePicture rating')
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

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

// @desc    Accept walk request
// @route   PUT /api/walks/:id/accept
// @access  Private/Walker
const acceptWalk = async (req, res) => {
  try {
    const walk = await Walk.findById(req.params.id);

    if (!walk) {
      return res.status(404).json({
        success: false,
        message: 'Walk not found'
      });
    }

    // Check if walk is unassigned or assigned to this walker
    const isUnassigned = !walk.walker && walk.status === 'unassigned';
    const isAssignedToWalker = walk.walker && walk.walker.toString() === req.user.id;

    if (!isUnassigned && !isAssignedToWalker) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this walk'
      });
    }

    // Check if walk can be accepted
    if (!['pending', 'unassigned'].includes(walk.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot accept a ${walk.status} walk`
      });
    }

    // If unassigned, assign to this walker
    if (isUnassigned) {
      walk.walker = req.user.id;
    }

    walk.status = 'confirmed';
    await walk.save();

    await walk.populate([
      { path: 'pet', select: 'name breed petType photos' },
      { path: 'owner', select: 'name email phone' },
      { path: 'walker', select: 'name email phone' }
    ]);

    res.json({
      success: true,
      data: {
        walk
      },
      message: 'Walk request accepted successfully'
    });
  } catch (error) {
    console.error('Accept walk error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while accepting walk'
    });
  }
};

// @desc    Decline walk request
// @route   PUT /api/walks/:id/decline
// @access  Private/Walker
const declineWalk = async (req, res) => {
  try {
    const walk = await Walk.findById(req.params.id);

    if (!walk) {
      return res.status(404).json({
        success: false,
        message: 'Walk not found'
      });
    }

    // Check if user is the assigned walker
    if (walk.walker.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to decline this walk'
      });
    }

    // Check if walk is pending
    if (walk.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot decline a ${walk.status} walk`
      });
    }

    walk.status = 'cancelled';
    walk.cancellationReason = 'Declined by walker';
    walk.cancelledBy = req.user.id;
    walk.cancelledAt = new Date();
    await walk.save();

    res.json({
      success: true,
      data: {
        walk
      },
      message: 'Walk request declined'
    });
  } catch (error) {
    console.error('Decline walk error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while declining walk'
    });
  }
};

module.exports = {
  getAvailableWalkers,
  createWalkBooking,
  getUserWalks,
  getWalkById,
  cancelWalk,
  acceptWalk,
  declineWalk
};
