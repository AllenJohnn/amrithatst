import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { connectDB, isDbConnected } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET || 'phishguards_super_secret_jwt_key_2026_fallback';

// Helper to generate JWT
const generateToken = (userId, email, role) => {
  return jwt.sign(
    { id: userId, email, role },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// GET /api/auth/status - Check database and auth status
router.get('/status', (req, res) => {
  const connected = isDbConnected();
  res.json({
    success: true,
    connected,
    message: connected
      ? 'MongoDB Atlas is actively connected.'
      : 'MongoDB connection is offline.',
  });
});

// POST /api/auth/register - Register new user in MongoDB
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Ensure database connection
    if (!isDbConnected()) {
      await connectDB();
      if (!isDbConnected()) {
        return res.status(503).json({
          success: false,
          message: 'Database is currently offline. Please ensure MongoDB is connected.',
        });
      }
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please sign in instead.',
      });
    }

    // Create user in MongoDB with bcrypt password hash
    const user = await User.create({
      email: normalizedEmail,
      password,
      name: name?.trim() || normalizedEmail.split('@')[0],
      role: 'analyst',
    });

    const token = generateToken(user._id, user.email, user.role);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully and stored in MongoDB.',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      dbConnected: true,
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
});

// POST /api/auth/login - Sign in user against MongoDB
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Ensure database connection
    if (!isDbConnected()) {
      await connectDB();
      if (!isDbConnected()) {
        return res.status(503).json({
          success: false,
          message: 'Database is currently offline. Please verify MongoDB connection.',
        });
      }
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if account exists in MongoDB
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email. Please create an account first.',
      });
    }

    // Verify bcrypt password hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.email, user.role);

    return res.json({
      success: true,
      message: 'Signed in successfully. Authenticated via MongoDB.',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        lastLogin: user.lastLogin,
      },
      dbConnected: true,
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
});

// POST /api/auth/demo - Instant Demo Login
router.post('/demo', async (req, res) => {
  try {
    if (!isDbConnected()) {
      await connectDB();
    }

    const demoEmail = 'analyst@phishguards.sec';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      user = await User.create({
        email: demoEmail,
        password: 'DemoSecurePassword2026!',
        name: 'Demo Security Analyst',
        role: 'analyst',
      });
    }

    const token = generateToken(user._id, user.email, user.role);

    return res.json({
      success: true,
      message: 'Signed in as Demo Analyst.',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      dbConnected: isDbConnected(),
    });
  } catch (error) {
    console.error('[Auth Demo Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize demo login.',
    });
  }
});

// GET /api/auth/me - Get logged-in user profile from MongoDB
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        lastLogin: user.lastLogin,
      },
      dbConnected: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error retrieving user.',
    });
  }
});

export default router;
