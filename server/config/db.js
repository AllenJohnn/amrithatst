import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  const hasPlaceholder =
    !uri ||
    uri.includes('<db_password>') ||
    uri.includes('<password>') ||
    uri.includes('<username>') ||
    /<[^>]+>/.test(uri);

  if (hasPlaceholder) {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      '[MongoDB] Notice: MONGODB_URI contains a password placeholder (<db_password>) in .env.'
    );
    console.warn(
      '\x1b[33m%s\x1b[0m',
      '[MongoDB] To store login details directly in your cluster, replace <db_password> in .env with your MongoDB user password.'
    );
    console.warn(
      '\x1b[36m%s\x1b[0m',
      '[MongoDB] Server running in fallback mode so the app works smoothly in the meantime.'
    );
    isConnected = false;
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || 'phishguards',
      serverSelectionTimeoutMS: 8000,
    });

    isConnected = true;
    console.log(
      '\x1b[32m%s\x1b[0m',
      `[MongoDB] ✅ Successfully connected to MongoDB Atlas: ${conn.connection.host}`
    );
    console.log(
      '\x1b[32m%s\x1b[0m',
      `[MongoDB] 📁 Database: ${conn.connection.name}`
    );
    return true;
  } catch (error) {
    isConnected = false;
    console.error(
      '\x1b[31m%s\x1b[0m',
      `[MongoDB] ❌ Connection error: ${error.message}`
    );
    console.warn(
      '\x1b[33m%s\x1b[0m',
      '[MongoDB] Note: Check if your IP address is whitelisted in MongoDB Atlas Network Access (0.0.0.0/0) and credentials are correct.'
    );
    return false;
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('[MongoDB] Disconnected from database.');
});

mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('[MongoDB] Connected event triggered.');
});

export const isDbConnected = () => isConnected || mongoose.connection.readyState === 1;
