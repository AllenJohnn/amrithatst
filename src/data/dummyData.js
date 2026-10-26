import { localMLInference } from '../services/mlService';

export const SAMPLE_URLS = [
  {
    label: "Google Official",
    url: "https://google.com/search?q=cybersecurity",
    type: "safe",
  },
  {
    label: "Google Homoglyph (0)",
    url: "https://go0gle.com",
    type: "phishing",
  },
  {
    label: "Google Homoglyph (@)",
    url: "https://go@gle.com",
    type: "phishing",
  },
  {
    label: "GitHub Official",
    url: "https://github.com/facebook/react",
    type: "safe",
  },
  {
    label: "GitHub Typosquat",
    url: "https://githuub.com",
    type: "phishing",
  },
  {
    label: "PayPal Leetspeak (1)",
    url: "https://paypa1.com",
    type: "phishing",
  },
  {
    label: "PayPal Scam",
    url: "https://paypal-security-update.account-verification-login.xyz/auth",
    type: "phishing",
  },
  {
    label: "Authority Hijack (@)",
    url: "https://google.com@phishing.com",
    type: "phishing",
  }
];

export const INITIAL_SCANS = [
  {
    id: "scan-1",
    url: "https://githuub.com",
    domain: "githuub.com",
    status: "phishing",
    riskScore: 93,
    confidence: 93.1,
    modelProbability: 0.9309,
    targetBrand: "github",
    spoofingType: "typosquat_repeated_chars ('githuub' targets 'github')",
    brandSpoofingScore: 92,
    timestamp: "1 min ago",
    date: "2026-03-09 09:24:10",
    features: {
      urlLength: 19,
      domainLength: 11,
      hasIp: false,
      hasHttps: true,
      dotsCount: 1,
      hyphensCount: 0,
      subdomainsCount: 0,
      urlEntropy: 3.6819,
      domainEntropy: 3.2776,
      suspiciousWords: [],
      hasSuspiciousWords: false,
      tldRisk: "Normal"
    },
    aiExplanation: "URL evaluated by Random Forest ML Classifier (v2.0) with 93.1% confidence. Brand Impersonation / Typosquatting detected: typosquat_repeated_chars ('githuub' targets 'github').",
    recommendation: "BLOCK ACCESS IMMEDIATELY. High probability of credential theft or brand spoofing."
  },
  {
    id: "scan-2",
    url: "https://github.com/facebook/react",
    domain: "github.com",
    status: "safe",
    riskScore: 0,
    confidence: 99.7,
    modelProbability: 0.0029,
    targetBrand: "github",
    spoofingType: "official_verified",
    brandSpoofingScore: 0,
    timestamp: "8 mins ago",
    date: "2026-03-09 09:17:44",
    features: {
      urlLength: 32,
      domainLength: 10,
      hasIp: false,
      dotsCount: 1,
      hyphensCount: 0,
      hasHttps: true,
      subdomainsCount: 0,
      urlEntropy: 3.8421,
      domainEntropy: 3.3219,
      hasSuspiciousWords: false,
      suspiciousWords: [],
      tldRisk: "Normal"
    },
    aiExplanation: "URL evaluated by Random Forest ML Classifier (v2.0) with 99.7% confidence. Verified legitimate official domain for brand 'github'. Valid cryptographic HTTPS identity and trusted reputation.",
    recommendation: "PERMIT ACCESS. Normal benign internet traffic profile."
  },
  {
    id: "scan-3",
    url: "https://paypal-security-update.account-verification-login.xyz/auth",
    domain: "paypal-security-update.account-verification-login.xyz",
    status: "phishing",
    riskScore: 98,
    confidence: 98.4,
    modelProbability: 0.9842,
    targetBrand: "paypal",
    spoofingType: "brand_impersonation ('paypal' embedded in unverified domain)",
    brandSpoofingScore: 88,
    timestamp: "24 mins ago",
    date: "2026-03-09 09:01:10",
    features: {
      urlLength: 68,
      domainLength: 56,
      hasIp: false,
      dotsCount: 4,
      hyphensCount: 3,
      hasHttps: true,
      subdomainsCount: 3,
      urlEntropy: 4.412,
      domainEntropy: 4.120,
      hasSuspiciousWords: true,
      suspiciousWords: ["paypal", "security", "update", "verification", "login", "auth"],
      tldRisk: "High (.xyz)"
    },
    aiExplanation: "URL evaluated by Random Forest ML Classifier (v2.0) with 98.4% confidence. Brand Impersonation / Typosquatting detected: 'paypal' embedded in unverified domain. Contains high-urgency credential tokens: [paypal, security, update, verification, login, auth].",
    recommendation: "BLOCK IMMEDIATELY. Deceptive credential harvesting infrastructure."
  },
  {
    id: "scan-4",
    url: "http://192.168.1.105/amazon-prime-renewal-invoice/pay.html",
    domain: "192.168.1.105",
    status: "phishing",
    riskScore: 94,
    confidence: 94.8,
    modelProbability: 0.9481,
    targetBrand: "amazon",
    spoofingType: "brand_token_in_path ('amazon')",
    brandSpoofingScore: 55,
    timestamp: "45 mins ago",
    date: "2026-03-09 08:40:12",
    features: {
      urlLength: 54,
      domainLength: 13,
      hasIp: true,
      dotsCount: 3,
      hyphensCount: 3,
      hasHttps: false,
      subdomainsCount: 0,
      urlEntropy: 4.102,
      domainEntropy: 2.841,
      hasSuspiciousWords: true,
      suspiciousWords: ["amazon", "invoice", "pay"],
      tldRisk: "Raw IP"
    },
    aiExplanation: "URL evaluated by Random Forest ML Classifier (v2.0) with 94.8% confidence. Raw numerical IP address host instead of registered domain. Unencrypted insecure HTTP protocol. Contains credential/payment tokens: [amazon, invoice, pay].",
    recommendation: "CRITICAL THREAT. Raw IP hosts with payment tokens represent active scam infrastructure."
  }
];

