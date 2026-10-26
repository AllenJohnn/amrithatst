import express from 'express';
import { predictWithPythonService, evaluateRiskWithML, getModelMetadata } from '../ml/mlEngine.js';

const router = express.Router();

// POST /api/ml/predict - Classify a URL with Machine Learning
router.post('/predict', async (req, res) => {
  try {
    const { url } = req.body || {};
    if (!url || !url.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A target URL is required for ML analysis.'
      });
    }

    const prediction = await predictWithPythonService(url.trim());
    return res.json({
      success: true,
      prediction
    });
  } catch (error) {
    console.error('[ML Predict Error]:', error);
    // Even if an unexpected error occurs, fall back to evaluateRiskWithML
    try {
      const fallback = evaluateRiskWithML(req.body.url);
      return res.json({ success: true, prediction: fallback });
    } catch (e2) {
      return res.status(500).json({
        success: false,
        message: 'Failed to complete ML prediction.',
        error: error.message
      });
    }
  }
});

// GET /api/ml/metrics - Retrieve trained model metrics, confusion matrix & feature importances
router.get('/metrics', (req, res) => {
  try {
    const metadata = getModelMetadata();
    return res.json({
      success: true,
      metrics: metadata.metrics,
      confusionMatrix: metadata.confusion_matrix,
      featureImportances: metadata.feature_importances,
      metadata: metadata.metadata
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve ML metrics.',
      error: error.message
    });
  }
});

// GET /api/ml/models - Retrieve multi-model comparison leaderboard
router.get('/models', (req, res) => {
  try {
    const metadata = getModelMetadata();
    return res.json({
      success: true,
      models: metadata.model_comparison || [],
      activeModel: metadata.metadata?.model_name || 'Random Forest (Ensemble)'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve model comparison.',
      error: error.message
    });
  }
});

export default router;
