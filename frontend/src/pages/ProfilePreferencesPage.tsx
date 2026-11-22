import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Tag,
  Video,
  Check,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationPromptCard } from '../components/pwa/NotificationPromptCard';

const AVAILABLE_TOPICS = [
  'Artificial Intelligence',
  'Cybersecurity',
  'Cloud Computing',
  'Web Development',
  'Data Science',
  'Machine Learning',
  'DevOps & Kubernetes',
  'Deep Learning & PyTorch',
  'Software Architecture',
  'Career & Technical Interviews',
  'Academic Research & Publishing',
];

const AVAILABLE_PLATFORMS = [
  'Zoom',
  'Google Meet',
  'Microsoft Teams',
  'Webex',
  'YouTube Live',
];

export const ProfilePreferencesPage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();

  const [university, setUniversity] = useState(profile?.university || 'State University of Technology');
  const [major, setMajor] = useState(profile?.major || 'Computer Science & Software Engineering');
  const [academicYear, setAcademicYear] = useState(profile?.academic_year || 'Junior (3rd Year)');
  const [careerGoals, setCareerGoals] = useState(profile?.career_goals || 'Seeking AI and Cloud Engineering internships');
  const [interests, setInterests] = useState<string[]>(profile?.interests || ['Artificial Intelligence', 'Cybersecurity', 'Cloud Computing']);
  const [platforms, setPlatforms] = useState<string[]>(profile?.preferred_platforms || ['Zoom', 'Google Meet', 'Microsoft Teams']);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleInterest = (topic: string) => {
    setInterests((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const togglePlatform = (p: string) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      university,
      major,
      academic_year: academicYear,
      career_goals: careerGoals,
      interests,
      preferred_platforms: platforms,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <User className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          Student Profile & Learning Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your academic background and preferred webinar categories to calibrate AI recommendations.
        </p>
      </div>

      {/* Web Push & Notification Reminders Configuration */}
      <NotificationPromptCard />

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Account Info Box */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Academic Enrollment Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                disabled
                value={user?.full_name || 'Alex Chen'}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'student@university.edu'}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College or University
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Degree Major / Field of Study
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Standing
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
              >
                <option value="Freshman (1st Year)">Freshman (1st Year)</option>
                <option value="Sophomore (2nd Year)">Sophomore (2nd Year)</option>
                <option value="Junior (3rd Year)">Junior (3rd Year)</option>
                <option value="Senior (4th Year / Capstone)">Senior (4th Year / Capstone)</option>
                <option value="Postgraduate / Master's">Postgraduate / Master's</option>
              </select>
            </div>
          </div>
        </div>

        {/* Learning Interests & Topic Multi-selector */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-600" />
              Target Learning Topics & Course Requirements
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select the technical fields and skills you need webinars for.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TOPICS.map((topic) => {
              const selected = interests.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleInterest(topic)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selected
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {selected ? `✓ ${topic}` : `+ ${topic}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Webinar Platforms */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-600" />
              Preferred Online Platforms
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select platforms supported on your student laptop / device.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {AVAILABLE_PLATFORMS.map((platform) => {
              const selected = platforms.includes(platform);
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selected
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {selected ? `✓ ${platform}` : platform}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
              <Check className="w-4 h-4" />
              Profile preferences saved successfully!
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              Changes update your AI recommendations immediately.
            </div>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Profile Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
