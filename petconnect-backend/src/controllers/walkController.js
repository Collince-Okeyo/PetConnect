const mongoose = require('mongoose');
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
      { path: 'owner', select: 'name email phone' },
      { path: 'walker', select: 'name email phone profileImage rating' }
    ]);

    // Send notifications to admin
    const { createNotification } = require('./notificationController');
    const { sendWalkCreatedEmail } = require('../utils/emailService');
    const { sendWalkNotificationSMS } = require('../utils/smsService');

    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await createNotification(
        admin._id,
        'walk_request',
        'New Walk Request',
        `New walk request for ${walk.pet.name} by ${req.user.name}`
      );
      await sendWalkCreatedEmail(walk, admin);
      if (admin.phone) {
        await sendWalkNotificationSMS(admin.phone, walk._id, 'created', {
          petName: walk.pet.name
        });
      }
    }

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

    // Send notifications
    const { createNotification } = require('./notificationController');
    const { sendWalkAcceptedEmail } = require('../utils/emailService');
    const { sendWalkNotificationSMS } = require('../utils/smsService');

    // Notify owner
    await createNotification(
      walk.owner._id,
      'walk_accepted',
      'Walk Request Accepted',
      `${walk.walker.name} has accepted your walk request for ${walk.pet.name}`
    );
    await sendWalkAcceptedEmail(walk, walk.owner);
    if (walk.owner.phone) {
      await sendWalkNotificationSMS(walk.owner.phone, walk._id, 'accepted', {
        petName: walk.pet.name,
        walkerName: walk.walker.name,
        date: new Date(walk.scheduledDate).toLocaleDateString(),
        time: walk.scheduledTime
      });
    }

    // Notify admin
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await createNotification(
        admin._id,
        'walk_accepted',
        'Walk Accepted',
        `Walk #${walk._id.toString().slice(-6)} accepted by ${walk.walker.name}`
      );
    }

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

// @desc    Start walk
// @route   PUT /api/walks/:id/start
// @access  Private/Walker
const startWalk = async (req, res) => {
  try {
    const walk = await Walk.findById(req.params.id)
      .populate('pet', 'name breed')
      .populate('owner', 'name email phone')
      .populate('walker', 'name email phone');

    if (!walk) {
      return res.status(404).json({
        success: false,
        message: 'Walk not found'
      });
    }

    // Verify walker is assigned and is the current user
    if (!walk.walker || walk.walker._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to start this walk'
      });
    }

    // Verify status is confirmed
    if (walk.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: `Cannot start walk with status: ${walk.status}`
      });
    }

    // Set started timestamp and calculate estimated end time
    walk.startedAt = new Date();
    walk.estimatedEndTime = new Date(walk.startedAt.getTime() + walk.duration * 60000);
    walk.status = 'in-progress';
    await walk.save();

    // Send notifications
    const { createNotification } = require('./notificationController');
    const { sendWalkStartedEmail } = require('../utils/emailService');
    const { sendWalkNotificationSMS } = require('../utils/smsService');

    // Notify owner
    await createNotification(
      walk.owner._id,
      'walk_started',
      'Walk Started',
      `${walk.walker.name} has started walking ${walk.pet.name}!`
    );
    await sendWalkStartedEmail(walk, walk.owner);
    if (walk.owner.phone) {
      await sendWalkNotificationSMS(walk.owner.phone, walk._id, 'started', {
        walkerName: walk.walker.name,
        petName: walk.pet.name,
        estimatedEnd: walk.estimatedEndTime.toLocaleTimeString()
      });
    }

    // Notify admin
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await createNotification(
        admin._id,
        'walk_started',
        'Walk Started',
        `Walk #${walk._id.toString().slice(-6)} started by ${walk.walker.name}`
      );
    }

    res.json({
      success: true,
      data: { walk },
      message: 'Walk started successfully'
    });
  } catch (error) {
    console.error('Start walk error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while starting walk'
    });
  }
};

