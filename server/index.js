import dns from 'node:dns';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Force public DNS resolvers to prevent querySrv ECONNREFUSED errors on restricted ISPs/hotspots
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  // Ignore if network environment restricts custom DNS
}
import { connectDB, isDbConnected } from './config/db.js';
import authRoutes from './routes/auth.js';
import scanRoutes from './routes/scans.js';
import mlRoutes from './routes/ml.js';

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup to allow requests from Vite dev server & Vercel deployments
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for API calls
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// Ensure MongoDB connection before handling API calls (for Vercel Serverless Functions)
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api') && !isDbConnected()) {
    try {
      await connectDB();
    } catch (e) {
      console.error('[MongoDB Serverless Connect Error]:', e);
    }
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      connected: isDbConnected(),
      type: 'MongoDB',
    },
    service: 'PhishGuards Security Backend',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/ml', mlRoutes);

// Fallback for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl || req.path} not found.`,
  });
});

// Serve production frontend assets if dist folder exists
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    }
    next();
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log('----------------------------------------------------');
    console.log(`[*] PhishGuards Backend running at http://localhost:${PORT}`);
    console.log(`[*] Auth API: http://localhost:${PORT}/api/auth`);
    console.log(`[*] Scans API: http://localhost:${PORT}/api/scans`);
    console.log(`[*] ML Inference API: http://localhost:${PORT}/api/ml`);
    console.log('----------------------------------------------------');
  });

  // Connect to DB asynchronously so server is immediately responsive
  connectDB().then(() => {
    console.log(`📡 MongoDB Status: ${isDbConnected() ? 'Connected' : 'Fallback mode'}`);
  }).catch((err) => {
    console.warn(`[MongoDB Warning]: ${err.message}`);
  });

  return server;
};

if (!process.env.VERCEL) {
  startServer();
}

export default app;
