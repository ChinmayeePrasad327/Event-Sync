const http = require('http');

console.log('🧪 Testing server connection...');

// Test if server is responding
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/test',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Server responded with status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📥 Response data:', data);
    console.log('🎉 Server is working correctly!');
  });
});

req.on('error', (error) => {
  console.log('❌ Server connection failed:', error.message);
  console.log('💡 Make sure the server is running with: node simple-server.js');
});

req.end();
