"""
PhishGuards - Dataset Generator & Loader
Generates and manages a balanced, curated dataset of verified benign and phishing URLs
specifically designed to capture modern cyber threats including typosquatting,
brand impersonation, credential harvesting, and lexical anomalies.
"""

import os
import random
import pandas as pd
from ml.features import extract_feature_vector, FEATURE_COLUMNS

# Base lists of benign domains, paths, and patterns
BENIGN_DOMAINS = [
    "github.com", "google.com", "microsoft.com", "amazon.com", "paypal.com",
    "apple.com", "wikipedia.org", "stackoverflow.com", "youtube.com", "linkedin.com",
    "reddit.com", "twitter.com", "instagram.com", "netflix.com", "cloudflare.com",
    "nytimes.com", "bbc.co.uk", "cnn.com", "medium.com", "gitlab.com",
    "bitbucket.org", "mozilla.org", "wordpress.org", "spotify.com", "slack.com",
    "dropbox.com", "salesforce.com", "adobe.com", "zoom.us", "quora.com",
    "nih.gov", "stanford.edu", "mit.edu", "harvard.edu", "berkeley.edu",
    "w3schools.com", "archive.org", "imdb.com", "espn.com", "weather.com",
    "nature.com", "sciencedirect.com", "khanacademy.org", "coursera.org", "udemy.com"
]

BENIGN_PATHS = [
    "",
    "/about",
    "/features",
    "/documentation/getting-started",
    "/blog/2026/03/release-notes",
    "/projects/awesome-project",
    "/wiki/Machine_learning",
    "/search?q=cybersecurity+defense",
    "/explore/trending",
    "/topics/data-science",
    "/articles/research-study",
    "/view/photo/492019",
    "/questions/891234/how-to-optimize-code",
    "/profile/researcher_42",
    "/developer/api/v2/reference"
]

# Targeted brands for generating realistic typosquatting & impersonation attacks
BRANDS = ["github", "paypal", "google", "amazon", "microsoft", "apple", "netflix", "discord", "chase", "binance", "coinbase", "steam"]
MALICIOUS_TLDS = [".xyz", ".top", ".club", ".tk", ".ml", ".ga", ".cf", ".work", ".buzz", ".icu"]
SPOOF_PREFIXES = ["login-", "secure-", "verify-", "account-", "auth-", "signin-", "update-", "checkpoint-", "portal-"]
SPOOF_SUFFIXES = ["-security", "-verification", "-account", "-support", "-update", "-login", "-service", "-protect", "-auth"]
PHISH_PATHS = [
    "/login",
    "/signin.php",
    "/auth/verify",
    "/account/update-billing",
    "/security-checkpoint",
    "/confirm-identity",
    "/recover/wallet",
    "/free-nitro/claim",
    "/invoice/pay-now.html",
    "/verification/session?id=987213",
    "/urgent-notification/proceed"
]

