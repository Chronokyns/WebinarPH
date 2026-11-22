import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Compass,
  Grid,
  List as ListIcon,
  RotateCcw,
  Sparkles,
  Inbox,
  Filter,
} from 'lucide-react';
import { api } from '../services/api';
import { Webinar, WebinarCategory, SearchFilterState, WebinarPlatform } from '../types';
import { WebinarCard } from '../components/webinar/WebinarCard';
import { WebinarFilterBar } from '../components/webinar/WebinarFilterBar';
import { WebinarGridSkeleton } from '../components/common/SkeletonLoader';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<WebinarCategory[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Parse initial filters from URL search params
  const [filters, setFilters] = useState<SearchFilterState>(() => ({
    query: searchParams.get('q') || '',
    natural_language_mode: false,
    category_id: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
    start_date: searchParams.get('start_date') || undefined,
    end_date: searchParams.get('end_date') || undefined,
    is_free: searchParams.get('is_free') === 'true' ? true : undefined,
    certificate_available: searchParams.get('certificate') === 'true' ? true : undefined,
    webinar_platform: (searchParams.get('platform') as WebinarPlatform) || undefined,
    include_expired: false,
    sort_by: 'date_asc',
  }));

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadWebinars();
  }, [filters]);

  const loadCategories = async () => {
    const cats = await api.getCategories();
    setCategories(cats);
  };

  const loadWebinars = async () => {
    setIsLoading(true);
    try {
      const res = await api.getWebinars(filters);
      setWebinars(res.webinars);
      setTotalCount(res.total);
    } catch (e) {
      console.error('Failed to load webinars', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<SearchFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      natural_language_mode: false,
      sort_by: 'date_asc',
      include_expired: false,
    });
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Explore All Webinars
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover verified academic webinars aggregated from IEEE, ACM, GDSC, and AWS.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <WebinarFilterBar
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={totalCount}
      />

      {/* Active Filters Display & Quick Search Input */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Filter by keyword, speaker, or tag..."
            value={filters.query}
            onChange={(e) => handleFilterChange({ query: e.target.value })}
            className="w-full text-xs py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 self-end sm:self-auto">
          Showing <span className="font-bold text-slate-900 dark:text-white">{webinars.length}</span> verified webinars
        </div>
      </div>

      {/* Results Grid or Empty State */}
      {isLoading ? (
        <WebinarGridSkeleton count={6} />
      ) : webinars.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No webinars matched your criteria</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              Try adjusting your date range, clearing specific filters, or resetting all search conditions.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {webinars.map((w) => (
            <WebinarCard
              key={w.id}
              webinar={w}
              onSaveToggle={() => loadWebinars()}
              onStatusChange={() => loadWebinars()}
              showRecommendationReason={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};
