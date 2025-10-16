# PetConnect Authentication API Documentation

## Overview
This document provides comprehensive documentation for all authentication endpoints in the PetConnect API. The authentication system includes user registration, login, password management, two-factor authentication, social login, session management, and account security features.

## Base URL
```
http://localhost:5000/api/auth
```

## Authentication Flow
1. **Registration**: User registers with email, phone, and password
2. **Verification**: User verifies phone number via OTP and email via link
3. **Login**: User logs in with email/phone and password
4. **Token Management**: Access tokens (15min) and refresh tokens (30 days)
5. **Session Management**: Track active sessions across devices
6. **Security**: Optional 2FA, social login, account deactivation

---

## Endpoints

### 1. User Registration
**POST** `/register`

Register a new user account.

**Rate Limit**: 3 attempts per 15 minutes

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0712345678",
  "password": "password123",
  "role": "owner",
  "location": {
    "coordinates": [36.8219, -1.2921],
    "address": "Nairobi, Kenya",
    "city": "Nairobi"
  }
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your phone number and email.",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0712345678",
      "role": "owner",
      "isVerified": false,
      "isEmailVerified": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0...",
      "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

### 2. User Login
**POST** `/login`

Authenticate user with email/phone and password.

**Rate Limit**: 5 attempts per 15 minutes

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0712345678",
      "role": "owner",
      "isVerified": true,
      "isEmailVerified": true,
      "twoFactorEnabled": false,
      "profilePicture": null,
      "rating": {
        "average": 0,
        "count": 0
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0...",
      "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

### 3. Phone Verification
**POST** `/verify`

Verify phone number with OTP.

**Rate Limit**: 10 attempts per 15 minutes

**Request Body**:
```json
{
  "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "otp": "123456"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Phone number verified successfully",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0712345678",
      "role": "owner",
      "isVerified": true
    }
  }
}
```

---

### 4. Resend OTP
**POST** `/resend-verification`

Resend OTP for phone verification.

**Rate Limit**: 3 attempts per 15 minutes

**Request Body**:
```json
{
  "userId": "64f1a2b3c4d5e6f7g8h9i0j1"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

### 5. Email Verification
**POST** `/verify-email`

Verify email address with token.

**Request Body**:
```json
{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "isEmailVerified": true
    }
  }
}
```

---

### 6. Forgot Password
**POST** `/forgot-password`

Request password reset email.

**Rate Limit**: 3 attempts per 15 minutes

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

---

### 7. Reset Password
**POST** `/reset-password`

Reset password with token.

**Rate Limit**: 5 attempts per 15 minutes

**Request Body**:
```json
{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
  "password": "newpassword123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 8. Refresh Token
**POST** `/refresh`

Get new access token using refresh token.

**Request Body**:
```json
{
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1"
    }
  }
}
```

---

### 9. Get Current User
**GET** `/me`

Get current authenticated user profile.

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "0712345678",
      "role": "owner",
      "isVerified": true,
      "isEmailVerified": true,
      "twoFactorEnabled": false,
      "profilePicture": null,
      "rating": {
        "average": 4.5,
        "count": 10
      },
      "createdAt": "2023-09-01T10:00:00.000Z",
      "updatedAt": "2023-09-01T10:00:00.000Z"
    }
  }
}
```

---

### 10. Change Password
**PUT** `/change-password`

Change user password.

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 11. Logout
**POST** `/logout`

Logout from current session.

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 12. Logout All Devices
**POST** `/logout-all`

Logout from all devices and sessions.

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out from all devices successfully"
}
```

---

### 13. Setup Two-Factor Authentication
**POST** `/2fa/setup`

Initialize 2FA setup process.

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200):
```json
{
  "success": true,
  "message": "2FA setup initiated. Please scan QR code and verify.",
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "qrCodeUrl": "otpauth://totp/PetConnect%20(john@example.com)?secret=JBSWY3DPEHPK3PXP&issuer=PetConnect"
  }
}
```

---

### 14. Verify 2FA Setup
**POST** `/2fa/verify-setup`

Verify and enable 2FA.

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "token": "123456"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Two-factor authentication enabled successfully"
}
```

---

### 15. Disable 2FA
**POST** `/2fa/disable`

Disable two-factor authentication.

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "token": "123456"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Two-factor authentication disabled successfully"
}
```

---

### 16. Get Active Sessions
**GET** `/sessions`

