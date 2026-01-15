const User = require('../models/User');
const { sendVerificationApprovedEmail, sendVerificationRejectedEmail } = require('../utils/emailService');

// @desc    Get all pending verifications
// @route   GET /api/admin/verifications/pending
// @access  Private (Admin only)
const getPendingVerifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'under_review' } = req.query;

    const users = await User.find({
      'adminApproval.status': status
    })
      .select('name email phone role idVerification selfieVerification adminApproval createdAt')
      .sort({ 'idVerification.submittedAt': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments({
      'adminApproval.status': status
    });

    res.json({
      success: true,
      data: {
        verifications: users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    console.error('Get pending verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get verification details for a user
// @route   GET /api/admin/verifications/:userId
// @access  Private (Admin only)
const getVerificationDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -refreshTokens -activeSessions');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get verification details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Approve verification
// @route   PUT /api/admin/verifications/:userId/approve
// @access  Private (Admin only)
const approveVerification = async (req, res) => {
  try {
    const { reviewNotes } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update approval status
    user.adminApproval.status = 'approved';
    user.adminApproval.reviewedBy = req.user.id;
    user.adminApproval.reviewedAt = new Date();
    user.adminApproval.approvalDate = new Date();
    user.adminApproval.reviewNotes = reviewNotes || '';
    user.idVerificationStatus = 'verified'; // Update old field for compatibility

    await user.save();

    // Send approval email
    try {
      await sendVerificationApprovedEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
    }

    res.json({
      success: true,
      message: 'Verification approved successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          approvalStatus: user.adminApproval.status
        }
      }
    });
  } catch (error) {
    console.error('Approve verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reject verification
// @route   PUT /api/admin/verifications/:userId/reject
// @access  Private (Admin only)
const rejectVerification = async (req, res) => {
  try {
    const { rejectionReason, reviewNotes } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update approval status
    user.adminApproval.status = 'rejected';
    user.adminApproval.reviewedBy = req.user.id;
    user.adminApproval.reviewedAt = new Date();
    user.adminApproval.rejectionReason = rejectionReason;
    user.adminApproval.reviewNotes = reviewNotes || '';
    user.idVerificationStatus = 'rejected'; // Update old field

    await user.save();

    // Send rejection email
    try {
      await sendVerificationRejectedEmail(user.email, user.name, rejectionReason);
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
    }

    res.json({
      success: true,
      message: 'Verification rejected',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          approvalStatus: user.adminApproval.status,
          rejectionReason
        }
      }
    });
  } catch (error) {
    console.error('Reject verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get verification statistics
// @route   GET /api/admin/verifications/stats
// @access  Private (Admin only)
const getVerificationStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$adminApproval.status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      pending: 0,
      under_review: 0,
      approved: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: { stats: formattedStats }
    });
  } catch (error) {
    console.error('Get verification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getPendingVerifications,
  getVerificationDetails,
  approveVerification,
  rejectVerification,
  getVerificationStats
};
