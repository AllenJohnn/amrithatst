"""
PhishGuards - Python Flask ML REST Microservice
Exposes endpoints for URL classification and ML telemetry:
  POST /predict  - Real-time classification on target URL
  GET  /metrics  - Model performance (Acc, Prec, Rec, F1, Confusion Matrix)
  GET  /models   - Multi-model comparison leaderboard
  GET  /health   - Microservice health & loaded model status
"""

import os
import sys
import json
from flask import Flask, request, jsonify

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from ml.predict import predict_url, load_model

app = Flask(__name__)
model = None

def get_model():
    global model
    if model is None:
        model = load_model()
    return model

def get_weights_metadata():
    ml_dir = os.path.dirname(os.path.abspath(__file__))
    weights_path = os.path.join(ml_dir, "model_weights.json")
    if os.path.exists(weights_path):
        with open(weights_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return None

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "PhishGuards ML Inference Engine",
        "model_loaded": model is not None,
        "framework": "scikit-learn"
    })

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True, silent=True) or {}
    url = data.get("url", "").strip()
    if not url:
        return jsonify({"success": False, "error": "URL parameter is required"}), 400

    try:
        m = get_model()
        result = predict_url(url, m)
        return jsonify({
            "success": True,
            "prediction": result
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/metrics", methods=["GET"])
def metrics():
    meta = get_weights_metadata()
    if not meta:
        return jsonify({"success": False, "error": "Model weights metadata not found"}), 404
    return jsonify({
        "success": True,
        "metrics": meta.get("metrics"),
        "confusion_matrix": meta.get("confusion_matrix"),
        "feature_importances": meta.get("feature_importances"),
        "metadata": meta.get("metadata")
    })

@app.route("/models", methods=["GET"])
def models():
    meta = get_weights_metadata()
    if not meta:
        return jsonify({"success": False, "error": "Model weights metadata not found"}), 404
    return jsonify({
        "success": True,
        "models": meta.get("model_comparison"),
        "active_model": meta.get("metadata", {}).get("model_name")
    })

if __name__ == "__main__":
    get_model()
    port = int(os.environ.get("ML_PORT", 5001))
    print(f"[*] PhishGuards ML Microservice running on http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=False)
