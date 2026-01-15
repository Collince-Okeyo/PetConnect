const User = require('../models/User');
const Wallet = require('../models/Wallet');
const BlacklistedToken = require('../models/BlacklistedToken');
const { generateToken, generateRefreshToken, generateSessionToken } = require('../utils/generateToken');
const { generateOTP, sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } = require('../utils/emailService');
const { sendSMSOTP, sendPasswordResetSMS } = require('../utils/smsService');
const { getDeviceInfo, generateSessionId } = require('../utils/deviceInfo');
const { generateTwoFactorSecret, generateQRCode, verifyTwoFactorToken, generateBackupCodes } = require('../utils/twoFactorAuth');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();


// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log('Registration attempt started...');
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, password, role, location } = req.body;
    console.log('Registration data received:', { name, email, phone, role });

    // Check if user already exists
    console.log('Checking if user already exists...');
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone number'
      });
    }

    // Create user
    console.log('Creating user...');
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'owner',
      location
    });
    console.log('User created with ID:', user._id);

    // Create wallet for user
    console.log('Creating wallet...');
    await Wallet.create({
      user: user._id,
      balance: 0
    });
    console.log('Wallet created');

    // Generate OTP for phone verification
    console.log('Generating OTP...');
    const phoneOTP = generateOTP();
    const emailOTP = generateOTP();
    
    // Store OTPs in user document
    user.phoneVerificationOTP = phoneOTP;
    user.phoneVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.emailVerificationOTP = emailOTP;
    user.emailVerificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send SMS OTP (with error handling)
    try {
      const smsResult = await sendSMSOTP(user.phone, phoneOTP);
      if (!smsResult.success) {
        console.error('Failed to send SMS OTP:', smsResult.error);
      } else {
        console.log('SMS OTP sent successfully');
      }
    } catch (smsError) {
      console.error('SMS sending error:', smsError);
    }

    // Send email OTP (with error handling)
    try {
      const emailResult = await sendVerificationEmail(user.email, user.name, emailOTP);
      if (!emailResult.success) {
        console.error('Failed to send email OTP:', emailResult.error);
      } else {
        console.log('Email OTP sent successfully');
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    // Get device info and create session
    const deviceInfo = getDeviceInfo(req);
    const sessionId = generateSessionId();
    const refreshToken = generateRefreshToken(user._id);
    
    // Add refresh token and session to user (with error handling)
    try {
      await user.addRefreshToken(refreshToken, deviceInfo);
      await user.addActiveSession(sessionId, deviceInfo);
    } catch (sessionError) {
      console.error('Session management error:', sessionError);
      // Continue with registration even if session management fails
    }

    // Generate tokens
    const accessToken = generateToken(user._id, sessionId);
    const sessionToken = generateSessionToken(user._id, deviceInfo);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your phone number and email.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified
        },
        tokens: {
          accessToken,
          refreshToken,
          sessionToken
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({
      $or: [{ email }, { phone: email }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is suspended or banned'
      });
    }

    // Update last seen and set online status
    user.lastSeen = new Date();
    user.isOnline = true;  // Set user as online
    await user.save();

    // Get device info and create session
    const deviceInfo = getDeviceInfo(req);
    const sessionId = generateSessionId();
    const refreshToken = generateRefreshToken(user._id);
    
    // Add refresh token and session to user (with error handling)
    try {
      await user.addRefreshToken(refreshToken, deviceInfo);
      await user.addActiveSession(sessionId, deviceInfo);
    } catch (sessionError) {
      console.error('Session management error:', sessionError);
      // Continue with login even if session management fails
    }

    // Generate tokens
    const accessToken = generateToken(user._id, sessionId);
    const sessionToken = generateSessionToken(user._id, deviceInfo);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          isEmailVerified: user.isEmailVerified,
          twoFactorEnabled: user.twoFactorEnabled,
          profilePicture: user.profilePicture,
          rating: user.rating
        },
        tokens: {
          accessToken,
          refreshToken,
          sessionToken
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'User ID and OTP are required'
      });
    }

    // Check if OTP exists and is valid
    const storedOTP = otpStore.get(userId);
    
    if (!storedOTP) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    if (Date.now() > storedOTP.expiresAt) {
      otpStore.delete(userId);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Verify user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isVerified = true;
    await user.save();

    // Remove OTP from store
    otpStore.delete(userId);

    // Send welcome SMS
    await sendWelcomeSMS(user.phone, user.name);

    res.json({
      success: true,
      message: 'Phone number verified successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP verification'
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-verification
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'User is already verified'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    otpStore.set(user._id.toString(), {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Send OTP
    const otpResult = await sendOTP(user.phone, otp);
    
    if (!otpResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP',
        error: otpResult.error
      });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP resend'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email address'
      });
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(user.email, user.name, resetToken);
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email',
        error: emailResult.error
      });
    }

    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token, password } = req.body;

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    // Blacklist all refresh tokens for security
    await user.refreshTokens.forEach(async (refreshToken) => {
      await BlacklistedToken.create({
        token: refreshToken.token,
        userId: user._id,
        reason: 'password_change',
        expiresAt: refreshToken.expiresAt
      });
    });

    // Clear all refresh tokens and sessions
    user.refreshTokens = [];
    user.activeSessions = [];
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token } = req.body;

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified
        }
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { refreshToken } = req.body;

    // Find user with this refresh token
    const user = await User.findOne({
      'refreshTokens.token': refreshToken,
      'refreshTokens.expiresAt': { $gt: new Date() }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Check if user is still active
    if (user.status !== 'active' || user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Get device info
    const deviceInfo = getDeviceInfo(req);
    const sessionId = generateSessionId();

    // Generate new tokens
    const newAccessToken = generateToken(user._id, sessionId);
    const newRefreshToken = generateRefreshToken(user._id);

    // Remove old refresh token and add new one
    await user.removeRefreshToken(refreshToken);
    await user.addRefreshToken(newRefreshToken, deviceInfo);
    await user.addActiveSession(sessionId, deviceInfo);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken
        }
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token refresh'
    });
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    // Blacklist the access token
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check if token is already blacklisted
        const existingBlacklist = await BlacklistedToken.findOne({ token });
        if (!existingBlacklist) {
          await BlacklistedToken.create({
            token,
            userId: decoded.id,
            reason: 'logout',
            expiresAt: new Date(decoded.exp * 1000)
          });
        }
      } catch (tokenError) {
        // Token might be invalid or already blacklisted, continue with logout
        console.log('Token blacklist error (non-critical):', tokenError.message);
      }
    }

    // Remove refresh token if provided
    if (refreshToken) {
      await req.user.removeRefreshToken(refreshToken);
    }

    // Remove current session
    if (req.sessionId) {
      await req.user.removeActiveSession(req.sessionId);
    }

    // Set user as offline
    req.user.isOnline = false;
    req.user.lastSeen = new Date();
    await req.user.save();

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
const logoutAll = async (req, res) => {
  try {
    const user = req.user;

    // Blacklist all current access tokens (this would require storing them)
    // For now, we'll just clear refresh tokens and sessions
    user.refreshTokens = [];
    user.activeSessions = [];
    await user.save();

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout all'
    });
  }
};

