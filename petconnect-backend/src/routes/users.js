const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getProfile,
  updateProfile,
  getUserById,
  getUsersByRole,
  updateOnlineStatus,
  uploadProfilePicture,
  deleteAccount
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   PUT /api/users/update
// @desc    Update user profile
// @access  Private
router.put('/update', protect, updateProfile);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, validateObjectId('id'), getUserById);

// @route   GET /api/users
// @desc    Get users by role with pagination
// @access  Private
router.get('/', protect, validatePagination, getUsersByRole);

// @route   PUT /api/users/online-status
// @desc    Update online status
// @access  Private
router.put('/online-status', protect, updateOnlineStatus);

// @route   POST /api/users/upload-picture
// @desc    Upload profile picture
// @access  Private
router.post('/upload-picture', protect, upload.single('profilePicture'), uploadProfilePicture);

// @route   DELETE /api/users/delete
// @desc    Delete user account
// @access  Private
router.delete('/delete', protect, deleteAccount);

module.exports = router;