Get all active sessions for the user.

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "sessionId": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
        "deviceInfo": {
          "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "ipAddress": "192.168.1.100",
          "deviceType": "desktop"
        },
        "loginTime": "2023-09-01T10:00:00.000Z",
        "lastActivity": "2023-09-01T12:30:00.000Z",
        "isCurrent": true
      }
    ]
  }
}
```

---

### 17. Revoke Session
**DELETE** `/sessions/:sessionId`

Revoke a specific session.

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200):
```json
{
  "success": true,
  "message": "Session revoked successfully"
}
```

---

### 18. Deactivate Account
**DELETE** `/deactivate`

Soft delete user account.

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200):
```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

---

### 19. Google OAuth Login
**POST** `/google`

Login with Google OAuth.

**Rate Limit**: 5 attempts per 15 minutes

**Request Body**:
```json
{
  "accessToken": "ya29.a0AfH6SMC..."
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Google login successful",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": null,
      "role": "owner",
      "isVerified": true,
      "isEmailVerified": true,
      "twoFactorEnabled": false,
      "profilePicture": "https://lh3.googleusercontent.com/...",
      "rating": {
        "average": 0,
        "count": 0
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0...",
      "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

### 20. Facebook OAuth Login
**POST** `/facebook`

Login with Facebook OAuth.

**Rate Limit**: 5 attempts per 15 minutes

**Request Body**:
```json
{
  "accessToken": "EAABwzLixnjYBO..."
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Facebook login successful",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": null,
      "role": "owner",
      "isVerified": true,
      "isEmailVerified": true,
      "twoFactorEnabled": false,
      "profilePicture": "https://platform-lookaside.fbsbx.com/...",
      "rating": {
        "average": 0,
        "count": 0
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0...",
      "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

### 21. Link Social Account
**POST** `/link-social`

Link Google or Facebook account to existing user.

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "provider": "google",
  "accessToken": "ya29.a0AfH6SMC..."
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "google account linked successfully",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "email": "john@example.com",
      "googleId": "1234567890",
      "facebookId": null
    }
  }
}
```

---

### 22. Unlink Social Account
**DELETE** `/unlink-social`

Unlink Google or Facebook account.

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "provider": "google"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "google account unlinked successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Account verification required to access this feature"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many authentication attempts, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error during registration"
}
```

---

## Security Features

### Rate Limiting
- **Registration**: 3 attempts per 15 minutes
- **Login**: 5 attempts per 15 minutes
- **OTP Verification**: 10 attempts per 15 minutes
- **Password Reset**: 3 attempts per 15 minutes
- **Social Login**: 5 attempts per 15 minutes

### Token Management
- **Access Token**: 15 minutes expiration
- **Refresh Token**: 30 days expiration
- **Session Token**: 7 days expiration
- **Token Blacklisting**: Automatic cleanup of expired tokens

### Password Security
- **Hashing**: bcrypt with 12 salt rounds
- **Reset Tokens**: 10 minutes expiration
- **Password Requirements**: Minimum 6 characters

### Two-Factor Authentication
- **TOTP**: Time-based One-Time Password
- **QR Code**: Generated for easy setup
- **Backup Codes**: Generated for recovery

### Session Management
- **Device Tracking**: IP address, user agent, device type
- **Session Limits**: Maximum 10 active sessions
- **Activity Tracking**: Last activity timestamp
- **Remote Logout**: Revoke specific sessions

---

## Environment Variables

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=15m

# Database
MONGODB_URI=mongodb://localhost:27017/petconnect

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=PetConnect <noreply@petconnect.com>

# Twilio Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## Installation & Setup

1. **Install Dependencies**:
```bash
npm install
```

2. **Set Environment Variables**:
Copy `.env.example` to `.env` and configure your variables.

3. **Start Server**:
```bash
npm run dev
```

4. **Test Endpoints**:
Use the provided test files or API testing tools like Postman.

---

## Testing

### Test Files Available:
- `test-api.js` - Basic API testing
- `test-register.js` - Registration testing
- `test-simple.js` - Simple endpoint testing

### Manual Testing:
1. Register a new user
2. Verify phone number with OTP
3. Verify email with token
4. Login with credentials
5. Test token refresh
6. Test logout functionality
7. Test 2FA setup (optional)
8. Test social login (optional)

---

## Best Practices

1. **Always use HTTPS in production**
2. **Store sensitive data in environment variables**
3. **Implement proper error handling**
4. **Use rate limiting to prevent abuse**
5. **Regularly rotate JWT secrets**
6. **Monitor failed login attempts**
7. **Implement proper logging**
8. **Use strong password policies**
9. **Enable 2FA for admin accounts**
10. **Regular security audits**

---

## Support

For issues or questions regarding the authentication API, please contact the development team or create an issue in the project repository.