// @desc    Setup 2FA
// @route   POST /api/auth/2fa/setup
// @access  Private
const setupTwoFactor = async (req, res) => {
  try {
    const user = req.user;

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication is already enabled'
      });
    }

    // Generate 2FA secret
    const { secret, qrCodeUrl } = generateTwoFactorSecret(user.email);
    
    // Generate QR code
    const qrCode = await generateQRCode(qrCodeUrl);

    // Store secret temporarily (user needs to verify before enabling)
    user.twoFactorSecret = secret;
    await user.save();

    res.json({
      success: true,
      message: '2FA setup initiated. Please scan QR code and verify.',
      data: {
        secret,
        qrCode,
        qrCodeUrl
      }
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during 2FA setup'
    });
  }
};

// @desc    Verify 2FA setup
// @route   POST /api/auth/2fa/verify-setup
// @access  Private
const verifyTwoFactorSetup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token } = req.body;
    const user = req.user;

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: '2FA setup not initiated'
      });
    }

    // Verify the token
    const isValid = verifyTwoFactorToken(user.twoFactorSecret, token);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA token'
      });
    }

    // Enable 2FA
    user.twoFactorEnabled = true;
    user.twoFactorVerified = true;
    await user.save();

    res.json({
      success: true,
      message: 'Two-factor authentication enabled successfully'
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during 2FA verification'
    });
  }
};

// @desc    Disable 2FA
// @route   POST /api/auth/2fa/disable
// @access  Private
const disableTwoFactor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token } = req.body;
    const user = req.user;

    if (!user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication is not enabled'
      });
    }

    // Verify the token
    const isValid = verifyTwoFactorToken(user.twoFactorSecret, token);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA token'
      });
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorVerified = false;
    user.twoFactorSecret = null;
    await user.save();

    res.json({
      success: true,
      message: 'Two-factor authentication disabled successfully'
    });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during 2FA disable'
    });
  }
};

