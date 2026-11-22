import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Calendar,
  Bookmark,
  Bell,
  Shield,
  Video,
  Users,
  Database,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

interface MobileNavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const MobileNavBar: React.FC = () => {
  const { user, role } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  // Hidden on landing page, login/register, or when logged out
  if (!user || location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const studentItems: MobileNavItem[] = [
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'AI Search', path: '/search', icon: Sparkles },
    { label: 'Schedule', path: '/calendar', icon: Calendar },
    { label: 'Saved', path: '/saved', icon: Bookmark },
    { label: 'Alerts', path: '/notifications', icon: Bell, badge: unreadCount },
  ];

  const adminItems: MobileNavItem[] = [
    { label: 'Overview', path: '/admin', icon: Shield },
    { label: 'Webinars', path: '/admin/webinars', icon: Video },
    { label: 'Students', path: '/admin/students', icon: Users },
    { label: 'Sources', path: '/admin/sources', icon: Database },
    { label: 'Logs', path: '/admin/logs', icon: Activity },
  ];

  const items = role === 'admin' ? adminItems : studentItems;

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800/90 px-2 py-1.5 shadow-lg pb-safe"
    >
      <div className="grid grid-cols-5 items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
                active
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
                {item.label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
