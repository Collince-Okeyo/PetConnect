const User = require('../models/User');
const { deleteImage } = require('../config/cloudinary');
const { sendAdminVerificationNotification } = require('../utils/emailService');

// @desc    Submit verification documents
// @route   POST /api/verification/submit
// @access  Private
const submitVerification = async (req, res) => {
  try {
    const { nationalIdNumber } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!nationalIdNumber) {
      return res.status(400).json({
        success: false,
        message: 'National ID number is required'
      });
    }

    // Validate ID number format (Kenya: 8 digits)
    const idRegex = /^\d{8}$/;
    if (!idRegex.test(nationalIdNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid National ID number format. Must be 8 digits.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already approved
    if (user.adminApproval.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Your account is already verified'
      });
    }

    // Validate that all required images are uploaded
    if (!user.idVerification.idFrontImage || !user.idVerification.idBackImage || !user.selfieVerification.selfieWithIdImage) {
      return res.status(400).json({
        success: false,
        message: 'Please upload all required documents: ID front, ID back, and selfie with ID'
      });
    }

    // Update user verification data
    user.idVerification.nationalIdNumber = nationalIdNumber;
    user.idVerification.submittedAt = new Date();
    user.adminApproval.status = 'under_review';
    
    await user.save();

    // Send notification to admin
    try {
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        await sendAdminVerificationNotification(
          admin.email,
          user.name,
          user.role,
          user._id
        );
      }
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Verification documents submitted successfully. Please wait for admin review.',
      data: {
        verificationStatus: user.adminApproval.status
      }
    });
  } catch (error) {
    console.error('Submit verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification submission'
    });
  }
};

// @desc    Upload ID front image
// @route   POST /api/verification/upload-id-front
// @access  Private
const uploadIdFront = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.user.id);
    
    // Delete old image if exists
    if (user.idVerification.idFrontImage) {
      await deleteImage(user.idVerification.idFrontImage);
    }

    // Save new image URL
    user.idVerification.idFrontImage = req.file.path;
    await user.save();

    res.json({
      success: true,
      message: 'ID front image uploaded successfully',
      data: {
        imageUrl: req.file.path
      }
    });
  } catch (error) {
    console.error('Upload ID front error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during image upload'
    });
  }
};

// @desc    Upload ID back image
// @route   POST /api/verification/upload-id-back
// @access  Private
const uploadIdBack = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.user.id);
    
    // Delete old image if exists
    if (user.idVerification.idBackImage) {
      await deleteImage(user.idVerification.idBackImage);
    }

    // Save new image URL
    user.idVerification.idBackImage = req.file.path;
    await user.save();

    res.json({
      success: true,
      message: 'ID back image uploaded successfully',
      data: {
        imageUrl: req.file.path
      }
    });
  } catch (error) {
    console.error('Upload ID back error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during image upload'
    });
  }
};

// @desc    Upload selfie image
// @route   POST /api/verification/upload-selfie
// @access  Private
const uploadSelfie = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.user.id);
    
    // Delete old image if exists
    if (user.selfieVerification.selfieWithIdImage) {
      await deleteImage(user.selfieVerification.selfieWithIdImage);
    }

    // Save new image URL
    user.selfieVerification.selfieWithIdImage = req.file.path;
    user.selfieVerification.submittedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Selfie uploaded successfully',
      data: {
        imageUrl: req.file.path
      }
    });
  } catch (error) {
    console.error('Upload selfie error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during image upload'
    });
  }
};

// @desc    Get verification status
// @route   GET /api/verification/status
// @access  Private
const getVerificationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('idVerification selfieVerification adminApproval isVerified');

    res.json({
      success: true,
      data: {
        isOTPVerified: user.isVerified,
        idVerification: user.idVerification,
        selfieVerification: user.selfieVerification,
        adminApproval: user.adminApproval
      }
    });
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  submitVerification,
  uploadIdFront,
  uploadIdBack,
  uploadSelfie,
  getVerificationStatus
};
