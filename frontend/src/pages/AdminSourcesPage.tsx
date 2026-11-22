import React, { useEffect, useState } from 'react';
import {
  Globe,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Database,
  ExternalLink,
  ShieldCheck,
  Upload,
  Link as LinkIcon,
  FileSpreadsheet,
  Download,
  AlertCircle,
  Sparkles,
  Check,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { WebinarSource, SynchronizationLog, UrlPreviewResponse, CsvImportSummary } from '../types';

export const AdminSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<WebinarSource[]>([]);
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const [latestSyncResult, setLatestSyncResult] = useState<SynchronizationLog | null>(null);

  // Assisted Import Suite States
  const [importMode, setImportMode] = useState<'url' | 'csv'>('url');
  
  // URL Import State
  const [inputUrl, setInputUrl] = useState('');
  const [selectedSourceId, setSelectedSourceId] = useState<number>(7); // Default NIST NICE or ROC.PH
  const [isInspecting, setIsInspecting] = useState(false);
  const [previewResult, setPreviewResult] = useState<UrlPreviewResponse | null>(null);
  const [inspectError, setInspectError] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // CSV Import State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvSourceId, setCsvSourceId] = useState<number>(5);
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);
  const [csvSummary, setCsvSummary] = useState<CsvImportSummary | null>(null);
  const [csvError, setCsvError] = useState('');

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    const data = await api.getSources();
    setSources(data);
    if (data.length > 0 && !selectedSourceId) {
      setSelectedSourceId(data[0].id);
    }
  };

  const handleSync = async (sourceId: number) => {
    setSyncingId(sourceId);
    setLatestSyncResult(null);
    try {
      const log = await api.adminTriggerSync(sourceId);
      setLatestSyncResult(log);
      loadSources();
    } catch (e) {
      console.error('Sync failed', e);
    } finally {
      setSyncingId(null);
    }
  };

  const handleInspectUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsInspecting(true);
    setInspectError('');
    setPreviewResult(null);
    setSaveSuccessMsg('');

    try {
      const preview = await api.adminPreviewUrl(inputUrl.trim());
      setPreviewResult(preview);
    } catch (err: any) {
      setInspectError(err.message || 'Failed to inspect webinar URL. Please verify the link.');
    } finally {
      setIsInspecting(false);
    }
  };

  const handleSaveImportedWebinar = async (autoApprove: boolean) => {
    if (!previewResult) return;
    setIsSaving(true);
    try {
      const payload = {
        title: previewResult.title,
        short_description: previewResult.short_description,
        full_description: previewResult.full_description,
        category_id: previewResult.category_id || 1,
        source_id: selectedSourceId,
        speaker_name: previewResult.speaker_name,
        speaker_title: previewResult.speaker_title || 'Faculty Lead / Industry Speaker',
        speaker_organization: previewResult.speaker_organization || previewResult.organizer_name,
        organizer_name: previewResult.organizer_name,
        webinar_platform: previewResult.webinar_platform,
        start_time: previewResult.start_time,
        end_time: previewResult.end_time,
        timezone: previewResult.timezone,
        is_free: previewResult.is_free,
        price_amount: previewResult.price_amount || 0,
        currency: previewResult.currency || 'USD',
        certificate_available: previewResult.certificate_available,
        registration_url: previewResult.registration_url,
        tags: previewResult.tags.length > 0 ? previewResult.tags : ['Webinar', previewResult.organizer_name],
      };

      await api.adminSaveUrlImport(payload, autoApprove);
      setSaveSuccessMsg(
        autoApprove
          ? '✓ Webinar saved and verified immediately for students!'
          : '✓ Webinar saved to Pending Review queue for administrator verification.'
      );
      setPreviewResult(null);
      setInputUrl('');
      loadSources();
    } catch (err: any) {
      setInspectError(err.message || 'Failed to save webinar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;

    setIsUploadingCsv(true);
    setCsvError('');
    setCsvSummary(null);

    try {
      const summary = await api.adminImportCsv(csvFile, csvSourceId);
      setCsvSummary(summary);
      setCsvFile(null);
      loadSources();
    } catch (err: any) {
      setCsvError(err.message || 'Failed to import CSV file');
    } finally {
      setIsUploadingCsv(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent =
      'title,short_description,full_description,webinar_platform,registration_url,start_time,end_time,timezone,speaker_name,speaker_title,speaker_organization,organizer_name,is_free,certificate_available,category_slug,tags\n' +
      'AI Threat Hunting and Forensics,Hands-on virtual lab on automated SOC triage,Comprehensive technical webinar analyzing automated threat detection and telemetry pipelines.,Zoom,https://zoom.us/webinar/register/WN_sample01,2026-12-05 14:00:00,2026-12-05 16:00:00,UTC+8,Elena Rostova,Senior SOC Lead,SIGSAC Security,ACM Student Chapter,true,true,cybersecurity,"AI,Threat Hunting,SOC,Certificate"\n' +
      'Microservices Deployment with Kubernetes,Best practices in container orchestration,Learn container scaling ingress controllers and Prometheus observability for student projects.,Microsoft Teams,https://teams.microsoft.com/registration/sample02,2026-12-12 10:00:00,2026-12-12 12:00:00,UTC+8,Dr. Marcus Vance,Cloud Architect,IEEE Computer Society,IEEE Computer Society,true,true,cloud-devops,"Kubernetes,Docker,Cloud,Certificate"\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'webinarph_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Globe className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          Webinar Data Collection & Import System
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Centralized collection hub managing automated source synchronization, duplicate detection, and admin-assisted URL / CSV imports. All imported records follow strict webinar validation criteria.
        </p>
      </div>

      {/* Sync result alert notification */}
      {latestSyncResult && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Synchronization complete!</strong> Processed {latestSyncResult.records_fetched} records ({latestSyncResult.records_added} new added, {latestSyncResult.records_updated} updated, {latestSyncResult.records_skipped} duplicate skipped).
            </span>
          </div>
          <button
            onClick={() => setLatestSyncResult(null)}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Admin Assisted Import Suite */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/80 pb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Requirements 3, 4, 6 & 10
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              Admin-Assisted Webinar Import Suite
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Used when sources do not offer public APIs (e.g. KnowBe4, Gartner, ISACA, AllAI, Techstrong).
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => {
                setImportMode('url');
                setPreviewResult(null);
                setInspectError('');
                setSaveSuccessMsg('');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                importMode === 'url'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Import by URL</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setImportMode('csv');
                setCsvSummary(null);
                setCsvError('');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                importMode === 'csv'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Upload CSV File</span>
            </button>
          </div>
        </div>

        {/* Tab 1: URL Import */}
        {importMode === 'url' && (
          <div className="space-y-6">
            <form onSubmit={handleInspectUrl} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Webinar Page / Registration URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      placeholder="e.g. https://www.knowbe4.com/webinar-library/... or https://roc.ph/webinars/..."
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="w-full py-2.5 pl-9 pr-4 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
                    />
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Source Attribution
                  </label>
                  <select
                    value={selectedSourceId}
                    onChange={(e) => setSelectedSourceId(Number(e.target.value))}
                    className="w-full py-2.5 px-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white"
                  >
                    {sources.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-slate-400">
                  Parses OpenGraph, metadata, validates online platform, and checks duplicate registration links.
                </p>
                <button
                  type="submit"
                  disabled={isInspecting || !inputUrl.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  {isInspecting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Inspecting Webpage...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Inspect & Preview</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Error Message */}
            {inspectError && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{inspectError}</span>
              </div>
            )}

            {/* Success Message */}
            {saveSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Preview Card */}
            {previewResult && (
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Extracted Webinar Inspection Preview
                    </span>
                    {previewResult.is_valid_webinar ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Valid Online Webinar
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {previewResult.validation_message}
                      </span>
                    )}
                  </div>

                  {previewResult.is_duplicate && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Duplicate Detected (Webinar #{previewResult.duplicate_match?.id})
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Title:</span>
                    <p className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                      {previewResult.title}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Organizer / Host:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {previewResult.organizer_name} ({previewResult.webinar_platform})
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-400 font-medium">Description:</span>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {previewResult.short_description}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Certificate Availability:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {previewResult.certificate_available ? '✓ Verified Certificate Available' : 'No certificate stated'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Registration Link:</span>
                    <a
                      href={previewResult.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-blue-600 hover:underline block truncate mt-0.5"
                    >
                      {previewResult.registration_url}
                    </a>
                  </div>
                </div>

                {/* Save Buttons */}
                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => handleSaveImportedWebinar(false)}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Save for Review (Pending Verification)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveImportedWebinar(true)}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save & Approve Immediately</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: CSV Bulk Import */}
        {importMode === 'csv' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-blue-900 dark:text-blue-300">
                  Standardized Webinar CSV Import Template
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  Expected fields: <code>title, short_description, webinar_platform, registration_url, start_time, organizer_name, is_free, certificate_available</code>.
                </p>
              </div>
              <button
                type="button"
                onClick={downloadSampleCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-200 dark:border-blue-800 hover:bg-blue-50 transition-colors shadow-xs cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV</span>
              </button>
            </div>

            <form onSubmit={handleCsvUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Assign Source Attribution
                  </label>
                  <select
                    value={csvSourceId}
                    onChange={(e) => setCsvSourceId(Number(e.target.value))}
                    className="w-full py-2.5 px-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {sources.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Select CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    required
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-slate-800 dark:file:text-blue-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUploadingCsv || !csvFile}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingCsv ? 'Parsing & Normalizing...' : 'Upload & Process CSV'}</span>
                </button>
              </div>
            </form>

            {/* CSV Error */}
            {csvError && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{csvError}</span>
              </div>
            )}

            {/* CSV Summary */}
            {csvSummary && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-200 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>CSV Import Finished — Processing Summary</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    <div className="text-lg font-extrabold text-blue-600">{csvSummary.total_rows}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Rows Processed</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    <div className="text-lg font-extrabold text-emerald-600">+{csvSummary.records_added}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Staged for Review</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    <div className="text-lg font-extrabold text-amber-600">{csvSummary.skipped_duplicates}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Duplicate Skipped</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
                    <div className="text-lg font-extrabold text-purple-600">{csvSummary.skipped_non_webinars}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Physical Excluded</div>
                  </div>
                </div>

                {csvSummary.errors.length > 0 && (
                  <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px] space-y-1">
                    <span className="font-bold">Import Warnings / Validation Skips:</span>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {csvSummary.errors.slice(0, 5).map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid of Sources (Investigation Sources + Legacy Sources) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Configured Webinar Data Sources ({sources.length})
          </h2>
          <span className="text-xs text-slate-400">
            Automated collectors poll per schedule; manual sources accept URL & CSV imports.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sources.map((src) => {
            const isSyncing = syncingId === src.id;
            const isAutomated = src.source_type === 'feed' || src.source_type === 'official_api';

            return (
              <div
                key={src.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 p-6 shadow-sm hover:shadow-card transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      <Database className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        src.source_type === 'feed'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                          : src.source_type === 'official_api'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {src.source_type === 'manual_import' ? 'Assisted Import' : src.source_type.replace('_', ' ')}
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        src.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : src.status === 'error'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {src.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {src.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                      code: {src.code} • {src.base_url}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Collection Cadence:</span>
                      <span className="font-semibold">{src.sync_frequency}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Webinars in Database:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{src.records_count} stored</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Last Sync / Import:</span>
                      <span>{src.last_sync_at ? new Date(src.last_sync_at).toLocaleTimeString() : 'Never'}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 truncate">
                      {src.last_sync_status || 'Configured & Ready'}
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => handleSync(src.id)}
                    disabled={isSyncing}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Synchronizing...' : isAutomated ? 'Execute Collector Sync' : 'Check Source Status'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
