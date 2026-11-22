from typing import List, Tuple, Optional
from datetime import datetime
from ..models.models import Webinar, User

def generate_recommendations(
    user: User,
    all_webinars: List[Webinar],
    custom_interests: Optional[List[str]] = None
) -> List[Tuple[Webinar, float, str]]:
    now = datetime.utcnow()
    # Exclude expired webinars from upcoming recommendations
    upcoming = [w for w in all_webinars if w.start_time > now]

    user_interests = []
    if custom_interests and len(custom_interests) > 0:
        user_interests = [i.lower() for i in custom_interests]
    elif user.profile and user.profile.interests:
        user_interests = [i.lower() for i in user.profile.interests]

    user_major = (user.profile.major.lower() if user.profile and user.profile.major else "")

    saved_categories = {
        s.webinar.category.name.lower()
        for s in user.saved_webinars
        if s.webinar and s.webinar.category
    }
    saved_titles = [s.webinar.title for s in user.saved_webinars if s.webinar]

    scored_recs = []

    for w in upcoming:
        score = 0.55
        reasons = []

        w_tags = [t.lower() for t in w.tags]
        cat_name = w.category.name.lower() if w.category else ""

        # 1. Stated student interests match
        matched_interests = [
            interest for interest in user_interests
            if interest in cat_name or any(interest in tag for tag in w_tags) or interest in w.title.lower()
        ]

        if matched_interests:
            score += 0.32
            reasons.append(f"Recommended because you are interested in {matched_interests[0].title()}")

        # 2. Major match
        major_tokens = [m for m in user_major.replace("&", " ").split() if len(m) > 3]
        if any(tok in cat_name or any(tok in tag for tag in w_tags) for tok in major_tokens):
            score += 0.15
            if not reasons:
                reasons.append(f"Aligned with your degree major in {user.profile.major}")

        # 3. Match with saved webinars history
        if cat_name in saved_categories:
            score += 0.18
            if not reasons and saved_titles:
                reasons.append(f"Based on your saved webinar on '{saved_titles[0]}'")

        # 4. Academic value boost: Free registration + Verified Certificate
        if w.is_free and w.certificate_available:
            score += 0.10
            if not reasons:
                reasons.append("High academic value with free verified certificate")

        # 5. Verified source boost
        if w.is_verified:
            score += 0.05

        final_score = min(0.99, round(score, 2))
        final_reason = reasons[0] if reasons else f"Recommended technical webinar in {w.category.name if w.category else 'Computing'}"

        scored_recs.append((w, final_score, final_reason))

    scored_recs.sort(key=lambda x: x[1], reverse=True)
    return scored_recs
