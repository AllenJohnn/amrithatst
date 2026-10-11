import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, isDbConnected } from './config/db.js';
import authRoutes from './routes/auth.js';
import scanRoutes from './routes/scans.js';

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup to allow requests from Vite dev server
app.use(
  cors({
    origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://127.0.0.1:3000'],
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

// Fallback for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl || req.path} not found.`,
  });
});

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
const startServer = async () => {
  // Attempt MongoDB connection (non-blocking, won't crash if credentials are placeholders)
  await connectDB();

  app.listen(PORT, () => {
    console.log('----------------------------------------------------');
    console.log(`🛡️  PhishGuards Backend running at http://localhost:${PORT}`);
    console.log(`📡 MongoDB Status: ${isDbConnected() ? '✅ Connected' : '⏳ Awaiting credentials in .env'}`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
    console.log(`📊 Scans API: http://localhost:${PORT}/api/scans`);
    console.log('----------------------------------------------------');
  });
};

startServer();

export default app;
