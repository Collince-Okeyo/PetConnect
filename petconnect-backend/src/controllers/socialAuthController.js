const User = require('../models/User');
const Wallet = require('../models/Wallet');
const { generateToken, generateRefreshToken, generateSessionToken } = require('../utils/generateToken');
const { getDeviceInfo, generateSessionId } = require('../utils/deviceInfo');
const { sendWelcomeEmail } = require('../utils/sendEmail');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'Google access token is required'
      });
    }

    // Verify Google access token
    const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    const { id, email, name, picture } = googleResponse.data;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Unable to get email from Google'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, check if Google ID is linked
      if (!user.googleId) {
        user.googleId = id;
        user.profilePicture = picture;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId: id,
        profilePicture: picture,
        isEmailVerified: true, // Google emails are pre-verified
        isVerified: true, // Skip phone verification for social login
        role: 'owner'
      });

      // Create wallet for user
      await Wallet.create({
        user: user._id,
        balance: 0
      });

      // Send welcome email
      await sendWelcomeEmail(user.email, user.name);
    }

    // Check if user is active
    if (user.status !== 'active' || user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Get device info and create session
    const deviceInfo = getDeviceInfo(req);
    const sessionId = generateSessionId();
    const refreshToken = generateRefreshToken(user._id);
    
    // Add refresh token and session to user
    await user.addRefreshToken(refreshToken, deviceInfo);
    await user.addActiveSession(sessionId, deviceInfo);

    // Generate tokens
    const accessTokenJWT = generateToken(user._id, sessionId);
    const sessionToken = generateSessionToken(user._id, deviceInfo);

    res.json({
      success: true,
      message: 'Google login successful',
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
          accessToken: accessTokenJWT,
          refreshToken,
          sessionToken
        }
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google login'
    });
  }
};

// @desc    Facebook OAuth login
// @route   POST /api/auth/facebook
// @access  Public
const facebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'Facebook access token is required'
      });
    }

    // Verify Facebook access token
    const facebookResponse = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
    const { id, email, name, picture } = facebookResponse.data;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Unable to get email from Facebook'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, check if Facebook ID is linked
      if (!user.facebookId) {
        user.facebookId = id;
        user.profilePicture = picture.data?.url || user.profilePicture;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        facebookId: id,
        profilePicture: picture.data?.url,
        isEmailVerified: true, // Facebook emails are pre-verified
        isVerified: true, // Skip phone verification for social login
        role: 'owner'
      });

      // Create wallet for user
      await Wallet.create({
        user: user._id,
        balance: 0
      });

      // Send welcome email
      await sendWelcomeEmail(user.email, user.name);
    }

    // Check if user is active
    if (user.status !== 'active' || user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Get device info and create session
    const deviceInfo = getDeviceInfo(req);
    const sessionId = generateSessionId();
    const refreshToken = generateRefreshToken(user._id);
    
    // Add refresh token and session to user
    await user.addRefreshToken(refreshToken, deviceInfo);
    await user.addActiveSession(sessionId, deviceInfo);

    // Generate tokens
    const accessTokenJWT = generateToken(user._id, sessionId);
    const sessionToken = generateSessionToken(user._id, deviceInfo);

    res.json({
      success: true,
      message: 'Facebook login successful',
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
          accessToken: accessTokenJWT,
          refreshToken,
          sessionToken
        }
      }
    });
  } catch (error) {
    console.error('Facebook login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Facebook login'
    });
  }
};

// @desc    Link social account
// @route   POST /api/auth/link-social
// @access  Private
const linkSocialAccount = async (req, res) => {
  try {
    const { provider, accessToken } = req.body;
    const user = req.user;

    if (!['google', 'facebook'].includes(provider)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid provider. Must be google or facebook'
      });
    }

    let socialData;
    
    if (provider === 'google') {
      const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
      socialData = googleResponse.data;
      
      if (socialData.email !== user.email) {
        return res.status(400).json({
          success: false,
          message: 'Social account email does not match your account email'
        });
      }
      
      user.googleId = socialData.id;
    } else if (provider === 'facebook') {
      const facebookResponse = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
      socialData = facebookResponse.data;
      
      if (socialData.email !== user.email) {
        return res.status(400).json({
          success: false,
          message: 'Social account email does not match your account email'
        });
      }
      
      user.facebookId = socialData.id;
    }

    await user.save();

    res.json({
      success: true,
      message: `${provider} account linked successfully`,
      data: {
        user: {
          id: user._id,
          email: user.email,
          googleId: user.googleId,
          facebookId: user.facebookId
        }
      }
    });
  } catch (error) {
    console.error('Link social account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during social account linking'
    });
  }
};

// @desc    Unlink social account
// @route   DELETE /api/auth/unlink-social
// @access  Private
const unlinkSocialAccount = async (req, res) => {
  try {
    const { provider } = req.body;
    const user = req.user;

    if (!['google', 'facebook'].includes(provider)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid provider. Must be google or facebook'
      });
    }

    // Check if user has password or other social accounts
    const hasPassword = user.password;
    const hasGoogle = user.googleId;
    const hasFacebook = user.facebookId;

    if (provider === 'google') {
      if (!hasPassword && !hasFacebook) {
        return res.status(400).json({
          success: false,
          message: 'Cannot unlink Google account. You need at least one login method.'
        });
      }
      user.googleId = null;
    } else if (provider === 'facebook') {
      if (!hasPassword && !hasGoogle) {
        return res.status(400).json({
          success: false,
          message: 'Cannot unlink Facebook account. You need at least one login method.'
        });
      }
      user.facebookId = null;
    }

    await user.save();

    res.json({
      success: true,
      message: `${provider} account unlinked successfully`
    });
  } catch (error) {
    console.error('Unlink social account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during social account unlinking'
    });
  }
};

module.exports = {
  googleLogin,
  facebookLogin,
  linkSocialAccount,
  unlinkSocialAccount
};
