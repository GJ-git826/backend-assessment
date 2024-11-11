// src/utils/db.ts

import mongoose from 'mongoose';

const connectDB = async (log = true) => { // Add optional logging parameter
  if (mongoose.connection.readyState === 1) {
    log && console.log('MongoDB already connected');
    return;
  }

  try {
    const databaseUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/sampleDB';
    await mongoose.connect(databaseUrl);
    log && console.log('MongoDB connected'); // Conditional logging
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
