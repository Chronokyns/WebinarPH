import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Video,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Plus,
  Shield,
  Activity,
  ArrowRight,
  CheckCircle2,
  Globe,
  Flag,
  Clock,
} from 'lucide-react';
import { api } from '../services/api';
import { WebinarSource, SynchronizationLog, UserReport } from '../types';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    total_students: 5,
    total_webinars: 11,
    upcoming_webinars: 10,
    expired_webinars: 1,
    active_sources: 4,
    pending_reports: 1,
  });

  const [sources, setSources] = useState<WebinarSource[]>([]);
  const [recentLogs, setRecentLogs] = useState<SynchronizationLog[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [isSyncing, setIsSyncing] = useState<number | null>(null);

  useEffect(() => {
    loadAdminOverview();
  }, []);

  const loadAdminOverview = async () => {
    try {
      const [srcs, logs, reps, webins, studs] = await Promise.all([
        api.getSources(),
        api.adminGetSyncLogs(),
        api.adminGetReports(),
        api.getWebinars({ include_expired: true }),
        api.adminGetStudents(),
      ]);

      setSources(srcs);
      setRecentLogs(logs.slice(0, 4));
      setReports(reps);

      const expiredCount = webins.webinars.filter((w) => w.is_expired).length;
      setMetrics({
        total_students: studs.length,
        total_webinars: webins.total,
        upcoming_webinars: webins.total - expiredCount,
        expired_webinars: expiredCount,
        active_sources: srcs.filter((s) => s.status === 'active').length,
        pending_reports: reps.filter((r) => r.status === 'pending').length,
      });
    } catch (e) {
      console.error('Failed to load admin overview', e);
    }
  };

  const handleManualSync = async (sourceId: number) => {
    setIsSyncing(sourceId);
    try {
      await api.adminTriggerSync(sourceId);
      await loadAdminOverview();
    } catch (e) {
      console.error('Sync failed', e);
    } finally {
      setIsSyncing(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Control Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            System Overview & Metrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor verified webinars, manage student accounts, and oversee automated platform feeds.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            to="/admin/webinars"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Webinar
          </Link>
          <Link
            to="/admin/sources"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Data Sources
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{metrics.total_students}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">Active Accounts</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Catalog</span>
            <Video className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{metrics.total_webinars}</div>
          <div className="text-[10px] text-slate-400 mt-1">Total Webinars</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Upcoming</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{metrics.upcoming_webinars}</div>
          <div className="text-[10px] text-slate-400 mt-1">Open Registration</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Expired</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-500">{metrics.expired_webinars}</div>
          <div className="text-[10px] text-slate-400 mt-1">Archived for Proof</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Feeds</span>
            <Globe className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600">{metrics.active_sources}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">Syncing Healthy</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Reports</span>
            <Flag className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-600">{metrics.pending_reports}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-1">Needs Review</div>
        </div>
      </div>

      {/* Main Grid: Data Feeds Monitor & Recent Sync Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Data Sources Health Monitor */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              External Feed Health & Synchronization
            </h2>
            <Link to="/admin/sources" className="text-xs font-semibold text-blue-600 hover:underline">
              Manage All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {sources.map((src) => (
              <div key={src.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{src.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Last Sync: {src.last_sync_at ? new Date(src.last_sync_at).toLocaleTimeString() : 'Never'} • {src.records_count} webinars stored
                  </div>
                </div>

                <button
                  onClick={() => handleManualSync(src.id)}
                  disabled={isSyncing === src.id}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing === src.id ? 'animate-spin text-blue-600' : ''}`} />
                  <span>{isSyncing === src.id ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Synchronization Audit Logs */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Recent Aggregation Logs
            </h2>
            <Link to="/admin/logs" className="text-xs font-semibold text-blue-600 hover:underline">
              View Audit History
            </Link>
          </div>

          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{log.source_name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {log.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Fetched: <strong>{log.records_fetched}</strong></span>
                  <span>Added: <strong>{log.records_added}</strong></span>
                  <span>Updated: <strong>{log.records_updated}</strong></span>
                  <span>Skipped: <strong>{log.records_skipped}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
