const userAgent = require('user-agents');

// Extract device information from request
const getDeviceInfo = (req) => {
  const userAgentString = req.get('User-Agent') || '';
  const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                   (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                   req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';

  // Parse user agent to get device type
  let deviceType = 'unknown';
  if (userAgentString.includes('Mobile') || userAgentString.includes('Android') || userAgentString.includes('iPhone')) {
    deviceType = 'mobile';
  } else if (userAgentString.includes('Tablet') || userAgentString.includes('iPad')) {
    deviceType = 'tablet';
  } else if (userAgentString.includes('Windows') || userAgentString.includes('Macintosh') || userAgentString.includes('Linux')) {
    deviceType = 'desktop';
  }

  return {
    userAgent: userAgentString,
    ipAddress: ipAddress,
    deviceType: deviceType
  };
};

// Generate session ID
const generateSessionId = () => {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};

module.exports = {
  getDeviceInfo,
  generateSessionId
};
