import React from 'react';
import {
  Filter,
  RotateCcw,
  Calendar,
  Award,
  DollarSign,
  Video,
  ArrowUpDown,
  Tag,
} from 'lucide-react';
import { WebinarCategory, WebinarPlatform, SearchFilterState } from '../../types';

interface WebinarFilterBarProps {
  categories: WebinarCategory[];
  filters: SearchFilterState;
  onFilterChange: (newFilters: Partial<SearchFilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

const PLATFORMS: WebinarPlatform[] = [
  'Zoom',
  'Google Meet',
  'Microsoft Teams',
  'Webex',
  'YouTube Live',
];

export const WebinarFilterBar: React.FC<WebinarFilterBarProps> = ({
  categories,
  filters,
  onFilterChange,
  onReset,
  totalResults,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 shadow-sm space-y-4">
      
      {/* Top row: Categories pills */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            Categories & Topics
          </label>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {totalResults} {totalResults === 1 ? 'webinar' : 'webinars'} found
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onFilterChange({ category_id: undefined })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              !filters.category_id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onFilterChange({ category_id: cat.id })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filters.category_id === cat.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Second row: Detailed multi-faceted filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
        
        {/* Date Range Start */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            From Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => onFilterChange({ start_date: e.target.value || undefined })}
              className="w-full text-xs py-1.5 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Date Range End */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            To Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) => onFilterChange({ end_date: e.target.value || undefined })}
              className="w-full text-xs py-1.5 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Platform Dropdown */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Platform
          </label>
          <select
            value={filters.webinar_platform || ''}
            onChange={(e) => onFilterChange({ webinar_platform: (e.target.value as WebinarPlatform) || undefined })}
            className="w-full text-xs py-1.5 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Any Platform</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Sort By
          </label>
          <select
            value={filters.sort_by}
            onChange={(e) => onFilterChange({ sort_by: e.target.value as any })}
            className="w-full text-xs py-1.5 px-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="date_asc">Webinar Date: Earliest First</option>
            <option value="date_desc">Webinar Date: Latest First</option>
            <option value="deadline">Registration Deadline Soonest</option>
            <option value="relevance">Relevance / Popularity</option>
          </select>
        </div>

        {/* Reset & Quick Toggles */}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => onFilterChange({ is_free: filters.is_free === true ? undefined : true })}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1 ${
              filters.is_free === true
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Free Only
          </button>

          <button
            type="button"
            onClick={() => onFilterChange({ certificate_available: filters.certificate_available === true ? undefined : true })}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1 ${
              filters.certificate_available === true
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Cert Only
          </button>

          <button
            type="button"
            onClick={onReset}
            title="Reset all filters"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
