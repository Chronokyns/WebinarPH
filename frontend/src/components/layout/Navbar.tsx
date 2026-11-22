import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  User,
  LogOut,
  ChevronDown,
  PanelLeft,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSidebar } from '../../context/SidebarContext';
import { useAuthModal } from '../../context/AuthModalContext';

export const Navbar: React.FC = () => {
  const { user, role, logout, switchRoleDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { toggleCollapse, toggleMobile } = useSidebar();
  const { openLogin, openRegister, closeModal } = useAuthModal();
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboardOrLanding = location.pathname === '/dashboard' || location.pathname === '/';

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickQuery.trim())}`);
      setQuickQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Upper Left: Sidebar Toggle (Only for authenticated internal pages) + Logo & Brand */}
          <div className="flex items-center gap-3">
            {/* Sidebar Toggles: Only shown when logged in and NOT on landing page */}
            {user && location.pathname !== '/' && (
              <>
                {/* Desktop Sidebar Toggle */}
                <button
                  onClick={toggleCollapse}
                  className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Toggle Sidebar"
                  aria-label="Toggle Sidebar"
                >
                  <PanelLeft className="w-5 h-5" />
                </button>

                {/* Mobile Sidebar Drawer Toggle */}
                <button
                  onClick={toggleMobile}
                  className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Open Navigation Menu"
                  aria-label="Open Navigation Menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Logo & Name */}
            <Link
              to={user ? (role === 'admin' ? '/admin' : '/dashboard') : '/'}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center">
                Webinar<span className="text-blue-600 dark:text-blue-400">PH</span>
              </span>
            </Link>
          </div>

          {/* Center: Global Search Bar (Hidden on Dashboard, Landing, or for Admin accounts) */}
          {!isDashboardOrLanding && role !== 'admin' ? (
            <div className="flex-1 max-w-md mx-2 sm:mx-6 animate-in fade-in duration-200">
              <form onSubmit={handleQuickSearch} className="w-full relative">
                <input
                  type="text"
                  placeholder="Search webinars (e.g. Free AI with certificate)..."
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200/90 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </form>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Right Action Controls: Theme, Notifications, User Menu */}
          <div className="flex items-center gap-2">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationOpen(!notificationOpen);
                    setUserMenuOpen(false);
                  }}
                  className="p-2 relative rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Drawer */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 text-[11px] font-medium bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/40">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer ${
                              !n.is_read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{n.title}</h4>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {new Date(n.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="px-4 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-center">
                      <Link
                        to="/notifications"
                        onClick={() => setNotificationOpen(false)}
                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Access Control Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotificationOpen(false);
                  }}
                  className="flex items-center gap-2 pl-2 pr-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                    role === 'admin' ? 'bg-amber-600' : 'bg-blue-600'
                  }`}>
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                    {user.full_name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700/60">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.full_name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          role === 'admin'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200'
                        }`}>
                          {role === 'admin' ? 'Role: Administrator' : 'Role: Verified Student'}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      {role === 'admin' ? (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          <Shield className="w-4 h-4 text-amber-500" />
                          Admin Overview
                        </Link>
                      ) : (
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Profile & Interests
                        </Link>
                      )}

                      {/* Role Switcher for Seamless Testing & Evaluation */}
                      <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-900/40 my-1 border-y border-slate-100 dark:border-slate-700/40">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Role Switcher (Evaluation)
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              switchRoleDemo('student');
                              setUserMenuOpen(false);
                              navigate('/dashboard');
                            }}
                            className={`text-[11px] py-1 px-2 rounded-lg font-medium border text-center transition-colors ${
                              role === 'student'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            Student
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              switchRoleDemo('admin');
                              setUserMenuOpen(false);
                              navigate('/admin');
                            }}
                            className={`text-[11px] py-1 px-2 rounded-lg font-medium border text-center transition-colors ${
                              role === 'admin'
                                ? 'bg-amber-600 text-white border-amber-600'
                                : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            Admin
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                          closeModal();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-left transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openLogin()}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => openRegister()}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
