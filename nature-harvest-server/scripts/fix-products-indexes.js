/*
  One-off maintenance script to fix stale indexes on the `products` collection.
  - Drops any legacy slug indexes if present
  - Runs Product.syncIndexes() to align indexes with the Mongoose schema
*/

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH || path.resolve(process.cwd(), '.env') });

const Product = require('../models/Product');

async function connectToDatabase() {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4,
    maxPoolSize: 5,
  };

  await mongoose.connect(mongoURI, options);
}

async function dropLegacyIndexesIfExists() {
  const collection = mongoose.connection.db.collection('products');
  const indexes = await collection.indexes();

  console.log('Current indexes on products collection:');
  indexes.forEach(idx => {
    console.log(`- ${idx.name}: ${JSON.stringify(idx.key)}`);
  });

  // Look for any slug-related indexes
  const slugIndexes = indexes.filter((idx) => 
    idx.name.includes('slug') || 
    Object.keys(idx.key).includes('slug')
  );

  for (const index of slugIndexes) {
    console.log(`Found slug-related index '${index.name}'. Dropping...`);
    try {
      await collection.dropIndex(index.name);
      console.log(`Dropped index '${index.name}'.`);
    } catch (error) {
      console.log(`Failed to drop index '${index.name}':`, error.message);
    }
  }

  if (slugIndexes.length === 0) {
    console.log('No slug-related indexes found. Skipping drop.');
  }
}

async function syncMongooseIndexes() {
  console.log('Syncing Mongoose indexes for Product model...');
  const result = await Product.syncIndexes();
  console.log('Product.syncIndexes() complete:', result);
}

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToDatabase();
    console.log('Connected.');

    await dropLegacyIndexesIfExists();
    await syncMongooseIndexes();

    console.log('All done.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Failed to fix products indexes:', error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
}

main();
