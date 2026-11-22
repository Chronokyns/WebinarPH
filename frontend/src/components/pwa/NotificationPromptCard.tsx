import React, { useState } from 'react';
import { Bell, CheckCircle, ShieldAlert, Sparkles, Send } from 'lucide-react';
import { usePwa } from '../../context/PwaContext';

export const NotificationPromptCard: React.FC = () => {
  const {
    notificationPermission,
    requestNotificationPermission,
    sendWebinarReminder,
  } = usePwa();

  const [testSent, setTestSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnable = async () => {
    setLoading(true);
    await requestNotificationPermission();
    setLoading(false);
  };

  const handleTestReminder = async () => {
    setTestSent(true);
    await sendWebinarReminder(
      'WebinarPH: Starting Soon! 🎓',
      'Defensive Security & Threat Hunting starts in 1 hour on Microsoft Teams. Check your schedule!',
      '/calendar'
    );
    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              Web Push & Webinar Reminders
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Receive timely push alerts on your phone or desktop for upcoming webinars and registration deadlines.
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {notificationPermission === 'granted' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <CheckCircle className="w-3.5 h-3.5" />
              Active
            </span>
          ) : notificationPermission === 'denied' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              Blocked
            </span>
          ) : notificationPermission === 'unsupported' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              Unsupported
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              Not Configured
            </span>
          )}
        </div>
      </div>

      <div className="pt-1 flex flex-wrap items-center gap-3">
        {notificationPermission === 'default' && (
          <button
            onClick={handleEnable}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Bell className="w-4 h-4" />
            <span>Enable Push Notifications</span>
          </button>
        )}

        {notificationPermission === 'granted' && (
          <button
            onClick={handleTestReminder}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
          >
            <Send className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{testSent ? '✓ Notification Dispatched!' : 'Send Test Webinar Reminder'}</span>
          </button>
        )}

        {notificationPermission === 'denied' && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Notifications are currently blocked in your browser settings. You can re-enable them in your browser site permissions.
          </p>
        )}

        {notificationPermission === 'unsupported' && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This browser does not support web push notifications. In-app alerts remain active.
          </p>
        )}
      </div>
    </div>
  );
};
