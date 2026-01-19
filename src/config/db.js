import mongoose from 'mongoose';
 import env from './env.js';

export const connectwithdb = async () => {
  try {
    mongoose.connection.on('connected', () =>
      console.log('MongoDB connected')
    );

    mongoose.connection.on('error', (err) =>
      console.error('MongoDB error:', err)
    );

    mongoose.connection.on('disconnected', () =>
      console.log('MongoDB disconnected')
    );

    await mongoose.connect(env.MONGODB_URL, {
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
};


export const closedb = async () => {
  await mongoose.connection.close(false);
};


