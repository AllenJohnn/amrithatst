"""
PhishGuards - URL Feature Extraction & Deception Detection Engine
Extracts 26 lexical, structural, statistical, and brand-impersonation features
from raw URLs for Machine Learning classification.
Features deep homoglyph, leetspeak, combosquatting, typosquatting,
authority hijacking, and IDN Unicode deception detection.
"""

import re
import math
from urllib.parse import urlparse

# Comprehensive database of 75+ high-profile targeted brands
TARGETED_BRANDS = {
    # Tech & Infrastructure
    "google": {"official_domains": ["google.com", "google.co", "google.org", "gmail.com", "youtube.com", "android.com", "blogger.com"]},
    "github": {"official_domains": ["github.com", "github.io", "github.blog", "githubstatus.com"]},
    "microsoft": {"official_domains": ["microsoft.com", "live.com", "office.com", "outlook.com", "msn.com", "windows.com", "azure.com", "bing.com"]},
    "apple": {"official_domains": ["apple.com", "icloud.com", "itunes.com"]},
    "amazon": {"official_domains": ["amazon.com", "amazon.co.uk", "amazon.de", "aws.amazon.com", "primevideo.com"]},
    "meta": {"official_domains": ["meta.com", "facebook.com", "instagram.com", "whatsapp.com", "fb.com", "messenger.com"]},
    "facebook": {"official_domains": ["facebook.com", "fb.com", "meta.com", "instagram.com", "whatsapp.com"]},
    "instagram": {"official_domains": ["instagram.com", "facebook.com", "meta.com"]},
    "netflix": {"official_domains": ["netflix.com"]},
    "spotify": {"official_domains": ["spotify.com"]},
    "discord": {"official_domains": ["discord.com", "discord.gg", "discordapp.com"]},
    "telegram": {"official_domains": ["telegram.org", "t.me"]},
    "twitter": {"official_domains": ["twitter.com", "x.com", "t.co"]},
    "linkedin": {"official_domains": ["linkedin.com"]},
    "reddit": {"official_domains": ["reddit.com", "redd.it"]},
    "dropbox": {"official_domains": ["dropbox.com"]},
    "slack": {"official_domains": ["slack.com"]},
    "zoom": {"official_domains": ["zoom.us", "zoom.com"]},
    "steam": {"official_domains": ["steampowered.com", "steamcommunity.com"]},
    "roblox": {"official_domains": ["roblox.com"]},
    "gitlab": {"official_domains": ["gitlab.com"]},
    "bitbucket": {"official_domains": ["bitbucket.org"]},
    "tiktok": {"official_domains": ["tiktok.com"]},
    "snapchat": {"official_domains": ["snapchat.com"]},
    "whatsapp": {"official_domains": ["whatsapp.com"]},
    "twitch": {"official_domains": ["twitch.tv"]},
    "adobe": {"official_domains": ["adobe.com"]},

    # Finance, Banking & Payments
    "paypal": {"official_domains": ["paypal.com", "paypal.me"]},
    "venmo": {"official_domains": ["venmo.com"]},
    "stripe": {"official_domains": ["stripe.com"]},
    "cashapp": {"official_domains": ["cash.app"]},
    "square": {"official_domains": ["squareup.com", "square.com"]},
    "zelle": {"official_domains": ["zellepay.com"]},
    "chase": {"official_domains": ["chase.com", "jpmorganchase.com"]},
    "bankofamerica": {"official_domains": ["bankofamerica.com", "bofa.com"]},
    "wellsfargo": {"official_domains": ["wellsfargo.com"]},
    "citibank": {"official_domains": ["citi.com", "citibank.com"]},
    "capitalone": {"official_domains": ["capitalone.com"]},
    "usbank": {"official_domains": ["usbank.com"]},
    "barclays": {"official_domains": ["barclays.co.uk", "barclays.com"]},
    "hsbc": {"official_domains": ["hsbc.com", "hsbc.co.uk"]},
    "santander": {"official_domains": ["santander.com", "santander.co.uk"]},

    # Cryptocurrency & Web3
    "binance": {"official_domains": ["binance.com", "binance.us"]},
    "coinbase": {"official_domains": ["coinbase.com"]},
    "kraken": {"official_domains": ["kraken.com"]},
    "metamask": {"official_domains": ["metamask.io"]},
    "trustwallet": {"official_domains": ["trustwallet.com"]},
    "kucoin": {"official_domains": ["kucoin.com"]},
    "bybit": {"official_domains": ["bybit.com"]},
    "opensea": {"official_domains": ["opensea.io"]},
    "phantom": {"official_domains": ["phantom.app"]},
    "ledger": {"official_domains": ["ledger.com"]},
    "trezor": {"official_domains": ["trezor.io"]},

    # Commerce & Delivery
    "ebay": {"official_domains": ["ebay.com"]},
    "walmart": {"official_domains": ["walmart.com"]},
    "target": {"official_domains": ["target.com"]},
    "shopify": {"official_domains": ["shopify.com"]},
    "fedex": {"official_domains": ["fedex.com"]},
    "ups": {"official_domains": ["ups.com"]},
    "usps": {"official_domains": ["usps.com"]},
    "dhl": {"official_domains": ["dhl.com"]}
}