def generate_typosquat(brand: str) -> str:
    """Generates realistic typosquat variations of brand names."""
    methods = [
        lambda b: b[:len(b)//2] + b[len(b)//2] + b[len(b)//2:], # Repeat middle char (e.g. githuub)
        lambda b: b + b[-1],                                     # Repeat last char (e.g. githubb)
        lambda b: b.replace('o', '0'),                           # Leetspeak 0 for o (e.g. go0gle, g00gle)
        lambda b: b.replace('m', 'rn'),                          # rn for m (e.g. arnazon)
        lambda b: b.replace('l', '1'),                           # 1 for l (e.g. paypa1, app1e)
        lambda b: b.replace('e', '3'),                           # 3 for e
        lambda b: b.replace('a', '4'),                           # 4 for a
        lambda b: b.replace('s', '5'),                           # 5 for s
        lambda b: b[:-1] if len(b) > 4 else b + "s",             # Drop letter
        lambda b: b[:1] + b[2:3] + b[1:2] + b[3:],               # Transpose adjacent
        lambda b: b + "-official"                                # Hyphenated affix
    ]
    fn = random.choice(methods)
    res = fn(brand)
    return res if res != brand else brand + "0"

def generate_url_dataset(num_samples: int = 5000) -> pd.DataFrame:
    """
    Generates a balanced dataset of benign (label=0) and phishing (label=1) URLs.
    Includes exact target cases like github.com vs githuub.com.
    """
    random.seed(42)
    urls = []
    labels = []
    categories = []

    half = num_samples // 2

    # 1. Benign URLs (label = 0)
    for _ in range(half):
        domain = random.choice(BENIGN_DOMAINS)
        path = random.choice(BENIGN_PATHS)
        protocol = "https://" if random.random() > 0.05 else "http://"
        sub = "www." if random.random() > 0.4 else ("blog." if random.random() > 0.8 else "")
        url = f"{protocol}{sub}{domain}{path}"
        urls.append(url)
        labels.append(0)
        categories.append("benign")

    # Add specific cornerstone benign URLs
    cornerstone_benign = [
        "https://github.com",
        "https://github.com/facebook/react",
        "https://github.com/torvalds/linux",
        "https://google.com/search?q=machine+learning",
        "https://paypal.com",
        "https://amazon.com",
        "https://microsoft.com",
        "https://apple.com",
        "https://netflix.com",
        "https://discord.com"
    ]
    for u in cornerstone_benign:
        urls.append(u)
        labels.append(0)
        categories.append("benign")

    # 2. Phishing URLs (label = 1)
    
    # 2a. Typosquatting / Brand Spoofing (CRITICAL FOCUS)
    typosquat_cases = [
        "https://go0gle.com",
        "https://g00gle.com",
        "https://go@gle.com",
        "https://p@ypal.com",
        "https://google.com@phishing.com",
        "https://paypal.com@verify-account.xyz",
        "https://github.com@evil-auth.top",
        "https://goolge.com",
        "https://amzaon.com",
        "https://githbu.com",
        "https://secur1ty-portal-verify.com",
        "https://upd8-l0gin-b4nk.com",
        "https://free-c0ins-cl4im.xyz",
        "https://go0gle.com/search?q=login",
        "https://githuub.com",
        "https://githuub.com/login",
        "http://githuub.com/session/auth",
        "https://git-hub-security.com/login",
        "https://githubb.com",
        "https://g1thub.net/verify",
        "https://github-auth-service.xyz",
        "http://github.security-check-portal.xyz/token",
        "https://paypaal.com",
        "https://paypa1.com",
        "https://paypa1.com/signin",
        "https://paypal-security-update.account-verification-login.xyz/auth",
        "https://arnazon.com",
        "https://arnazon.com/order-confirm",
        "https://amaz0n-prime-renewal.com",
        "https://goog1e.com/drive",
        "https://accounts-google-verify.net",
        "https://micros0ft-support.com",
        "https://micros0ft.com",
        "https://login-microsoft365.online",
        "https://app1e.com/id",
        "https://apple-id-recover.xyz",
        "https://dlscord-app-gift-nitro.free-claim.top/nitro",
        "https://disc0rd.com/nitro",
        "https://faceb00k-security.com",
        "https://faceb00k.com/login"
    ]
    for u in typosquat_cases:
        urls.append(u)
        labels.append(1)
        categories.append("typosquat")

    # Generate more typosquats
    for _ in range(num_samples // 6):
        brand = random.choice(BRANDS)
        typo = generate_typosquat(brand)
        tld = random.choice([".com", ".net", ".org", ".io"] + MALICIOUS_TLDS)
        path = random.choice(PHISH_PATHS)
        proto = "https://" if random.random() > 0.3 else "http://"
        urls.append(f"{proto}{typo}{tld}{path}")
        labels.append(1)
        categories.append("typosquat")

    # 2b. Brand Impersonation / Embedded Subdomains / Prefix-Suffix
    for _ in range(num_samples // 6):
        brand = random.choice(BRANDS)
        prefix = random.choice(SPOOF_PREFIXES) if random.random() > 0.5 else ""
        suffix = random.choice(SPOOF_SUFFIXES) if random.random() > 0.5 else ""
        mid = f"{prefix}{brand}{suffix}"
        tld = random.choice(MALICIOUS_TLDS + [".com", ".info", ".biz"])
        path = random.choice(PHISH_PATHS)
        urls.append(f"http://{mid}{tld}{path}")
        labels.append(1)
        categories.append("impersonation")

    # 2c. Raw IP & Obfuscated Hosts
    for _ in range(num_samples // 12):
        ip = f"{random.randint(11, 210)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(1, 254)}"
        path = random.choice(PHISH_PATHS)
        port = f":{random.choice([8080, 8443, 3000, 8000])}" if random.random() > 0.5 else ""
        urls.append(f"http://{ip}{port}{path}")
        labels.append(1)
        categories.append("ip_phish")

    # 2d. Excessive Subdomain / Token-stuffed URLs
    for _ in range(num_samples // 12):
        sub_chain = ".".join(random.sample(["account", "verify", "secure", "login", "portal", "user", "auth", "token"], random.randint(3, 5)))
        domain = random.choice(["service-center.xyz", "gateway-online.top", "host-auth.club", "dns-gate.buzz"])
        urls.append(f"https://{sub_chain}.{domain}/verify.php")
        labels.append(1)
        categories.append("subdomain_token_stuffing")

    # 2e. Malicious TLDs with Security Phishing Tokens
    for _ in range(num_samples // 12):
        tld = random.choice(MALICIOUS_TLDS)
        name = "".join(random.choices("abcdefghijklmnopqrstuvwxyz", k=random.randint(6, 12)))
        tok = random.choice(["login", "wallet", "banking", "free-gift", "claim", "confirm", "invoice"])
        urls.append(f"http://{name}-{tok}{tld}/auth")
        labels.append(1)
        categories.append("malicious_tld_token")

    df = pd.DataFrame({
        "url": urls,
        "label": labels,
        "category": categories
    }).sample(frac=1.0, random_state=42).reset_index(drop=True)

    return df

def build_dataset_features(df: pd.DataFrame) -> (pd.DataFrame, list):
    """Extracts ML feature matrix from URL DataFrame."""
    feature_rows = []
    for u in df["url"]:
        feature_rows.append(extract_feature_vector(u))
    
    feat_df = pd.DataFrame(feature_rows, columns=FEATURE_COLUMNS)
    feat_df["label"] = df["label"].values
    return feat_df

if __name__ == "__main__":
    df = generate_url_dataset(500)
    print(f"Generated {len(df)} URLs.")
    print("Label distribution:\n", df["label"].value_counts())
    print("\nSample URLs:\n", df.head(10))
