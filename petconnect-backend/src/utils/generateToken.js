const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id, sessionId = null) => {
  const payload = { id };
  if (sessionId) {
    payload.sessionId = sessionId;
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m' // Short-lived access token
  });
};

const generateRefreshToken = (id) => {
  // Generate a random refresh token
  const token = crypto.randomBytes(64).toString('hex');
  return token;
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const generateSessionToken = (id, deviceInfo) => {
  const payload = {
    id,
    type: 'session',
    deviceInfo: {
      deviceType: deviceInfo.deviceType,
      ipAddress: deviceInfo.ipAddress
    }
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  generateSessionToken
};