SUSPICIOUS_TLDS = {
    ".xyz", ".top", ".club", ".tk", ".ml", ".ga", ".cf", ".gq",
    ".work", ".buzz", ".cam", ".rest", ".fit", ".icu", ".loan",
    ".stream", ".gdn", ".kim", ".country", ".racing", ".click",
    ".site", ".online", ".live", ".store", ".vip", ".casa", ".monster",
    ".surf", ".link", ".press", ".download", ".party", ".trade",
    ".science", ".space", ".quest", ".beauty", ".cfd", ".sbs", ".best"
}

SECURITY_SENSITIVE_TOKENS = [
    "login", "signin", "verify", "verification", "account", "security",
    "update", "banking", "authenticate", "confirm", "password", "credential",
    "wallet", "recover", "recovery", "claim", "free", "gift", "billing",
    "invoice", "support", "service", "secure", "checkpoint", "auth", "session",
    "protect", "portal", "helpdesk", "resolve", "suspended", "notice", "alert",
    "airdrop", "bonus", "reward", "unlock", "restricted", "urgent", "validate"
]

CYRILLIC_AND_GREEK_HOMOGLYPHS = {
    '\u0430': 'a',  # Cyrillic small a
    '\u0435': 'e',  # Cyrillic small e
    '\u043e': 'o',  # Cyrillic small o
    '\u0440': 'p',  # Cyrillic small p
    '\u0441': 'c',  # Cyrillic small c
    '\u0443': 'y',  # Cyrillic small y
    '\u0445': 'x',  # Cyrillic small x
    '\u0456': 'i',  # Cyrillic small i
    '\u0458': 'j',  # Cyrillic small j
    '\u0455': 's',  # Cyrillic small s
    '\u0501': 'd',  # Komi de
    '\u051d': 'w',  # Cyrillic we
    '\u03bf': 'o',  # Greek omicron
    '\u03bd': 'v',  # Greek nu
    '\u03c1': 'p',  # Greek rho
    '\u03b1': 'a',  # Greek alpha
}

def shannon_entropy(string: str) -> float:
    """Calculates Shannon entropy of a given string."""
    if not string:
        return 0.0
    entropy = 0.0
    length = len(string)
    frequencies = {}
    for char in string:
        frequencies[char] = frequencies.get(char, 0) + 1
    for count in frequencies.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 4)

def damerau_levenshtein_distance(s1: str, s2: str) -> int:
    """
    Calculates Damerau-Levenshtein distance between two strings,
    supporting insertions, deletions, substitutions, and adjacent transpositions.
    """
    len1 = len(s1)
    len2 = len(s2)
    d = {}
    for i in range(-1, len1 + 1):
        d[(i, -1)] = i + 1
    for j in range(-1, len2 + 1):
        d[(-1, j)] = j + 1

    for i in range(len1):
        for j in range(len2):
            cost = 0 if s1[i] == s2[j] else 1
            d[(i, j)] = min(
                d[(i - 1, j)] + 1,          # deletion
                d[(i, j - 1)] + 1,          # insertion
                d[(i - 1, j - 1)] + cost    # substitution
            )
            # Transposition of adjacent characters (e.g. goolge -> google)
            if i > 0 and j > 0 and s1[i] == s2[j - 1] and s1[i - 1] == s2[j]:
                d[(i, j)] = min(d[(i, j)], d[(i - 2, j - 2)] + 1)

    return d[(len1 - 1, len2 - 1)]

