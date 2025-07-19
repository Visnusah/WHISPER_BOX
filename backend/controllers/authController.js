import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { User } from '../models/index.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendOTPEmail } from '../services/emailService.js';
import { generateTokens, verifyToken, generateEmailVerificationToken, generatePasswordResetToken } from '../utils/jwtUtils.js';
import { deleteOldProfileImage, getImageUrl } from '../middleware/upload.js';

// User Registration with Email Verification
export const signup = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Validate input
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and full name are required'
      });
    }

    // Generate username from full name (lowercase, remove spaces, add random number if needed)
    let username = fullName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    
    // Check if email already exists
    const existingEmailUser = await User.findOne({
      where: { email }
    });

    if (existingEmailUser) {
      // If user exists but is not verified, allow them to get OTP again
      if (!existingEmailUser.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered but not verified. Please verify your email first.',
          code: 'EMAIL_NOT_VERIFIED',
          data: {
            email: existingEmailUser.email,
            needsVerification: true
          }
        });
      }
      
      // If user exists and is verified
      return res.status(400).json({
        success: false,
        message: 'Email already registered and verified. Please login instead.',
        code: 'EMAIL_ALREADY_VERIFIED'
      });
    }

    // Check if username exists and generate unique one if needed
    let usernameExists = await User.findOne({
      where: { username }
    });

    while (usernameExists) {
      // If username exists, add random number
      username = username + Math.floor(Math.random() * 1000);
      usernameExists = await User.findOne({
        where: { username }
      });
    }

    // Generate email verification token
    const emailVerificationToken = generateEmailVerificationToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user (password will be hashed automatically by the model)
    const user = await User.create({
      email,
      password,
      username,
      fullName,
      emailVerificationToken,
      emailVerificationExpires,
      isEmailVerified: false
    });

    // Send verification email
    let emailSent = false;
    try {
      await sendVerificationEmail(user.email, user.fullName, emailVerificationToken);
      emailSent = true;
    } catch (emailError) {
      // Log error internally but don't expose to user
      console.error('Email service error:', emailError.message);
    }

    const responseMessage = emailSent 
      ? 'Registration successful! Please check your email to verify your account.'
      : 'Registration successful! Please contact support or check your email configuration.';

    const dataMessage = emailSent
      ? 'A verification email has been sent to your email address.'
      : 'Email verification is required but email service is currently unavailable. Please contact support.';

    res.status(201).json({
      success: true,
      message: responseMessage,
      data: {
        user: user.toSafeObject(),
        message: dataMessage,
        emailSent
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed. Please try again.',
      code: 'SIGNUP_ERROR'
    });
  }
};

// Email Verification
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find user with valid verification token
    const user = await User.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update user as verified
    await user.update({
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      lastLoginAt: new Date()
    });

    // Generate access and refresh tokens for immediate login
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Save refresh token to database
    await user.update({
      refreshToken
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.fullName);
    } catch (emailError) {
      // Log internally but don't affect user experience
      console.error('Welcome email error:', emailError);
    }

    res.json({
      success: true,
      message: 'Email verified successfully! You are now logged in.',
      data: {
        user: user.toSafeObject(),
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Email verification failed. Please try again or contact support.',
      code: 'VERIFICATION_ERROR'
    });
  }
};

