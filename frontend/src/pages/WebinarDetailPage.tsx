import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Award,
  Video,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Building,
  User,
  Share2,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Globe,
  Tag,
  Flag,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { Webinar, RegistrationStatus } from '../types';
import { ConflictWarningModal } from '../components/webinar/ConflictWarningModal';

export const WebinarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [similarWebinars, setSimilarWebinars] = useState<Webinar[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<RegistrationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Conflict modal state
  const [conflicts, setConflicts] = useState<Webinar[]>([]);
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'save' | 'register' | null>(null);

  // Report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Incorrect Time or Date');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      loadWebinarData(Number(id));
    }
  }, [id]);

  const loadWebinarData = async (webinarId: number) => {
    setIsLoading(true);
    try {
      const data = await api.getWebinarById(webinarId);
      if (data) {
        setWebinar(data);
        setIsSaved(!!data.is_saved);
        setCurrentStatus(data.user_registration_status || null);

        // Fetch similar webinars from same category
        const catalog = await api.getWebinars({ category_id: data.category_id });
        setSimilarWebinars(catalog.webinars.filter((w) => w.id !== data.id).slice(0, 3));
      }
    } catch (e) {
      console.error('Failed to load webinar', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!webinar) return;

    if (!isSaved) {
      const detectedConflicts = await api.checkScheduleConflicts(webinar.id);
      if (detectedConflicts.length > 0) {
        setConflicts(detectedConflicts);
        setPendingAction('save');
        setConflictModalOpen(true);
        return;
      }
      await api.saveWebinar(webinar.id);
      setIsSaved(true);
    } else {
      await api.unsaveWebinar(webinar.id);
      setIsSaved(false);
    }
  };

  const handleStatusChange = async (newStatus: RegistrationStatus) => {
    if (!webinar) return;

    if (newStatus === 'registered') {
      const detectedConflicts = await api.checkScheduleConflicts(webinar.id);
      if (detectedConflicts.length > 0) {
        setConflicts(detectedConflicts);
        setPendingAction('register');
        setConflictModalOpen(true);
        return;
      }
    }

    await api.updateRegistrationStatus(webinar.id, newStatus);
    setCurrentStatus(newStatus);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webinar) return;
    await api.submitReport(webinar.id, reportReason, reportDetails);
    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSubmitted(false);
      setReportDetails('');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading verified webinar information...</p>
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Webinar not found</h2>
        <p className="text-xs text-slate-500">The requested webinar listing may have expired or been removed.</p>
        <Link to="/explore" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Back to Explore
        </Link>
      </div>
    );
  }

  const startDate = new Date(webinar.start_time);
  const endDate = new Date(webinar.end_time);
  const deadline = webinar.registration_deadline ? new Date(webinar.registration_deadline) : null;
  const isPast = webinar.is_expired;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Header Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                {webinar.category_name}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                <Video className="w-3.5 h-3.5 text-slate-500" />
                {webinar.webinar_platform}
              </span>
              {webinar.is_free ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  Free Student Registration
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                  ${webinar.price_amount} {webinar.currency}
                </span>
              )}
              {webinar.certificate_available && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                  <Award className="w-3.5 h-3.5" />
                  Certificate Included
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {webinar.title}
            </h1>

            {/* Speaker & Host Row */}
            <div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                  {webinar.speaker_name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{webinar.speaker_name}</div>
                  <div className="text-[11px] text-slate-400">{webinar.speaker_title || 'Guest Speaker'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{webinar.organizer_name}</div>
                  <div className="text-[11px] text-slate-400">{webinar.speaker_organization || 'Academic Institution'}</div>
                </div>
              </div>
            </div>

            {/* Overview & Description */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Webinar Overview
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {webinar.full_description}
              </p>
            </div>

            {/* Eligibility & Target Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  Target Student Audience
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {webinar.target_audience || 'Undergraduate & graduate STEM students'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/60">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                  Certificate & Eligibility
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {webinar.eligibility_notes || 'Available for students who attend live and complete verification.'}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Related Concepts & Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {webinar.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Source Information & Report */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>Aggregated Source: <strong className="text-slate-600 dark:text-slate-300">{webinar.source_name || 'Official Feed'}</strong></span>
                {webinar.external_id && <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{webinar.external_id}</span>}
              </div>

              <button
                onClick={() => setReportModalOpen(true)}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Flag className="w-3.5 h-3.5" />
                Report Inaccurate Listing
              </button>
            </div>
          </div>

          {/* Similar Webinars from this category */}
          {similarWebinars.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Other Webinars in {webinar.category_name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similarWebinars.map((sw) => (
                  <Link
                    key={sw.id}
                    to={`/webinar/${sw.id}`}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                      {sw.title}
                    </div>
                    <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{new Date(sw.start_time).toLocaleDateString()}</span>
                      <span className="text-blue-600 font-semibold">{sw.is_free ? 'Free' : `$${sw.price_amount}`}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Action Card & Schedule Widget */}
        <div className="space-y-6">
          
          <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-card space-y-6">
            
            {/* Price & Verification */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Registration Fee</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {webinar.is_free ? 'FREE' : `$${webinar.price_amount} ${webinar.currency}`}
                </div>
              </div>

              {webinar.is_verified && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Webinar
                </div>
              )}
            </div>

            {/* Date & Time Highlights */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {startDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({webinar.timezone})
                  </div>
                </div>
              </div>

              {deadline && (
                <div className="flex items-start gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <Clock className="w-4 h-4 text-amber-500 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-800 dark:text-amber-300">
                      Registration Deadline
                    </div>
                    <div className="text-amber-700 dark:text-amber-400">
                      {deadline.toLocaleDateString()} at {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button: Official External Link */}
            <div className="space-y-2">
              <a
                href={webinar.registration_url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all text-center"
              >
                <span>Register on Official Platform</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <p className="text-[11px] text-slate-400 text-center">
                Registration occurs securely through {webinar.organizer_name}'s official portal.
              </p>
            </div>

            {/* Bookmark & Tracking Status */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
              <button
                type="button"
                onClick={handleSaveToggle}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-2 ${
                  isSaved
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved to Bookmarks' : 'Save / Bookmark Webinar'}
              </button>

              {/* Attendance Status Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Track Your Participation Status:
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {(['interested', 'registered', 'attended', 'cancelled'] as RegistrationStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`py-1.5 px-2 rounded-lg font-medium capitalize border text-center transition-colors ${
                        currentStatus === st
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Conflict Warning Indicator (if detected) */}
            <div className="pt-2">
              <Link
                to="/calendar"
                className="text-xs font-medium text-blue-600 hover:underline flex items-center justify-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                View in Your Personal Calendar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Conflict Warning Modal */}
      <ConflictWarningModal
        isOpen={conflictModalOpen}
        onClose={() => setConflictModalOpen(false)}
        onConfirm={() => {
          if (pendingAction === 'save') {
            api.saveWebinar(webinar.id);
            setIsSaved(true);
          }
          if (pendingAction === 'register') {
            api.updateRegistrationStatus(webinar.id, 'registered');
            setCurrentStatus('registered');
          }
        }}
        targetWebinar={webinar}
        conflictingWebinars={conflicts}
        actionLabel={pendingAction === 'register' ? 'Register Anyway' : 'Save Anyway'}
      />

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flag className="w-4 h-4 text-red-500" />
              Report Inaccurate Listing
            </h3>
            
            {reportSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">Report Submitted</p>
                <p className="text-xs text-slate-500">Thank you! Administrators will review this listing.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Issue Category
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                  >
                    <option value="Incorrect Time or Date">Incorrect Time or Date</option>
                    <option value="Broken Registration Link">Broken Registration Link</option>
                    <option value="Webinar Cancelled by Organizer">Webinar Cancelled by Organizer</option>
                    <option value="Wrong Category or Topics">Wrong Category or Topics</option>
                    <option value="Other Issue">Other Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Details / Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide details about what changed or what is inaccurate..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
