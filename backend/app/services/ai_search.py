import re
import math
from datetime import datetime
from typing import List, Dict, Any, Tuple, Optional
from ..models.models import Webinar

CONCEPT_TAXONOMY: Dict[str, List[str]] = {
    "Cybersecurity & Ethical Hacking": [
        "security", "cyber", "cybersecurity", "hacker", "hackers", "hacking", "infosec", "threat",
        "threats", "defensive", "cryptography", "network defense", "zero trust", "firewall",
        "firewalls", "protect computer systems", "penetration testing", "soc", "siem", "vulnerability",
        "vulnerabilities", "malware", "ransomware", "kali linux", "wireshark", "packet inspection"
    ],
    "AI & Machine Learning": [
        "artificial intelligence", "machine learning", "deep learning", "neural network", "neural networks",
        "llm", "llms", "rag", "genai", "generative ai", "computer vision", "robotics", "nlp",
        "pytorch", "tensorflow", "ai agents", "model training", "transformers", "chatgpt", "openai"
    ],
    "Cloud Computing & DevOps": [
        "cloud", "aws", "kubernetes", "k8s", "docker", "microservices", "serverless",
        "devops", "lambda", "containers", "ci/cd", "azure", "gcp", "distributed systems",
        "cloud infrastructure", "terraform", "helm", "service mesh"
    ],
    "Web & Mobile Engineering": [
        "web development", "frontend", "react", "next.js", "javascript", "typescript",
        "fullstack", "full-stack", "tailwind", "ui components", "api", "mobile app", "flutter",
        "backend", "node.js", "express", "web engineering"
    ],
    "Data Science & Big Data": [
        "data science", "analytics", "pandas", "python for data", "data visualization",
        "big data", "sql", "numpy", "statistics", "data analysis", "data engineering",
        "business intelligence", "tableau", "power bi"
    ],
    "Health Sciences & Biomedical": [
        "pregnancy", "pregnant", "prenatal", "maternal", "obstetrics", "gynecology",
        "maternal health", "neonatal", "pediatrics", "childbirth", "fetal", "postpartum",
        "nursing", "clinical", "medicine", "biomedical", "healthcare", "patient care",
        "health informatics", "digital health", "medical technology", "epidemiology"
    ],
    "Academic & Career Readiness": [
        "technical interview", "interviews", "career development", "capstone", "resume",
        "hiring", "academic research", "research paper", "algorithms", "system design",
        "internship", "portfolio", "graduate readiness"
    ],
}

STOPWORDS = {
    "a", "about", "all", "an", "and", "any", "are", "as", "at", "be", "by",
    "can", "could", "do", "does", "for", "from", "how", "i", "in", "is",
    "it", "me", "my", "need", "of", "on", "or", "our", "show", "some",
    "that", "the", "their", "them", "then", "there", "these", "they",
    "this", "to", "us", "want", "was", "we", "webinar", "webinars",
    "what", "when", "where", "which", "who", "will", "with", "would", "you", "your"
}

CONSTRAINT_WORDS = {
    "free", "paid", "cost", "costs", "fee", "fees", "zero", "price", "prices",
    "certificate", "certificates", "certification", "certifications", "cert", "certs",
    "credential", "credentials", "proof", "accredited",
    "zoom", "meet", "teams", "webex", "youtube", "live",
    "before", "after", "until", "by", "deadline", "deadlines", "date", "dates",
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
    "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec",
    "week", "weeks", "next", "this", "today", "tomorrow"
}

def stem_token(word: str) -> str:
    """Lightweight academic stemmer."""
    w = word.lower()
    if w.endswith("ies") and len(w) > 4:
        return w[:-3] + "y"
    if w.endswith("ing") and len(w) > 5:
        return w[:-3]
    if w.endswith("ed") and len(w) > 4:
        return w[:-2]
    if w.endswith("es") and len(w) > 4:
        return w[:-2]
    if w.endswith("s") and not w.endswith("ss") and len(w) > 3:
        return w[:-1]
    return w

def tokenize(text: str) -> List[str]:
    clean = re.sub(r"[^a-zA-Z0-9\s]", " ", text.lower())
    words = clean.split()
    return [w for w in words if len(w) > 2 and w not in STOPWORDS]

def phrase_in_text(phrase: str, text: str) -> bool:
    """Checks if a multi-word phrase or word exists with word boundaries."""
    pattern = rf"\b{re.escape(phrase.lower())}\b"
    return bool(re.search(pattern, text.lower()))

