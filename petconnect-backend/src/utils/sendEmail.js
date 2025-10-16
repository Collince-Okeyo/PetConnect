const nodemailer = require('nodemailer');

// Initialize email transporter
let transporter = null;

if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

// Send email verification
const sendEmailVerification = async (email, name, verificationToken) => {
  try {
    if (!transporter) {
      console.log(`Email verification would be sent to ${email} for ${name}`);
      console.log(`Verification token: ${verificationToken}`);
      return {
        success: true,
        messageId: 'mock-email-verification-id',
        mock: true
      };
    }

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your PetConnect Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Welcome to PetConnect!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering with PetConnect. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account with PetConnect, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">© 2024 PetConnect. All rights reserved.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Error sending email verification:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    if (!transporter) {
      console.log(`Password reset email would be sent to ${email} for ${name}`);
      console.log(`Reset token: ${resetToken}`);
      return {
        success: true,
        messageId: 'mock-password-reset-id',
        mock: true
      };
    }

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your PetConnect Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password for your PetConnect account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">© 2024 PetConnect. All rights reserved.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    if (!transporter) {
      console.log(`Welcome email would be sent to ${email} for ${name}`);
      return {
        success: true,
        messageId: 'mock-welcome-email-id',
        mock: true
      };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to PetConnect!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Welcome to PetConnect!</h2>
          <p>Hi ${name},</p>
          <p>Welcome to PetConnect! We're excited to have you join our community of pet lovers.</p>
          <p>With PetConnect, you can:</p>
          <ul>
            <li>Find trusted pet walkers in your area</li>
            <li>Schedule walks for your furry friends</li>
            <li>Connect with local veterinarians</li>
            <li>Track your pet's activities and health</li>
          </ul>
          <p>If you have any questions or need help getting started, feel free to reach out to our support team.</p>
          <p>Happy pet parenting!</p>
          <p>The PetConnect Team</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">© 2024 PetConnect. All rights reserved.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendEmailVerification,
  sendPasswordResetEmail,
  sendWelcomeEmail
};
