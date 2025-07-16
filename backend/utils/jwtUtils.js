import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Generate JWT tokens
export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '30d' }
  );

  return { accessToken, refreshToken };
};

// Verify JWT token
export const verifyToken = (token, type = 'access') => {
  try {
    if (type === 'refresh') {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } else {
      return jwt.verify(token, process.env.JWT_SECRET);
    }
  } catch (error) {
    return null;
  }
};

// Generate random token for email verification
export const generateEmailVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate random token for password reset
export const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate random token for email verification and password reset
export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate token expiry date
export const generateTokenExpiry = (hours = 24) => {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

// Hash token (for storing in database)
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export default {
  generateTokens,
  verifyToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateRandomToken,
  generateTokenExpiry,
  hashToken
};