export function analyzeURL(inputUrl) {
  return localMLInference(inputUrl);
}

export const SCAN_TREND_DATA = [
  { day: "Mon", total: 32, safe: 24, threats: 8 },
  { day: "Tue", total: 45, safe: 31, threats: 14 },
  { day: "Wed", total: 58, safe: 42, threats: 16 },
  { day: "Thu", total: 64, safe: 46, threats: 18 },
  { day: "Fri", total: 78, safe: 52, threats: 26 },
  { day: "Sat", total: 52, safe: 40, threats: 12 },
  { day: "Sun", total: 61, safe: 45, threats: 16 },
];

export const THREAT_DISTRIBUTION_DATA = [
  { name: "Safe URLs", value: 402, color: "#10b981" },
  { name: "Phishing URLs", value: 469, color: "#ef4444" },
  { name: "Suspicious", value: 24, color: "#f59e0b" },
];

export const TARGETED_BRANDS_DATA = [
  { brand: "GitHub", attacks: 58 },
  { brand: "PayPal", attacks: 52 },
  { brand: "Amazon", attacks: 44 },
  { brand: "Microsoft 365", attacks: 38 },
  { brand: "Google Accounts", attacks: 31 },
  { brand: "Discord Nitro", attacks: 26 },
  { brand: "Netflix", attacks: 19 },
];

export const FEATURE_IMPORTANCE = [
  { feature: "Suspicious Tokens", importance: 28.4 },
  { feature: "Suspicious TLD Risk", importance: 16.1 },
  { feature: "HTTPS Encryption Protocol", importance: 12.1 },
  { feature: "Brand Impersonation / Typosquatting", importance: 10.5 },
  { feature: "Subdomain Nesting Depth", importance: 6.8 },
  { feature: "Domain Entropy (DGA)", importance: 3.3 },
  { feature: "Path Length", importance: 3.1 },
  { feature: "Special Characters (Dots/Hyphens)", importance: 2.7 }
];

export const CONFUSION_MATRIX = {
  safe: { safe: 402, phishing: 0 },
  phishing: { safe: 2, phishing: 469 }
};

export const MODEL_LEADERBOARD = [
  { model_name: "Random Forest (Ensemble)", accuracy: 99.77, precision: 100.0, recall: 99.58, f1_score: 0.9979, roc_auc: 1.0, status: "Active Production" },
  { model_name: "Gradient Boosting", accuracy: 100.0, precision: 100.0, recall: 100.0, f1_score: 1.0, roc_auc: 1.0, status: "Candidate" },
  { model_name: "Decision Tree", accuracy: 99.77, precision: 100.0, recall: 99.58, f1_score: 0.9979, roc_auc: 0.9979, status: "Evaluated" },
  { model_name: "Logistic Regression", accuracy: 99.77, precision: 100.0, recall: 99.58, f1_score: 0.9979, roc_auc: 0.9998, status: "Baseline" }
];
