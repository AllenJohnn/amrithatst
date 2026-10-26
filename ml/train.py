"""
PhishGuards - Machine Learning Model Training & Evaluation Pipeline
Complies with ML Best Practices:
1. Strict Featurization Ordering: Train/Test split BEFORE scaler fitting.
2. Multi-Model Comparison: Random Forest, Gradient Boosting, Logistic Regression, Decision Tree.
3. 5-Fold Cross Validation.
4. Comprehensive Metrics: Accuracy, Precision, Recall, F1, ROC-AUC, Confusion Matrix.
5. Feature Importance Analysis.
6. Verification tests on target URLs (github.com vs githuub.com).
7. Artifact export (.joblib and model_weights.json).
"""

import os
import sys
import json

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import joblib
import numpy as np
import pandas as pd
from datetime import datetime

from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)

from ml.dataset import generate_url_dataset, build_dataset_features
from ml.features import extract_feature_vector, extract_features, FEATURE_COLUMNS

def train_phishing_models(num_samples: int = 4000):
    print("=================================================================")
    print("[*] PhishGuards - Training Machine Learning Threat Detectors")
    print("=================================================================")

    # 1. Dataset Generation
    print(f"\n[Step 1/6] Generating balanced URL dataset ({num_samples} samples)...")
    url_df = generate_url_dataset(num_samples=num_samples)
    print(f"  -> Generated {len(url_df)} URLs.")
    print(f"  -> Class distribution: Benign={sum(url_df['label'] == 0)}, Phishing={sum(url_df['label'] == 1)}")

    # 2. Feature Extraction
    print("\n[Step 2/6] Extracting 25-dimensional ML feature matrix...")
    feat_df = build_dataset_features(url_df)
    X = feat_df[FEATURE_COLUMNS].values
    y = feat_df["label"].values

    # 3. Train/Test Split (Strict Featurization Ordering)
    print("\n[Step 3/6] Partitioning data (80% Train, 20% Test) BEFORE fitting transformers...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"  -> Training samples: {len(X_train)}")
    print(f"  -> Testing samples:  {len(X_test)}")

    # Fit Scaler strictly on X_train
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 4. Multi-Model Training & Cross-Validation
    print("\n[Step 4/6] Training & comparing multiple ML classification algorithms...")
    models = {
        "Random Forest (Ensemble)": RandomForestClassifier(
            n_estimators=120, max_depth=14, min_samples_split=4, random_state=42, n_jobs=-1
        ),
        "Gradient Boosting": GradientBoostingClassifier(
            n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42
        ),
        "Decision Tree": DecisionTreeClassifier(
            max_depth=9, min_samples_split=5, random_state=42
        ),
        "Logistic Regression": LogisticRegression(
            max_iter=1000, C=1.0, random_state=42
        )
    }

    comparison_results = []
    trained_models = {}
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    for name, model in models.items():
        print(f"\n  -> Training {name}...")
        # Use scaled data for Logistic Regression, raw or scaled for trees (scaled preserves parity)
        train_data = X_train_scaled if "Logistic" in name else X_train
        test_data = X_test_scaled if "Logistic" in name else X_test

        # 5-Fold Cross Validation
        cv_scores = cross_val_score(model, train_data, y_train, cv=cv, scoring="f1")
        
        # Fit model on entire training set
        model.fit(train_data, y_train)
        trained_models[name] = model

        # Evaluate on hold-out test set
        y_pred = model.predict(test_data)
        y_prob = model.predict_proba(test_data)[:, 1] if hasattr(model, "predict_proba") else y_pred

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        auc = roc_auc_score(y_test, y_prob)

        print(f"     CV F1: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
        print(f"     Test Acc: {acc*100:.2f}% | Prec: {prec*100:.2f}% | Rec: {rec*100:.2f}% | F1: {f1:.4f} | AUC: {auc:.4f}")

        comparison_results.append({
            "model_name": name,
            "cv_f1_mean": round(float(cv_scores.mean()), 4),
            "cv_f1_std": round(float(cv_scores.std()), 4),
            "accuracy": round(float(acc * 100), 2),
            "precision": round(float(prec * 100), 2),
            "recall": round(float(rec * 100), 2),
            "f1_score": round(float(f1), 4),
            "roc_auc": round(float(auc), 4)
        })

    # Select best model (Random Forest)
    best_model_name = "Random Forest (Ensemble)"
    best_model = trained_models[best_model_name]
    y_test_pred = best_model.predict(X_test)
    y_test_prob = best_model.predict_proba(X_test)[:, 1]

    cm = confusion_matrix(y_test, y_test_pred)
    tn, fp, fn, tp = cm.ravel()
    print(f"\n[Step 5/6] Best Model [{best_model_name}] Confusion Matrix:")
    print(f"           Pred Benign   Pred Phish")
    print(f"Act Benign     {tn:<10}  {fp:<10} (False Positives: {fp})")
    print(f"Act Phish      {fn:<10}  {tp:<10} (False Negatives: {fn})")

    # Feature Importance ranking
    importances = best_model.feature_importances_
    feat_ranking = sorted(
        zip(FEATURE_COLUMNS, importances),
        key=lambda x: x[1],
        reverse=True
    )
    print("\n  Top 8 Feature Importances:")
    for feat, imp in feat_ranking[:8]:
        print(f"    - {feat:<24}: {imp*100:.2f}%")

    # 5. Target URL Edge-Case Validation
    print("\n[Step 6/6] Verifying Target Critical URLs:")
    test_urls = [
        "https://github.com",
        "https://githuub.com",
        "https://google.com",
        "https://go0gle.com",
        "https://g00gle.com",
        "https://paypa1.com",
        "https://arnazon.com",
        "https://faceb00k.com",
        "https://github.com/facebook/react",
        "https://githuub.com/login",
        "https://paypal.com",
        "https://paypaal.com",
        "http://192.168.1.105/amazon/pay.html"
    ]

    for u in test_urls:
        vec = extract_feature_vector(u)
        prob = best_model.predict_proba([vec])[0][1]
        pred_label = "PHISHING" if prob >= 0.50 else "SAFE"
        risk_score = round(prob * 100)
        diag = extract_features(u)
        print(f"  URL: {u}")
        print(f"       Verdict: {pred_label} (Risk: {risk_score}/100, Prob: {prob*100:.1f}%) | Target Brand: {diag['target_brand']} | Spoof: {diag['spoof_type']}")

    # 6. Export Artifacts
    ml_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(ml_dir, "phishing_model.joblib")
    scaler_path = os.path.join(ml_dir, "scaler.joblib")
    weights_json_path = os.path.join(ml_dir, "model_weights.json")

    joblib.dump(best_model, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"\n[+] Serialized scikit-learn model to {model_path}")

    # Build comprehensive model_weights.json for fast Node/frontend inference & telemetry
    model_export_payload = {
        "metadata": {
            "model_name": best_model_name,
            "version": "2.0.0-ML",
            "framework": "scikit-learn",
            "trained_at": datetime.utcnow().isoformat() + "Z",
            "dataset_samples": len(url_df),
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "n_estimators": 120,
            "feature_count": len(FEATURE_COLUMNS),
            "target_classes": ["safe", "phishing"]
        },
        "metrics": {
            "accuracy": round(float(accuracy_score(y_test, y_test_pred) * 100), 2),
            "precision": round(float(precision_score(y_test, y_test_pred) * 100), 2),
            "recall": round(float(recall_score(y_test, y_test_pred) * 100), 2),
            "f1_score": round(float(f1_score(y_test, y_test_pred)), 4),
            "roc_auc": round(float(roc_auc_score(y_test, y_test_prob)), 4)
        },
        "confusion_matrix": {
            "true_negatives": int(tn),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "true_positives": int(tp),
            "safe": {"safe": int(tn), "phishing": int(fp)},
            "phishing": {"safe": int(fn), "phishing": int(tp)}
        },
        "model_comparison": comparison_results,
        "feature_importances": [
            {"feature": feat, "importance": round(float(imp * 100), 2)}
            for feat, imp in feat_ranking
        ],
        "feature_columns": FEATURE_COLUMNS,
        "scaler": {
            "mean": [round(float(m), 6) for m in scaler.mean_],
            "scale": [round(float(s), 6) for s in scaler.scale_]
        }
    }

    with open(weights_json_path, "w", encoding="utf-8") as f:
        json.dump(model_export_payload, f, indent=2)

    print(f"[+] Exported JSON ML telemetry & parameters to {weights_json_path}")
    print("\n[*] Model training & export complete successfully!")
    return model_export_payload

if __name__ == "__main__":
    train_phishing_models()
