const { uploadToExternalService } = require('./middleware/externalUpload');
const fs = require('fs');
const path = require('path');

// Test the external upload service
async function testExternalUpload() {
  try {
    console.log('Testing external upload service...');
    
    // Create a test file buffer (simulating an image)
    const testBuffer = Buffer.from('test image data');
    const testFile = {
      buffer: testBuffer,
      originalname: 'test-image.jpg',
      mimetype: 'image/jpeg'
    };
    
    console.log('Uploading test file...');
    const result = await uploadToExternalService(testFile, 'test');
    
    console.log('Upload successful!');
    console.log('Result:', result);
    
    return result;
  } catch (error) {
    console.error('Upload failed:', error.message);
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testExternalUpload()
    .then(() => {
      console.log('Test completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testExternalUpload }; 