import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => void;
  deleteNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    user_id: 1,
    title: 'Webinar Starting Soon',
    message: '"Modern Cloud Architecture & Microservices" begins in 3 hours on Zoom. Have your questions ready!',
    type: 'starting_soon',
    webinar_id: 1,
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    title: 'Registration Deadline Approaching',
    message: 'Registration closes in 24 hours for "Ethical Hacking & Network Defense with Free Certificate".',
    type: 'deadline_warning',
    webinar_id: 2,
    is_read: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    title: 'New AI Recommendation',
    message: 'Based on your interest in Data Science, we found "Generative AI in Medical Imaging" (ACM Student Chapter).',
    type: 'recommendation',
    webinar_id: 4,
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 4,
    user_id: 1,
    title: 'Catalog Synchronized',
    message: 'Successfully aggregated 18 verified academic webinars from IEEE, ACM, and Google Developers.',
    type: 'system',
    is_read: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('webinarmatch_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_NOTIFICATIONS; }
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('webinarmatch_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => {
    const newEntry: Notification = {
      ...notif,
      id: Date.now(),
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [newEntry, ...prev]);
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
