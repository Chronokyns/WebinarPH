import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SidebarProvider } from './context/SidebarContext';
import { AuthModalProvider, useAuthModal } from './context/AuthModalContext';
import { AuthModal } from './components/auth/AuthModal';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNavBar } from './components/layout/MobileNavBar';
import { Footer } from './components/layout/Footer';
import { PwaProvider } from './context/PwaContext';
import { OfflineBanner } from './components/pwa/OfflineBanner';
import { PwaInstallBanner } from './components/pwa/PwaInstallBanner';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { ExplorePage } from './pages/ExplorePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { WebinarDetailPage } from './pages/WebinarDetailPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { SavedWebinarsPage } from './pages/SavedWebinarsPage';
import { CalendarPage } from './pages/CalendarPage';
import { TrackedWebinarsPage } from './pages/TrackedWebinarsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePreferencesPage } from './pages/ProfilePreferencesPage';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminWebinarsPage } from './pages/AdminWebinarsPage';
import { AdminStudentsPage } from './pages/AdminStudentsPage';
import { AdminSourcesPage } from './pages/AdminSourcesPage';
import { AdminLogsPage } from './pages/AdminLogsPage';

// Role Guard Component
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const ProtectedStudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role } = useAuth();
  const { openLogin } = useAuthModal();

  React.useEffect(() => {
    if (!user) {
      openLogin('Please sign in or create an account to explore webinars.');
    }
  }, [user, openLogin]);

  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthModalProvider>
          <NotificationProvider>
            <PwaProvider>
              <SidebarProvider>
                <Router>
                  <OfflineBanner />
                  <AuthModal />
                  <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
                    <Navbar />
                  <div className="flex-1 flex w-full">
                    <Sidebar />
                    <div className="flex-1 min-w-0 flex flex-col">
                      <main className="flex-1 pb-16 md:pb-0">
                      <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected Webinar Exploration (Requires Sign In) */}
                  <Route
                    path="/explore"
                    element={
                      <ProtectedStudentRoute>
                        <ExplorePage />
                      </ProtectedStudentRoute>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <ProtectedStudentRoute>
                        <SearchResultsPage />
                      </ProtectedStudentRoute>
                    }
                  />
                  <Route
                    path="/webinar/:id"
                    element={
                      <ProtectedStudentRoute>
                        <WebinarDetailPage />
                      </ProtectedStudentRoute>
                    }
                  />

                  {/* Student Protected Pages */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedStudentRoute>
                        <StudentDashboard />
                      </ProtectedStudentRoute>
                    }
                  />
                  <Route
                    path="/recommendations"
                    element={
                      <ProtectedStudentRoute>
                        <RecommendationsPage />
                      </ProtectedStudentRoute>
                    }
                  />
                  <Route
                    path="/saved"
                    element={
                      <ProtectedStudentRoute>
                        <SavedWebinarsPage />
                      </ProtectedStudentRoute>
                    }
                  />
                  <Route
                    path="/calendar"
                    element={
                      <ProtectedStudentRoute>
                        <CalendarPage />
                      </ProtectedStudentRoute>
                    }
                  />
                  <Route
                    path="/tracked"
                    element={
                      <ProtectedStudentRoute>
                        <TrackedWebinarsPage />
                      </ProtectedStudentRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <ProtectedStudentRoute>
                        <NotificationsPage />
                      </ProtectedStudentRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedStudentRoute>
                        <ProfilePreferencesPage />
                      </ProtectedStudentRoute>
                    }
                  />

                  {/* Administrator Protected Pages */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboard />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/webinars"
                    element={
                      <ProtectedAdminRoute>
                        <AdminWebinarsPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/students"
                    element={
                      <ProtectedAdminRoute>
                        <AdminStudentsPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/sources"
                    element={
                      <ProtectedAdminRoute>
                        <AdminSourcesPage />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/logs"
                    element={
                      <ProtectedAdminRoute>
                        <AdminLogsPage />
                      </ProtectedAdminRoute>
                    }
                  />

                  {/* Catch-all Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
          <MobileNavBar />
          <PwaInstallBanner />
        </div>
        </Router>
      </SidebarProvider>
    </PwaProvider>
    </NotificationProvider>
  </AuthModalProvider>
</AuthProvider>
</ThemeProvider>
  );
};

export default App;
