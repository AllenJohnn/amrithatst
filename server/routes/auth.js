import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const getJwtSecret = () => process.env.JWT_SECRET || 'phishguards_super_secret_jwt_key_2026_fallback';

// In-memory fallback cache when MongoDB is waiting for credentials
const fallbackUsers = new Map();

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
      ? 'MongoDB is actively connected.'
      : 'MongoDB is awaiting credentials in .env (running in resilient fallback mode).',
    envConfigured: Boolean(
      process.env.MONGODB_URI &&
      !process.env.MONGODB_URI.includes('<db_password>') &&
      !process.env.MONGODB_URI.includes('<password>') &&
      !process.env.MONGODB_URI.includes('<username>')
    ),
  });
});

// POST /api/auth/register - Register new user
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

    const normalizedEmail = email.toLowerCase().trim();

    // If MongoDB is connected, persist in database
    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.',
        });
      }

      const user = await User.create({
        email: normalizedEmail,
        password,
        name: name || normalizedEmail.split('@')[0],
      });

      const token = generateToken(user._id, user.email, user.role);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully and saved to MongoDB.',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        dbConnected: true,
      });
    }

    // Fallback mode when MongoDB credentials are not yet supplied
    if (fallbackUsers.has(normalizedEmail)) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists in local session.',
      });
    }

    const fallbackUser = {
      id: 'local-' + Date.now(),
      email: normalizedEmail,
      name: name || normalizedEmail.split('@')[0],
      role: 'analyst',
      password, // stored locally for fallback session only
    };
    fallbackUsers.set(normalizedEmail, fallbackUser);

    const token = generateToken(fallbackUser.id, fallbackUser.email, fallbackUser.role);

    return res.status(201).json({
      success: true,
      message: 'Account created in temporary fallback mode. Update MONGODB_URI in .env to persist permanently in MongoDB.',
      token,
      user: {
        id: fallbackUser.id,
        email: fallbackUser.email,
        name: fallbackUser.name,
        role: fallbackUser.role,
      },
      dbConnected: false,
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
});

// POST /api/auth/login - Sign in user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // If MongoDB is connected, verify against database
    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id, user.email, user.role);

      return res.json({
        success: true,
        message: 'Login successful. Authenticated via MongoDB.',
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
    }

    // Fallback mode when MongoDB credentials are not yet supplied
    // Check fallback user or allow standard demo / any valid password
    const existingFallback = fallbackUsers.get(normalizedEmail);
    if (existingFallback && existingFallback.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const fallbackUser = existingFallback || {
      id: 'demo-analyst',
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      role: 'analyst',
      lastLogin: new Date(),
    };

    const token = generateToken(fallbackUser.id, fallbackUser.email, fallbackUser.role);

    return res.json({
      success: true,
      message: 'Signed in successfully (Fallback mode. MongoDB connection pending in .env).',
      token,
      user: {
        id: fallbackUser.id,
        email: fallbackUser.email,
        name: fallbackUser.name,
        role: fallbackUser.role,
        lastLogin: new Date(),
      },
      dbConnected: false,
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
});

// GET /api/auth/me - Get current logged-in user profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user.id);
      if (user) {
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
      }
    }

    // Return decoded token info if user not in DB or in fallback
    return res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.email ? req.user.email.split('@')[0] : 'Security Analyst',
        role: req.user.role || 'analyst',
      },
      dbConnected: isDbConnected(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error retrieving user.',
    });
  }
});

export default router;
