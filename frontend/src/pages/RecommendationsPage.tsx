import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  Tag,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Webinar } from '../types';
import { WebinarCard } from '../components/webinar/WebinarCard';
import { WebinarGridSkeleton } from '../components/common/SkeletonLoader';

const ALL_INTEREST_TAGS = [
  'Artificial Intelligence',
  'Cybersecurity',
  'Cloud Computing',
  'Web Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Kubernetes',
  'Python',
  'React',
  'Career Preparation',
  'Technical Interviews',
];

export const RecommendationsPage: React.FC = () => {
  const { profile, updateProfile } = useAuth();

  const [activeInterests, setActiveInterests] = useState<string[]>(profile?.interests || [
    'Artificial Intelligence',
    'Cybersecurity',
    'Cloud Computing',
  ]);
  const [recommendations, setRecommendations] = useState<Webinar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [activeInterests]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const recs = await api.getRecommendations(activeInterests);
      setRecommendations(recs);
    } catch (e) {
      console.error('Failed to load recommendations', e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInterest = (tag: string) => {
    const updated = activeInterests.includes(tag)
      ? activeInterests.filter((t) => t !== tag)
      : [...activeInterests, tag];
    setActiveInterests(updated);
    updateProfile({ interests: updated });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-300" />
          <span>Explainable Recommendation Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Webinars Curated For You
        </h1>
        <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
          Our recommendation mechanism evaluates your major, saved webinars, and chosen subject tags to present webinars that fulfill your learning goals and graduation criteria.
        </p>
      </div>

      {/* Interactive Topics / Interests Customizer */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            Fine-tune Your Recommended Topics:
          </span>
          <Link to="/profile" className="text-xs font-semibold text-blue-600 hover:underline">
            Manage Full Profile
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {ALL_INTEREST_TAGS.map((tag) => {
            const isSelected = activeInterests.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleInterest(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {isSelected ? `✓ ${tag}` : `+ ${tag}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommendation Results Grid */}
      {isLoading ? (
        <WebinarGridSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((w) => (
            <WebinarCard
              key={w.id}
              webinar={w}
              showRecommendationReason={true}
              onSaveToggle={() => loadRecommendations()}
              onStatusChange={() => loadRecommendations()}
            />
          ))}
        </div>
      )}
    </div>
  );
};
