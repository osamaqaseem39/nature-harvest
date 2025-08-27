const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test login functionality
const testLogin = async () => {
  try {
    console.log('Testing login functionality...\n');
    
    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin@natureharvest.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log('  - Email:', adminUser.email);
    console.log('  - Username:', adminUser.username);
    console.log('  - Role:', adminUser.role);
    console.log('  - ID:', adminUser._id);
    
    // Test password comparison
    const isPasswordValid = await adminUser.comparePassword('admin123456');
    console.log('  - Password valid:', isPasswordValid);
    
    if (isPasswordValid) {
      console.log('\n🎉 Login should work with:');
      console.log('  Email: admin@natureharvest.com');
      console.log('  Password: admin123456');
    } else {
      console.log('\n❌ Password is incorrect');
    }
    
  } catch (error) {
    console.error('Error testing login:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testLogin();
  mongoose.connection.close();
  console.log('\nTest completed.');
};

main(); 