def squash_repeated_chars(s: str) -> str:
    """Squashes consecutive repeated characters, e.g., 'githuub' -> 'github', 'gooogle' -> 'gogle'."""
    return re.sub(r'(.)\1+', r'\1', s)

def normalize_homoglyphs(s: str, at_as: str = 'o') -> str:
    """
    Translates common visual homoglyphs, leetspeak substitutions, and Cyrillic/Greek Unicode impostors.
    Handles '@' dynamically as either 'o' (e.g. go@gle -> google) or 'a' (e.g. p@ypal -> paypal).
    """
    res = s.lower()
    
    # 1. Transliterate Unicode Cyrillic & Greek homoglyphs
    for glyph, latin in CYRILLIC_AND_GREEK_HOMOGLYPHS.items():
        res = res.replace(glyph, latin)

    # 2. Multi-character visual substitutions
    res = res.replace("rn", "m").replace("vv", "w").replace("cl", "d").replace("nn", "m")

    # 3. Handle @ symbol based on context/mode
    if at_as == 'o':
        res = res.replace("@", "o")
    else:
        res = res.replace("@", "a")

    # 4. Standard numerical leetspeak substitutions
    res = res.replace("0", "o")
    res = res.replace("1", "l").replace("|", "l").replace("!", "l")
    res = res.replace("2", "z")
    res = res.replace("3", "e")
    res = res.replace("4", "a")
    res = res.replace("5", "s").replace("$", "s")
    res = res.replace("6", "b")
    res = res.replace("7", "t").replace("+", "t")
    res = res.replace("8", "b")
    res = res.replace("9", "g")
    return res

def has_mixed_digits_in_word(domain_str: str) -> bool:
    """
    Detects numbers intentionally substituted inside or around alphabetic words,
    e.g., 'go0gle', 'paypa1', 'ch4se', 'secur1ty', 'upd8', 'b4nk'.
    """
    # Embedded digit: letters + digits + letters
    if re.search(r'[a-zA-Z]+\d+[a-zA-Z]+', domain_str):
        return True
    # Word ending in typical substitution digit (like paypa1, appl3, chas3, upd8)
    if re.search(r'[a-zA-Z]{3,}[0134578]\b', domain_str):
        return True
    # Word starting in digit substitution (like 0google, 4mazon)
    if re.search(r'\b[0134578][a-zA-Z]{3,}', domain_str):
        return True
    return False

def extract_domain_parts(url: str):
    """Parses clean URL and splits hostname into subdomain, SLD, TLD, and authority info."""
    clean_url = url.strip()
    if not clean_url.startswith(("http://", "https://")):
        clean_url = "https://" + clean_url

    parsed = urlparse(clean_url)

    # Extract raw authority section (between scheme:// and path/query)
    after_scheme = clean_url.split("://", 1)[1] if "://" in clean_url else clean_url
    raw_authority = after_scheme.split("/")[0].split("?")[0].split("#")[0]

    has_at_in_authority = "@" in raw_authority
    authority_userinfo = ""
    effective_hostname = ""

    if has_at_in_authority:
        at_idx = raw_authority.rfind("@")
        authority_userinfo = raw_authority[:at_idx]
        effective_hostname = raw_authority[at_idx + 1:].lower()
    else:
        effective_hostname = (parsed.hostname or raw_authority).lower()

    # Strip port if present
    effective_hostname = effective_hostname.split(":")[0]

    parts = effective_hostname.split('.')
    sld = ""
    subdomain = ""
    tld = ""

    if len(parts) >= 2:
        tld = "." + parts[-1]
        sld = parts[-2]
        if len(parts) > 2:
            subdomain = ".".join(parts[:-2])
    else:
        sld = effective_hostname

    return clean_url, parsed, effective_hostname, sld, subdomain, tld, raw_authority, authority_userinfo

