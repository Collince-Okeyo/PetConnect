const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Generate 2FA secret for user
const generateTwoFactorSecret = (userEmail) => {
  const secret = speakeasy.generateSecret({
    name: `PetConnect (${userEmail})`,
    issuer: 'PetConnect',
    length: 32
  });

  return {
    secret: secret.base32,
    qrCodeUrl: secret.otpauth_url
  };
};

// Generate QR code for 2FA setup
const generateQRCode = async (otpauthUrl) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(otpauthUrl);
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

// Verify 2FA token
const verifyTwoFactorToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2 // Allow 2 time steps (60 seconds) of tolerance
  });
};

// Generate backup codes
const generateBackupCodes = () => {
  const crypto = require('crypto');
  const codes = [];
  
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  
  return codes;
};

module.exports = {
  generateTwoFactorSecret,
  generateQRCode,
  verifyTwoFactorToken,
  generateBackupCodes
};
