const mongoose = require('mongoose');
const Flavor = require('./models/Flavor');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample flavor data with image URLs
const sampleFlavors = [
  {
    name: 'Apple',
    description: 'Fresh and crisp apple flavor with natural sweetness',
    imageUrl: '/images/orange.png', // Using existing image as placeholder
    status: 'Active'
  },
  {
    name: 'Mango',
    description: 'Tropical mango flavor with rich, sweet taste',
    imageUrl: '/images/pineapple.png', // Using existing image as placeholder
    status: 'Active'
  },
  {
    name: 'Orange',
    description: 'Zesty orange flavor with perfect citrus balance',
    imageUrl: '/images/orange.png',
    status: 'Active'
  },
  {
    name: 'Strawberry',
    description: 'Sweet and tangy strawberry flavor',
    imageUrl: '/images/strawberry.png',
    status: 'Active'
  },
  {
    name: 'Pineapple',
    description: 'Tropical pineapple flavor with refreshing taste',
    imageUrl: '/images/pineapple.png',
    status: 'Active'
  },
  {
    name: 'Guava',
    description: 'Exotic guava flavor with unique tropical notes',
    imageUrl: '/images/orange.png', // Using existing image as placeholder
    status: 'Active'
  },
  {
    name: 'Peach',
    description: 'Delicate peach flavor with subtle sweetness',
    imageUrl: '/images/strawberry.png', // Using existing image as placeholder
    status: 'Active'
  },
  {
    name: 'Natural',
    description: 'Pure natural water with no added flavors',
    imageUrl: '/images/orange.png', // Using existing image as placeholder
    status: 'Active'
  }
];

async function createSampleFlavors() {
  try {
    // Clear existing flavors
    await Flavor.deleteMany({});
    console.log('Cleared existing flavors');

    // Create new flavors
    const createdFlavors = await Flavor.insertMany(sampleFlavors);
    console.log(`Created ${createdFlavors.length} flavors:`);
    
    createdFlavors.forEach(flavor => {
      console.log(`- ${flavor.name}: ${flavor.imageUrl}`);
    });

    console.log('Sample flavors created successfully!');
  } catch (error) {
    console.error('Error creating sample flavors:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

createSampleFlavors(); 