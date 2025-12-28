const AfricasTalking = require('africastalking');

// Check if we have credentials
const hasCredentials = !!(process.env.AFRICAS_TALKING_API_KEY && process.env.AFRICAS_TALKING_USERNAME);

// Initialize Africa's Talking only if credentials are available
let sms = null;
if (hasCredentials) {
  const africasTalking = AfricasTalking({
    apiKey: process.env.AFRICAS_TALKING_API_KEY,
    username: process.env.AFRICAS_TALKING_USERNAME,
  });
  sms = africasTalking.SMS;
  console.log('✅ Africa\'s Talking SMS service initialized');
} else {
  console.log('⚠️  Africa\'s Talking credentials not found - running in development mode (SMS will be logged to console)');
}

/**
 * Format phone number for Kenya (+254)
 */
const formatPhoneNumber = (phoneNumber) => {
  if (phoneNumber.startsWith('0')) {
    return '+254' + phoneNumber.substring(1);
  } else if (!phoneNumber.startsWith('+')) {
    return '+254' + phoneNumber;
  }
  return phoneNumber;
};

/**
 * Send SMS using Africa's Talking
 */
const sendSMS = async (to, message) => {
  try {
    const formattedPhone = formatPhoneNumber(to);

    if (!hasCredentials) {
      console.log('\n📱 SMS (Development Mode):');
      console.log(`To: ${formattedPhone}`);
      console.log(`Message: ${message}`);
      console.log('---\n');
      return { success: true, message: 'SMS logged to console (dev mode)', development: true };
    }

    const options = {
      to: [formattedPhone],
      message,
      from: process.env.AFRICAS_TALKING_SENDER_ID || undefined
    };

    const response = await sms.send(options);
    console.log('✅ SMS sent successfully:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('Error sending SMS:', error);
    
    // In development, still log SMS even if sending fails
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 SMS for ${to}: ${message} (Africa's Talking failed, logging for dev)`);
      return { success: true, message: 'SMS logged to console (error in dev mode)', development: true };
    }
    
    return { success: false, error: error.message };
  }
};

// Send SMS OTP
const sendSMSOTP = async (phoneNumber, otp) => {
  const message = `Your PetConnect verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`;
  return await sendSMS(phoneNumber, message);
};

// Send password reset SMS
const sendPasswordResetSMS = async (phoneNumber, resetCode) => {
  const message = `Your PetConnect password reset code is: ${resetCode}. This code will expire in 10 minutes. If you didn't request this, please ignore this message.`;
  return await sendSMS(phoneNumber, message);
};

// Send walk notification SMS
const sendWalkNotificationSMS = async (phoneNumber, walkId, type, details = {}) => {
  try {
    let message = '';
    const shortId = walkId.slice(-6).toUpperCase();

    switch (type) {
      case 'created':
        message = `New walk request #${shortId} created for ${details.petName}. Check your dashboard for details.`;
        break;
      case 'accepted':
        message = `Your walk request #${shortId} for ${details.petName} has been accepted by ${details.walkerName}. Scheduled for ${details.date} at ${details.time}.`;
        break;
      case 'started':
        message = `${details.walkerName} has started walking ${details.petName}. Estimated completion: ${details.estimatedEnd}.`;
        break;
      case 'completed':
        message = `Walk #${shortId} completed! ${details.petName} has been safely returned. Thank you for using PetConnect.`;
        break;
      case 'cancelled':
        message = `Walk request #${shortId} for ${details.petName} has been cancelled by the owner.${details.reason ? ' Reason: ' + details.reason : ''}`;
        break;
      default:
        message = `Walk #${shortId} status update. Check your dashboard for details.`;
    }

    return await sendSMS(phoneNumber, message);
  } catch (error) {
    console.error('Error sending walk notification SMS:', error);
    return { success: false, error: error.message };
  }
};

// Verify phone number format
const isValidKenyanPhone = (phoneNumber) => {
  const kenyanPhoneRegex = /^(\+254|0)[0-9]{9}$/;
  return kenyanPhoneRegex.test(phoneNumber);
};

module.exports = {
  sendSMS,
  sendSMSOTP,
  sendPasswordResetSMS,
  sendWalkNotificationSMS,
  isValidKenyanPhone
};