def parse_natural_language_query(query: str) -> Dict[str, Any]:
    q_lower = query.lower()
    intent: Dict[str, Any] = {}
    explanations: List[str] = []

    # 1. Price constraint
    if any(k in q_lower for k in ["free", "no cost", "without fee", "zero price", "free of charge"]):
        intent["price"] = "free"
        explanations.append("Free registration required")
    elif "paid" in q_lower:
        intent["price"] = "paid"
        explanations.append("Paid industry webinars")

    # 2. Certificate constraint
    if any(k in q_lower for k in ["certificate", "certificates", "cert", "credential", "proof", "accredited"]):
        intent["certificate"] = True
        explanations.append("Certificate of completion required")

    # 3. Platform constraint
    platforms = ["Zoom", "Google Meet", "Microsoft Teams", "Webex", "YouTube Live"]
    for p in platforms:
        if p.lower() in q_lower:
            intent["platform"] = p
            explanations.append(f"Restricted to {p}")
            break

    # 4. Deadline / Date constraint
    date_match = re.search(r"before\s+(december|dec|january|jan|november|nov)\s+(\d{1,2})", q_lower)
    if date_match:
        month_str = date_match.group(1)
        day_num = int(date_match.group(2))
        month_map = {"jan": 1, "january": 1, "nov": 11, "november": 11, "dec": 12, "december": 12}
        month = month_map.get(month_str, 12)
        year = datetime.utcnow().year
        deadline_dt = datetime(year, month, day_num, 23, 59, 59)
        intent["deadline_before"] = deadline_dt
        explanations.append(f"Restricted to before {month_str.upper()} {day_num}")
    elif "next week" in q_lower or "this week" in q_lower:
        from datetime import timedelta
        intent["deadline_before"] = datetime.utcnow() + timedelta(days=7)
        explanations.append("Within next 7 days")

    # 5. Semantic concept extraction
    matched_topics = []
    for category, keywords in CONCEPT_TAXONOMY.items():
        if any(phrase_in_text(kw, q_lower) for kw in keywords):
            matched_topics.append(category)

    if matched_topics:
        intent["topics"] = matched_topics
        explanations.append(f"Concept matched: {', '.join(matched_topics)}")

    intent["summary"] = " • ".join(explanations) if explanations else "Semantic search over webinar catalog"
    return intent

def compute_similarity(query_tokens: List[str], doc_tokens: List[str]) -> float:
    if not query_tokens or not doc_tokens:
        return 0.0

    query_freq: Dict[str, int] = {}
    for t in query_tokens:
        query_freq[t] = query_freq.get(t, 0) + 1

    doc_freq: Dict[str, int] = {}
    for t in doc_tokens:
        doc_freq[t] = doc_freq.get(t, 0) + 1

    dot_product = sum(query_freq.get(t, 0) * doc_freq.get(t, 0) for t in set(query_tokens))
    norm_q = math.sqrt(sum(v ** 2 for v in query_freq.values()))
    norm_d = math.sqrt(sum(v ** 2 for v in doc_freq.values()))

    if norm_q == 0 or norm_d == 0:
        return 0.0

    return dot_product / (norm_q * norm_d)

