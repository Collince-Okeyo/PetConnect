const twilio = require('twilio');

// Initialize Twilio client
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured');
    return null;
  }
  
  return twilio(accountSid, authToken);
};

// Send SMS OTP
const sendSMSOTP = async (phoneNumber, otp) => {
  try {
    const client = getTwilioClient();
    
    if (!client) {
      // In development/sandbox mode, log OTP to console
      console.log(`📱 SMS OTP for ${phoneNumber}: ${otp}`);
      return { 
        success: true, 
        message: 'OTP logged to console (Twilio not configured)',
        development: true 
      };
    }

    // Format phone number for Kenyan numbers
    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedPhone = '+254' + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('+')) {
      formattedPhone = '+254' + phoneNumber;
    }

    const message = await client.messages.create({
      body: `Your PetConnect verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    console.log(`✅ SMS sent successfully. SID: ${message.sid}`);
    return { 
      success: true, 
      message: 'OTP sent successfully',
      sid: message.sid 
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    
    // In development, still log OTP even if Twilio fails
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 SMS OTP for ${phoneNumber}: ${otp} (Twilio failed, logging for dev)`);
      return { 
        success: true, 
        message: 'OTP logged to console (Twilio error in dev mode)',
        development: true 
      };
    }
    
    return { 
      success: false, 
      message: 'Failed to send SMS',
      error: error.message 
    };
  }
};

// Send password reset SMS
const sendPasswordResetSMS = async (phoneNumber, resetCode) => {
  try {
    const client = getTwilioClient();
    
    if (!client) {
      console.log(`📱 Password Reset Code for ${phoneNumber}: ${resetCode}`);
      return { 
        success: true, 
        message: 'Reset code logged to console (Twilio not configured)',
        development: true 
      };
    }

    // Format phone number
    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedPhone = '+254' + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('+')) {
      formattedPhone = '+254' + phoneNumber;
    }

    const message = await client.messages.create({
      body: `Your PetConnect password reset code is: ${resetCode}. This code will expire in 10 minutes. If you didn't request this, please ignore this message.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    console.log(`✅ Password reset SMS sent. SID: ${message.sid}`);
    return { 
      success: true, 
      message: 'Reset code sent successfully',
      sid: message.sid 
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 Password Reset Code for ${phoneNumber}: ${resetCode} (Twilio failed, logging for dev)`);
      return { 
        success: true, 
        message: 'Reset code logged to console (Twilio error in dev mode)',
        development: true 
      };
    }
    
    return { 
      success: false, 
      message: 'Failed to send SMS',
      error: error.message 
    };
  }
};

// Send walk notification SMS
const sendWalkNotificationSMS = async (phoneNumber, message) => {
  try {
    const client = getTwilioClient();
    
    if (!client) {
      console.log(`📱 Walk Notification for ${phoneNumber}: ${message}`);
      return { 
        success: true, 
        message: 'Notification logged to console (Twilio not configured)',
        development: true 
      };
    }

    // Format phone number
    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedPhone = '+254' + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('+')) {
      formattedPhone = '+254' + phoneNumber;
    }

    const twilioMessage = await client.messages.create({
      body: `PetConnect: ${message}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    console.log(`✅ Notification SMS sent. SID: ${twilioMessage.sid}`);
    return { 
      success: true, 
      message: 'Notification sent successfully',
      sid: twilioMessage.sid 
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 Walk Notification for ${phoneNumber}: ${message} (Twilio failed, logging for dev)`);
      return { 
        success: true, 
        message: 'Notification logged to console (Twilio error in dev mode)',
        development: true 
      };
    }
    
    return { 
      success: false, 
      message: 'Failed to send notification',
      error: error.message 
    };
  }
};

// Verify phone number format
const isValidKenyanPhone = (phoneNumber) => {
  const kenyanPhoneRegex = /^(\+254|0)[0-9]{9}$/;
  return kenyanPhoneRegex.test(phoneNumber);
};

module.exports = {
  sendSMSOTP,
  sendPasswordResetSMS,
  sendWalkNotificationSMS,
  isValidKenyanPhone
};