def analyze_brand_spoofing(hostname: str, url_lower: str, raw_authority: str = "", userinfo: str = ""):
    """
    Deep multi-layer deception detection for:
    - Authority Userinfo Hijacking (e.g. google.com@attacker.xyz)
    - Direct @ Glyph Homoglyphs (e.g. go@gle.com, p@ypal.com)
    - Unicode IDN / Cyrillic Homographs (e.g. gооgle.com with Cyrillic 'о')
    - Homoglyphs & Leetspeak (e.g. go0gle.com, paypa1.com, arnazon.com)
    - Repeated Character Typosquatting (e.g. githuub.com, gooogle.com)
    - Damerau-Levenshtein Transpositions & Distance (e.g. goolge.com, githb.com)
    - Combosquatting / Affix Spoofing (e.g. google-security.com, login-github.com)
    - Subdomain Brand Hijacking (e.g. google.com.malicious-site.xyz)
    """
    hostname_clean = re.sub(r'^www\.', '', hostname.lower())

    # 1. Official Domain Verification: If domain is genuinely owned by brand, return 0 risk
    for brand, info in TARGETED_BRANDS.items():
        for official in info["official_domains"]:
            if hostname_clean == official or hostname_clean.endswith("." + official):
                return 0.0, brand, "official_verified"

    # 2. Check Authority Userinfo Hijacking (e.g. https://google.com@attacker.com or https://paypal.com:auth@evil.xyz)
    if userinfo:
        userinfo_lower = userinfo.lower()
        for brand, info in TARGETED_BRANDS.items():
            for official in info["official_domains"]:
                if official in userinfo_lower or brand in userinfo_lower:
                    return 99.0, brand, f"authority_userinfo_hijacking ('{userinfo}' deceptive prefix before destination '@{hostname}')"

    # 3. Check Direct @ Glyph Homoglyph inside domain name (e.g. go@gle.com, p@ypal.com)
    if raw_authority and "@" in raw_authority:
        raw_clean = re.sub(r'^www\.', '', raw_authority.lower())
        # Try both @ -> o (go@gle -> google) and @ -> a (p@ypal -> paypal)
        authority_sld = raw_clean.split('.')[0] if '.' in raw_clean else raw_clean
        norm_at_o = normalize_homoglyphs(authority_sld, at_as='o')
        norm_at_a = normalize_homoglyphs(authority_sld, at_as='a')

        for brand in TARGETED_BRANDS:
            if norm_at_o == brand or norm_at_a == brand:
                return 99.0, brand, f"visual_homoglyph_leetspeak ('{authority_sld}' visually impersonates '{brand}' via '@' glyph)"

    parts = hostname_clean.split('.')
    sld = parts[-2] if len(parts) >= 2 else parts[0]
    subdomain = ".".join(parts[:-2]) if len(parts) > 2 else ""

    # Check for Unicode Cyrillic/Greek homoglyphs
    has_cyrillic = any(c in CYRILLIC_AND_GREEK_HOMOGLYPHS for c in sld)

    # Normalized forms with both @ interpretations
    norm_sld_o = normalize_homoglyphs(sld, at_as='o')
    norm_sld_a = normalize_homoglyphs(sld, at_as='a')
    squashed_raw = squash_repeated_chars(sld)
    squashed_norm = squash_repeated_chars(norm_sld_o)

    max_spoof_score = 0.0
    detected_brand = "none"
    spoof_type = "none"

    for brand, info in TARGETED_BRANDS.items():
        squashed_brand = squash_repeated_chars(brand)

        # ---------------------------------------------------------------------
        # LAYER 1: Unicode IDN Cyrillic / Greek Homograph Spoofing
        # ---------------------------------------------------------------------
        if has_cyrillic and (norm_sld_o == brand or norm_sld_a == brand):
            score = 99.0
            if score > max_spoof_score:
                max_spoof_score = score
                detected_brand = brand
                spoof_type = f"idn_homograph_attack ('{sld}' uses deceptive Unicode glyphs to impersonate '{brand}')"
                continue

        # ---------------------------------------------------------------------
        # LAYER 2: Exact Visual Homoglyph / Leetspeak Impersonation
        # (e.g. go0gle -> google, paypa1 -> paypal, arnazon -> amazon, vvellfargo -> wellsfargo)
        # ---------------------------------------------------------------------
        if sld != brand and (norm_sld_o == brand or norm_sld_a == brand):
            score = 98.0
            if score > max_spoof_score:
                max_spoof_score = score
                detected_brand = brand
                spoof_type = f"visual_homoglyph_leetspeak ('{sld}' visually impersonates '{brand}')"
                continue

        # ---------------------------------------------------------------------
        # LAYER 3: Squashed Repeated Characters (e.g. githuub -> github, gooogle -> google)
        # ---------------------------------------------------------------------
        if sld != brand and (squashed_raw == brand or squashed_norm == brand or squashed_norm == squashed_brand):
            score = 95.0
            if score > max_spoof_score:
                max_spoof_score = score
                detected_brand = brand
                spoof_type = f"typosquat_repeated_chars ('{sld}' targets '{brand}')"
                continue

        # ---------------------------------------------------------------------
        # LAYER 4: Damerau-Levenshtein Edit Distance (Transpositions & Edits)
        # Handles swapped letters like 'goolge', dropped letters like 'gogle', etc.
        # ---------------------------------------------------------------------
        dist_raw = damerau_levenshtein_distance(sld, brand)
        dist_norm = min(
            damerau_levenshtein_distance(norm_sld_o, brand),
            damerau_levenshtein_distance(norm_sld_a, brand)
        )
        min_dist = min(dist_raw, dist_norm)
        max_len = max(len(sld), len(brand))

        if min_dist in (1, 2) and max_len > 0:
            similarity = 1.0 - (min_dist / max_len)
            if similarity >= 0.65:
                score = round(93.0 - (min_dist * 3), 1)
                if score > max_spoof_score:
                    max_spoof_score = score
                    detected_brand = brand
                    spoof_type = f"typosquat_edit_distance (distance {min_dist} from '{brand}')"
                    continue

        # ---------------------------------------------------------------------
        # LAYER 5: Subdomain Brand Impersonation (e.g. google.com.evil.xyz)
        # ---------------------------------------------------------------------
        if subdomain and (brand in subdomain or normalize_homoglyphs(subdomain).find(brand) != -1):
            score = 94.0
            if score > max_spoof_score:
                max_spoof_score = score
                detected_brand = brand
                spoof_type = f"subdomain_impersonation ('{brand}' injected into subdomain '{subdomain}')"
                continue

        # ---------------------------------------------------------------------
        # LAYER 6: Combosquatting / Affix Squatting (e.g. google-security.com, login-github.com)
        # ---------------------------------------------------------------------
        if brand in sld or brand in norm_sld_o or f"-{brand}" in hostname_clean or f"{brand}-" in hostname_clean:
            score = 90.0
            if score > max_spoof_score:
                max_spoof_score = score
                detected_brand = brand
                spoof_type = f"combosquatting ('{brand}' combined with affixes in '{hostname_clean}')"
                continue

    # -------------------------------------------------------------------------
    # LAYER 7: Brand Name Token Embedded in Path / Query on Untrusted Host
    # -------------------------------------------------------------------------
    if max_spoof_score < 40:
        for brand in TARGETED_BRANDS:
            if f"/{brand}" in url_lower or f"={brand}" in url_lower:
                score = 55.0
                if score > max_spoof_score:
                    max_spoof_score = score
                    detected_brand = brand
                    spoof_type = f"brand_token_in_path ('{brand}')"

    return max_spoof_score, detected_brand, spoof_type

