const express = require('express');
const router = express.Router();
const {
  getPendingVerifications,
  getVerificationDetails,
  approveVerification,
  rejectVerification,
  getVerificationStats
} = require('../controllers/adminVerificationController');
const { protect, adminOnly } = require('../middleware/auth');

// Admin verification routes
router.get('/pending', protect, adminOnly, getPendingVerifications);
router.get('/stats', protect, adminOnly, getVerificationStats);
router.get('/:userId', protect, adminOnly, getVerificationDetails);
router.put('/:userId/approve', protect, adminOnly, approveVerification);
router.put('/:userId/reject', protect, adminOnly, rejectVerification);

module.exports = router;
