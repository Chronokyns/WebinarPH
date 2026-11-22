import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Bookmark,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
  TrendingUp,
  Tag,
  ShieldCheck,
  Video,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Webinar, SavedWebinar, WebinarRegistration, WebinarCategory } from '../types';
import { WebinarCard } from '../components/webinar/WebinarCard';
import { NaturalLanguageSearchBar } from '../components/search/NaturalLanguageSearchBar';

export const StudentDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState<Webinar[]>([]);
  const [upcomingWebinars, setUpcomingWebinars] = useState<Webinar[]>([]);
  const [savedWebinars, setSavedWebinars] = useState<SavedWebinar[]>([]);
  const [trackedRegistrations, setTrackedRegistrations] = useState<WebinarRegistration[]>([]);
  const [categories, setCategories] = useState<WebinarCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [profile]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [cats, recs, allW, saved, tracked] = await Promise.all([
        api.getCategories(),
        api.getRecommendations(profile?.interests || []),
        api.getWebinars({ sort_by: 'date_asc', include_expired: false }),
        api.getSavedWebinars(),
        api.getTrackedRegistrations(),
      ]);

      setCategories(cats);
      setRecommendations(recs.slice(0, 3));
      setUpcomingWebinars(allW.webinars.slice(0, 4));
      setSavedWebinars(saved.slice(0, 3));
      setTrackedRegistrations(tracked);
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const nextRegisteredWebinar = trackedRegistrations.find(
    (r) => r.status === 'registered' && !r.webinar.is_expired
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Welcome & Urgent Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Personalized for {profile?.major || 'Computing & Engineering'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
              You have <span className="font-bold underline">{trackedRegistrations.filter(r => r.status === 'registered').length} active registrations</span> and <span className="font-bold underline">{savedWebinars.length} saved webinars</span>. Explore verified academic webinars tailored to your graduation requirements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/calendar"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-blue-300" />
              View Schedule
            </Link>
            <Link
              to="/explore"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-900 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              Explore All
            </Link>
          </div>
        </div>

        {/* Up Next Registered Webinar Alert Pill (if present) */}
        {nextRegisteredWebinar && (
          <div className="mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white/5 rounded-2xl p-3.5">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <div>
                <span className="text-blue-200 font-medium">Up Next on Your Calendar: </span>
                <span className="font-bold text-white ml-1">{nextRegisteredWebinar.webinar.title}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-blue-200 shrink-0">
              <span className="flex items-center gap-1 font-semibold text-white">
                <Clock className="w-3.5 h-3.5 text-blue-300" />
                {new Date(nextRegisteredWebinar.webinar.start_time).toLocaleDateString()} at{' '}
                {new Date(nextRegisteredWebinar.webinar.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <a
                href={nextRegisteredWebinar.webinar.registration_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] transition-colors"
              >
                Join Webinar
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Search Bar Widget */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 shadow-sm">
        <NaturalLanguageSearchBar onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)} />
      </div>

      {/* 3. AI Personalized Recommendations */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recommended For You
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Based on your major in <span className="font-semibold text-slate-700 dark:text-slate-300">{profile?.major}</span> and chosen interests.
            </p>
          </div>
          <Link
            to="/recommendations"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto shrink-0"
          >
            See all recommendations
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((w) => (
            <WebinarCard
              key={w.id}
              webinar={w}
              onSaveToggle={() => loadDashboardData()}
              onStatusChange={() => loadDashboardData()}
              showRecommendationReason={true}
            />
          ))}
        </div>
      </section>

      {/* 4. Two-Column Layout: Upcoming Webinars & Saved Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upcoming Webinars (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Soonest Upcoming Webinars
            </h2>
            <Link
              to="/explore"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Browse catalog
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upcomingWebinars.map((w) => (
              <WebinarCard
                key={w.id}
                webinar={w}
                onSaveToggle={() => loadDashboardData()}
                onStatusChange={() => loadDashboardData()}
                showRecommendationReason={false}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Bookmarks & Categories (1 col) */}
        <div className="space-y-6">
          
          {/* Saved Bookmarks Preview */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600" />
                Saved Bookmarks ({savedWebinars.length})
              </h3>
              <Link to="/saved" className="text-xs text-blue-600 hover:underline">
                View all
              </Link>
            </div>

            {savedWebinars.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No saved webinars yet. Click bookmark on any webinar to save it!
              </p>
            ) : (
              <div className="space-y-3">
                {savedWebinars.map((s) => (
                  <Link
                    key={s.id}
                    to={`/webinar/${s.webinar_id}`}
                    className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-blue-50 dark:hover:bg-slate-700/40 border border-slate-100 dark:border-slate-700/40 transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-200 line-clamp-1">
                      {s.webinar.title}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                      <span>{new Date(s.webinar.start_time).toLocaleDateString()}</span>
                      <span className="text-blue-600 font-semibold">{s.webinar.webinar_platform}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Browse Categories */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-600" />
              Browse by Subject Area
            </h3>
            <div className="space-y-1.5">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/explore?category=${c.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-[11px] text-slate-400">{c.webinar_count} webinars</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
