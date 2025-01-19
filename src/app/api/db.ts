import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcryptjs';

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

    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
