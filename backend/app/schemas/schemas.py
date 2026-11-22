from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserOut"

class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "student"

class UserCreate(UserBase):
    password: str
    university: Optional[str] = None
    major: Optional[str] = None
    interests: Optional[List[str]] = []

class UserLogin(BaseModel):
    email: str
    password: str

class StudentProfileOut(BaseModel):
    id: int
    user_id: int
    university: Optional[str] = None
    major: Optional[str] = None
    academic_year: Optional[str] = None
    interests: List[str] = []
    preferred_platforms: List[str] = []
    career_goals: Optional[str] = None

    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    university: Optional[str] = None
    major: Optional[str] = None
    academic_year: Optional[str] = None
    career_goals: Optional[str] = None
    interests: Optional[List[str]] = None
    preferred_platforms: Optional[List[str]] = None

class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    profile: Optional[StudentProfileOut] = None

    class Config:
        from_attributes = True

class WebinarCategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    display_order: int
    is_active: bool

    class Config:
        from_attributes = True

class WebinarSourceOut(BaseModel):
    id: int
    name: str
    code: str
    source_type: str
    base_url: str
    sync_frequency: str
    status: str
    last_sync_at: Optional[datetime] = None
    last_sync_status: Optional[str] = None
    records_count: int
    is_active: bool

    class Config:
        from_attributes = True

class WebinarBase(BaseModel):
    title: str
    slug: Optional[str] = None
    short_description: str
    full_description: str
    category_id: int
    source_id: int
    external_id: Optional[str] = None
    start_time: datetime
    end_time: datetime
    timezone: str = "UTC+8"
    registration_deadline: Optional[datetime] = None
    speaker_name: str
    speaker_title: Optional[str] = None
    speaker_organization: Optional[str] = None
    organizer_name: str
    webinar_platform: str = "Zoom"
    is_free: bool = True
    price_amount: Optional[float] = None
    currency: Optional[str] = "USD"
    certificate_available: bool = False
    registration_url: str
    is_verified: bool = True
    verification_badge: Optional[str] = None
    status: str = "upcoming"
    tags: List[str] = []
    eligibility_notes: Optional[str] = None
    target_audience: Optional[str] = None
    language: str = "English"

class WebinarCreate(WebinarBase):
    pass

class WebinarUpdate(BaseModel):
    title: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    category_id: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    registration_deadline: Optional[datetime] = None
    speaker_name: Optional[str] = None
    organizer_name: Optional[str] = None
    webinar_platform: Optional[str] = None
    is_free: Optional[bool] = None
    price_amount: Optional[float] = None
    certificate_available: Optional[bool] = None
    registration_url: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[List[str]] = None

class WebinarOut(WebinarBase):
    id: int
    category_name: Optional[str] = None
    source_name: Optional[str] = None
    attendance_count: int = 0
    is_expired: bool = False
    is_saved: bool = False
    user_registration_status: Optional[str] = None
    similarity_score: Optional[float] = None
    recommendation_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SavedWebinarOut(BaseModel):
    id: int
    user_id: int
    webinar_id: int
    notes: Optional[str] = None
    created_at: datetime
    webinar: WebinarOut

    class Config:
        from_attributes = True

class WebinarRegistrationOut(BaseModel):
    id: int
    user_id: int
    webinar_id: int
    status: str
    registered_at: datetime
    notes: Optional[str] = None
    updated_at: datetime
    webinar: WebinarOut

    class Config:
        from_attributes = True

class RegistrationStatusUpdate(BaseModel):
    status: str # interested, registered, attended, missed, cancelled
    notes: Optional[str] = None

class NotificationOut(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str
    webinar_id: Optional[int] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserReportCreate(BaseModel):
    webinar_id: int
    report_type: str
    description: str

class UserReportOut(BaseModel):
    id: int
    user_id: int
    webinar_id: int
    report_type: str
    description: str
    status: str
    admin_notes: Optional[str] = None
    created_at: datetime
    user_name: Optional[str] = None
    webinar_title: Optional[str] = None

    class Config:
        from_attributes = True

class SynchronizationLogOut(BaseModel):
    id: int
    source_id: int
    source_name: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    status: str
    records_fetched: int
    records_added: int
    records_updated: int
    records_skipped: int
    error_details: Optional[str] = None

    class Config:
        from_attributes = True

class ParsedIntentOut(BaseModel):
    extracted_topic: Optional[str] = None
    extracted_price: Optional[str] = None
    extracted_certificate: Optional[bool] = None
    extracted_deadline: Optional[str] = None
    extracted_platform: Optional[str] = None
    interpretation_summary: Optional[str] = None

class SearchResultOut(BaseModel):
    webinars: List[WebinarOut]
    total: int
    parsed_intent: Optional[ParsedIntentOut] = None

class UrlPreviewRequest(BaseModel):
    url: str

class UrlPreviewResponse(BaseModel):
    title: str
    short_description: str
    full_description: str
    registration_url: str
    speaker_name: str
    speaker_title: Optional[str] = None
    speaker_organization: Optional[str] = None
    organizer_name: str
    webinar_platform: str
    is_free: bool
    price_amount: Optional[float] = None
    currency: str
    certificate_available: bool
    category_id: int
    timezone: str
    start_time: str
    end_time: str
    tags: List[str] = []
    is_duplicate: bool
    duplicate_match: Optional[Dict[str, Any]] = None
    is_valid_webinar: bool
    validation_message: str

class CsvImportSummary(BaseModel):
    total_rows: int
    records_added: int
    records_updated: int
    skipped_duplicates: int
    skipped_non_webinars: int
    errors: List[str]
