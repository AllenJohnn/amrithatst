"""
PhishGuards - Command-Line & Programmatic ML Prediction Tool
Loads trained Random Forest model and provides instant classification on any URL.
"""

import os
import sys
import json
import joblib

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from ml.features import extract_feature_vector, extract_features

def load_model():
    ml_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(ml_dir, "phishing_model.joblib")
    if not os.path.exists(model_path):
        from ml.train import train_phishing_models
        train_phishing_models(num_samples=2000)
    return joblib.load(model_path)

def predict_url(url: str, model=None) -> dict:
    if model is None:
        model = load_model()

    diag = extract_features(url)
    vec = extract_feature_vector(url)
    
    # Model inference
    prob_phishing = float(model.predict_proba([vec])[0][1])
    prob_benign = float(model.predict_proba([vec])[0][0])
    
    # Risk score calibrated (0 - 100)
    risk_score = int(round(prob_phishing * 100))
    
    # Ensure decisive brand spoofing overrides model threshold if spoof score >= 80
    if diag["brand_spoofing_score"] >= 80:
        risk_score = max(risk_score, int(diag["brand_spoofing_score"]))
        status = "phishing"
    elif diag["brand_spoofing_score"] >= 50:
        risk_score = max(risk_score, int(diag["brand_spoofing_score"]))
        if status == "safe":
            status = "suspicious"

    confidence = round(max(prob_phishing, prob_benign) * 100, 1)
    if status == "phishing" and confidence < 90.0 and diag["brand_spoofing_score"] >= 80:
        confidence = round(diag["brand_spoofing_score"], 1)

    reasons = []
    if diag["spoof_type"] not in ("none", "official_verified"):
        reasons.append(f"Brand Impersonation / Typosquatting detected: {diag['spoof_type']}.")
    elif diag["spoof_type"] == "official_verified":
        reasons.append(f"Verified legitimate domain for brand '{diag['target_brand']}'.")

    if diag.get("userinfo"):
        reasons.append(f"RFC 3986 Userinfo authority hijacking detected: deceptive credentials prefix '{diag['userinfo']}' before host.")
    if diag["has_mixed_digits"]:
        reasons.append("Deceptive leetspeak/digit substitutions detected within alphabetic domain name.")
    if diag["has_punycode"]:
        reasons.append("Punycode / IDN homograph encoding detected in domain structure.")
    if diag["has_ip"]:
        reasons.append("Raw numeric IP host instead of a registered domain.")
    if not diag["is_https"]:
        reasons.append("Insecure unencrypted HTTP protocol.")
    if diag["suspicious_token_count"] > 0:
        reasons.append(f"Contains high-urgency credential tokens: [{', '.join(diag['matched_tokens'])}].")
    if diag["suspicious_tld"]:
        reasons.append("Registered under an untrusted, low-reputation top-level domain.")
    if diag["num_subdomains"] > 2:
        reasons.append(f"Deep subdomain nesting ({diag['num_subdomains']} subdomains) used to obscure host.")
    if diag["num_hyphens"] >= 3:
        reasons.append(f"Excessive hyphenation ({diag['num_hyphens']} hyphens) typical of fraudulent combosquatting.")
    if diag["url_entropy"] > 4.2:
        reasons.append(f"High character entropy ({diag['url_entropy']}) indicative of randomized token payload.")

    if len(reasons) == 0:
        reasons.append("Clean lexical syntax, standard entropy, and absence of deceptive keywords.")

    ai_explanation = (
        f"URL evaluated by Random Forest ML Classifier (v2.0) with {confidence}% confidence. "
        + " ".join(reasons)
    )

    recommendation = (
        "BLOCK ACCESS IMMEDIATELY. High probability of credential theft, spoofing, or spam infrastructure."
        if status == "phishing" else
        "EXERCISE CAUTION. Ambiguous indicators detected. Isolate before proceeding."
        if status == "suspicious" else
        "PERMIT ACCESS. Normal benign internet traffic profile."
    )

    return {
        "url": diag["url"],
        "domain": diag["domain"],
        "status": status,
        "riskScore": risk_score,
        "confidence": confidence,
        "modelProbability": round(prob_phishing, 4),
        "targetBrand": diag["target_brand"],
        "spoofingType": diag["spoof_type"],
        "brandSpoofingScore": diag["brand_spoofing_score"],
        "features": {
            "urlLength": diag["url_length"],
            "domainLength": diag["domain_length"],
            "hasIp": bool(diag["has_ip"]),
            "hasHttps": bool(diag["is_https"]),
            "dotsCount": diag["num_dots"],
            "hyphensCount": diag["num_hyphens"],
            "subdomainsCount": diag["num_subdomains"],
            "urlEntropy": diag["url_entropy"],
            "domainEntropy": diag["domain_entropy"],
            "suspiciousWords": diag["matched_tokens"],
            "hasSuspiciousWords": diag["suspicious_token_count"] > 0,
            "tldRisk": "High" if diag["suspicious_tld"] else ("Raw IP" if diag["has_ip"] else "Normal")
        },
        "aiExplanation": ai_explanation,
        "recommendation": recommendation
    }

if __name__ == "__main__":
    test_target = sys.argv[1] if len(sys.argv) > 1 else "https://githuub.com"
    model = load_model()
    result = predict_url(test_target, model)
    print(json.dumps(result, indent=2))
