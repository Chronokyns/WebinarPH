import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Filter,
  Inbox,
  RotateCcw,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import { api } from '../services/api';
import { Webinar, ParsedSearchIntent } from '../types';
import { WebinarCard } from '../components/webinar/WebinarCard';
import { NaturalLanguageSearchBar } from '../components/search/NaturalLanguageSearchBar';
import { AiSynthesisSkeleton, WebinarGridSkeleton } from '../components/common/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';

export const SearchResultsPage: React.FC = () => {
  const { user } = useAuth();
  const { openLogin } = useAuthModal();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<Webinar[]>([]);
  const [parsedIntent, setParsedIntent] = useState<ParsedSearchIntent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      executeSearch(queryParam);
    } else {
      executeSearch('Cybersecurity webinars with certificates');
    }
  }, [queryParam]);

  const executeSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const res = await api.searchWebinarsAI(searchQuery);
      setResults(res.webinars);
      setParsedIntent(res.parsedIntent);
      setSearchParams({ q: searchQuery });
    } catch (e) {
      console.error('Search failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (newQuery: string) => {
    if (!user) {
      openLogin('Please sign in to search and discover webinars.', newQuery);
      return;
    }
    setQuery(newQuery);
    executeSearch(newQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 rounded-3xl p-6 sm:p-8 border border-blue-200/60 dark:border-blue-900/40 space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              AI Semantic Webinar Search
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Understands student intents, schedule constraints, topic synonyms, and certificate requirements.
            </p>
          </div>
        </div>

        {/* Natural Language Prompt Search Bar */}
        <NaturalLanguageSearchBar
          initialQuery={query}
          onSearch={handleSearchSubmit}
          parsedIntent={parsedIntent}
          isLoading={isLoading}
        />
      </div>

      {/* Results Header Status */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <span>Search Results for:</span>
          <span className="text-blue-600 dark:text-blue-400 italic font-bold">"{query}"</span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-900 dark:text-white">{results.length}</span> {results.length === 1 ? 'webinar' : 'webinars'} found
        </span>
      </div>

      {/* Results Grid / Skeleton State */}
      {isLoading ? (
        <div className="space-y-6">
          <AiSynthesisSkeleton
            title={`Answer from top 5 webinars`}
            sourceCount={5}
          />
          <WebinarGridSkeleton count={6} />
        </div>
      ) : results.length === 0 ? (
        <div className="py-16 px-6 text-center bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-8 space-y-5 shadow-sm animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900/60 shadow-sm">
            <Search className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              We couldn't find any webinars for "{query}"
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No verified academic webinars matched your exact keywords or topic. The AI searches titles, subject categories, descriptions, and verified tags. Try searching for related academic subjects or explore the full catalog.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              Explore All Webinars
            </Link>
            <button
              onClick={() => handleSearchSubmit('Free webinars with certificates')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Try "Free with Certificates"
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((w) => (
            <WebinarCard
              key={w.id}
              webinar={w}
              showRecommendationReason={true}
              onSaveToggle={() => executeSearch(query)}
              onStatusChange={() => executeSearch(query)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
