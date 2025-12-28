const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAvailableWalkers,
  createWalkBooking,
  getUserWalks,
  getWalkById,
  cancelWalk,
  acceptWalk,
  declineWalk,
  startWalk,
  completeWalk,
  cancelWalkByOwner
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

// @route   PUT /api/walks/:id/accept
// @desc    Accept walk request (walker only)
// @access  Private/Walker
router.put('/:id/accept', protect, authorize('walker'), acceptWalk);

// @route   PUT /api/walks/:id/decline
// @desc    Decline walk request (walker only)
// @access  Private/Walker
router.put('/:id/decline', protect, authorize('walker'), declineWalk);

// @route   PUT /api/walks/:id/start
// @desc    Start walk (walker only)
// @access  Private/Walker
router.put('/:id/start', protect, authorize('walker'), startWalk);

// @route   PUT /api/walks/:id/complete
// @desc    Complete walk (walker only)
// @access  Private/Walker
router.put('/:id/complete', protect, authorize('walker'), completeWalk);

// @route   PUT /api/walks/:id/cancel-by-owner
// @desc    Cancel walk by owner
// @access  Private/Owner
router.put('/:id/cancel-by-owner', protect, authorize('owner'), cancelWalkByOwner);

module.exports = router;
