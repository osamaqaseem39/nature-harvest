/*
  One-off maintenance script to fix stale indexes on the `sizes` collection.
  - Drops the legacy unique compound index { productId: 1, volume: 1 } if present
  - Runs Size.syncIndexes() to align indexes with the Mongoose schema
*/

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH || path.resolve(process.cwd(), '.env') });

const Size = require('../models/Size');

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

async function dropLegacyIndexIfExists() {
  const collection = mongoose.connection.db.collection('sizes');
  const indexes = await collection.indexes();

  const legacyIndexName = 'productId_1_volume_1';
  const legacy = indexes.find((idx) => idx.name === legacyIndexName);

  if (legacy) {
    console.log(`Found legacy index '${legacyIndexName}'. Dropping...`);
    await collection.dropIndex(legacyIndexName);
    console.log(`Dropped index '${legacyIndexName}'.`);
  } else {
    console.log(`Legacy index '${legacyIndexName}' not found. Skipping drop.`);
  }
}

async function syncMongooseIndexes() {
  console.log('Syncing Mongoose indexes for Size model...');
  const result = await Size.syncIndexes();
  console.log('Size.syncIndexes() complete:', result);
}

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToDatabase();
    console.log('Connected.');

    await dropLegacyIndexIfExists();
    await syncMongooseIndexes();

    console.log('All done.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Failed to fix sizes indexes:', error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
}

main();