// @desc    Complete walk
// @route   PUT /api/walks/:id/complete
// @access  Private/Walker
const completeWalk = async (req, res) => {
  try {
    const walk = await Walk.findById(req.params.id)
      .populate('pet', 'name breed')
      .populate('owner', 'name email phone')
      .populate('walker', 'name email phone');

    if (!walk) {
      return res.status(404).json({
        success: false,
        message: 'Walk not found'
      });
    }

    // Verify walker is assigned and is the current user
    if (!walk.walker || walk.walker._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to complete this walk'
      });
    }

    // Verify status is in-progress
    if (walk.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: `Cannot complete walk with status: ${walk.status}`
      });
    }

    // Set completed timestamp
    walk.completedAt = new Date();
    walk.status = 'completed';
    
    // Calculate actual duration
    if (walk.startedAt) {
      walk.actualDuration = Math.round((walk.completedAt - walk.startedAt) / 60000);
    }

    await walk.save();

    // Send notifications
    const { createNotification } = require('./notificationController');
    const { sendWalkCompletedEmail } = require('../utils/emailService');
    const { sendWalkNotificationSMS } = require('../utils/smsService');

    // Notify owner
    await createNotification(
      walk.owner._id,
      'walk_completed',
      'Walk Completed',
      `${walk.pet.name} has been safely returned from their walk!`
    );
    await sendWalkCompletedEmail(walk, walk.owner);
    if (walk.owner.phone) {
      await sendWalkNotificationSMS(walk.owner.phone, walk._id, 'completed', {
        petName: walk.pet.name
      });
    }

    // Notify admin
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await createNotification(
        admin._id,
        'walk_completed',
        'Walk Completed',
        `Walk #${walk._id.toString().slice(-6)} completed by ${walk.walker.name}`
      );
    }

    res.json({
      success: true,
      data: { walk },
      message: 'Walk completed successfully'
    });
  } catch (error) {
    console.error('Complete walk error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while completing walk'
    });
  }
};

// @desc    Cancel walk by owner
// @route   PUT /api/walks/:id/cancel-by-owner
// @access  Private/Owner
const cancelWalkByOwner = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const walk = await Walk.findById(req.params.id)
      .populate('pet', 'name breed')
      .populate('owner', 'name email phone')
      .populate('walker', 'name email phone');

    if (!walk) {
      return res.status(404).json({
        success: false,
        message: 'Walk not found'
      });
    }

    // Verify owner
    if (walk.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this walk'
      });
    }

    // Cannot cancel if walk is in-progress or completed
    if (walk.status === 'in-progress' || walk.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel walk with status: ${walk.status}`
      });
    }

    // Update walk
    walk.status = 'cancelled';
    walk.cancelledBy = req.user._id;
    walk.cancelledAt = new Date();
    if (cancellationReason) {
      walk.cancellationReason = cancellationReason;
    }
    await walk.save();

    // Send notifications
    const { createNotification } = require('./notificationController');
    const { sendWalkCancelledEmail } = require('../utils/emailService');
    const { sendWalkNotificationSMS } = require('../utils/smsService');

    // Notify walker if assigned
    if (walk.walker) {
      await createNotification(
        walk.walker._id,
        'walk_cancelled',
        'Walk Cancelled',
        `Walk request for ${walk.pet.name} has been cancelled by the owner`
      );
      await sendWalkCancelledEmail(walk, walk.walker);
      if (walk.walker.phone) {
        await sendWalkNotificationSMS(walk.walker.phone, walk._id, 'cancelled', {
          petName: walk.pet.name,
          reason: cancellationReason
        });
      }
    }

    // Notify admin
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await createNotification(
        admin._id,
        'walk_cancelled',
        'Walk Cancelled',
        `Walk #${walk._id.toString().slice(-6)} cancelled by owner`
      );
    }

    res.json({
      success: true,
      data: { walk },
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

// @desc    Update walk location (GPS tracking)
// @route   PUT /api/walks/:id/location
// @access  Private/Walker
const updateWalkLocation = async (req, res) => {
  try {
    const { latitude, longitude, accuracy, speed } = req.body;

    const walk = await Walk.findById(req.params.id);

    if (!walk) {
      return res.status(404).json({
        success: false,
        message: 'Walk not found'
      });
    }

    // Verify walker is assigned and is the current user
    if (!walk.walker || walk.walker.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this walk location'
      });
    }

    // Verify status is in-progress
    if (walk.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Can only update location for in-progress walks'
      });
    }

    const { calculateDistance } = require('../utils/geoUtils');

    // Calculate distance from last point if exists
    let distanceIncrement = 0;
    if (walk.currentLocation && walk.currentLocation.coordinates && 
        walk.currentLocation.coordinates[0] !== 0 && walk.currentLocation.coordinates[1] !== 0) {
      const [lastLon, lastLat] = walk.currentLocation.coordinates;
      distanceIncrement = calculateDistance(lastLat, lastLon, latitude, longitude);
    }

    // Update current location
    walk.currentLocation = {
      type: 'Point',
      coordinates: [longitude, latitude],
      timestamp: new Date()
    };

    // Add to route (limit to 500 points to prevent excessive data)
    walk.route.push({
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      timestamp: new Date(),
      speed: speed || 0,
      accuracy: accuracy || 0
    });

    // Keep only last 500 points
    if (walk.route.length > 500) {
      walk.route = walk.route.slice(-500);
    }

    // Update total distance
    walk.totalDistance += distanceIncrement;

    await walk.save();

    res.json({
      success: true,
      data: {
        currentLocation: {
          latitude,
          longitude,
          timestamp: walk.currentLocation.timestamp
        },
        totalDistance: walk.totalDistance,
        routePointsCount: walk.route.length
      },
      message: 'Location updated successfully'
    });
  } catch (error) {
    console.error('Update walk location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating location'
    });
  }
};

