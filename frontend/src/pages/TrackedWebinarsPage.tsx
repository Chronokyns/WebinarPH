import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  FileCheck,
  Award,
  Video,
  ExternalLink,
  Edit2,
  Inbox,
} from 'lucide-react';
import { api } from '../services/api';
import { WebinarRegistration, RegistrationStatus } from '../types';

export const TrackedWebinarsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<WebinarRegistration[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Edit notes state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTrackedRegistrations();
      setRegistrations(data);
    } catch (e) {
      console.error('Failed to load tracked registrations', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (webinarId: number, newStatus: RegistrationStatus) => {
    await api.updateRegistrationStatus(webinarId, newStatus);
    loadRegistrations();
  };

  const handleSaveNotes = async (webinarId: number) => {
    await api.updateRegistrationStatus(webinarId, 'registered', noteText);
    setEditingId(null);
    loadRegistrations();
  };

  const filtered = activeTab === 'all'
    ? registrations
    : registrations.filter((r) => r.status === activeTab);

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'registered':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">Registered</span>;
      case 'interested':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">Interested</span>;
      case 'attended':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">Attended (Completed)</span>;
      case 'missed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">Missed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">Cancelled</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          My Tracked Webinars
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor your registration journey from initial interest to confirmed academic attendance.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { key: 'all', label: 'All Tracked', count: registrations.length },
          { key: 'registered', label: 'Registered', count: registrations.filter(r => r.status === 'registered').length },
          { key: 'interested', label: 'Interested', count: registrations.filter(r => r.status === 'interested').length },
          { key: 'attended', label: 'Attended', count: registrations.filter(r => r.status === 'attended').length },
          { key: 'missed', label: 'Missed', count: registrations.filter(r => r.status === 'missed').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading tracking history...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No tracked webinars in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Change your filter or browse explore to start tracking participation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const w = item.webinar;
            const startDate = new Date(w.start_time);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    <span className="text-[11px] text-slate-400">
                      Tracked since {new Date(item.registered_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="text-[11px] font-semibold text-slate-400">Update Status:</span>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(w.id, e.target.value as RegistrationStatus)}
                      className="text-xs py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-semibold"
                    >
                      <option value="interested">Interested</option>
                      <option value="registered">Registered</option>
                      <option value="attended">Attended</option>
                      <option value="missed">Missed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link to={`/webinar/${w.id}`}>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600">
                      {w.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({w.timezone})
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" />
                      {w.webinar_platform}
                    </span>
                    {w.certificate_available && (
                      <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                        <Award className="w-3.5 h-3.5" />
                        Certificate Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Notes section for student semester submission */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-start justify-between gap-4">
                  {editingId === item.id ? (
                    <div className="w-full flex items-center gap-2">
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add personal notes e.g. Submitted proof for CS401 module"
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                      />
                      <button
                        onClick={() => handleSaveNotes(w.id)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shrink-0"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1.5 text-slate-400 text-xs shrink-0"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full text-xs text-slate-500">
                      <span className="italic">
                        {item.notes ? `Note: "${item.notes}"` : 'No personal verification notes added.'}
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setNoteText(item.notes || '');
                        }}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                      >
                        <Edit2 className="w-3 h-3" />
                        {item.notes ? 'Edit Note' : 'Add Note'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
