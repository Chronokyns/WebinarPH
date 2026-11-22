import re
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from ..models.models import Webinar, WebinarSource, WebinarCategory, SynchronizationLog
from .collectors.registry import CollectorRegistry
from .collectors.base import BaseWebinarCollector

class AggregationManager:
    """
    Centralized Aggregation & Synchronization Manager.
    Coordinates modular collectors, enforces duplicate detection, applies webinar filters,
    handles expiry detection, and updates audit sync logs.
    """

    @staticmethod
    def normalize_title(title: str) -> str:
        return re.sub(r"[^a-zA-Z0-9]", "", title.lower())

    @staticmethod
    def is_duplicate(db: Session, raw_event: Dict[str, Any]) -> Optional[Webinar]:
        # 1. Check external_id match
        ext_id = raw_event.get("external_id")
        if ext_id:
            existing = db.query(Webinar).filter(Webinar.external_id == ext_id).first()
            if existing:
                return existing

        # 2. Check canonical registration URL match
        reg_url = raw_event.get("registration_url")
        if reg_url:
            canonical_url = BaseWebinarCollector.canonicalize_url(reg_url)
            existing = db.query(Webinar).filter(Webinar.registration_url == canonical_url).first()
            if existing:
                return existing

        # 3. Check normalized title + start time window (+/- 2 hours)
        norm_title = AggregationManager.normalize_title(raw_event.get("title", ""))
        start_time = raw_event.get("start_time")
        if norm_title and start_time:
            window_start = start_time - timedelta(hours=2)
            window_end = start_time + timedelta(hours=2)
            candidates = db.query(Webinar).filter(
                Webinar.start_time >= window_start,
                Webinar.start_time <= window_end
            ).all()
            for cand in candidates:
                if AggregationManager.normalize_title(cand.title) == norm_title:
                    return cand

        return None

    @classmethod
    def update_expired_webinars(cls, db: Session):
        """
        Requirement 12: Detect expired webinars and transition status without deleting historical records.
        """
        now = datetime.utcnow()
        expired_upcoming = db.query(Webinar).filter(
            Webinar.end_time < now,
            Webinar.status == "upcoming"
        ).all()
        for w in expired_upcoming:
            w.status = "completed"
            w.updated_at = now
        if expired_upcoming:
            db.commit()

    @classmethod
    def process_and_sync_source(cls, db: Session, source_id: int) -> SynchronizationLog:
        """
        Synchronizes a webinar source using its registered modular collector,
        enforcing duplicate checks, webinar-only filtering, and review staging.
        """
        source = db.query(WebinarSource).filter(WebinarSource.id == source_id).first()
        if not source:
            raise ValueError(f"Source with id {source_id} not found")

        # First, ensure expired webinars are marked completed
        cls.update_expired_webinars(db)

        log = SynchronizationLog(
            source_id=source.id,
            started_at=datetime.utcnow(),
            status="syncing",
            records_fetched=0,
            records_added=0,
            records_updated=0,
            records_skipped=0
        )
        db.add(log)
        db.commit()

        # Category mapping helper
        categories = db.query(WebinarCategory).all()
        cat_slug_map = {c.slug.lower(): c.id for c in categories}
        default_cat_id = categories[0].id if categories else 1

        try:
            # Check for registered modular collector
            collector = CollectorRegistry.get(source.code)
            if collector:
                fetched_records = collector.fetch_events()
            elif source.source_type == "manual_import":
                # Manual sources (e.g., KnowBe4, Gartner, ISACA) require assisted import
                source.last_sync_at = datetime.utcnow()
                source.last_sync_status = "Manual source: Please use 'Import by URL' or 'Upload CSV'"
                source.status = "idle"
                log.completed_at = datetime.utcnow()
                log.status = "success"
                log.error_details = "Manual source requires admin-assisted URL or CSV import."
                db.commit()
                return log
            else:
                # Default fallback simulation for legacy seeded sources
                fetched_records = cls._mock_source_feed(source.code)

            log.records_fetched = len(fetched_records)

            for rec in fetched_records:
                # Requirement 6: Strictly validate online webinar
                is_webinar, val_msg = BaseWebinarCollector.validate_webinar(
                    rec["title"],
                    rec.get("full_description", ""),
                    rec.get("webinar_platform", "Zoom"),
                    rec.get("registration_url", "")
                )
                if not is_webinar:
                    log.records_skipped += 1
                    continue

                canonical_url = BaseWebinarCollector.canonicalize_url(rec["registration_url"])
                rec["registration_url"] = canonical_url

                # Category resolution
                cat_slug = rec.get("category_slug", "").lower()
                cat_id = cat_slug_map.get(cat_slug, rec.get("category_id", default_cat_id))

                # Tags JSON formatting
                tags = rec.get("tags", [])
                if isinstance(tags, list):
                    tags_json = json.dumps(tags)
                else:
                    tags_json = rec.get("tags_json", "[]")

                existing = cls.is_duplicate(db, rec)
                if existing:
                    # Update existing record if refreshed (Requirement 12: preserve record history)
                    existing.title = rec["title"]
                    existing.short_description = rec["short_description"]
                    existing.full_description = rec["full_description"]
                    existing.speaker_name = rec["speaker_name"]
                    existing.start_time = rec["start_time"]
                    existing.end_time = rec["end_time"]
                    existing.attendance_count = rec.get("attendance_count", existing.attendance_count)
                    existing.updated_at = datetime.utcnow()
                    log.records_updated += 1
                    log.records_skipped += 1
                else:
                    # Insert new record staged for review (Requirement 10: unverified until approved)
                    # For official government NIST NICE and official API partners, assign designated badge
                    is_auto_verified = source.code in ["nist_nice", "ieee_cs"]
                    badge_title = f"{source.name} Verified Webinar" if is_auto_verified else f"Pending Admin Approval ({source.name})"

                    new_webinar = Webinar(
                        title=rec["title"],
                        slug=re.sub(r"[^a-z0-9]+", "-", rec["title"].lower()).strip("-"),
                        short_description=rec["short_description"],
                        full_description=rec["full_description"],
                        category_id=cat_id,
                        source_id=source.id,
                        external_id=rec.get("external_id"),
                        start_time=rec["start_time"],
                        end_time=rec["end_time"],
                        timezone=rec.get("timezone", "UTC+8"),
                        registration_deadline=rec.get("registration_deadline", rec["start_time"] - timedelta(hours=2)),
                        speaker_name=rec["speaker_name"],
                        speaker_title=rec.get("speaker_title"),
                        speaker_organization=rec.get("speaker_organization"),
                        organizer_name=rec.get("organizer_name", source.name),
                        webinar_platform=rec.get("webinar_platform", "Zoom"),
                        is_free=rec.get("is_free", True),
                        price_amount=rec.get("price_amount"),
                        currency=rec.get("currency", "USD"),
                        certificate_available=rec.get("certificate_available", False),
                        registration_url=canonical_url,
                        is_verified=is_auto_verified, # Staged for review if not pre-approved source
                        verification_badge=badge_title,
                        status="upcoming",
                        tags_json=tags_json,
                        eligibility_notes=rec.get("eligibility_notes"),
                        target_audience=rec.get("target_audience"),
                        language=rec.get("language", "English"),
                        attendance_count=rec.get("attendance_count", 0)
                    )
                    db.add(new_webinar)
                    log.records_added += 1

            source.last_sync_at = datetime.utcnow()
            source.records_count = db.query(Webinar).filter(Webinar.source_id == source.id).count()
            source.last_sync_status = f"Healthy: +{log.records_added} added, {log.records_updated} updated, {log.records_skipped} dupes"
            source.status = "active"

            log.completed_at = datetime.utcnow()
            log.status = "success"
            db.commit()
            return log

        except Exception as e:
            db.rollback()
            log.completed_at = datetime.utcnow()
            log.status = "failed"
            log.error_details = str(e)
            source.last_sync_status = f"Error: {str(e)[:100]}"
            source.status = "error"
            db.commit()
            return log

    @staticmethod
    def _mock_source_feed(source_code: str) -> List[Dict[str, Any]]:
        now = datetime.utcnow()
        return [
            {
                "title": f"Advancements in Deep Learning Frameworks ({source_code.upper()})",
                "short_description": "A technical look at automated differentiation, pipeline parallelism, and distributed model training.",
                "full_description": "Academic webinar exploring low-level model parallelism and memory optimization for students conducting research on deep networks.",
                "category_id": 1,
                "category_slug": "ai-ml",
                "external_id": f"{source_code.upper()}-AUTO-{int(now.timestamp()) % 10000}",
                "start_time": now + timedelta(days=12, hours=14),
                "end_time": now + timedelta(days=12, hours=16),
                "registration_deadline": now + timedelta(days=11),
                "speaker_name": "Dr. Ronald Vance",
                "speaker_title": "AI Research Fellow",
                "speaker_organization": "Computing Research Group",
                "organizer_name": "Academic Webinar Consortium",
                "webinar_platform": "Zoom",
                "is_free": True,
                "certificate_available": True,
                "registration_url": f"https://webinars.org/register/{source_code}-deep-learning",
                "tags": ["Deep Learning", "AI", "PyTorch", "Certificate"],
                "attendance_count": 210
            }
        ]
