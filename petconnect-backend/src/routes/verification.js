const express = require('express');
const router = express.Router();
const {
  submitVerification,
  uploadIdFront,
  uploadIdBack,
  uploadSelfie,
  getVerificationStatus
} = require('../controllers/verificationController');
const { protect } = require('../middleware/auth');
const { uploadId, uploadSelfie: uploadSelfieMiddleware } = require('../config/cloudinary');

// User verification routes
router.post('/submit', protect, submitVerification);
router.post('/upload-id-front', protect, uploadId.single('image'), uploadIdFront);
router.post('/upload-id-back', protect, uploadId.single('image'), uploadIdBack);
router.post('/upload-selfie', protect, uploadSelfieMiddleware.single('image'), uploadSelfie);
router.get('/status', protect, getVerificationStatus);

module.exports = router;
