import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

export const validateSignup = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('fullName')
    .isLength({ min: 2, max: 100 })
    .trim()
    .withMessage('Full name must be 2-100 characters long'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

export const validatePost = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .trim()
    .withMessage('Title must be 1-200 characters long'),
  body('description')
    .isLength({ min: 1, max: 2000 })
    .trim()
    .withMessage('Description must be 1-2000 characters long'),
  body('hashtags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Maximum 10 hashtags allowed'),
  body('hashtags.*')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Each hashtag must be less than 50 characters'),
  handleValidationErrors
];

export const validateComment = [
  body('text')
    .isLength({ min: 1, max: 1000 })
    .trim()
    .withMessage('Comment must be 1-1000 characters long'),
  handleValidationErrors
];

export const validateUpdateProfile = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .isAlphanumeric()
    .withMessage('Username must be 3-30 characters and contain only letters and numbers'),
  body('fullName')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Full name must be less than 100 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  handleValidationErrors
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  handleValidationErrors
];

export const validateForgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  handleValidationErrors
];

export const validateResetPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

export const validateVote = [
  body('voteType')
    .isIn(['up', 'down'])
    .withMessage('Vote type must be either "up" or "down"'),
  handleValidationErrors
];
