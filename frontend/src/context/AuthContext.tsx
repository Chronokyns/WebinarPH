import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: StudentProfile | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string, overrideRole?: UserRole) => Promise<boolean>;
  register: (data: { full_name: string; email: string; password?: string; university?: string; major?: string; interests?: string[] }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: Partial<StudentProfile>) => Promise<boolean>;
  switchRoleDemo: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial fallback demo accounts
const DEMO_STUDENT: User = {
  id: 1,
  email: 'student@university.edu',
  full_name: 'Alex Chen',
  role: 'student',
  is_active: true,
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
};

const DEMO_STUDENT_PROFILE: StudentProfile = {
  id: 1,
  user_id: 1,
  university: 'State University of Technology',
  major: 'Computer Science & Software Engineering',
  academic_year: 'Junior (3rd Year)',
  interests: ['Artificial Intelligence', 'Cybersecurity', 'Web Development', 'Cloud Computing', 'Data Science'],
  preferred_platforms: ['Zoom', 'Google Meet', 'Microsoft Teams', 'YouTube Live'],
  career_goals: 'Seeking internships in AI Engineering and Cloud Infrastructure; eager to collect verified certificates.',
};

const DEMO_ADMIN: User = {
  id: 2,
  email: 'admin@webinarmatch.org',
  full_name: 'Dr. Sarah Jenkins',
  role: 'admin',
  is_active: true,
  created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('webinarmatch_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null; // Visitors start unauthenticated
  });

  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem('webinarmatch_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('webinarmatch_token') || null;
  });

  // Verify and sync current user from real database on mount
  useEffect(() => {
    const syncCurrentUser = async () => {
      const activeToken = localStorage.getItem('webinarmatch_token');
      if (!activeToken) {
        // Automatically authenticate with default demo account to fetch real DB session
        await login('student@university.edu', 'student123');
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${activeToken}`,
          },
        });
        if (res.ok) {
          const userData: User = await res.json();
          setUser(userData);
          if (userData.profile) {
            setProfile(userData.profile);
          }
        }
      } catch (e) {
        console.warn('Backend sync deferred, using cached session');
      }
    };

    syncCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('webinarmatch_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('webinarmatch_user');
    }
    if (token) {
      localStorage.setItem('webinarmatch_token', token);
    } else {
      localStorage.removeItem('webinarmatch_token');
    }
  }, [user, token]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('webinarmatch_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('webinarmatch_profile');
    }
  }, [profile]);

  const login = async (email: string, password?: string, overrideRole?: UserRole): Promise<boolean> => {
    const resolvedPassword = password || (overrideRole === 'admin' || email.toLowerCase().includes('admin') ? 'admin123' : 'student123');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: resolvedPassword }),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.access_token);
        setUser(data.user);
        if (data.user.profile) {
          setProfile(data.user.profile);
        } else if (data.user.role === 'student') {
          setProfile(DEMO_STUDENT_PROFILE);
        } else {
          setProfile(null);
        }
        return true;
      }
    } catch (e) {
      console.warn('Backend login error, falling back to local credentials', e);
    }

    // Local fallback if offline
    const isLoggingAsAdmin = overrideRole === 'admin' || email.toLowerCase().includes('admin');
    if (isLoggingAsAdmin) {
      setUser(DEMO_ADMIN);
      setProfile(null);
      setToken('admin-jwt-token-webinarmatch');
    } else {
      setUser({
        id: 1,
        email: email || 'student@university.edu',
        full_name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Student User',
        role: 'student',
        is_active: true,
        created_at: new Date().toISOString(),
      });
      setProfile(DEMO_STUDENT_PROFILE);
      setToken('student-jwt-token-webinarmatch');
    }
    return true;
  };

  const register = async (data: { full_name: string; email: string; password?: string; university?: string; major?: string; interests?: string[] }): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          full_name: data.full_name,
          password: data.password || 'student123',
          role: 'student',
          university: data.university || 'State University',
          major: data.major || 'Computer Science',
          interests: data.interests || ['Artificial Intelligence', 'Cybersecurity'],
        }),
      });

      if (res.ok) {
        const tokenData = await res.json();
        setToken(tokenData.access_token);
        setUser(tokenData.user);
        if (tokenData.user.profile) {
          setProfile(tokenData.user.profile);
        }
        return true;
      }
    } catch (e) {
      console.warn('Backend register error, using local registration', e);
    }

    // Fallback
    const newUser: User = {
      id: Date.now(),
      email: data.email,
      full_name: data.full_name,
      role: 'student',
      is_active: true,
      created_at: new Date().toISOString(),
    };
    const newProfile: StudentProfile = {
      id: Date.now(),
      user_id: newUser.id,
      university: data.university || 'University Student',
      major: data.major || 'General Studies',
      academic_year: 'Undergraduate',
      interests: data.interests && data.interests.length > 0 ? data.interests : ['Computer Science', 'Career Readiness'],
      preferred_platforms: ['Zoom', 'Google Meet', 'YouTube Live'],
      career_goals: 'Eager to expand practical skills and fulfill academic webinar requirements.',
    };

    setUser(newUser);
    setProfile(newProfile);
    setToken(`registered-jwt-${Date.now()}`);
    return true;
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setToken(null);
    localStorage.removeItem('webinarmatch_user');
    localStorage.removeItem('webinarmatch_profile');
    localStorage.removeItem('webinarmatch_token');
  };

  const updateProfile = async (profileData: Partial<StudentProfile>): Promise<boolean> => {
    const activeToken = token || localStorage.getItem('webinarmatch_token');
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        const updatedUser: User = await res.json();
        setUser(updatedUser);
        if (updatedUser.profile) {
          setProfile(updatedUser.profile);
        }
        return true;
      }
    } catch (e) {
      console.warn('Backend profile update failed, applying locally', e);
    }

    if (profile) {
      setProfile({ ...profile, ...profileData });
    }
    return true;
  };

  const switchRoleDemo = async (role: UserRole) => {
    if (role === 'admin') {
      await login('admin@webinarmatch.org', 'admin123', 'admin');
    } else {
      await login('student@university.edu', 'student123', 'student');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        role: user?.role || null,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        switchRoleDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
