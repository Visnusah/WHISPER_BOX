import emailService from './services/emailService.js';

async function testOTP() {
  try {
    console.log('🧪 Testing OTP email functionality...');
    
    // Test OTP generation and email sending
    const testOTP = '1234';
    const testEmail = 'test@example.com';
    const testUserName = 'Test User';
    
    console.log(`📧 Attempting to send OTP ${testOTP} to ${testEmail}...`);
    
    await emailService.sendOTPEmail(testEmail, testOTP, testUserName);
    
    console.log('✅ OTP email sent successfully!');
    console.log('🎉 OTP functionality is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing OTP:', error.message);
  }
}

testOTP();
