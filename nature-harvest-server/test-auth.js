const axios = require('axios');

const testAuth = async () => {
  try {
    console.log('Testing authentication API...\n');
    
    // Test 1: Valid login
    console.log('Test 1: Valid login credentials');
    const loginResponse = await axios.post('http://localhost:3002/api/auth/login', {
      email: 'admin@natureharvest.com',
      password: 'admin123456'
    });
    console.log('✅ Login successful:', loginResponse.data);
    
    // Test 2: Invalid email format
    console.log('\nTest 2: Invalid email format');
    try {
      await axios.post('http://localhost:3002/api/auth/login', {
        email: 'invalid-email',
        password: 'admin123456'
      });
    } catch (error) {
      console.log('✅ Invalid email rejected:', error.response.data);
    }
    
    // Test 3: Missing password
    console.log('\nTest 3: Missing password');
    try {
      await axios.post('http://localhost:3002/api/auth/login', {
        email: 'admin@natureharvest.com'
      });
    } catch (error) {
      console.log('✅ Missing password rejected:', error.response.data);
    }
    
    // Test 4: Empty request body
    console.log('\nTest 4: Empty request body');
    try {
      await axios.post('http://localhost:3002/api/auth/login', {});
    } catch (error) {
      console.log('✅ Empty body rejected:', error.response.data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

testAuth(); 