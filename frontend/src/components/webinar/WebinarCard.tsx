import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Award,
  Video,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { Webinar, RegistrationStatus } from '../../types';
import { api } from '../../services/api';
import { ConflictWarningModal } from './ConflictWarningModal';

interface WebinarCardProps {
  webinar: Webinar;
  onSaveToggle?: (webinarId: number, isSaved: boolean) => void;
  onStatusChange?: (webinarId: number, newStatus: RegistrationStatus) => void;
  isSavedInitial?: boolean;
  registrationStatusInitial?: RegistrationStatus | null;
  showRecommendationReason?: boolean;
}

export const WebinarCard: React.FC<WebinarCardProps> = ({
  webinar,
  onSaveToggle,
  onStatusChange,
  isSavedInitial = false,
  registrationStatusInitial = null,
  showRecommendationReason = true,
}) => {
  const [isSaved, setIsSaved] = useState(isSavedInitial || !!webinar.is_saved);
  const [currentStatus, setCurrentStatus] = useState<RegistrationStatus | null>(
    registrationStatusInitial || webinar.user_registration_status || null
  );
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [conflicts, setConflicts] = useState<Webinar[]>([]);
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'save' | 'register' | null>(null);

  // Format date and time
  const startDate = new Date(webinar.start_time);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Calculate deadline urgency
  let deadlineText = '';
  let isDeadlineUrgent = false;
  if (webinar.registration_deadline) {
    const deadline = new Date(webinar.registration_deadline);
    const diffHours = (deadline.getTime() - Date.now()) / (1000 * 60 * 60);
    if (diffHours > 0 && diffHours < 48) {
      deadlineText = `Deadline: in ${Math.round(diffHours)}h`;
      isDeadlineUrgent = true;
    } else if (diffHours > 0) {
      deadlineText = `Reg until ${deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
  }

  // Handle Save toggle with conflict checking
  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSaved) {
      // Check for schedule conflict before saving
      const detectedConflicts = await api.checkScheduleConflicts(webinar.id);
      if (detectedConflicts.length > 0) {
        setConflicts(detectedConflicts);
        setPendingAction('save');
        setConflictModalOpen(true);
        return;
      }
      executeSave();
    } else {
      await api.unsaveWebinar(webinar.id);
      setIsSaved(false);
      onSaveToggle?.(webinar.id, false);
    }
  };

  const executeSave = async () => {
    await api.saveWebinar(webinar.id);
    setIsSaved(true);
    onSaveToggle?.(webinar.id, true);
  };

  const handleStatusSelect = async (status: RegistrationStatus, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === 'registered') {
      const detectedConflicts = await api.checkScheduleConflicts(webinar.id);
      if (detectedConflicts.length > 0) {
        setConflicts(detectedConflicts);
        setPendingAction('register');
        setConflictModalOpen(true);
        setStatusMenuOpen(false);
        return;
      }
    }

    await api.updateRegistrationStatus(webinar.id, status);
    setCurrentStatus(status);
    setStatusMenuOpen(false);
    onStatusChange?.(webinar.id, status);
  };

  return (
    <>
      <div className={`group relative bg-white dark:bg-slate-800/90 rounded-2xl border transition-all duration-200 hover:shadow-hover flex flex-col justify-between overflow-hidden ${
        webinar.is_expired
          ? 'opacity-75 border-slate-200 dark:border-slate-800 bg-slate-50/50'
          : 'border-slate-200/90 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500'
      }`}>
        
        {/* Card Body */}
        <div className="p-5 pb-3">
          
          {/* Header row: Category, Platform, Price & Bookmark (Clean typography, no pill clutter) */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {webinar.category_name}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Video className="w-3 h-3 text-slate-400" />
                {webinar.webinar_platform}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              {webinar.is_expired ? (
                <span className="font-medium text-slate-400">Expired</span>
              ) : webinar.is_free ? (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Free</span>
              ) : (
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  ${webinar.price_amount} {webinar.currency}
                </span>
              )}
            </div>

            {/* Bookmark button */}
            <button
              onClick={handleSaveClick}
              aria-label={isSaved ? 'Remove from saved' : 'Save webinar'}
              className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                isSaved
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* AI Recommendation Context (Clean inline note, no heavy boxed banner) */}
          {showRecommendationReason && webinar.recommendation_reason && (
            <p className="mb-2.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 shrink-0 text-indigo-500" />
              <span className="truncate">{webinar.recommendation_reason}</span>
            </p>
          )}

          {/* Title with link */}
          <Link to={`/webinar/${webinar.id}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
              {webinar.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {webinar.short_description}
          </p>

          {/* Speaker & Organizer */}
          <div className="mt-3.5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-slate-400 font-medium">By:</span>
              <span className="font-semibold truncate">{webinar.speaker_name}</span>
            </div>
            {webinar.is_verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Date, Time & Metadata Footer */}
        <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-2.5">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{formattedDate}</span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{formattedTime}</span>
            </div>

            {/* Certificate indicator (Clean, no heavy pill) */}
            {webinar.certificate_available && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Certificate</span>
              </span>
            )}
          </div>

          {/* Deadline alert if urgent */}
          {deadlineText && (
            <div className={`mb-3 text-[11px] flex items-center gap-1 font-medium ${
              isDeadlineUrgent ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
            }`}>
              {isDeadlineUrgent && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
              <span>{deadlineText}</span>
            </div>
          )}

          {/* Action Row: Status Tracker & View Details */}
          <div className="flex items-center justify-between gap-2 pt-1">
            
            {/* Status Dropdown Tracker */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setStatusMenuOpen(!statusMenuOpen);
                }}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  currentStatus === 'registered'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : currentStatus === 'interested'
                    ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300'
                    : currentStatus === 'attended'
                    ? 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {currentStatus ? currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1) : 'Track Status'}
              </button>

              {/* Status options dropdown */}
              {statusMenuOpen && (
                <div className="absolute left-0 bottom-full mb-1 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-30 animate-in fade-in duration-100">
                  {(['interested', 'registered', 'attended', 'missed', 'cancelled'] as RegistrationStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={(e) => handleStatusSelect(st, e)}
                      className={`w-full text-left px-3 py-1.5 text-xs capitalize hover:bg-slate-50 dark:hover:bg-slate-700/60 ${
                        currentStatus === st ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Details Link */}
            <Link
              to={`/webinar/${webinar.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group-hover:translate-x-0.5 transition-transform"
            >
              Details
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Conflict Alert Modal */}
      <ConflictWarningModal
        isOpen={conflictModalOpen}
        onClose={() => setConflictModalOpen(false)}
        onConfirm={() => {
          if (pendingAction === 'save') executeSave();
          if (pendingAction === 'register') {
            api.updateRegistrationStatus(webinar.id, 'registered');
            setCurrentStatus('registered');
            onStatusChange?.(webinar.id, 'registered');
          }
        }}
        targetWebinar={webinar}
        conflictingWebinars={conflicts}
        actionLabel={pendingAction === 'register' ? 'Register Anyway' : 'Save Anyway'}
      />
    </>
  );
};
