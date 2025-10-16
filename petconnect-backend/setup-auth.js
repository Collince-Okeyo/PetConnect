#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 PetConnect Auth API Setup');
console.log('=' .repeat(40));

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/petconnect

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=15m

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (for password reset and email verification)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=PetConnect <noreply@petconnect.com>

# Twilio Configuration (for SMS OTP)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Social Login Configuration (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security Configuration
BCRYPT_ROUNDS=12
TOKEN_CLEANUP_INTERVAL=3600000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=logs/app.log`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully');
} else {
  console.log('✅ .env file already exists');
}

// Check if uploads directory exists
const uploadsPath = path.join(__dirname, 'uploads');
const petsUploadsPath = path.join(uploadsPath, 'pets');
const profilesUploadsPath = path.join(uploadsPath, 'profiles');

if (!fs.existsSync(uploadsPath)) {
  console.log('📁 Creating uploads directories...');
  fs.mkdirSync(uploadsPath, { recursive: true });
  fs.mkdirSync(petsUploadsPath, { recursive: true });
  fs.mkdirSync(profilesUploadsPath, { recursive: true });
  console.log('✅ Upload directories created successfully');
} else {
  console.log('✅ Upload directories already exist');
}

// Check if logs directory exists
const logsPath = path.join(__dirname, 'logs');
if (!fs.existsSync(logsPath)) {
  console.log('📁 Creating logs directory...');
  fs.mkdirSync(logsPath, { recursive: true });
  console.log('✅ Logs directory created successfully');
} else {
  console.log('✅ Logs directory already exists');
}

console.log('\n📋 Setup Instructions:');
console.log('1. Update the .env file with your actual configuration values');
console.log('2. Install dependencies: npm install');
console.log('3. Start MongoDB service');
console.log('4. Run the server: npm run dev');
console.log('5. Test the API: node test-auth-comprehensive.js');

console.log('\n🔧 Required Environment Variables:');
console.log('- MONGODB_URI: MongoDB connection string');
console.log('- JWT_SECRET: Secret key for JWT tokens');
console.log('- EMAIL_*: Email configuration for notifications');
console.log('- TWILIO_*: Twilio configuration for SMS OTP');

console.log('\n📚 Documentation:');
console.log('- API Documentation: AUTH_API_DOCUMENTATION.md');
console.log('- Test File: test-auth-comprehensive.js');

console.log('\n🎉 Setup completed successfully!');
console.log('Happy coding! 🚀');