// @desc    Get active sessions
// @route   GET /api/auth/sessions
// @access  Private
const getActiveSessions = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      data: {
        sessions: user.activeSessions.map(session => ({
          sessionId: session.sessionId,
          deviceInfo: session.deviceInfo,
          loginTime: session.loginTime,
          lastActivity: session.lastActivity,
          isCurrent: session.sessionId === req.sessionId
        }))
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sessions'
    });
  }
};

// @desc    Revoke session
// @route   DELETE /api/auth/sessions/:sessionId
// @access  Private
const revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const user = req.user;

    // Don't allow revoking current session
    if (sessionId === req.sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot revoke current session'
      });
    }

    await user.removeActiveSession(sessionId);

    res.json({
      success: true,
      message: 'Session revoked successfully'
    });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while revoking session'
    });
  }
};

// @desc    Deactivate account
// @route   DELETE /api/auth/deactivate
// @access  Private
const deactivateAccount = async (req, res) => {
  try {
    const user = req.user;

    // Soft delete the user
    await user.softDelete();

    // Blacklist all tokens
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await BlacklistedToken.create({
        token,
        userId: decoded.id,
        reason: 'admin_action',
        expiresAt: new Date(decoded.exp * 1000)
      });
    }

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during account deactivation'
    });
  }
};

// @desc    Verify phone OTP
// @route   POST /api/auth/verify-phone
// @access  Public
const verifyPhoneOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'User ID and OTP are required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isPhoneVerified) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is already verified'
      });
    }

    // Check if OTP is valid
    if (!user.phoneVerificationOTP || !user.phoneVerificationExpires) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }

    if (new Date() > user.phoneVerificationExpires) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    if (user.phoneVerificationOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Verify phone
    user.isPhoneVerified = true;
    user.phoneVerificationOTP = null;
    user.phoneVerificationExpires = null;
    
    // Update overall verification status if both email and phone are verified
    if (user.isEmailVerified && user.isPhoneVerified) {
      user.isVerified = true;
    }
    
    await user.save();

    // Send welcome email if fully verified
    if (user.isVerified) {
      try {
        await sendWelcomeEmail(user.email, user.name);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }
    }

    res.json({
      success: true,
      message: 'Phone number verified successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isPhoneVerified: user.isPhoneVerified,
          isEmailVerified: user.isEmailVerified,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    console.error('Phone OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during phone verification'
    });
  }
};

// @desc    Verify email OTP
// @route   POST /api/auth/verify-email-otp
// @access  Public
const verifyEmailOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'User ID and OTP are required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Check if OTP is valid
    if (!user.emailVerificationOTP || !user.emailVerificationOTPExpires) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }

    if (new Date() > user.emailVerificationOTPExpires) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationOTP = null;
    user.emailVerificationOTPExpires = null;
    
    // Update overall verification status if both email and phone are verified
    if (user.isEmailVerified && user.isPhoneVerified) {
      user.isVerified = true;
    }
    
    await user.save();

    // Send welcome email if fully verified
    if (user.isVerified) {
      try {
        await sendWelcomeEmail(user.email, user.name);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }
    }

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isPhoneVerified: user.isPhoneVerified,
          isEmailVerified: user.isEmailVerified,
          isVerified: user.isVerified
        }
      }
    });
  } catch (error) {
    console.error('Email OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
};

// @desc    Resend phone OTP
// @route   POST /api/auth/resend-phone-otp
// @access  Public
const resendPhoneOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isPhoneVerified) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is already verified'
      });
    }

    // Generate new OTP
    const phoneOTP = generateOTP();
    user.phoneVerificationOTP = phoneOTP;
    user.phoneVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send SMS OTP
    const smsResult = await sendSMSOTP(user.phone, phoneOTP);
    
    if (!smsResult.success && !smsResult.development) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP',
        error: smsResult.error
      });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully to your phone'
    });
  } catch (error) {
    console.error('Resend phone OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP resend'
    });
  }
};

// @desc    Resend email OTP
// @route   POST /api/auth/resend-email-otp
// @access  Public
const resendEmailOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new OTP
    const emailOTP = generateOTP();
    user.emailVerificationOTP = emailOTP;
    user.emailVerificationOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send email OTP
    const emailResult = await sendVerificationEmail(user.email, user.name, emailOTP);
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP',
        error: emailResult.error
      });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully to your email'
    });
  } catch (error) {
    console.error('Resend email OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP resend'
    });
  }
};



module.exports = {
  register,
  login,
  verifyOTP,
  resendOTP,
  verifyPhoneOTP,
  verifyEmailOTP,
  resendPhoneOTP,
  resendEmailOTP,
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
};