// Resend Verification Email
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const emailVerificationToken = generateEmailVerificationToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await user.update({
      emailVerificationToken,
      emailVerificationExpires
    });

    // Send verification email
    await sendVerificationEmail(user.email, user.fullName, emailVerificationToken);

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not registered. Please sign up first.',
        code: 'ACCOUNT_NOT_FOUND'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is disabled. Please contact support.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      // Automatically send OTP to help user verify account
      let otpSent = false;
      try {
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await user.update({
          otpCode,
          otpExpires,
          otpAttempts: 0
        });

        // Try to send OTP email
        await sendOTPEmail(user.email, otpCode, user.fullName);
        otpSent = true;
      } catch (emailError) {
        // Log error internally
        console.error('Email service error:', emailError.message);
      }

      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before logging in.',
        code: 'EMAIL_NOT_VERIFIED',
        data: {
          email: user.email,
          needsVerification: true,
          otpSent: otpSent,
          message: otpSent 
            ? 'An OTP has been sent to your email for verification.'
            : 'Please request OTP verification or contact support if email service is unavailable.'
        }
      });
    }

    // Check password
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Save refresh token to database
    await user.update({
      refreshToken,
      lastLogin: new Date()
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toSafeObject(),
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An unexpected error occurred during login. Please try again.',
      code: 'LOGIN_ERROR'
    });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, 'refresh');
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Find user and verify refresh token matches
    const user = await User.findOne({
      where: {
        id: decoded.userId,
        refreshToken: refreshToken
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user.id);

    // Update refresh token in database
    await user.update({ refreshToken: tokens.refreshToken });

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate password reset token
    const resetToken = generatePasswordResetToken();
    const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.update({
      passwordResetToken: resetToken,
      passwordResetExpires
    });

    // Send password reset email or provide reset URL for development
    if (process.env.NODE_ENV === 'development') {
      // In development mode, return the reset URL directly instead of sending email
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
      
      res.json({
        success: true,
        message: 'Password reset link generated successfully (Development Mode)',
        resetUrl: resetUrl,
        devNote: 'In production, this link would be sent to the user\'s email. For now, copy this URL to reset password.'
      });
    } else {
      // Production mode - send email
      try {
        await sendPasswordResetEmail(user, resetToken);
        
        res.json({
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        });
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Failed to send password reset email'
        });
      }
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password and clear reset token
    await user.update({
      password, // Will be hashed automatically by the model
      passwordResetToken: null,
      passwordResetExpires: null,
      refreshToken: null // Invalidate all sessions
    });

    res.json({
      success: true,
      message: 'Password reset successfully. Please log in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Change Password (for authenticated users)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.checkPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password and invalidate all sessions
    await user.update({
      password: newPassword, // Will be hashed automatically
      refreshToken: null // Force re-login
    });

    res.json({
      success: true,
      message: 'Password changed successfully. Please log in again.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get User Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user: user.toSafeObject() }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const { username, fullName, bio } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if username is taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    // Update user
    await user.update({
      username: username || user.username,
      fullName: fullName !== undefined ? fullName : user.fullName,
      bio: bio !== undefined ? bio : user.bio
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: user.toSafeObject() }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    // Clear refresh token from database
    const user = await User.findByPk(req.user.id);
    if (user) {
      await user.update({ refreshToken: null });
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get Current User (for authentication check)
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    res.json({
      success: true,
      data: { user: user.toSafeObject() }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Upload Profile Picture
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old profile image if it exists
    if (user.profileImage) {
      deleteOldProfileImage(user.profileImage);
    }

    // Update user with new profile image path
    const profileImagePath = `/uploads/profile-images/${req.file.filename}`;
    await user.update({ profileImage: profileImagePath });

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      data: {
        profileImage: profileImagePath,
        user: user.toSafeObject()
      }
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Send OTP for email verification
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email address.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Generate 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP
    await user.update({
      otpCode,
      otpExpires,
      otpAttempts: 0 // Reset attempts when new OTP is generated
    });

    // Send OTP email
    try {
      await sendOTPEmail(user.email, otpCode, user.fullName);
    } catch (emailError) {
      console.error('Email service error:', emailError.message);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again or contact support.',
        code: 'EMAIL_SERVICE_ERROR'
      });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully to your email.',
      data: {
        email: user.email,
        expiresIn: '10 minutes'
      }
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP. Please try again.',
      code: 'OTP_SEND_ERROR'
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP code are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email address.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if too many failed attempts
    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.',
        code: 'TOO_MANY_ATTEMPTS'
      });
    }

    // Check if OTP is valid and not expired
    if (!user.otpCode || user.otpCode !== otpCode) {
      // Increment failed attempts
      await user.update({
        otpAttempts: user.otpAttempts + 1
      });
      
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code. Please check and try again.',
        code: 'INVALID_OTP',
        data: {
          attemptsRemaining: Math.max(0, 5 - (user.otpAttempts + 1))
        }
      });
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
        code: 'OTP_EXPIRED'
      });
    }

    // Verify user and clear OTP
    await user.update({
      isEmailVerified: true,
      otpCode: null,
      otpExpires: null,
      otpAttempts: 0, // Reset attempts on successful verification
      emailVerificationToken: null,
      emailVerificationExpires: null,
      lastLoginAt: new Date()
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Save refresh token to database
    await user.update({
      refreshToken
    });

    res.json({
      success: true,
      message: 'Email verified successfully! You are now logged in.',
      data: {
        user: user.toSafeObject(),
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'OTP verification failed. Please try again.',
      code: 'OTP_VERIFICATION_ERROR'
    });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email address.',
        code: 'USER_NOT_FOUND'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Your email is already verified. You can login directly.',
        code: 'ALREADY_VERIFIED'
      });
    }

    // Generate new 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    await user.update({
      otpCode,
      otpExpires,
      otpAttempts: 0 // Reset attempts when new OTP is generated
    });

    // Send OTP email
    try {
      await sendOTPEmail(user.email, otpCode, user.fullName);
    } catch (emailError) {
      console.error('Email service error:', emailError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again or contact support.',
        code: 'EMAIL_SERVICE_ERROR'
      });
    }

    res.json({
      success: true,
      message: 'New OTP sent successfully to your email.',
      data: {
        email: user.email,
        expiresIn: '10 minutes'
      }
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to resend OTP. Please try again.',
      code: 'OTP_RESEND_ERROR'
    });
  }
};

// Check verification status
export const checkVerificationStatus = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email address.',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'Verification status retrieved successfully.',
      data: {
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        hasOTP: !!user.otpCode,
        otpExpires: user.otpExpires
      }
    });
  } catch (error) {
    console.error('Check verification status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check verification status. Please try again.',
      code: 'STATUS_CHECK_ERROR'
    });
  }
};
