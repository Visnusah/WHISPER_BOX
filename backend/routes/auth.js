import express from 'express';
import { 
  signup, 
  login, 
  verifyEmail, 
  resendVerification, 
  refreshToken, 
  forgotPassword, 
  resetPassword, 
  changePassword, 
  getProfile, 
  updateProfile, 
  uploadProfilePicture,
  logout, 
  getMe,
  sendOTP,
  verifyOTP,
  resendOTP
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadProfileImage } from '../middleware/upload.js';
import { 
  validateSignup, 
  validateLogin, 
  validateUpdateProfile, 
  validateChangePassword, 
  validateForgotPassword, 
  validateResetPassword 
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPassword);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, validateUpdateProfile, updateProfile);
router.post('/upload-profile-picture', authenticateToken, uploadProfileImage.single('profileImage'), uploadProfilePicture);
router.post('/change-password', authenticateToken, validateChangePassword, changePassword);
router.post('/logout', authenticateToken, logout);

export default router;
