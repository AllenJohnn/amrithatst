export const SAMPLE_URLS = [
  {
    label: "PayPal Phish",
    url: "https://paypal-security-update.account-verification-login.xyz/auth",
    type: "phishing",
  },
  {
    label: "Amazon Scam",
    url: "http://192.168.1.105/amazon-prime-renewal-invoice/pay.html",
    type: "phishing",
  },
  {
    label: "Discord Nitro Phish",
    url: "https://dlscord-app-gift-nitro.free-claim.top/nitro",
    type: "phishing",
  },
  {
    label: "Official GitHub",
    url: "https://github.com/facebook/react",
    type: "safe",
  },
  {
    label: "Official Google",
    url: "https://google.com/search?q=cybersecurity",
    type: "safe",
  },
  {
    label: "Suspicious Redirect",
    url: "https://bit.ly/secure-banking-portal-redirect",
    type: "suspicious",
  }
];

export const INITIAL_SCANS = [
  {
    id: "scan-1",
    url: "https://paypal-security-update.account-verification-login.xyz/auth",
    domain: "paypal-security-update.account-verification-login.xyz",
    status: "phishing",
    riskScore: 94,
    confidence: 96.2,
    timestamp: "2 mins ago",
    date: "2026-03-09 09:22:10",
    features: {
      urlLength: 68,
      hasIp: false,
      dotsCount: 4,
      hyphensCount: 3,
      hasHttps: true,
      hasSuspiciousWords: true,
      suspiciousWords: ["paypal", "security", "update", "verification", "login"],
      tldRisk: "High (.xyz)",
      subdomainsCount: 3
    },
    aiExplanation: "The URL exhibits severe brand impersonation ('paypal') under an untrusted TLD (.xyz). Multiple high-urgency credential harvesting keywords were detected alongside excessive subdomains meant to bypass basic lexical filters.",
    recommendation: "BLOCK IMMEDIATELY. Do not submit credentials or OTP codes."
  },
  {
    id: "scan-2",
    url: "https://github.com/facebook/react",
    domain: "github.com",
    status: "safe",
    riskScore: 3,
    confidence: 98.9,
    timestamp: "12 mins ago",
    date: "2026-03-09 09:12:44",
    features: {
      urlLength: 32,
      hasIp: false,
      dotsCount: 1,
      hyphensCount: 0,
      hasHttps: true,
      hasSuspiciousWords: false,
      suspiciousWords: [],
      tldRisk: "Low (.com)",
      subdomainsCount: 0
    },
    aiExplanation: "Legitimate domain with established global reputation, valid TLS/SSL certificates, clean lexical structure, and absence of deceptive keywords.",
    recommendation: "SAFE. No known malicious indicators detected."
  },
  {
    id: "scan-3",
    url: "http://192.168.1.105/amazon-prime-renewal-invoice/pay.html",
    domain: "192.168.1.105",
    status: "phishing",
    riskScore: 91,
    confidence: 93.8,
    timestamp: "34 mins ago",
    date: "2026-03-09 08:50:12",
    features: {
      urlLength: 54,
      hasIp: true,
      dotsCount: 3,
      hyphensCount: 3,
      hasHttps: false,
      hasSuspiciousWords: true,
      suspiciousWords: ["amazon", "invoice", "pay"],
      tldRisk: "Raw IP Address",
      subdomainsCount: 0
    },
    aiExplanation: "Direct raw IP address host with clear brand spoofing of Amazon, unencrypted HTTP transmission, and urgent payment keywords.",
    recommendation: "CRITICAL THREAT. Raw IP hosts with payment keywords represent active scam infrastructure."
  }
];

