const { Resend } = require('resend');
const crypto = require('crypto');

// Check if we have an API key
const hasApiKey = !!process.env.RESEND_API_KEY;

// Initialize Resend only if API key is available
let resend = null;
if (hasApiKey) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log('✅ Resend email service initialized');
} else {
  console.log('⚠️  Resend API key not found - running in development mode (emails will be logged to console)');
}

// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send email verification OTP
const sendVerificationEmail = async (email, name, otp) => {
  try {
    if (!hasApiKey) {
      console.log('\n📧 EMAIL OTP (Development Mode):');
      console.log(`To: ${email}`);
      console.log(`Name: ${name}`);
      console.log(`OTP: ${otp}`);
      console.log('---\n');
      return { success: true, message: 'Email OTP logged to console (dev mode)' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'PetConnect <onboarding@resend.dev>',
      to: [email],
      subject: 'PetConnect Email Verification',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🐾 PetConnect</h1>
              <p>Email Verification</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for registering with PetConnect. Please use the following OTP to verify your email address:</p>
              
              <div class="otp-box">
                <p style="margin: 0; color: #666;">Your verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; color: #999; font-size: 14px;">This code will expire in 10 minutes</p>
              </div>
              
              <p>If you didn't create an account with PetConnect, please ignore this email.</p>
              
              <p>Best regards,<br>The PetConnect Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} PetConnect. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, message: 'Failed to send verification email', error: error.message };
    }

    console.log('✅ Email sent successfully:', data);
    return { success: true, message: 'Verification email sent successfully', data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send verification email', error: error.message };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    if (!hasApiKey) {
      console.log('\n🔑 PASSWORD RESET (Development Mode):');
      console.log(`To: ${email}`);
      console.log(`Name: ${name}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('---\n');
      return { success: true, message: 'Password reset link logged to console (dev mode)' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'PetConnect <onboarding@resend.dev>',
      to: [email],
      subject: 'Password Reset Request - PetConnect',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🐾 PetConnect</h1>
              <p>Password Reset Request</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px; font-size: 12px;">${resetUrl}</p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul style="margin: 10px 0;">
                  <li>This link will expire in 10 minutes</li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password won't change until you create a new one</li>
                </ul>
              </div>
              
              <p>Best regards,<br>The PetConnect Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} PetConnect. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, message: 'Failed to send password reset email', error: error.message };
    }

    console.log('✅ Password reset email sent successfully:', data);
    return { success: true, message: 'Password reset email sent successfully', data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send password reset email', error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    if (!hasApiKey) {
      console.log('\n🎉 WELCOME EMAIL (Development Mode):');
      console.log(`To: ${email}`);
      console.log(`Name: ${name}`);
      console.log('---\n');
      return { success: true, message: 'Welcome email logged to console (dev mode)' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'PetConnect <onboarding@resend.dev>',
      to: [email],
      subject: 'Welcome to PetConnect! 🐾',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🐾 Welcome to PetConnect!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Welcome to PetConnect - your trusted platform for pet care services! We're excited to have you join our community.</p>
              
              <h3>What you can do with PetConnect:</h3>
              
              <div class="feature">
                <strong>🐕 Manage Your Pets</strong>
                <p>Add your furry friends, track their medical records, and keep all their information in one place.</p>
              </div>
              
              <div class="feature">
                <strong>🚶 Book Dog Walks</strong>
                <p>Find trusted dog walkers nearby and schedule walks at your convenience.</p>
              </div>
              
              <div class="feature">
                <strong>📍 Live Tracking</strong>
                <p>Track your pet's walk in real-time and stay connected with your walker.</p>
              </div>
              
              <div class="feature">
                <strong>💳 Secure Payments</strong>
                <p>Pay safely through M-Pesa integration with transparent pricing.</p>
              </div>
              
              <p>Get started by completing your profile and adding your first pet!</p>
              
              <p>If you have any questions, our support team is here to help.</p>
              
              <p>Best regards,<br>The PetConnect Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} PetConnect. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, message: 'Failed to send welcome email', error: error.message };
    }

    console.log('✅ Welcome email sent successfully:', data);
    return { success: true, message: 'Welcome email sent successfully', data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send welcome email', error: error.message };
  }
};

// Send walk created notification to admin
const sendWalkCreatedEmail = async (walk, admin) => {
  try {
    const subject = `New Walk Request - ${walk.pet.name}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐾 New Walk Request</h1>
          </div>
          <div class="content">
            <p>A new walk has been booked on PetConnect.</p>
            <div class="info-box">
              <h3>Walk Details</h3>
              <p><strong>Pet:</strong> ${walk.pet.name} (${walk.pet.breed})</p>
              <p><strong>Owner:</strong> ${walk.owner.name}</p>
              <p><strong>Walker:</strong> ${walk.walker ? walk.walker.name : 'Unassigned'}</p>
              <p><strong>Date:</strong> ${new Date(walk.scheduledDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${walk.scheduledTime}</p>
              <p><strong>Duration:</strong> ${walk.duration} minutes</p>
              <p><strong>Pickup:</strong> ${walk.pickupLocation}</p>
              ${walk.dropoffLocation ? `<p><strong>Dropoff:</strong> ${walk.dropoffLocation}</p>` : ''}
              <p><strong>Amount:</strong> KES ${walk.price}</p>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} PetConnect. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    if (!hasApiKey) {
      console.log('\n📧 WALK CREATED EMAIL (Development Mode):');
      console.log(`To: ${admin.email}`);
      console.log(`Subject: ${subject}`);
      console.log('---\n');
      return { success: true, message: 'Email logged to console (dev mode)' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'PetConnect <onboarding@resend.dev>',
      to: [admin.email],
      subject,
      html
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, message: 'Failed to send email', error: error.message };
    }

    console.log('✅ Walk created email sent successfully');
    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send walk accepted notification to owner
const sendWalkAcceptedEmail = async (walk, owner) => {
  try {
    const subject = `Walk Confirmed - ${walk.pet.name}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Walk Confirmed!</h1>
          </div>
          <div class="content">
            <p>Great news! Your walk request has been accepted by ${walk.walker.name}.</p>
            <div class="info-box">
              <h3>Walk Details</h3>
              <p><strong>Pet:</strong> ${walk.pet.name}</p>
              <p><strong>Walker:</strong> ${walk.walker.name}</p>
              <p><strong>Date:</strong> ${new Date(walk.scheduledDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${walk.scheduledTime}</p>
              <p><strong>Duration:</strong> ${walk.duration} minutes</p>
              <p><strong>Pickup:</strong> ${walk.pickupLocation}</p>
            </div>
            <p>Your walker will arrive at the scheduled time. You'll receive another notification when the walk starts.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} PetConnect. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    if (!hasApiKey) {
      console.log('\n📧 WALK ACCEPTED EMAIL (Development Mode):');
      console.log(`To: ${owner.email}`);
      console.log(`Subject: ${subject}`);
      console.log('---\n');
      return { success: true, message: 'Email logged to console (dev mode)' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'PetConnect <onboarding@resend.dev>',
      to: [owner.email],
      subject,
      html
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, message: 'Failed to send email', error: error.message };
    }

    console.log('✅ Walk accepted email sent successfully');
    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send walk started notification to owner
const sendWalkStartedEmail = async (walk, owner) => {
  try {
    const subject = `Walk Started - ${walk.pet.name}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚶 Walk in Progress</h1>
          </div>
          <div class="content">
            <p>${walk.walker.name} has started walking ${walk.pet.name}!</p>
            <div class="info-box">
              <h3>Walk Information</h3>
              <p><strong>Started at:</strong> ${new Date(walk.startedAt).toLocaleString()}</p>
              <p><strong>Estimated completion:</strong> ${new Date(walk.estimatedEndTime).toLocaleString()}</p>
              <p><strong>Duration:</strong> ${walk.duration} minutes</p>
            </div>
            <p>You'll receive a notification when the walk is completed.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} PetConnect. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    if (!hasApiKey) {
      console.log('\n📧 WALK STARTED EMAIL (Development Mode):');
      console.log(`To: ${owner.email}`);
      console.log(`Subject: ${subject}`);
      console.log('---\n');
      return { success: true, message: 'Email logged to console (dev mode)' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'PetConnect <onboarding@resend.dev>',
      to: [owner.email],
      subject,
      html
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, message: 'Failed to send email', error: error.message };
    }

    console.log('✅ Walk started email sent successfully');
    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send walk completed notification to owner
const sendWalkCompletedEmail = async (walk, owner) => {
  try {
    const subject = `Walk Completed - ${walk.pet.name}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Walk Completed!</h1>
          </div>
          <div class="content">
            <p>${walk.pet.name} has been safely returned from their walk with ${walk.walker.name}.</p>
            <div class="info-box">
              <h3>Walk Summary</h3>
              <p><strong>Started:</strong> ${new Date(walk.startedAt).toLocaleString()}</p>
              <p><strong>Completed:</strong> ${new Date(walk.completedAt).toLocaleString()}</p>
              <p><strong>Duration:</strong> ${walk.duration} minutes</p>
              <p><strong>Amount:</strong> KES ${walk.price}</p>
            </div>
            <p>We hope ${walk.pet.name} enjoyed the walk! Please consider leaving a review for ${walk.walker.name}.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} PetConnect. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    if (!hasApiKey) {
      console.log('\n📧 WALK COMPLETED EMAIL (Development Mode):');
      console.log(`To: ${owner.email}`);
      console.log(`Subject: ${subject}`);
      console.log('---\n');
      return { success: true, message: 'Email logged to console (dev mode)' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'PetConnect <onboarding@resend.dev>',
      to: [owner.email],
      subject,
      html
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, message: 'Failed to send email', error: error.message };
    }

    console.log('✅ Walk completed email sent successfully');
    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send walk cancelled notification to walker
const sendWalkCancelledEmail = async (walk, walker) => {
  try {
    const subject = `Walk Cancelled - ${walk.pet.name}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Walk Cancelled</h1>
          </div>
          <div class="content">
            <p>The walk request for ${walk.pet.name} has been cancelled by the owner.</p>
            <div class="info-box">
              <h3>Cancelled Walk Details</h3>
              <p><strong>Pet:</strong> ${walk.pet.name}</p>
              <p><strong>Owner:</strong> ${walk.owner.name}</p>
              <p><strong>Scheduled Date:</strong> ${new Date(walk.scheduledDate).toLocaleDateString()}</p>
              <p><strong>Scheduled Time:</strong> ${walk.scheduledTime}</p>
              ${walk.cancellationReason ? `<p><strong>Reason:</strong> ${walk.cancellationReason}</p>` : ''}
            </div>
            <p>We apologize for any inconvenience. You can view other available walk requests in your dashboard.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} PetConnect. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    if (!hasApiKey) {
      console.log('\n📧 WALK CANCELLED EMAIL (Development Mode):');
      console.log(`To: ${walker.email}`);
      console.log(`Subject: ${subject}`);
      console.log('---\n');
      return { success: true, message: 'Email logged to console (dev mode)' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'PetConnect <onboarding@resend.dev>',
      to: [walker.email],
      subject,
      html
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, message: 'Failed to send email', error: error.message };
    }

    console.log('✅ Walk cancelled email sent successfully');
    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendWalkCreatedEmail,
  sendWalkAcceptedEmail,
  sendWalkStartedEmail,
  sendWalkCompletedEmail,
  sendWalkCancelledEmail
};
