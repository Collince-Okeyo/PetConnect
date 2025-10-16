const twilio = require('twilio');

// Initialize Twilio client only if credentials are available
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// Generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS
const sendOTP = async (phoneNumber, otp) => {
  try {
    // Check if Twilio client is available
    if (!client) {
      console.log('Twilio not configured, OTP would be:', otp);
      return {
        success: true,
        messageId: 'mock-message-id',
        phoneNumber: phoneNumber,
        mock: true
      };
    }

    // Format phone number for Kenya (+254)
    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedPhone = '+254' + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('+254')) {
      formattedPhone = '+254' + phoneNumber;
    }

    const message = await client.messages.create({
      body: `Your PetConnect verification code is: ${otp}. This code expires in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    return {
      success: true,
      messageId: message.sid,
      phoneNumber: formattedPhone
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send welcome SMS
const sendWelcomeSMS = async (phoneNumber, userName) => {
  try {
    // Check if Twilio client is available
    if (!client) {
      console.log(`Welcome SMS would be sent to ${phoneNumber} for ${userName}`);
      return {
        success: true,
        messageId: 'mock-welcome-message-id',
        mock: true
      };
    }

    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedPhone = '+254' + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('+254')) {
      formattedPhone = '+254' + phoneNumber;
    }

    const message = await client.messages.create({
      body: `Welcome to PetConnect, ${userName}! Your account has been created successfully.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    return {
      success: true,
      messageId: message.sid
    };
  } catch (error) {
    console.error('Error sending welcome SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send walk notification SMS
const sendWalkNotificationSMS = async (phoneNumber, message) => {
  try {
    // Check if Twilio client is available
    if (!client) {
      console.log(`Walk notification SMS would be sent to ${phoneNumber}: ${message}`);
      return {
        success: true,
        messageId: 'mock-notification-message-id',
        mock: true
      };
    }

    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedPhone = '+254' + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('+254')) {
      formattedPhone = '+254' + phoneNumber;
    }

    const smsMessage = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    return {
      success: true,
      messageId: smsMessage.sid
    };
  } catch (error) {
    console.error('Error sending walk notification SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  generateOTP,
  sendOTP,
  sendWelcomeSMS,
  sendWalkNotificationSMS
};
