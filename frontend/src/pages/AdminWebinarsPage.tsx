import React, { useEffect, useState } from 'react';
import {
  Video,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  X,
  Check,
  Award,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { Webinar, WebinarCategory, WebinarPlatform } from '../types';
import { TableRowSkeleton } from '../components/common/SkeletonLoader';

export const AdminWebinarsPage: React.FC = () => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [pendingWebinars, setPendingWebinars] = useState<Webinar[]>([]);
  const [categories, setCategories] = useState<WebinarCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'verified' | 'pending'>('verified');
  const [isLoading, setIsLoading] = useState(true);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  // In-App Confirmation Modal state (replaces browser confirm dialog)
  const [confirmModal, setConfirmModal] = useState<{
    type: 'delete' | 'reject';
    id: number;
    title: string;
  } | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    full_description: '',
    category_id: 1,
    source_id: 5,
    speaker_name: '',
    speaker_title: '',
    speaker_organization: '',
    organizer_name: '',
    webinar_platform: 'Zoom' as WebinarPlatform,
    start_time: '',
    end_time: '',
    registration_deadline: '',
    timezone: 'UTC+8',
    is_free: true,
    price_amount: 0,
    certificate_available: true,
    registration_url: '',
    tags: 'Computer Science, Webinar',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [wRes, pendingRes, catRes] = await Promise.all([
        api.getWebinars({ include_expired: true }),
        api.adminGetPendingWebinars(),
        api.getCategories(),
      ]);
      setWebinars(wRes.webinars);
      setPendingWebinars(pendingRes);
      setCategories(catRes);
    } catch (e) {
      console.error('Failed to load admin webinars', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    const res = await api.adminApproveWebinar(id);
    if (res) {
      setActionAlert(`✓ Approved "${res.title}"! It is now publicly verified and available to students.`);
      loadData();
    }
  };

  const handleRejectPrompt = (id: number, title: string) => {
    setConfirmModal({ type: 'reject', id, title });
  };

  const handleDeletePrompt = (id: number, title: string) => {
    setConfirmModal({ type: 'delete', id, title });
  };

  const executeConfirmedAction = async () => {
    if (!confirmModal) return;
    const { type, id, title } = confirmModal;
    setConfirmModal(null);
    try {
      if (type === 'delete') {
        await api.adminDeleteWebinar(id);
        setActionAlert(`Webinar "${title}" has been permanently removed.`);
      } else if (type === 'reject') {
        await api.adminRejectWebinar(id);
        setActionAlert(`Webinar "${title}" rejected and removed from pending queue.`);
      }
      loadData();
    } catch (e) {
      console.error('Failed to execute admin action', e);
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    const tomorrow = new Date(Date.now() + 86400000);
    const tomorrowEnd = new Date(Date.now() + 86400000 + 7200000);
    setFormData({
      title: '',
      short_description: '',
      full_description: '',
      category_id: 1,
      source_id: 5,
      speaker_name: '',
      speaker_title: 'Faculty Lead / Industry Speaker',
      speaker_organization: 'University Computing Dept',
      organizer_name: 'WebinarPH Academic Network',
      webinar_platform: 'Zoom',
      start_time: tomorrow.toISOString().slice(0, 16),
      end_time: tomorrowEnd.toISOString().slice(0, 16),
      registration_deadline: tomorrow.toISOString().slice(0, 16),
      timezone: 'UTC+8',
      is_free: true,
      price_amount: 0,
      certificate_available: true,
      registration_url: 'https://zoom.us/webinar/register/test',
      tags: 'Computer Science, Python',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (w: Webinar) => {
    setIsEditing(true);
    setCurrentId(w.id);
    setFormData({
      title: w.title,
      short_description: w.short_description,
      full_description: w.full_description,
      category_id: w.category_id,
      source_id: w.source_id,
      speaker_name: w.speaker_name,
      speaker_title: w.speaker_title || '',
      speaker_organization: w.speaker_organization || '',
      organizer_name: w.organizer_name,
      webinar_platform: w.webinar_platform,
      start_time: new Date(w.start_time).toISOString().slice(0, 16),
      end_time: new Date(w.end_time).toISOString().slice(0, 16),
      registration_deadline: w.registration_deadline ? new Date(w.registration_deadline).toISOString().slice(0, 16) : '',
      timezone: w.timezone,
      is_free: w.is_free,
      price_amount: w.price_amount || 0,
      certificate_available: w.certificate_available,
      registration_url: w.registration_url,
      tags: w.tags.join(', '),
    });
    setModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagList = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);

    if (isEditing && currentId) {
      await api.adminUpdateWebinar(currentId, {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        registration_deadline: formData.registration_deadline ? new Date(formData.registration_deadline).toISOString() : undefined,
        tags: tagList,
      });
    } else {
      const selectedCat = categories.find((c) => c.id === Number(formData.category_id));
      await api.adminAddWebinar({
        ...formData,
        category_name: selectedCat?.name,
        source_name: 'Verified Faculty / Manual Import',
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        registration_deadline: formData.registration_deadline ? new Date(formData.registration_deadline).toISOString() : undefined,
        is_verified: true,
        verification_badge: 'Admin Verified Academic Webinar',
        status: 'upcoming',
        tags: tagList,
        language: 'English',
        attendance_count: 0,
      });
    }

    setModalOpen(false);
    loadData();
  };

  const currentList = activeTab === 'verified' ? webinars : pendingWebinars;

  const filtered = currentList.filter((w) => {
    const matchesCat = selectedCategory ? w.category_id === selectedCategory : true;
    const matchesQ = searchQuery.trim()
      ? w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.speaker_name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCat && matchesQ;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Video className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Webinar Records & Approval Workflow
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review imported external webinars, verify listings, and manage published academic offerings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Webinar Record
        </button>
      </div>

      {/* Action Notification Banner */}
      {actionAlert && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionAlert}</span>
          </div>
          <button
            onClick={() => setActionAlert(null)}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Workflow Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('verified')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'verified'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Active Webinars ({webinars.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Review Queue</span>
          {pendingWebinars.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse">
              {pendingWebinars.length}
            </span>
          )}
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:max-w-md relative">
          <input
            type="text"
            placeholder="Search by title, speaker, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full sm:w-auto text-xs py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Webinar Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Platform & Fee</th>
                <th className="py-3.5 px-4">Source & Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            {isLoading ? (
              <TableRowSkeleton rows={6} columns={6} />
            ) : (
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-300">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      {activeTab === 'pending'
                        ? 'No webinars currently pending review. All imported webinars are verified!'
                        : 'No webinars match the selected filters.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{w.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">Speaker: {w.speaker_name}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {w.category_name}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div>{new Date(w.start_time).toLocaleDateString()}</div>
                      <div className="text-[11px] text-slate-400">{new Date(w.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({w.timezone})</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div>{w.webinar_platform}</div>
                      <div className="text-[11px] font-semibold text-emerald-600">
                        {w.is_free ? 'Free' : `${w.currency} ${w.price_amount}`}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                        {w.source_name || 'Import'}
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase mt-0.5 ${
                        w.is_verified
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {w.is_verified ? 'Verified' : 'Pending Approval'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                      {activeTab === 'pending' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(w.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                            title="Approve webinar for public student discovery"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectPrompt(w.id, w.title)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300 font-bold text-[11px] cursor-pointer"
                            title="Reject imported webinar"
                          >
                            <X className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={() => handleOpenEdit(w)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                            title="Edit details before approval"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenEdit(w)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                            title="Edit listing"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePrompt(w.id, w.title)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                            title="Delete listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Edit Webinar Record' : 'Add New Webinar Record'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Webinar Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Platform</label>
                  <select
                    value={formData.webinar_platform}
                    onChange={(e) => setFormData({ ...formData, webinar_platform: e.target.value as WebinarPlatform })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                  >
                    <option value="Zoom">Zoom</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Webex">Webex</option>
                    <option value="YouTube Live">YouTube Live</option>
                    <option value="BigMarker">BigMarker</option>
                    <option value="ON24">ON24</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Speaker Name</label>
                  <input
                    type="text"
                    value={formData.speaker_name}
                    onChange={(e) => setFormData({ ...formData, speaker_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Organizer / Host</label>
                  <input
                    type="text"
                    value={formData.organizer_name}
                    onChange={(e) => setFormData({ ...formData, organizer_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Registration Deadline</label>
                  <input
                    type="datetime-local"
                    value={formData.registration_deadline}
                    onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Registration URL</label>
                <input
                  type="url"
                  value={formData.registration_url}
                  onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Description (Max 280 chars)</label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                  required
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.is_free}
                    onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Free Registration</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.certificate_available}
                    onChange={(e) => setFormData({ ...formData, certificate_available: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Certificate Provided</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm cursor-pointer"
                >
                  {isEditing ? 'Save Changes' : 'Create Webinar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern In-App Confirmation Modal (Replaces browser confirm popup) */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl flex-shrink-0 ${
                  confirmModal.type === 'delete'
                    ? 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400'
                    : 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                }`}
              >
                {confirmModal.type === 'delete' ? (
                  <Trash2 className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {confirmModal.type === 'delete' ? 'Delete Webinar Listing?' : 'Reject Imported Webinar?'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {confirmModal.type === 'delete'
                    ? `Are you sure you want to permanently remove "${confirmModal.title}" from the database? This action cannot be undone.`
                    : `Are you sure you want to reject "${confirmModal.title}"? It will not be visible to students in the public catalog.`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeConfirmedAction}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition cursor-pointer ${
                  confirmModal.type === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {confirmModal.type === 'delete' ? 'Yes, Delete Record' : 'Yes, Reject Listing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