// @desc    Get walk location and route
// @route   GET /api/walks/:id/location
// @access  Private (Owner/Walker/Admin)
const getWalkLocation = async (req, res) => {
  try {
    const walk = await Walk.findById(req.params.id)
      .populate('pet', 'name')
      .populate('owner', 'name')
      .populate('walker', 'name');

    if (!walk) {
      return res.status(404).json({
        success: false,
        message: 'Walk not found'
      });
    }

    // Verify authorization (owner, walker, or admin)
    const isOwner = walk.owner._id.toString() === req.user._id.toString();
    const isWalker = walk.walker && walk.walker._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isWalker && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this walk location'
      });
    }

    // Format current location
    let currentLocation = null;
    if (walk.currentLocation && walk.currentLocation.coordinates) {
      const [lon, lat] = walk.currentLocation.coordinates;
      if (lat !== 0 && lon !== 0) {
        currentLocation = {
          latitude: lat,
          longitude: lon,
          timestamp: walk.currentLocation.timestamp
        };
      }
    }

    // Format route
    const route = walk.route.map(point => ({
      latitude: point.location.coordinates[1],
      longitude: point.location.coordinates[0],
      timestamp: point.timestamp,
      speed: point.speed,
      accuracy: point.accuracy
    }));

    // Calculate duration if walk is in progress
    let duration = 0;
    if (walk.startedAt) {
      const endTime = walk.completedAt || new Date();
      duration = Math.floor((endTime - walk.startedAt) / 1000); // in seconds
    }

    res.json({
      success: true,
      data: {
        walkId: walk._id,
        status: walk.status,
        currentLocation,
        route,
        totalDistance: walk.totalDistance,
        duration,
        startedAt: walk.startedAt,
        estimatedEndTime: walk.estimatedEndTime,
        pet: walk.pet,
        walker: walk.walker
      }
    });
  } catch (error) {
    console.error('Get walk location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching location'
    });
  }
};

// @desc    Get walker's walk history with pagination and filters
// @route   GET /api/walks/walker/my-walks
// @access  Private/Walker
const getWalkerMyWalks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    // Build query - only walks assigned to this walker
    let query = { walker: req.user.id };
    
    // Filter by status (completed or cancelled)
    if (status && status !== 'all') {
      query.status = status;
    } else {
      // By default, show only completed and cancelled walks
      query.status = { $in: ['completed', 'cancelled'] };
    }
    
    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      
      // Find pets, owners that match search
      const pets = await require('../models/Pet').find({
        name: searchRegex
      }).select('_id');
      
      const owners = await User.find({
        name: searchRegex
      }).select('_id');
      
      // Add search conditions
      query.$or = [
        { pet: { $in: pets.map(p => p._id) } },
        { owner: { $in: owners.map(o => o._id) } },
        { pickupLocation: searchRegex },
        { dropoffLocation: searchRegex }
      ];
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Get total count for pagination
    const total = await Walk.countDocuments(query);
    
    // Fetch walks
    const walks = await Walk.find(query)
      .populate('pet', 'name petType photos')
      .populate({
        path: 'pet',
        populate: {
          path: 'petType',
          select: 'name icon'
        }
      })
      .populate('owner', 'name email phone profilePicture')
      .sort({ scheduledStartTime: -1 })
      .skip(skip)
      .limit(limitNum);
    
    // Calculate statistics
    const statsQuery = { walker: req.user.id };
    const totalWalks = await Walk.countDocuments(statsQuery);
    const completedWalks = await Walk.countDocuments({ ...statsQuery, status: 'completed' });
    const cancelledWalks = await Walk.countDocuments({ ...statsQuery, status: 'cancelled' });
    
    // Calculate total earnings from completed walks
    const earningsResult = await Walk.aggregate([
      { $match: { walker: new mongoose.Types.ObjectId(req.user.id), status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const totalEarnings = earningsResult.length > 0 ? earningsResult[0].total : 0;
    
    res.json({
      success: true,
      data: {
        walks,
        stats: {
          total: totalWalks,
          completed: completedWalks,
          cancelled: cancelledWalks,
          totalEarnings
        },
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalItems: total,
          itemsPerPage: limitNum
        }
      }
    });
  } catch (error) {
    console.error('Get walker my walks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching walk history'
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
  declineWalk,
  startWalk,
  completeWalk,
  cancelWalkByOwner,
  updateWalkLocation,
  getWalkLocation,
  getWalkerMyWalks
};
