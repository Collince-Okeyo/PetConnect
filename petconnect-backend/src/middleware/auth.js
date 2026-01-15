const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');
const { getDeviceInfo, generateSessionId } = require('../utils/deviceInfo');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Check if token is blacklisted
      const blacklistedToken = await BlacklistedToken.findOne({ token });
      if (blacklistedToken) {
        return res.status(401).json({
          success: false,
          message: 'Token has been revoked'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'No user found with this token'
        });
      }

      // Check if user is deleted
      if (user.isDeleted) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated'
        });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Account is suspended or banned'
        });
      }

      // Update session activity if sessionId is present
      if (decoded.sessionId) {
        await user.updateSessionActivity(decoded.sessionId);
      }

      req.user = user;
      req.sessionId = decoded.sessionId;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.status === 'active') {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we don't fail
        console.log('Invalid token in optional auth:', error.message);
      }
    }

    next();
  } catch (error) {
    next();
  }
};

// Check if user is verified
const requireVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Account verification required to access this feature'
    });
  }
  next();
};

// Check if user is online (for walkers)
const requireOnline = (req, res, next) => {
  if (req.user.role === 'walker' && !req.user.isOnline) {
    return res.status(403).json({
      success: false,
      message: 'You must be online to perform this action'
    });
  }
  next();
};

// Check if user has email verified
const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required to access this feature'
    });
  }
  next();
};

// Check if user has 2FA enabled and verified
const requireTwoFactor = (req, res, next) => {
  if (req.user.twoFactorEnabled && !req.user.twoFactorVerified) {
    return res.status(403).json({
      success: false,
      message: 'Two-factor authentication required'
    });
  }
  next();
};

// Rate limiting for auth endpoints
const authRateLimit = (windowMs = 15 * 60 * 1000, max = 10) => {
  const rateLimit = require('express-rate-limit');
  
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: 'Too many authentication attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Blacklist token middleware
const blacklistToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const expiresAt = new Date(decoded.exp * 1000);
      
      await BlacklistedToken.create({
        token,
        userId: decoded.id,
        reason: 'logout',
        expiresAt
      });
    }
    next();
  } catch (error) {
    next();
  }
};

// Admin only middleware
const adminOnly = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  requireVerification,
  requireOnline,
  requireEmailVerification,
  requireTwoFactor,
  authRateLimit,
  blacklistToken,
  adminOnly
};
