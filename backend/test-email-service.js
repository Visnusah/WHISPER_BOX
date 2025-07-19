import dotenv from 'dotenv';
import { sendOTPEmail } from './services/emailService.js';

dotenv.config();

async function testEmailService() {
  try {
    console.log('🧪 Testing email service...');
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.EMAIL_FROM
    });

    const testEmail = 'test@example.com';
    const testOTP = '1234';
    const testName = 'Test User';

    console.log('📧 Sending test OTP email...');
    const result = await sendOTPEmail(testEmail, testOTP, testName);
    console.log('✅ Email sent successfully:', result);
  } catch (error) {
    console.error('❌ Email service test failed:', error);
    console.error('Error details:', error.message);
  }
}

testEmailService();
