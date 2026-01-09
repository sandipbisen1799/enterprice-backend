import mongoose from 'mongoose';


const connectwithdb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err; // Ensure server doesn't start if DB connection fails
  }
};

export default connectwithdb;