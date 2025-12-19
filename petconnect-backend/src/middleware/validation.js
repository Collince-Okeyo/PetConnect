const { body, param, query } = require('express-validator');

// User registration validation
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('phone')
    .matches(/^(\+254|0)[0-9]{9}$/)
    .withMessage('Please provide a valid Kenyan phone number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .optional()
    .isIn(['owner', 'walker', 'vet', 'admin'])
    .withMessage('Role must be owner, walker, vet, or admin'),
  
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of 2 numbers [longitude, latitude]'),
  
  body('location.coordinates.*')
    .isNumeric()
    .withMessage('Coordinates must be numbers')
];

// User login validation
const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email or phone number is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Pet validation
const validatePet = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Pet name must be between 1 and 30 characters'),
  
  body('type')
    .isIn(['dog', 'cat', 'bird', 'rabbit', 'other'])
    .withMessage('Pet type must be dog, cat, bird, rabbit, or other'),
  
  body('breed')
    .trim()
    .notEmpty()
    .withMessage('Pet breed is required'),
  
  body('age')
    .isInt({ min: 0, max: 30 })
    .withMessage('Age must be between 0 and 30 years'),
  
  body('gender')
    .isIn(['male', 'female'])
    .withMessage('Gender must be male or female'),
  
  body('weight')
    .optional()
    .isFloat({ min: 0, max: 200 })
    .withMessage('Weight must be between 0 and 200kg'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters')
];

// Walk request validation
const validateWalkRequest = [
  body('pet')
    .isMongoId()
    .withMessage('Valid pet ID is required'),
  
  body('scheduledTime')
    .isISO8601()
    .withMessage('Valid scheduled time is required'),
  
  body('duration')
    .isInt({ min: 15, max: 120 })
    .withMessage('Duration must be between 15 and 120 minutes'),
  
  body('location.pickup.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Pickup coordinates must be an array of 2 numbers'),
  
  body('location.pickup.coordinates.*')
    .isNumeric()
    .withMessage('Pickup coordinates must be numbers'),
  
  body('location.pickup.address')
    .trim()
    .notEmpty()
    .withMessage('Pickup address is required'),
  
  body('specialInstructions')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Special instructions cannot be more than 500 characters')
];

// Rating validation
const validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment cannot be more than 500 characters'),
  
  body('categories.punctuality')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Punctuality rating must be between 1 and 5'),
  
  body('categories.care')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Care rating must be between 1 and 5'),
  
  body('categories.communication')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Communication rating must be between 1 and 5'),
  
  body('categories.professionalism')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Professionalism rating must be between 1 and 5')
];

// Complaint validation
const validateComplaint = [
  body('againstUser')
    .isMongoId()
    .withMessage('Valid user ID is required'),
  
  body('type')
    .isIn([
      'inappropriate_behavior',
      'safety_concern',
      'payment_issue',
      'service_quality',
      'communication_problem',
      'no_show',
      'other'
    ])
    .withMessage('Valid complaint type is required'),
  
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('walkRequest')
    .optional()
    .isMongoId()
    .withMessage('Valid walk request ID is required')
];

// MongoDB ObjectId validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Valid ${paramName} is required`)
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Password reset validation
const validateForgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

const validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Email verification validation
const validateEmailVerification = [
  body('token')
    .notEmpty()
    .withMessage('Verification token is required')
];

// Two-factor authentication validation
const validateTwoFactorSetup = [
  body('token')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('2FA token must be a 6-digit number')
];

const validateTwoFactorVerification = [
  body('token')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('2FA token must be a 6-digit number')
];

// Refresh token validation
const validateRefreshToken = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
];

// Change password validation
const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

module.exports = {
  validateRegistration,
  validateLogin,
  validatePet,
  validateWalkRequest,
  validateRating,
  validateComplaint,
  validateObjectId,
  validatePagination,
  validateForgotPassword,
  validateResetPassword,
  validateEmailVerification,
  validateTwoFactorSetup,
  validateTwoFactorVerification,
  validateRefreshToken,
  validateChangePassword
};
