const User = require('../models/User');

// @desc    Update user heartbeat (keep alive)
// @route   POST /api/users/heartbeat
// @access  Private
const heartbeat = async (req, res) => {
  try {
    // Update lastSeen to current time
    await User.findByIdAndUpdate(
      req.user.id,
      { 
        lastSeen: new Date(),
        isOnline: true  // Ensure user is marked as online
      }
    );

    res.json({
      success: true,
      message: 'Heartbeat received'
    });
  } catch (error) {
    console.error('Heartbeat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  heartbeat
};
