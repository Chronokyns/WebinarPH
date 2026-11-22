import React, { useEffect, useState } from 'react';
import {
  FileText,
  CheckCircle,
  XCircle,
  Flag,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { SynchronizationLog, UserReport } from '../types';

export const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SynchronizationLog[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [activeTab, setActiveTab] = useState<'logs' | 'reports'>('logs');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [lRes, rRes] = await Promise.all([
        api.adminGetSyncLogs(),
        api.adminGetReports(),
      ]);
      setLogs(lRes);
      setReports(rRes);
    } catch (e) {
      console.error('Failed to load logs', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveReport = async (reportId: number, status: 'resolved' | 'dismissed') => {
    await api.adminResolveReport(reportId, status, 'Reviewed and verified by Administrator.');
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          Audit Logs & Student Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review automated platform synchronization runs and address student-reported data discrepancies.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'logs'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Synchronization Audit Logs ({logs.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
            activeTab === 'reports'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Student Discrepancy Reports ({reports.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'logs' ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Data Source Feed</th>
                  <th className="py-3.5 px-4">Fetched</th>
                  <th className="py-3.5 px-4">Added</th>
                  <th className="py-3.5 px-4">Updated</th>
                  <th className="py-3.5 px-4">Skipped (Dupes)</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {new Date(log.started_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {log.source_name}
                    </td>
                    <td className="py-3 px-4 font-bold">{log.records_fetched}</td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">+{log.records_added}</td>
                    <td className="py-3 px-4 text-blue-600 font-semibold">{log.records_updated}</td>
                    <td className="py-3 px-4 text-slate-400">{log.records_skipped}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Reports Table */
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">Webinar / Issue</th>
                  <th className="py-3.5 px-4">Reported By</th>
                  <th className="py-3.5 px-4">Report Details</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{rep.webinar_title}</div>
                      <div className="text-[11px] font-semibold text-amber-600">{rep.report_type}</div>
                    </td>
                    <td className="py-3.5 px-4">{rep.user_name}</td>
                    <td className="py-3.5 px-4 max-w-sm text-slate-600 dark:text-slate-300">
                      "{rep.description}"
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rep.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        {rep.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {rep.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleResolveReport(rep.id, 'resolved')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px]"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleResolveReport(rep.id, 'dismissed')}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-[11px]"
                          >
                            Dismiss
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Action Taken</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
