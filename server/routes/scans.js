import express from 'express';
import Scan from '../models/Scan.js';
import { isDbConnected } from '../config/db.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Local fallback in-memory scan store when DB is waiting for .env config
let fallbackScans = [];

// GET /api/scans - Retrieve all scans
router.get('/', optionalAuth, async (req, res) => {
  try {
    if (isDbConnected()) {
      const query = req.user ? { $or: [{ userId: req.user.id }, { userId: null }] } : {};
      const scans = await Scan.find(query).sort({ createdAt: -1 }).limit(100);
      return res.json({
        success: true,
        scans,
        source: 'mongodb',
        dbConnected: true,
      });
    }

    return res.json({
      success: true,
      scans: fallbackScans,
      source: 'fallback',
      dbConnected: false,
    });
  } catch (error) {
    console.error('[Get Scans Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve scans from database.',
      error: error.message,
    });
  }
});

// POST /api/scans - Save a new scan to MongoDB
router.post('/', optionalAuth, async (req, res) => {
  try {
    const scanData = req.body;

    if (!scanData || !scanData.url) {
      return res.status(400).json({
        success: false,
        message: 'Scan URL is required.',
      });
    }

    const payload = {
      ...scanData,
      userId: req.user ? req.user.id : null,
      date: scanData.date || new Date().toISOString(),
    };

    if (isDbConnected()) {
      const newScan = await Scan.create(payload);
      return res.status(201).json({
        success: true,
        scan: newScan,
        message: 'Scan saved to MongoDB.',
        dbConnected: true,
      });
    }

    // Fallback store
    const localScan = {
      ...payload,
      id: scanData.id || 'scan-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    fallbackScans = [localScan, ...fallbackScans];

    return res.status(201).json({
      success: true,
      scan: localScan,
      message: 'Scan saved in fallback mode (MongoDB pending in .env).',
      dbConnected: false,
    });
  } catch (error) {
    console.error('[Save Scan Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save scan.',
      error: error.message,
    });
  }
});

// DELETE /api/scans/:id - Delete a scan
router.delete('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      await Scan.findOneAndDelete({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { id }],
      });
    }

    fallbackScans = fallbackScans.filter((s) => s.id !== id && s._id !== id);

    return res.json({
      success: true,
      message: 'Scan deleted.',
      dbConnected: isDbConnected(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete scan.',
      error: error.message,
    });
  }
});

// DELETE /api/scans - Clear all scans
router.delete('/', optionalAuth, async (req, res) => {
  try {
    if (isDbConnected()) {
      await Scan.deleteMany({});
    }
    fallbackScans = [];

    return res.json({
      success: true,
      message: 'All scan history cleared.',
      dbConnected: isDbConnected(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to clear scans.',
      error: error.message,
    });
  }
});

export default router;
