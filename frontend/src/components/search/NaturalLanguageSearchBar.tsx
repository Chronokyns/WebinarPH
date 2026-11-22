import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  X,
  Calendar,
  Award,
  DollarSign,
} from 'lucide-react';
import { ParsedSearchIntent } from '../../types';

interface NaturalLanguageSearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  parsedIntent?: ParsedSearchIntent | null;
  isLoading?: boolean;
}

interface SamplePrompt {
  label: string;
  query: string;
}

const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    label: 'Free Cybersecurity with Cert',
    query: 'Free cybersecurity webinars with certificates before December 20',
  },
  {
    label: 'AI & Machine Learning',
    query: 'Free webinars about artificial intelligence and deep learning',
  },
  {
    label: 'Kubernetes & Cloud DevOps',
    query: 'Cloud computing and Kubernetes for university projects',
  },
  {
    label: 'Python Data Analysis',
    query: 'Webinars about Python data analysis with certificates',
  },
  {
    label: 'Ethical Hacking & Defense',
    query: 'How to protect computer systems against hackers',
  },
];

export const NaturalLanguageSearchBar: React.FC<NaturalLanguageSearchBarProps> = ({
  initialQuery = '',
  onSearch,
  parsedIntent,
  isLoading = false,
}) => {
  const [query, setQuery] = useState(initialQuery);

  // Typewriter Animation using the words from below (SAMPLE_PROMPTS)
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor cadence (500ms)
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter typing and backspacing loop
  useEffect(() => {
    if (query) return;

    const fullWord = SAMPLE_PROMPTS[currentPromptIndex].label;

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2000); // Wait 2s on full word
      return () => clearTimeout(pauseTimer);
    }

    if (!isDeleting) {
      if (displayedText.length < fullWord.length) {
        const typeTimer = setTimeout(() => {
          setDisplayedText(fullWord.slice(0, displayedText.length + 1));
        }, 75); // Natural typing rhythm
        return () => clearTimeout(typeTimer);
      } else {
        setIsPaused(true);
      }
    } else {
      if (displayedText.length > 0) {
        const deleteTimer = setTimeout(() => {
          setDisplayedText(fullWord.slice(0, displayedText.length - 1));
        }, 35); // Rapid backspacing
        return () => clearTimeout(deleteTimer);
      } else {
        setIsDeleting(false);
        setCurrentPromptIndex((prev) => (prev + 1) % SAMPLE_PROMPTS.length);
      }
    }
  }, [displayedText, isDeleting, isPaused, currentPromptIndex, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    } else {
      // If submitted while empty, seamlessly use the currently active word's query
      const activePrompt = SAMPLE_PROMPTS[currentPromptIndex];
      onSearch(activePrompt.query);
    }
  };

  const handleChipClick = (sampleQuery: string) => {
    setQuery(sampleQuery);
    onSearch(sampleQuery);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const animatedPlaceholder = query ? '' : `${displayedText}${cursorVisible ? '|' : ''}`;

  return (
    <div className="w-full">
      {/* Modern, Clean Search Bar */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 shadow-sm transition-all p-1.5 sm:p-2">
          
          {/* Sparkles Badge Icon */}
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 ml-1">
            <Sparkles className="w-4 h-4" />
          </div>

          {/* Text Input with Typewriter Animated Placeholder */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={animatedPlaceholder}
            className="w-full py-2 px-3 text-sm sm:text-base bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none font-medium"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-1 shrink-0"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all shrink-0 active:scale-95 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* AI Extracted Constraints (Rendered only when active) */}
      {parsedIntent && (parsedIntent.extracted_price || parsedIntent.extracted_certificate || parsedIntent.extracted_deadline || parsedIntent.extracted_platform) && (
        <div className="mt-2.5 p-2.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40 flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            AI Matched:
          </span>

          {parsedIntent.extracted_price && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              <DollarSign className="w-3 h-3" />
              {parsedIntent.extracted_price === 'free' ? 'Free' : 'Paid'}
            </span>
          )}

          {parsedIntent.extracted_certificate && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
              <Award className="w-3 h-3" />
              Certificate
            </span>
          )}

          {parsedIntent.extracted_deadline && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
              <Calendar className="w-3 h-3" />
              Before {new Date(parsedIntent.extracted_deadline).toLocaleDateString()}
            </span>
          )}

          {parsedIntent.extracted_platform && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              {parsedIntent.extracted_platform}
            </span>
          )}

          {parsedIntent.interpretation_summary && (
            <span className="text-xs text-blue-700 dark:text-blue-300 italic ml-auto hidden md:inline truncate max-w-sm">
              {parsedIntent.interpretation_summary}
            </span>
          )}
        </div>
      )}

      {/* Clean, Pleasing "Try asking" Chips (Smooth single-line horizontal scroll on mobile) */}
      <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 font-semibold shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Try asking:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
          {SAMPLE_PROMPTS.map((item, idx) => {
            const isCurrentActive = idx === currentPromptIndex && !query;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(item.query)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                  isCurrentActive
                    ? 'bg-blue-100/90 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-400 dark:border-blue-600 shadow-xs scale-[1.02]'
                    : 'bg-slate-100/90 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
                title={item.query}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
