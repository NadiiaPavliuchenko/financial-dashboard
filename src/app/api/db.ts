import mongoose from 'mongoose';
import Revenue from '../models/Revenue';

export async function connectToDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    if (mongoose.connections[0].readyState) {
      return;
    }
    const db = await mongoose.connect(mongoUri);

    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
