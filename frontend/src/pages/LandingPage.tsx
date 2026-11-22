import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Calendar,
  Award,
  CheckCircle2,
  Bookmark,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Compass,
  TrendingUp,
  Clock,
  Layers,
  HeartPulse,
  Brain,
  Shield,
  Cloud,
  Database,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { NaturalLanguageSearchBar } from '../components/search/NaturalLanguageSearchBar';

interface DisciplineCard {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  icon: React.ComponentType<{ className?: string }>;
  tagColor: string;
}

const FEATURED_DISCIPLINES: DisciplineCard[] = [
  {
    title: 'Generative AI & Agentic Workflows',
    category: 'AI & Machine Learning',
    description: 'Master RAG architectures, vector embeddings, LLMs, and autonomous agents through live sessions led by Google Developer Experts.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    icon: Brain,
    tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
  },
  {
    title: 'Zero Trust & Threat Intelligence',
    category: 'Cybersecurity',
    description: 'Hands-on live threat hunting, packet inspection, SIEM alert correlation, and penetration testing frameworks from ACM SIGSAC.',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    icon: Shield,
    tagColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
  },
  {
    title: 'Microservices & Cloud DevOps',
    category: 'Cloud Computing',
    description: 'Learn modern distributed cloud architectures, Kubernetes auto-scaling, and AWS serverless backends for student capstone projects.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    icon: Cloud,
    tagColor: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800',
  },
  {
    title: 'Maternal Health & Digital Medicine',
    category: 'Health Sciences',
    description: 'Explore prenatal monitoring, predictive obstetrics analytics, clinical protocols, and healthcare informatics for medical students.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    icon: HeartPulse,
    tagColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
  },
  {
    title: 'Exploratory Data Analysis & Big Data',
    category: 'Data Science',
    description: 'Transform raw datasets into actionable insights using Pandas, Python pipelines, statistical modeling, and interactive visualization.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    icon: Database,
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
  },
  {
    title: 'Capstone Publishing & Interview Prep',
    category: 'Academic Readiness',
    description: 'Peer-reviewed research structuring, literature reviews, IEEE paper formatting, and live coding technical interview strategies.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    icon: BookOpen,
    tagColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
  },
];

interface FeaturePreview {
  step: string;
  title: string;
  description: string;
  imageUrl: string;
  highlight: string;
}

const FEATURE_PREVIEWS: FeaturePreview[] = [
  {
    step: 'Step 1',
    title: 'AI Semantic Search in Plain English',
    description: 'Search naturally without rigid filters. Type queries like "Free cybersecurity webinars with certificates before Dec 20"—the AI automatically interprets topic intent, schedule limits, and credentials.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    highlight: 'Natural Language Understanding',
  },
  {
    step: 'Step 2',
    title: 'Schedule Conflict Guard',
    description: 'Never worry about double-booking course classes or project milestones. WebinarPH cross-references your personal schedule and flags overlapping webinars before you register.',
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
    highlight: 'Zero Double-Booking Guarantee',
  },
  {
    step: 'Step 3',
    title: 'Verified Certificates for Degree Proof',
    description: 'Fulfill academic requirements with confidence. Aggregated directly from authorized university partners and certified bodies (IEEE, ACM, GDSC, AWS Educate) with official completion verification.',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
    highlight: 'Official Completion Proofs',
  },
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const { openLogin, openRegister } = useAuthModal();
  const navigate = useNavigate();

  const handleHeroSearch = (query: string) => {
    if (!user) {
      openLogin('Please sign in to search and discover personalized academic webinars.', query);
      return;
    }
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="space-y-24 pb-24">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-blue-400/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Capstone Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 animate-in fade-in duration-300 shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>AI-Powered Academic Platform • Exclusively for Webinars</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Find the Right Webinars. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
              At the Right Time.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover verified academic webinars that match your course requirements, free schedule, and certificate deadlines—curated and personalized in one centralized system.
          </p>

          {/* Interactive Hero AI Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto text-left">
            <NaturalLanguageSearchBar onSearch={handleHeroSearch} />
          </div>

          {/* Primary & Secondary Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  openLogin('Please sign in or create an account to explore webinars.');
                } else {
                  navigate('/explore');
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              Explore All Webinars
            </button>
            <button
              type="button"
              onClick={() => openRegister('Create your free student account to track registrations and get AI recommendations.')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trust Metrics */}
          <div className="mt-14 pt-8 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">100%</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Exclusive Webinar Scope</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">Verified</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">IEEE, ACM & GDSC Sources</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">Zero Guesswork</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Deterministic Date Matching</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">Conflict Guard</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Schedule Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visual Disciplines Showcase (Pictures + Descriptions) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Academic Fields & Specializations
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
            Explore Verified Webinars by Subject
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Connect directly with faculty lectures, certified workshops, and technical webinars across major degree specializations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_DISCIPLINES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Image Header with Badge Overlay */}
                <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md shadow-xs ${item.tagColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <button
                      type="button"
                      onClick={() => handleHeroSearch(item.category)}
                      className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>Find webinars in this field</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Platform Capabilities Showcase (Pictures + Descriptions) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
            Built Directly for Student Workflows
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Eliminating the time spent searching across dozens of different websites, Discord groups, and social feeds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURE_PREVIEWS.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              {/* Picture Preview */}
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={feature.imageUrl}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-bold">
                  {feature.step}
                </div>
              </div>

              {/* Description */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {feature.highlight}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Supported Data Sources Showcase */}
      <section className="bg-slate-100/70 dark:bg-slate-800/40 py-12 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
            Aggregated From Official & Authorized Academic Feeds
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-slate-600 dark:text-slate-300 font-bold text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              IEEE Computer Society
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              ACM Student Chapters
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Google Developer Student Clubs
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              AWS Educate Series
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              IEEE EMBS Medical Webinars
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 p-8 sm:p-12 text-center text-white shadow-xl shadow-blue-700/20 overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Your next learning opportunity is just a search away.
            </h2>
            <p className="mt-3 text-sm text-blue-100 leading-relaxed">
              Join students discovering academic webinars, earning verified certificates, and staying on schedule without missing deadlines.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    openLogin('Please sign in or create an account to explore webinars.');
                  } else {
                    navigate('/explore');
                  }
                }}
                className="px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors shadow-md active:scale-95 cursor-pointer"
              >
                Browse All Webinars
              </button>
              <button
                type="button"
                onClick={() => openRegister('Create your free student account to begin tracking webinars.')}
                className="px-6 py-3 rounded-xl bg-blue-800/70 hover:bg-blue-800 text-white font-bold text-sm border border-blue-400/40 transition-colors cursor-pointer active:scale-95"
              >
                Create Student Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
