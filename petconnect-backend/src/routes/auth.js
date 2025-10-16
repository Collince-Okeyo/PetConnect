const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyOTP,
  resendOTP,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  logout,
  logoutAll,
  setupTwoFactor,
  verifyTwoFactorSetup,
  disableTwoFactor,
  getActiveSessions,
  revokeSession,
  deactivateAccount
} = require('../controllers/authController');
const {
  googleLogin,
  facebookLogin,
  linkSocialAccount,
  unlinkSocialAccount
} = require('../controllers/socialAuthController');
const { 
  protect, 
  authRateLimit, 
  blacklistToken 
} = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateEmailVerification,
  validateTwoFactorSetup,
  validateTwoFactorVerification,
  validateRefreshToken,
  validateChangePassword
} = require('../middleware/validation');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authRateLimit(15 * 60 * 1000, 10), validateRegistration, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authRateLimit(15 * 60 * 1000, 10), validateLogin, login);

// @route   POST /api/auth/verify
// @desc    Verify OTP
// @access  Public
router.post('/verify', authRateLimit(15 * 60 * 1000, 10), verifyOTP);

// @route   POST /api/auth/resend-verification
// @desc    Resend OTP
// @access  Public
router.post('/resend-verification', authRateLimit(15 * 60 * 1000, 3), resendOTP);

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', authRateLimit(15 * 60 * 1000, 3), validateForgotPassword, forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', authRateLimit(15 * 60 * 1000, 5), validateResetPassword, resetPassword);

// @route   POST /api/auth/verify-email
// @desc    Verify email
// @access  Public
router.post('/verify-email', validateEmailVerification, verifyEmail);

// @route   POST /api/auth/refresh
// @desc    Refresh token
// @access  Public
router.post('/refresh', validateRefreshToken, refreshToken);

// @route   POST /api/auth/logout
// @desc    Logout
// @access  Private
router.post('/logout', protect, blacklistToken, logout);

// @route   POST /api/auth/logout-all
// @desc    Logout from all devices
// @access  Private
router.post('/logout-all', protect, logoutAll);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', protect, validateChangePassword, changePassword);

// @route   POST /api/auth/2fa/setup
// @desc    Setup 2FA
// @access  Private
router.post('/2fa/setup', protect, setupTwoFactor);

// @route   POST /api/auth/2fa/verify-setup
// @desc    Verify 2FA setup
// @access  Private
router.post('/2fa/verify-setup', protect, validateTwoFactorSetup, verifyTwoFactorSetup);

// @route   POST /api/auth/2fa/disable
// @desc    Disable 2FA
// @access  Private
router.post('/2fa/disable', protect, validateTwoFactorVerification, disableTwoFactor);

// @route   GET /api/auth/sessions
// @desc    Get active sessions
// @access  Private
router.get('/sessions', protect, getActiveSessions);

// @route   DELETE /api/auth/sessions/:sessionId
// @desc    Revoke session
// @access  Private
router.delete('/sessions/:sessionId', protect, revokeSession);

// @route   DELETE /api/auth/deactivate
// @desc    Deactivate account
// @access  Private
router.delete('/deactivate', protect, deactivateAccount);

// @route   POST /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.post('/google', authRateLimit(15 * 60 * 1000, 5), googleLogin);

// @route   POST /api/auth/facebook
// @desc    Facebook OAuth login
// @access  Public
router.post('/facebook', authRateLimit(15 * 60 * 1000, 5), facebookLogin);

// @route   POST /api/auth/link-social
// @desc    Link social account
// @access  Private
router.post('/link-social', protect, linkSocialAccount);

// @route   DELETE /api/auth/unlink-social
// @desc    Unlink social account
// @access  Private
router.delete('/unlink-social', protect, unlinkSocialAccount);

module.exports = router;
