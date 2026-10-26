import dns from 'node:dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Force Google & Cloudflare DNS to resolve MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if not supported in environment
}

// Load local .env if present (in Vercel, process.env is injected by the platform)
try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
} catch {
  // Ignore in serverless environments where .env file is omitted
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let lastConnectionError = '';

export const connectDB = async () => {
  // If already connected, reuse existing socket pool
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    lastConnectionError = 'MONGODB_URI is not defined in Vercel Environment Variables. Please add it in your Vercel Project Settings.';
    console.error('[MongoDB Error]:', lastConnectionError);
    return false;
  }

  if (/<[^>]+>/.test(uri)) {
    lastConnectionError = 'MONGODB_URI contains a placeholder like <db_password>. Update it in Vercel Environment Variables.';
    console.error('[MongoDB Error]:', lastConnectionError);
    return false;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: process.env.DB_NAME || 'phishguards',
      serverSelectionTimeoutMS: 12000,
      connectTimeoutMS: 12000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        console.log('[MongoDB] ✅ Connected to Atlas cluster:', m.connection.host);
        lastConnectionError = '';
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        lastConnectionError = err.message;
        console.error('[MongoDB Connection Failed]:', err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return true;
  } catch (error) {
    cached.promise = null;
    lastConnectionError = error.message;
    return false;
  }
};

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

export const getConnectionError = () => lastConnectionError;
