const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAvailableWalkers,
  createWalkBooking,
  getUserWalks,
  getWalkById,
  cancelWalk
} = require('../controllers/walkController');

// @route   GET /api/walks/walkers/available
// @desc    Get available walkers
// @access  Private
router.get('/walkers/available', protect, getAvailableWalkers);

// @route   POST /api/walks/book
// @desc    Create walk booking
// @access  Private/Owner
router.post('/book', protect, authorize('owner'), createWalkBooking);

// @route   GET /api/walks/my-walks
// @desc    Get user's walks
// @access  Private
router.get('/my-walks', protect, getUserWalks);

// @route   GET /api/walks/:id
// @desc    Get walk by ID
// @access  Private
router.get('/:id', protect, getWalkById);

// @route   PUT /api/walks/:id/cancel
// @desc    Cancel walk
// @access  Private
router.put('/:id/cancel', protect, cancelWalk);

module.exports = router;
