import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  TrendingUp,
  Calendar,
  Bookmark,
  CheckCircle2,
  Bell,
  User,
  Shield,
  Video,
  Users,
  Database,
  Activity,
  ChevronLeft,
  ChevronRight,
  X,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { useNotifications } from '../../context/NotificationContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass?: string;
  badge?: number;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { user, role, profile } = useAuth();
  const { isCollapsed, toggleCollapse, mobileOpen, setMobileOpen } = useSidebar();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  const isLanding = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isLanding || isAuthPage || !user) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/dashboard' && path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItemClass = (path: string) => {
    const active = isActive(path);
    return `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      active
        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 dark:shadow-blue-900/30 font-semibold'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400'
    }`;
  };

  const studentNavigation: NavSection[] = [
    {
      group: 'Discover',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Explore Webinars', path: '/explore', icon: Compass },
        { label: 'AI Natural Search', path: '/search', icon: Sparkles, iconClass: 'text-indigo-400' },
        { label: 'Curated For You', path: '/recommendations', icon: TrendingUp },
      ],
    },
    {
      group: 'My Webinars',
      items: [
        { label: 'Calendar Schedule', path: '/calendar', icon: Calendar },
        { label: 'Saved Bookmarks', path: '/saved', icon: Bookmark },
        { label: 'Participation Tracker', path: '/tracked', icon: CheckCircle2, iconClass: 'text-emerald-500' },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
        { label: 'Profile & Interests', path: '/profile', icon: User },
      ],
    },
  ];

  const adminNavigation: NavSection[] = [
    {
      group: 'Administration',
      items: [
        { label: 'Admin Overview', path: '/admin', icon: Shield },
        { label: 'Manage Webinars', path: '/admin/webinars', icon: Video },
        { label: 'Student Accounts', path: '/admin/students', icon: Users },
        { label: 'Data Sources', path: '/admin/sources', icon: Database },
        { label: 'Sync Logs & Reports', path: '/admin/logs', icon: Activity },
      ],
    },
  ];

  const activeNav = role === 'admin' ? adminNavigation : studentNavigation;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 select-none">
      {/* Mobile Header with close button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base text-slate-900 dark:text-white">
            Webinar<span className="text-blue-600 dark:text-blue-400">PH</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {activeNav.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {section.group}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    title={isCollapsed ? item.label : undefined}
                    className={navItemClass(item.path)}
                  >
                    <IconComponent
                      className={`w-5 h-5 shrink-0 transition-colors ${
                        active
                          ? 'text-white'
                          : item.iconClass || 'text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Student / User Card at Bottom */}
      {user && !isCollapsed && (
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 m-2 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user.full_name}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {role === 'admin' ? 'Administrator' : (profile?.major || 'Student')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Collapse / Expand Toggle Button */}
      <div className="hidden lg:flex p-3 border-t border-slate-200/80 dark:border-slate-800/80 items-center justify-between">
        <button
          onClick={toggleCollapse}
          className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {!isCollapsed && <span>Collapse Sidebar</span>}
          {isCollapsed ? <ChevronRight className="w-5 h-5 text-blue-500" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Off-canvas Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out z-20 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