def extract_features(url: str) -> dict:
    """
    Extracts a dictionary of 26 numerical and diagnostic features for ML models.
    """
    clean_url, parsed, hostname, sld, subdomain, tld, raw_authority, userinfo = extract_domain_parts(url)
    url_lower = clean_url.lower()
    path = parsed.path or ""
    query = parsed.query or ""

    url_len = len(clean_url)
    domain_len = len(hostname)
    path_len = len(path)
    query_len = len(query)

    # Lexical counts
    num_dots = clean_url.count('.')
    num_hyphens = clean_url.count('-')
    num_underscores = clean_url.count('_')
    num_slashes = clean_url.count('/')
    num_questionmarks = clean_url.count('?')
    num_equals = clean_url.count('=')
    num_at = clean_url.count('@')
    num_percent = clean_url.count('%')

    # Character distributions
    digits = sum(c.isdigit() for c in clean_url)
    letters = sum(c.isalpha() for c in clean_url)
    digit_ratio = round(digits / max(1, url_len), 4)
    letter_ratio = round(letters / max(1, url_len), 4)
    special_chars = url_len - (digits + letters)
    special_char_ratio = round(special_chars / max(1, url_len), 4)

    # IP address detection (IPv4 / IPv6)
    has_ip = 1 if re.match(r'^(\d{1,3}\.){3}\d{1,3}$', hostname) else 0

    # Protocol
    is_https = 1 if clean_url.startswith("https://") else 0

    # Subdomains count
    parts = hostname.split('.')
    num_subdomains = max(0, len(parts) - 2) if not has_ip else 0

    # Shannon Entropy
    url_entropy = shannon_entropy(clean_url)
    domain_entropy = shannon_entropy(hostname)

    # Suspicious TLD check
    is_suspicious_tld = 1 if any(hostname.endswith(stld) for stld in SUSPICIOUS_TLDS) else 0

    # Sensitive security tokens
    matched_tokens = [tok for tok in SECURITY_SENSITIVE_TOKENS if tok in url_lower]
    suspicious_token_count = len(matched_tokens)

    # Deep Brand spoofing and deception analysis
    brand_score, target_brand, spoof_type = analyze_brand_spoofing(hostname, url_lower, raw_authority, userinfo)

    # Punycode / IDN check
    has_punycode = 1 if ("xn--" in hostname or "xn--" in raw_authority) else 0

    # Mixed digits in domain (e.g. go0gle, pay1pal, b4nk, secur1ty)
    has_mixed_digits = 1 if has_mixed_digits_in_word(sld) else 0

    # Consonant / Vowel ratio in domain body
    vowels = sum(c in 'aeiou' for c in sld if c.isalpha())
    consonants = sum(c.isalpha() and c not in 'aeiou' for c in sld)
    vowel_consonant_ratio = round(vowels / max(1, consonants), 4)

    return {
        # Numerical feature vector for ML
        "url_length": url_len,
        "domain_length": domain_len,
        "path_length": path_len,
        "query_length": query_len,
        "num_dots": num_dots,
        "num_hyphens": num_hyphens,
        "num_underscores": num_underscores,
        "num_slashes": num_slashes,
        "num_questionmarks": num_questionmarks,
        "num_equals": num_equals,
        "num_at": num_at,
        "num_percent": num_percent,
        "digit_ratio": digit_ratio,
        "letter_ratio": letter_ratio,
        "special_char_ratio": special_char_ratio,
        "has_ip": has_ip,
        "is_https": is_https,
        "num_subdomains": num_subdomains,
        "url_entropy": url_entropy,
        "domain_entropy": domain_entropy,
        "suspicious_tld": is_suspicious_tld,
        "suspicious_token_count": suspicious_token_count,
        "brand_spoofing_score": brand_score,
        "has_punycode": has_punycode,
        "vowel_consonant_ratio": vowel_consonant_ratio,
        "has_mixed_digits": has_mixed_digits,
        
        # Metadata / Diagnostic explanations
        "url": clean_url,
        "domain": hostname,
        "raw_authority": raw_authority,
        "userinfo": userinfo,
        "target_brand": target_brand,
        "spoof_type": spoof_type,
        "matched_tokens": matched_tokens
    }

FEATURE_COLUMNS = [
    "url_length",
    "domain_length",
    "path_length",
    "query_length",
    "num_dots",
    "num_hyphens",
    "num_underscores",
    "num_slashes",
    "num_questionmarks",
    "num_equals",
    "num_at",
    "num_percent",
    "digit_ratio",
    "letter_ratio",
    "special_char_ratio",
    "has_ip",
    "is_https",
    "num_subdomains",
    "url_entropy",
    "domain_entropy",
    "suspicious_tld",
    "suspicious_token_count",
    "brand_spoofing_score",
    "has_punycode",
    "vowel_consonant_ratio",
    "has_mixed_digits"
]

def extract_feature_vector(url: str) -> list:
    """Returns the ordered numerical feature list matching FEATURE_COLUMNS for ML inference."""
    feats = extract_features(url)
    return [feats[col] for col in FEATURE_COLUMNS]
