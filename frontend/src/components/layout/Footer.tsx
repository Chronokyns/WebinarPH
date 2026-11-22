import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Shield, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Purpose */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                Webinar<span className="text-blue-600 dark:text-blue-400">PH</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              An intelligent, AI-powered web-based discovery and recommendation platform dedicated exclusively to academic and career webinars for college students.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Exclusively Webinars • Verified Sources</span>
            </div>
          </div>

          {/* Student Discovery Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Webinar Discovery
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/explore" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">All Upcoming Webinars</Link></li>
              <li><Link to="/search" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Natural Language Search</Link></li>
              <li><Link to="/recommendations" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Personalized Recommendations</Link></li>
              <li><Link to="/explore?is_free=true" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Free Student Webinars</Link></li>
              <li><Link to="/explore?certificate=true" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Webinars with Certificate</Link></li>
            </ul>
          </div>

          {/* Student Tools & Organization */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Academic Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/calendar" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Personal Webinar Calendar</Link></li>
              <li><Link to="/saved" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Bookmarked Webinars</Link></li>
              <li><Link to="/tracked" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Attendance & Status Tracker</Link></li>
              <li><Link to="/profile" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Interest Profiles & Topics</Link></li>
            </ul>
          </div>

          {/* Academic Sources & Integrity */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Aggregated Sources
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>IEEE Computer Society</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>ACM Student Chapters</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Google Developer Student Clubs</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>AWS Educate Student Series</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 WebinarPH. Built as a College Capstone Project for Student Empowerment.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Powered by Semantic Search & NLP
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
