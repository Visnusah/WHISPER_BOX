// Simple test to check if backend is running and CORS is working
// Run this in browser console when on http://localhost:5173

console.log('Testing WHISPER_BOX Backend Connection...');

// Test 1: Basic health check
fetch('http://localhost:5000/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Health Check Success:', data);
  })
  .catch(error => {
    console.error('❌ Health Check Failed:', error);
  });

// Test 2: CORS test
fetch('http://localhost:5000/api/test')
  .then(response => response.json())
  .then(data => {
    console.log('✅ CORS Test Success:', data);
  })
  .catch(error => {
    console.error('❌ CORS Test Failed:', error);
  });

// Test 3: Auth endpoint test
fetch('http://localhost:5000/api/auth/me', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => {
    console.log('✅ Auth Endpoint Response:', data);
  })
  .catch(error => {
    console.error('❌ Auth Endpoint Failed:', error);
  });
