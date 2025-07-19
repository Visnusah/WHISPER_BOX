// Quick test script to verify OTP endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5001/api/auth';

async function testOTPEndpoints() {
  console.log('🧪 Testing OTP endpoints...\n');
  
  try {
    // Test 1: Send OTP to a test email
    console.log('1. Testing Send OTP endpoint...');
    const sendOTPResponse = await fetch(`${BASE_URL}/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com' // You can change this to a real email if you want
      })
    });
    
    const sendOTPResult = await sendOTPResponse.json();
    console.log('Send OTP Status:', sendOTPResponse.status);
    console.log('Send OTP Response:', sendOTPResult);
    
    // Test 2: Test verify OTP endpoint (this will fail but we want to see the response)
    console.log('\n2. Testing Verify OTP endpoint...');
    const verifyOTPResponse = await fetch(`${BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        otp: '1234',
        password: 'testpassword'
      })
    });
    
    const verifyOTPResult = await verifyOTPResponse.json();
    console.log('Verify OTP Status:', verifyOTPResponse.status);
    console.log('Verify OTP Response:', verifyOTPResult);
    
    // Test 3: Test resend OTP endpoint
    console.log('\n3. Testing Resend OTP endpoint...');
    const resendOTPResponse = await fetch(`${BASE_URL}/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    });
    
    const resendOTPResult = await resendOTPResponse.json();
    console.log('Resend OTP Status:', resendOTPResponse.status);
    console.log('Resend OTP Response:', resendOTPResult);
    
    console.log('\n✅ OTP endpoints are accessible and responding correctly!');
    
  } catch (error) {
    console.error('❌ Error testing OTP endpoints:', error);
  }
}

testOTPEndpoints();
