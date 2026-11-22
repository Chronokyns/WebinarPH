import json
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="student", nullable=False) # 'student' | 'admin'
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    saved_webinars = relationship("SavedWebinar", back_populates="user", cascade="all, delete-orphan")
    registrations = relationship("WebinarRegistration", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("UserReport", back_populates="user", cascade="all, delete-orphan")

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    university = Column(String(255), nullable=True)
    major = Column(String(255), nullable=True)
    academic_year = Column(String(50), nullable=True)
    interests_json = Column(Text, default="[]", nullable=False)
    preferred_platforms_json = Column(Text, default="[]", nullable=False)
    career_goals = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="profile")

    @property
    def interests(self):
        try:
            return json.loads(self.interests_json)
        except Exception:
            return []

    @interests.setter
    def interests(self, value):
        self.interests_json = json.dumps(value)

    @property
    def preferred_platforms(self):
        try:
            return json.loads(self.preferred_platforms_json)
        except Exception:
            return []

    @preferred_platforms.setter
    def preferred_platforms(self, value):
        self.preferred_platforms_json = json.dumps(value)

class WebinarCategory(Base):
    __tablename__ = "webinar_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    webinars = relationship("Webinar", back_populates="category")

class WebinarSource(Base):
    __tablename__ = "webinar_sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(100), unique=True, index=True, nullable=False)
    source_type = Column(String(50), default="official_api", nullable=False) # 'official_api' | 'feed' | 'manual_import'
    base_url = Column(String(500), nullable=False)
    sync_frequency = Column(String(100), default="Daily", nullable=False)
    status = Column(String(50), default="active", nullable=False) # 'active' | 'syncing' | 'error' | 'idle'
    last_sync_at = Column(DateTime, nullable=True)
    last_sync_status = Column(String(255), nullable=True)
    records_count = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    webinars = relationship("Webinar", back_populates="source")
    sync_logs = relationship("SynchronizationLog", back_populates="source", cascade="all, delete-orphan")

class Webinar(Base):
    __tablename__ = "webinars"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), index=True, nullable=False)
    slug = Column(String(500), index=True, nullable=False)
    short_description = Column(Text, nullable=False)
    full_description = Column(Text, nullable=False)
    category_id = Column(Integer, ForeignKey("webinar_categories.id"), nullable=False)
    source_id = Column(Integer, ForeignKey("webinar_sources.id"), nullable=False)
    external_id = Column(String(255), index=True, nullable=True)
    start_time = Column(DateTime, index=True, nullable=False)
    end_time = Column(DateTime, nullable=False)
    timezone = Column(String(50), default="UTC+8", nullable=False)
    registration_deadline = Column(DateTime, index=True, nullable=True)
    speaker_name = Column(String(255), nullable=False)
    speaker_title = Column(String(255), nullable=True)
    speaker_organization = Column(String(255), nullable=True)
    organizer_name = Column(String(255), index=True, nullable=False)
    webinar_platform = Column(String(50), default="Zoom", nullable=False) # Zoom, Google Meet, Teams, Webex, YouTube Live
    is_free = Column(Boolean, default=True, index=True, nullable=False)
    price_amount = Column(Float, nullable=True)
    currency = Column(String(10), default="USD", nullable=True)
    certificate_available = Column(Boolean, default=False, index=True, nullable=False)
    registration_url = Column(String(1000), nullable=False)
    is_verified = Column(Boolean, default=True, nullable=False)
    verification_badge = Column(String(255), nullable=True)
    status = Column(String(50), default="upcoming", nullable=False) # upcoming, ongoing, completed, cancelled
    tags_json = Column(Text, default="[]", nullable=False)
    eligibility_notes = Column(Text, nullable=True)
    target_audience = Column(String(500), nullable=True)
    language = Column(String(50), default="English", nullable=False)
    attendance_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    category = relationship("WebinarCategory", back_populates="webinars")
    source = relationship("WebinarSource", back_populates="webinars")
    saved_records = relationship("SavedWebinar", back_populates="webinar", cascade="all, delete-orphan")
    registrations = relationship("WebinarRegistration", back_populates="webinar", cascade="all, delete-orphan")

    @property
    def tags(self):
        try:
            return json.loads(self.tags_json)
        except Exception:
            return []

    @tags.setter
    def tags(self, value):
        self.tags_json = json.dumps(value)

class SavedWebinar(Base):
    __tablename__ = "saved_webinars"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    webinar_id = Column(Integer, ForeignKey("webinars.id", ondelete="CASCADE"), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="saved_webinars")
    webinar = relationship("Webinar", back_populates="saved_records")

    __table_args__ = (
        Index("idx_user_webinar_saved", "user_id", "webinar_id", unique=True),
    )

class WebinarRegistration(Base):
    __tablename__ = "webinar_registrations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    webinar_id = Column(Integer, ForeignKey("webinars.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="interested", nullable=False) # interested, registered, attended, missed, cancelled
    registered_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="registrations")
    webinar = relationship("Webinar", back_populates="registrations")

    __table_args__ = (
        Index("idx_user_webinar_reg", "user_id", "webinar_id", unique=True),
    )

class WebinarPreference(Base):
    __tablename__ = "webinar_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    preferred_categories_json = Column(Text, default="[]", nullable=False)
    preferred_platforms_json = Column(Text, default="[]", nullable=False)
    only_free = Column(Boolean, default=False, nullable=False)
    only_certificate = Column(Boolean, default=False, nullable=False)
    reminder_days_before = Column(Integer, default=1, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    query_text = Column(String(500), nullable=False)
    parsed_intent_json = Column(Text, nullable=True)
    result_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="system", nullable=False) # deadline_warning, starting_soon, recommendation, update, system
    webinar_id = Column(Integer, ForeignKey("webinars.id", ondelete="SET NULL"), nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="notifications")

class UserReport(Base):
    __tablename__ = "user_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    webinar_id = Column(Integer, ForeignKey("webinars.id", ondelete="CASCADE"), nullable=False)
    report_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="pending", nullable=False) # pending, reviewed, resolved, dismissed
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="reports")

class SynchronizationLog(Base):
    __tablename__ = "synchronization_logs"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("webinar_sources.id", ondelete="CASCADE"), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String(50), default="success", nullable=False) # success, partial, failed
    records_fetched = Column(Integer, default=0, nullable=False)
    records_added = Column(Integer, default=0, nullable=False)
    records_updated = Column(Integer, default=0, nullable=False)
    records_skipped = Column(Integer, default=0, nullable=False)
    error_details = Column(Text, nullable=True)

    source = relationship("WebinarSource", back_populates="sync_logs")
