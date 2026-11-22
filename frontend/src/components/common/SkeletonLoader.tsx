import React from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

interface AiSynthesisSkeletonProps {
  title?: string;
  sourceCount?: number;
}

/**
 * AI Synthesis Skeleton Loader
 * Implements the exact layout from user image:
 * Header with dropdown arrow, grey badge skeleton, multi-paragraph grey skeleton lines,
 * and bottom pill button skeletons.
 */
export const AiSynthesisSkeleton: React.FC<AiSynthesisSkeletonProps> = ({
  title,
  sourceCount = 5,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm space-y-4 animate-in fade-in duration-200">
      {/* Header with Title and Dropdown Arrow */}
      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>{title || `Answer from top ${sourceCount} webinars`}</span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </div>

      {/* Top Tag / Pill Skeleton */}
      <div className="pt-1">
        <div className="h-5 w-28 bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
      </div>

      {/* Multi-Paragraph Skeleton Lines with rounded ends */}
      <div className="space-y-3.5 pt-1">
        {/* Paragraph 1 */}
        <div className="space-y-2">
          <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
          <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
          <div className="h-3.5 w-[75%] bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
        </div>

        {/* Paragraph 2 */}
        <div className="space-y-2 pt-1">
          <div className="h-3.5 w-[32%] bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
          <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
          <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
          <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
        </div>

        {/* Paragraph 3 */}
        <div className="space-y-2 pt-1">
          <div className="h-3.5 w-[32%] bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
          <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
          <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
          <div className="h-3.5 w-[32%] bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Bottom Action Pill Buttons Skeleton */}
      <div className="flex items-center gap-3 pt-3">
        <div className="h-8 w-28 bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
        <div className="h-8 w-28 bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

/**
 * Single Webinar Card Skeleton
 */
export const WebinarCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in duration-200">
      {/* Top Badges */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
          <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
        </div>
        <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700/70 rounded-md animate-pulse" />
      </div>

      {/* Title */}
      <div className="space-y-2 pt-1">
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
        <div className="h-3 w-5/6 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
      </div>

      {/* Speaker */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
        <div className="h-3 w-14 bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
      </div>

      {/* Schedule & Certificate */}
      <div className="flex items-center justify-between">
        <div className="h-3.5 w-36 bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
        <div className="h-3.5 w-20 bg-slate-200 dark:bg-slate-700/70 rounded-full animate-pulse" />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between pt-2">
        <div className="h-8 w-28 bg-slate-200 dark:bg-slate-700/70 rounded-xl animate-pulse" />
        <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700/70 rounded-xl animate-pulse" />
      </div>
    </div>
  );
};

/**
 * Grid of Webinar Card Skeletons
 */
export const WebinarGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <WebinarCardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * Table Row Skeletons for Admin Tables
 */
export const TableRowSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 6,
}) => {
  return (
    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="animate-pulse">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c} className="px-6 py-4 whitespace-nowrap">
              <div
                className="h-4 bg-slate-200 dark:bg-slate-700/70 rounded-full"
                style={{ width: `${Math.floor(50 + (c * 17) % 45)}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};
