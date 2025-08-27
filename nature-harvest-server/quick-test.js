const http = require('http');

const testEndpoints = async () => {
  console.log('🧪 Testing server endpoints...\n');
  
  const endpoints = [
    { path: '/', method: 'GET', name: 'Server Health' },
    { path: '/api/auth/test', method: 'GET', name: 'Auth Test' },
    { path: '/api/auth/me', method: 'GET', name: 'Get Profile (no token)' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(endpoint.path, endpoint.method);
      console.log(`✅ ${endpoint.name}: ${endpoint.method} ${endpoint.path}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Response: ${result.data.substring(0, 100)}...\n`);
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${endpoint.method} ${endpoint.path}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }
};

const makeRequest = (path, method) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
};

testEndpoints(); 