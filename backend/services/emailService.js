import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import OTPVerificationEmail from '../emails/OTPVerificationEmail.js';

dotenv.config();

// Create transporter
const createTransporter = () => {
  // Check if email configuration is available
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Email service not configured. Please set SMTP_USER and SMTP_PASS environment variables.');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send email verification

// Send email verification
export const sendVerificationEmail = async (user, verificationToken) => {
  const transporter = createTransporter();
  
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Whisper Box</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌟 Welcome to Whisper Box!</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.username}!</h2>
            <p>Thank you for joining Whisper Box! We're excited to have you as part of our community.</p>
            <p>To complete your registration and start sharing your thoughts, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify My Email</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
            <p><strong>Important:</strong> This verification link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create an account with Whisper Box, please ignore this email.</p>
            <p>Happy whisperring!</p>
            <p>The Whisper Box Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Whisper Box. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: 'Welcome to Whisper Box - Verify Your Email',
    html: emailHtml
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (user, resetToken) => {
  const transporter = createTransporter();
  
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Whisper Box</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${user.fullName || user.username}!</h2>
            <p>We received a request to reset the password for your Whisper Box account.</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </div>
            <p>To reset your password, click the button below:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset My Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            <p><strong>Important:</strong> This reset link will expire in 1 hour for security reasons.</p>
            <p>If you continue to have problems, please contact our support team.</p>
            <p>Best regards,</p>
            <p>The Whisper Box Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Whisper Box. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: 'Reset Your Whisper Box Password',
    html: emailHtml
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (user) => {
  const transporter = createTransporter();
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Whisper Box!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .feature { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Whisper Box, ${user.username}!</h1>
          </div>
          <div class="content">
            <p>Congratulations! Your email has been verified and your account is now active.</p>
            <p>You're now part of a vibrant community where thoughts and ideas flow freely. Here's what you can do:</p>
            
            <div class="feature">
              <strong>📝 Share Your Thoughts:</strong> Create posts and share what's on your mind with the community.
            </div>
            
            <div class="feature">
              <strong>💬 Engage with Others:</strong> Comment on posts and join meaningful conversations.
            </div>
            
            <div class="feature">
              <strong>📊 Vote & Save:</strong> Upvote great content and save posts you want to revisit.
            </div>
            
            <div class="feature">
              <strong>🔥 Discover Trending:</strong> Explore the most popular posts in the community.
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/home" class="button">Start Exploring</a>
            </div>
            
            <p>Need help getting started? Check out our community guidelines or reach out to our support team.</p>
            <p>We're thrilled to have you aboard!</p>
            <p>Happy whisperring!</p>
            <p>The Whisper Box Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Whisper Box. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: '🎉 Welcome to Whisper Box - Let\'s Get Started!',
    html: emailHtml
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    // Don't throw error for welcome email as it's not critical
    return { success: false, error: error.message };
  }
};

// Send contact form email to admin
export const sendContactEmail = async ({ name, email, subject, message }) => {
  const transporter = createTransporter();
  
  // Subject mapping for better readability
  const subjectMap = {
    'account-deactivated': 'Account Deactivation Inquiry',
    'password-reset': 'Password Reset Issues',
    'email-verification': 'Email Verification Problems',
    'technical-support': 'Technical Support Request',
    'content-moderation': 'Content Moderation Question',
    'feature-request': 'Feature Request',
    'bug-report': 'Bug Report',
    'other': 'General Inquiry'
  };

  const emailSubject = subjectMap[subject] || subject;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Submission - Whisper Box</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px; }
          .field { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
          .field-label { font-weight: bold; color: #333; margin-bottom: 5px; }
          .field-value { color: #555; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .priority { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Contact Form Submission</h1>
            <p>New message from Whisper Box website</p>
          </div>
          <div class="content">
            ${subject === 'account-deactivated' ? `
              <div class="priority">
                <strong>⚠️ Priority Message:</strong> This is an account deactivation inquiry that may require immediate attention.
              </div>
            ` : ''}
            
            <div class="field">
              <div class="field-label">From:</div>
              <div class="field-value">${name} (${email})</div>
            </div>
            
            <div class="field">
              <div class="field-label">Subject:</div>
              <div class="field-value">${emailSubject}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Message:</div>
              <div class="field-value" style="white-space: pre-wrap;">${message}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Submitted At:</div>
              <div class="field-value">${new Date().toLocaleString()}</div>
            </div>
            
            <p><strong>Reply Instructions:</strong> Please respond directly to ${email} to address this inquiry.</p>
          </div>
          <div class="footer">
            <p>© 2024 Whisper Box - Contact Form Submission</p>
            <p>This email was automatically generated from the website contact form.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: 'sahk5858@gmail.com', // Admin email
    replyTo: email, // Allow admin to reply directly to the user
    subject: `[Whisper Box Contact] ${emailSubject} - from ${name}`,
    html: emailHtml
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact email sent to admin:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending contact email:', error);
    throw new Error('Failed to send contact email to admin');
  }
};

// Send OTP verification email
export const sendOTPEmail = async (email, otp, userName) => {
  try {
    const transporter = createTransporter();
    const emailHtml = OTPVerificationEmail({ otp, userName });
    const emailText = `Your verification code is: ${otp}`;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Your Verification Code - Whisper Box',
      html: emailHtml,
      text: emailText
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    throw error;
  }
};