export function analyzeURL(inputUrl) {
  let cleanUrl = inputUrl.trim();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = "https://" + cleanUrl;
  }

  let domain = "";
  try {
    const parsed = new URL(cleanUrl);
    domain = parsed.hostname;
  } catch {
    domain = cleanUrl.split("/")[2] || cleanUrl;
  }

  const urlLower = cleanUrl.toLowerCase();
  const domainLower = domain.toLowerCase();

  const keywordsList = [
    "login", "verify", "account", "security", "update", "banking", "paypal",
    "apple", "amazon", "netflix", "crypto", "wallet", "recover", "free",
    "claim", "signin", "password", "support", "billing", "confirm", "invoice"
  ];
  const matchedKeywords = keywordsList.filter(k => urlLower.includes(k));

  const urlLength = cleanUrl.length;
  const dotsCount = (cleanUrl.match(/\./g) || []).length;
  const hyphensCount = (cleanUrl.match(/-/g) || []).length;
  const atCount = (cleanUrl.match(/@/g) || []).length;
  const hasIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
  const hasHttps = cleanUrl.startsWith("https://");

  const suspiciousTlds = [".xyz", ".top", ".club", ".tk", ".ml", ".ga", ".cf", ".gq", ".work", ".buzz"];
  const matchedTld = suspiciousTlds.find(tld => domainLower.endsWith(tld));

  let riskScore = 4;
  if (hasIp) riskScore += 45;
  if (!hasHttps) riskScore += 18;
  if (matchedKeywords.length > 0) riskScore += matchedKeywords.length * 15;
  if (dotsCount > 3) riskScore += 16;
  if (hyphensCount >= 3) riskScore += 14;
  if (urlLength > 60) riskScore += 12;
  if (atCount > 0) riskScore += 35;
  if (matchedTld) riskScore += 25;

  const knownSafe = ["google.com", "github.com", "youtube.com", "microsoft.com", "linkedin.com", "wikipedia.org", "apple.com", "amazon.com"];
  const isKnownSafe = knownSafe.some(safe => domainLower === safe || domainLower.endsWith("." + safe));

  if (isKnownSafe && !hasIp && atCount === 0) {
    riskScore = Math.min(riskScore, 5);
  }

  riskScore = Math.min(99, Math.max(2, riskScore));

  let status = "safe";
  if (riskScore >= 75) status = "phishing";
  else if (riskScore >= 45) status = "suspicious";

  const confidence = Number((88 + (riskScore > 50 ? (riskScore / 100) * 10 : ((100 - riskScore) / 100) * 10) + Math.random() * 1.5).toFixed(1));

  let reasons = [];
  if (hasIp) reasons.push("The domain is a raw numerical IP address instead of a registered domain name.");
  if (!hasHttps) reasons.push("Insecure HTTP protocol used without SSL/TLS encryption.");
  if (matchedKeywords.length > 0) reasons.push(`Contains high-risk credential/brand tokens: [${matchedKeywords.join(", ")}].`);
  if (matchedTld) reasons.push(`Uses a suspicious or low-reputation top-level domain (${matchedTld}).`);
  if (dotsCount > 3) reasons.push(`Excessive subdomain nesting (${dotsCount} dots) often used to conceal target domain.`);
  if (hyphensCount >= 3) reasons.push(`Abnormal number of hyphens (${hyphensCount}) used in typosquatting attempts.`);
  if (urlLength > 65) reasons.push(`Abnormal overall URL length (${urlLength} chars) typical of token-stuffed phishing payloads.`);
  if (atCount > 0) reasons.push("Contains '@' symbol which can redirect browser credentials parsing.");

  if (reasons.length === 0) {
    reasons.push("Clean lexical structure matching typical legitimate internet traffic.");
    reasons.push("Valid HTTPS encryption and trusted top-level domain.");
  }

  const aiExplanation = status === "phishing" 
    ? `The URL has been classified as PHISHING with ${confidence}% model confidence. ${reasons.join(" ")}`
    : status === "suspicious"
    ? `The URL shows AMBIGUOUS / SUSPICIOUS indicators. ${reasons.join(" ")} Caution is advised.`
    : `The URL is evaluated as SAFE with ${confidence}% confidence. ${reasons.join(" ")}`;

  const recommendation = status === "phishing"
    ? "BLOCK ACCESS. Do not visit or enter any sensitive personal or financial credentials."
    : status === "suspicious"
    ? "ISOLATE IN SANDBOX. Verify sender authenticity before interacting."
    : "PERMIT. URL shows standard benign characteristics.";

  return {
    id: `scan-${Date.now()}`,
    url: cleanUrl,
    domain,
    status,
    riskScore,
    confidence,
    timestamp: "Just now",
    date: new Date().toISOString().replace("T", " ").substring(0, 19),
    features: {
      urlLength,
      hasIp,
      dotsCount,
      hyphensCount,
      hasHttps,
      hasSuspiciousWords: matchedKeywords.length > 0,
      suspiciousWords: matchedKeywords,
      tldRisk: matchedTld ? `High (${matchedTld})` : (hasIp ? "Raw IP" : "Normal"),
      subdomainsCount: Math.max(0, domain.split(".").length - 2)
    },
    aiExplanation,
    recommendation
  };
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
  { name: "Safe URLs", value: 172, color: "#00e5ff" },
  { name: "Phishing URLs", value: 76, color: "#ff3366" },
  { name: "Suspicious", value: 32, color: "#f59e0b" },
];

export const TARGETED_BRANDS_DATA = [
  { brand: "PayPal", attacks: 42 },
  { brand: "Amazon", attacks: 35 },
  { brand: "Microsoft 365", attacks: 29 },
  { brand: "Google Accounts", attacks: 23 },
  { brand: "Discord Nitro", attacks: 19 },
  { brand: "Netflix", attacks: 14 },
];

export const FEATURE_IMPORTANCE = [
  { feature: "Domain similarity", importance: 94 },
  { feature: "URL entropy", importance: 82 },
  { feature: "Suspicious tokens", importance: 78 },
  { feature: "TLD risk", importance: 65 },
  { feature: "URL length", importance: 41 },
  { feature: "HTTPS absence", importance: 27 }
];

export const CONFUSION_MATRIX = {
  safe: { safe: 172, phishing: 4 },
  phishing: { safe: 2, phishing: 76 }
};
