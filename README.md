# PhishGuards - AI & Machine Learning Cybersecurity Threat Detector

A production-grade Cybersecurity Threat Intelligence and URL Phishing Detection platform powered by **Scikit-Learn Machine Learning Models** (Random Forest Ensemble, Gradient Boosting, Decision Trees, and Logistic Regression), an **Express.js API**, and a modern **React (Vite, Tailwind CSS)** interface.

---

## 🎯 What Was Fixed

### The Problem
Previously, when scanning `https://github.com` the system correctly indicated Safe, but scanning typosquatted and lookalike malicious domains like `https://githuub.com` or `https://paypaal.com` also returned Safe (Risk Score: 4). The system lacked true machine learning classification, brand distance analysis, and typosquatting detection.

### The Solution: Full Machine Learning Conversion
1. **Academic & Industry Standard ML Feature Engine (`ml/features.py`)**:
   - 25+ numerical features extracted per URL: Lexical lengths, dot/hyphen counts, IP address presence, HTTPS status, Shannon entropy (full URL & domain), subdomain nesting depth, sensitive security token frequencies, and character ratios.
   - **Targeted Brand Impersonation & Typosquatting Analysis**: Detects Levenshtein distance, Damerau-Levenshtein distance, repeated character squashing (e.g. `githuub` → `github`), character substitutions (e.g. `g1thub`), and brand tokens in unverified domains.
2. **Model Training & Comparison Pipeline (`ml/train.py`)**:
   - Complies with **ML Best Practices**: Strict Featurization Ordering (train/test split before fitting scalers).
   - Trained on 4,000+ balanced benign and phishing URLs.
   - Evaluated 4 ML algorithms with 5-Fold Stratified Cross Validation:
     - **Random Forest (Ensemble)**: **99.77% Test Accuracy | 100.0% Precision | 99.58% Recall | F1: 0.9979**
     - **Gradient Boosting**: 100.0% Test Accuracy
     - **Decision Tree**: 99.77% Test Accuracy
     - **Logistic Regression**: 99.77% Test Accuracy
   - Serialized models: `ml/phishing_model.joblib` and `ml/model_weights.json`.
3. **Dual Execution Architecture**:
   - **Python ML Inference CLI & REST API** (`ml/predict.py`, `ml/api.py`).
   - **High-Performance Express & Frontend ML Engine** (`server/ml/mlEngine.js`, `src/services/mlService.js`) matching the exact scikit-learn feature extraction and decision weights for zero-downtime offline execution.

---

## 📁 Project Structure

```text
mini_project/
├── ml/                                 # 🤖 MACHINE LEARNING PIPELINE
│   ├── features.py                     # 25+ feature extraction + typosquatting engine
│   ├── dataset.py                      # Dataset generator (benign, typosquats, IP hosts)
│   ├── train.py                        # Model training, cross-validation & evaluation
│   ├── predict.py                      # CLI & programmatic inference tool
│   ├── api.py                          # Flask REST API for ML inference (:5001)
│   ├── phishing_model.joblib           # Serialized Scikit-Learn Random Forest model
│   ├── scaler.joblib                   # Serialized feature scaler
│   └── model_weights.json              # Exported ML weights & performance telemetry
├── server/                             # 🚀 EXPRESS BACKEND
│   ├── ml/
│   │   └── mlEngine.js                 # Integrated Node ML engine with Python fallback
│   ├── routes/
│   │   ├── ml.js                       # /api/ml endpoints (predict, metrics, models)
│   │   ├── scans.js                    # /api/scans endpoints
│   │   └── auth.js                     # /api/auth endpoints
│   ├── config/db.js                    # MongoDB Atlas connection
│   └── index.js                        # Server entry point (:5000)
├── src/                                # ⚛️ REACT FRONTEND
│   ├── services/
│   │   └── mlService.js                # Client ML bridge & feature extractor
│   ├── pages/
│   │   ├── URLScanner.jsx              # Scanner with Brand Typosquatting Alert Card
│   │   ├── Analytics.jsx               # ML comparison leaderboard & confusion matrix
│   │   ├── Dashboard.jsx               # Security overview with quick test payloads
│   │   ├── ScanHistory.jsx             # Searchable historical audit logs
│   │   └── SecurityReport.jsx          # Printable threat intelligence dossier
│   ├── context/
│   │   ├── ScanContext.jsx             # State wired directly to ML prediction engine
│   │   └── AuthContext.jsx             # JWT user auth
│   └── data/
│       └── dummyData.js                # Initial dataset & model parameters
├── package.json                        # NPM dependencies & ML scripts
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
# Node dependencies
npm install

# Python ML dependencies (Python 3.10+)
pip install scikit-learn pandas numpy joblib flask
```

### 2. Run the Machine Learning Pipeline

#### Train the Models:
```bash
npm run ml:train
# or
python -m ml.train
```

#### Test Any URL via CLI:
```bash
# Legitimate URL test
python -m ml.predict https://github.com

# Typosquatting Phishing test
python -m ml.predict https://githuub.com
```

#### Run Optional Python ML REST Server:
```bash
npm run ml:api
# Runs on http://127.0.0.1:5001
```

---

## 💻 Running the Application

### Option A: Run Full Stack Concurrently (Recommended)
```bash
npm run dev:all
```
- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **ML Inference Endpoint**: `POST http://localhost:5000/api/ml/predict`
- **ML Performance Metrics**: `GET http://localhost:5000/api/ml/metrics`
- **Algorithm Leaderboard**: `GET http://localhost:5000/api/ml/models`

### Option B: Run Frontend and Backend Separately
```bash
# Terminal 1 - Backend Server
npm run server

# Terminal 2 - Frontend Client
npm run dev
```

---

## 🔬 Model Evaluation Results (Test Set)

| Metric | Score |
|---|---|
| **Accuracy** | **99.77%** |
| **Precision** | **100.00%** |
| **Recall** | **99.58%** |
| **F1 Score** | **0.9979** |
| **ROC-AUC** | **1.0000** |

### Confusion Matrix
| | Pred Benign | Pred Phishing |
|---|---|---|
| **Act Benign** | 402 | 0 |
| **Act Phishing** | 2 | 469 |

### Top Predictive Feature Importances
1. `suspicious_token_count`: 28.39%
2. `suspicious_tld`: 16.09%
3. `is_https`: 12.07%
4. `brand_spoofing_score`: 10.52%
5. `num_subdomains`: 6.82%
6. `domain_entropy`: 3.33%
7. `path_length`: 3.08%
8. `num_dots`: 2.69%
