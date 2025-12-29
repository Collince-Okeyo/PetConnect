// Quick script to list all users in the database
const User = require('../models/User');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id name email role');
    
    console.log('📋 All users in database:');
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.role}): ${user._id}`);
    });
    
    res.status(200).json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing users',
      error: error.message
    });
  }
};
