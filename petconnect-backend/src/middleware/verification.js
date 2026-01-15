// Require OTP verification
const requireOTPVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your phone and email first',
      requiresVerification: true,
      verificationType: 'otp',
      redirectTo: '/verify'
    });
  }
  next();
};

// Require admin approval
const requireAdminApproval = (req, res, next) => {
  if (req.user.adminApproval.status !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Your account is pending admin approval. Please complete your verification.',
      requiresVerification: true,
      verificationType: 'admin_approval',
      verificationStatus: req.user.adminApproval.status,
      redirectTo: '/verification'
    });
  }
  next();
};

// Combined verification check
const requireFullVerification = (req, res, next) => {
  requireOTPVerification(req, res, () => {
    requireAdminApproval(req, res, next);
  });
};

module.exports = {
  requireOTPVerification,
  requireAdminApproval,
  requireFullVerification
};
