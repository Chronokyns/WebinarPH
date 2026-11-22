import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  Trash2,
  Calendar,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { NotificationPromptCard } from '../components/pwa/NotificationPromptCard';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'starting_soon':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'deadline_warning':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'recommendation':
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Notifications & Reminders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time reminders for schedules, registration deadlines, and newly aggregated academic webinars.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Web Push Notification Preferences Card */}
      <NotificationPromptCard />

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="py-20 text-center text-xs text-slate-400 space-y-2">
          <Bell className="w-8 h-8 mx-auto text-slate-300" />
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                !n.is_read
                  ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-sm shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {n.title}
                    </h3>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {n.webinar_id && (
                  <Link
                    to={`/webinar/${n.webinar_id}`}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View Webinar
                  </Link>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(n.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
