import re
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

class BaseWebinarCollector:
    """
    Abstract Base Collector for all external webinar sources.
    Enforces canonical URL normalization, strict online webinar validation,
    date/timezone parsing, and zero-invention of missing information.
    """

    def __init__(self, source_code: str, source_name: str, base_url: str):
        self.source_code = source_code
        self.source_name = source_name
        self.base_url = base_url

    def fetch_events(self) -> List[Dict[str, Any]]:
        """
        Fetch raw event structures from the external source.
        Must be implemented by concrete subclasses.
        """
        raise NotImplementedError

    @staticmethod
    def canonicalize_url(url: str) -> str:
        """
        Strips tracking parameters (utm_*, ref, fbclid, etc.) and normalizes URLs
        for accurate duplicate detection.
        """
        if not url:
            return ""
        try:
            parsed = urlparse(url.strip())
            # Strip trailing slash on path for consistency
            path = parsed.path.rstrip("/")
            if not path:
                path = "/"

            # Filter out tracking queries
            tracking_params = {
                "utm_source", "utm_medium", "utm_campaign", "utm_term",
                "utm_content", "ref", "fbclid", "gclid", "mc_cid", "mc_eid"
            }
            query_dict = parse_qs(parsed.query, keep_blank_values=False)
            filtered_query = {
                k: v for k, v in query_dict.items()
                if k.lower() not in tracking_params
            }
            sorted_query = urlencode(filtered_query, doseq=True)

            canonical = urlunparse((
                parsed.scheme.lower(),
                parsed.netloc.lower(),
                path,
                "",
                sorted_query,
                ""
            ))
            return canonical
        except Exception:
            return url.strip()

    @staticmethod
    def validate_webinar(
        title: str,
        description: str,
        platform: str = "",
        registration_url: str = "",
        venue_text: str = ""
    ) -> Tuple[bool, str]:
        """
        Strictly enforces Requirement 6:
        Only accept actual online webinars.
        EXCLUDE seminars, conferences, workshops, physical events, and unrelated event types.
        """
        text = f"{title} {description} {platform} {venue_text} {registration_url}".lower()

        # 1. Check for physical/in-person exclusion indicators
        physical_keywords = [
            "in-person", "in person", "on-site", "onsite only", "physical attendance",
            "convention center", "hotel ballroom", "hall a", "hall b", "room 101",
            "expo floor", "multi-day conference", "three-day summit", "physical conference"
        ]
        for kw in physical_keywords:
            if kw in text:
                # If it explicitly says hybrid, we may consider it only if virtual link exists
                if "hybrid" not in text and "virtual attendance" not in text:
                    return False, f"Excluded: detected physical/in-person event keyword '{kw}'"

        # 2. Check for confirmed virtual/online webinar platforms
        known_online_platforms = [
            "zoom", "webex", "teams", "microsoft teams", "google meet",
            "youtube live", "livestream", "bigmarker", "on24", "gotowebinar"
        ]
        has_known_platform = any(p in platform.lower() for p in known_online_platforms) or \
                             any(p in registration_url.lower() for p in ["zoom.us", "webex.com", "teams.microsoft", "meet.google", "youtube.com/live", "bigmarker.com", "on24.com"])

        # 3. Check for webinar-specific keywords
        webinar_keywords = ["webinar", "virtual lecture", "online seminar", "virtual session", "live stream", "webcast", "online workshop"]
        has_webinar_keyword = any(kw in text for kw in webinar_keywords)

        if not (has_known_platform or has_webinar_keyword):
            return False, "Excluded: missing virtual webinar platform or online webinar designation"

        return True, "Valid online webinar"

    @staticmethod
    def normalize_string(val: Optional[str]) -> str:
        return val.strip() if val else ""
