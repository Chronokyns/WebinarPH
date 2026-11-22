export type UserRole = 'student' | 'admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  profile?: StudentProfile;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  university?: string;
  major?: string;
  academic_year?: string;
  interests: string[];
  preferred_platforms: string[];
  career_goals?: string;
}

export interface WebinarCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  webinar_count?: number;
}

export type WebinarPlatform = 'Zoom' | 'Google Meet' | 'Microsoft Teams' | 'Webex' | 'YouTube Live' | 'Other';
export type WebinarStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type RegistrationStatus = 'interested' | 'registered' | 'attended' | 'missed' | 'cancelled';

export interface WebinarSource {
  id: number;
  name: string;
  code: string;
  source_type: 'official_api' | 'feed' | 'manual_import';
  base_url: string;
  sync_frequency: string;
  status: 'active' | 'syncing' | 'error' | 'idle';
  last_sync_at?: string;
  last_sync_status?: string;
  records_count: number;
  is_active: boolean;
}

export interface Webinar {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  category_id: number;
  category_name?: string;
  source_id: number;
  source_name?: string;
  external_id?: string;
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
  timezone: string;
  registration_deadline?: string;
  speaker_name: string;
  speaker_title?: string;
  speaker_organization?: string;
  organizer_name: string;
  webinar_platform: WebinarPlatform;
  is_free: boolean;
  price_amount?: number;
  currency?: string;
  certificate_available: boolean;
  registration_url: string;
  is_verified: boolean;
  verification_badge?: string;
  status: WebinarStatus;
  tags: string[];
  eligibility_notes?: string;
  target_audience?: string;
  language: string;
  attendance_count?: number;
  is_expired?: boolean;
  is_saved?: boolean;
  user_registration_status?: RegistrationStatus | null;
  similarity_score?: number;
  recommendation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface SavedWebinar {
  id: number;
  user_id: number;
  webinar_id: number;
  notes?: string;
  created_at: string;
  webinar: Webinar;
}

export interface WebinarRegistration {
  id: number;
  user_id: number;
  webinar_id: number;
  status: RegistrationStatus;
  registered_at: string;
  notes?: string;
  updated_at: string;
  webinar: Webinar;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'deadline_warning' | 'starting_soon' | 'recommendation' | 'update' | 'system';
  webinar_id?: number;
  is_read: boolean;
  created_at: string;
}

export interface UserReport {
  id: number;
  user_id: number;
  webinar_id: number;
  report_type: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  admin_notes?: string;
  created_at: string;
  user_name?: string;
  webinar_title?: string;
}

export interface SynchronizationLog {
  id: number;
  source_id: number;
  source_name?: string;
  started_at: string;
  completed_at?: string;
  status: 'success' | 'partial' | 'failed';
  records_fetched: number;
  records_added: number;
  records_updated: number;
  records_skipped: number;
  error_details?: string;
}

export interface SearchFilterState {
  query: string;
  natural_language_mode: boolean;
  category_id?: number;
  start_date?: string;
  end_date?: string;
  deadline_before?: string;
  is_free?: boolean;
  certificate_available?: boolean;
  webinar_platform?: WebinarPlatform;
  organizer?: string;
  include_expired?: boolean;
  sort_by: 'date_asc' | 'date_desc' | 'relevance' | 'deadline';
}

export interface ParsedSearchIntent {
  extracted_topic?: string;
  extracted_price?: 'free' | 'paid';
  extracted_certificate?: boolean;
  extracted_deadline?: string;
  extracted_platform?: string;
  interpretation_summary?: string;
}

export interface UrlPreviewResponse {
  title: string;
  short_description: string;
  full_description: string;
  registration_url: string;
  speaker_name: string;
  speaker_title?: string;
  speaker_organization?: string;
  organizer_name: string;
  webinar_platform: WebinarPlatform;
  is_free: boolean;
  price_amount?: number;
  currency: string;
  certificate_available: boolean;
  category_id: number;
  timezone: string;
  start_time: string;
  end_time: string;
  tags: string[];
  is_duplicate: boolean;
  duplicate_match?: {
    id: number;
    title: string;
    is_verified: boolean;
    status: string;
  };
  is_valid_webinar: boolean;
  validation_message: string;
}

export interface CsvImportSummary {
  total_rows: number;
  records_added: number;
  records_updated: number;
  skipped_duplicates: number;
  skipped_non_webinars: number;
  errors: string[];
}
