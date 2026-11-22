import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Calendar,
  Clock,
  Trash2,
  ExternalLink,
  Inbox,
  Video,
  Award,
  Edit3,
} from 'lucide-react';
import { api } from '../services/api';
import { SavedWebinar } from '../types';

export const SavedWebinarsPage: React.FC = () => {
  const [savedWebinars, setSavedWebinars] = useState<SavedWebinar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSavedWebinars();
      setSavedWebinars(data);
    } catch (e) {
      console.error('Failed to load saved webinars', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (webinarId: number) => {
    await api.unsaveWebinar(webinarId);
    setSavedWebinars((prev) => prev.filter((s) => s.webinar_id !== webinarId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bookmark className="w-7 h-7 text-blue-600 dark:text-blue-400 fill-current" />
            Saved Webinars ({savedWebinars.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bookmarked webinars you plan to attend or use for coursework requirements.
          </p>
        </div>

        <Link
          to="/calendar"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-colors self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          View on Calendar
        </Link>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading your bookmarked webinars...</p>
        </div>
      ) : savedWebinars.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">You have no saved webinars yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              Browse webinars and click the bookmark icon on any card to save it for easy access.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedWebinars.map((item) => {
            const w = item.webinar;
            const startDate = new Date(w.start_time);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-5 shadow-sm hover:shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      {w.category_name}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                      <Video className="w-3 h-3 text-slate-500" />
                      {w.webinar_platform}
                    </span>
                    {w.is_free ? (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Free
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                        ${w.price_amount}
                      </span>
                    )}
                    {w.certificate_available && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Certificate
                      </span>
                    )}
                  </div>

                  <Link to={`/webinar/${w.id}`}>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors">
                      {w.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>By: <strong className="text-slate-700 dark:text-slate-300">{w.speaker_name}</strong></span>
                  </div>

                  {item.notes && (
                    <div className="text-xs bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 italic">
                      "Note: {item.notes}"
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <a
                    href={w.registration_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    <span>Register</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    to={`/webinar/${w.id}`}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors"
                  >
                    Details
                  </Link>

                  <button
                    onClick={() => handleRemove(w.id)}
                    title="Remove bookmark"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
