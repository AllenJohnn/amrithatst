import app from '../server/index.js';
import { connectDB, isDbConnected } from '../server/config/db.js';

export default async function handler(req, res) {
  if (!isDbConnected()) {
    try {
      await connectDB();
    } catch (err) {
      console.error('[Vercel Serverless DB Connection Error]:', err);
    }
  }
  return app(req, res);
}