def rank_webinars_semantic(
    query: str,
    webinars: List[Webinar],
    apply_hard_constraints: bool = True
) -> Tuple[List[Tuple[Webinar, float, str]], Dict[str, Any]]:
    parsed_intent = parse_natural_language_query(query)
    raw_query_tokens = tokenize(query)

    # Separate subject keywords from constraint filter words
    subject_tokens = [t for t in raw_query_tokens if t not in CONSTRAINT_WORDS]
    subject_stems = [stem_token(t) for t in subject_tokens]
    query_has_subject = len(subject_tokens) > 0

    scored_results = []
    query_lower = query.lower().strip()

    for w in webinars:
        # 1. Enforce hard constraints
        if apply_hard_constraints:
            if parsed_intent.get("price") == "free" and not w.is_free:
                continue
            if parsed_intent.get("price") == "paid" and w.is_free:
                continue
            if parsed_intent.get("certificate") and not w.certificate_available:
                continue
            if parsed_intent.get("platform") and w.webinar_platform.lower() != parsed_intent["platform"].lower():
                continue
            if parsed_intent.get("deadline_before"):
                limit = parsed_intent["deadline_before"]
                if w.start_time > limit:
                    continue

        # Prepare field token sets for exact whole-word matching
        title_lower = w.title.lower()
        title_tokens = set(tokenize(title_lower))
        title_stems = {stem_token(t) for t in title_tokens}

        tags_str = " ".join(w.tags) if w.tags else ""
        tags_tokens = set(tokenize(tags_str.lower()))
        tags_stems = {stem_token(t) for t in tags_tokens}

        category_str = w.category.name if w.category else ""
        cat_tokens = set(tokenize(category_str.lower()))
        cat_stems = {stem_token(t) for t in cat_tokens}

        short_desc_lower = (w.short_description or "").lower()
        full_desc_lower = (w.full_description or "").lower()
        desc_tokens = set(tokenize(f"{short_desc_lower} {full_desc_lower}"))
        desc_stems = {stem_token(t) for t in desc_tokens}

        speaker_lower = (w.speaker_name or "").lower()
        organizer_lower = (w.organizer_name or "").lower()
        audience_lower = (w.target_audience or "").lower()

        doc_full_text = f"{title_lower} {short_desc_lower} {full_desc_lower} {tags_str.lower()} {category_str.lower()} {speaker_lower} {organizer_lower} {audience_lower}"
        all_doc_tokens = tokenize(doc_full_text)

        # Case A: User only specified constraints (e.g. "free webinars with certificate")
        if not query_has_subject:
            score = 0.90
            reason = "Matches all specified requirements"
            if parsed_intent.get("certificate") and parsed_intent.get("price"):
                reason = "Free registration • Certificate included"
            elif parsed_intent.get("certificate"):
                reason = "Verified webinar with certificate"
            scored_results.append((w, score, reason))
            continue

        # Case B: User specified subject/topic keywords (e.g. "pregnancy", "kubernetes", "hacking")
        raw_relevance = 0.0
        match_highlights: List[str] = []

        # 1. Exact phrase match in title or body with word boundary
        if phrase_in_text(query_lower, title_lower):
            raw_relevance += 0.85
            match_highlights.append(f'Exact title match for "{query}"')
        elif phrase_in_text(query_lower, doc_full_text):
            raw_relevance += 0.55
            match_highlights.append(f'Found "{query}" in webinar details')

        # 2. Token & Stem matching using whole-word sets (no accidental substring hits)
        title_matches = 0
        tag_matches = 0
        desc_matches = 0
        cat_matches = 0

        for token, stem in zip(subject_tokens, subject_stems):
            # Title
            if token in title_tokens or stem in title_stems:
                title_matches += 1
            # Tags
            if token in tags_tokens or stem in tags_stems:
                tag_matches += 1
            # Category
            if token in cat_tokens or stem in cat_stems:
                cat_matches += 1
            # Descriptions
            if token in desc_tokens or stem in desc_stems:
                desc_matches += 1

        raw_relevance += title_matches * 0.45
        raw_relevance += tag_matches * 0.40
        raw_relevance += cat_matches * 0.35
        raw_relevance += desc_matches * 0.20

        # 3. Concept Taxonomy & Semantic Topic Matching
        tax_boost = 0.0
        if "topics" in parsed_intent:
            for matched_topic in parsed_intent["topics"]:
                # Check if webinar category matches this concept
                if matched_topic.lower() in category_str.lower() or category_str.lower() in matched_topic.lower():
                    tax_boost = 0.45
                    match_highlights.append(f"Matches category {category_str}")
                    break
                # Check if taxonomy keywords appear in document with word boundaries
                cat_keywords = CONCEPT_TAXONOMY.get(matched_topic, [])
                if any(phrase_in_text(kw, doc_full_text) for kw in cat_keywords):
                    tax_boost = 0.35
                    match_highlights.append(f"Related to {matched_topic}")
                    break

        raw_relevance += tax_boost

        # 4. TF-IDF Cosine similarity
        base_sim = compute_similarity(subject_tokens, all_doc_tokens)
        raw_relevance += base_sim * 0.35

        # STRICT RELEVANCE GATE:
        # If no subject token, no stem, and no taxonomy concept matched ANYWHERE, this webinar is unrelated!
        if (title_matches == 0 and tag_matches == 0 and cat_matches == 0 and desc_matches == 0 and tax_boost == 0.0):
            # Absolutely unrelated! Skip this webinar!
            continue

        # If raw relevance is below minimum threshold, discard as noise
        if raw_relevance < 0.25:
            continue

        # Calibrate score between 0.65 and 0.98
        calibrated_score = round(min(0.98, max(0.65, 0.55 + raw_relevance * 0.35)), 2)

        # Formulate human-readable, clear match reason
        if match_highlights:
            reason = match_highlights[0]
        elif title_matches > 0:
            reason = f'Matches "{subject_tokens[0]}" in title'
        elif tag_matches > 0:
            reason = f'Matches topic tags in {category_str}'
        elif tax_boost > 0:
            reason = f'Semantic match: {category_str}'
        else:
            reason = f'Relevant to "{query}"'

        scored_results.append((w, calibrated_score, reason))

    # Sort descending by score
    scored_results.sort(key=lambda x: x[1], reverse=True)
    return scored_results, parsed_intent
