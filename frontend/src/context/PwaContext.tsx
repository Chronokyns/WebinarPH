import React, { createContext, useContext, useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PwaContextType {
  isOnline: boolean;
  canInstall: boolean;
  isStandalone: boolean;
  installPwa: () => Promise<boolean>;
  dismissInstallBanner: () => void;
  showInstallBanner: boolean;
  notificationPermission: NotificationPermission | 'unsupported';
  requestNotificationPermission: () => Promise<boolean>;
  sendWebinarReminder: (title: string, body: string, url?: string) => Promise<boolean>;
}

const PwaContext = createContext<PwaContextType | undefined>(undefined);

export const PwaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    // 1. Online / Offline status listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 2. Check if running as installed standalone PWA
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // 3. Listen for browser PWA install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);

      // Check if user previously dismissed banner within 24 hours
      const lastDismissed = localStorage.getItem('webinarph_pwa_dismissed');
      if (!lastDismissed || Date.now() - Number(lastDismissed) > 86400000) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 4. App installed listener
    const handleAppInstalled = () => {
      setCanInstall(false);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      console.log('[PWA] WebinarPH was successfully installed!');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 5. Initial Notification Permission check
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    } else {
      setNotificationPermission('unsupported');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPwa = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setCanInstall(false);
        setShowInstallBanner(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('[PWA] Install prompt failed:', err);
      return false;
    }
  };

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('webinarph_pwa_dismissed', String(Date.now()));
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      setNotificationPermission('unsupported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === 'granted';
    } catch (e) {
      console.warn('[PWA] Notification permission request error:', e);
      return false;
    }
  };

  const sendWebinarReminder = async (
    title: string,
    body: string,
    url: string = '/calendar'
  ): Promise<boolean> => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return false;
    }

    try {
      // If service worker is ready, use it for rich persistent notification
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration && registration.showNotification) {
          await registration.showNotification(title, {
            body,
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            data: { url },
          });
          return true;
        }
      }

      // Fallback to standard window Notification
      new Notification(title, {
        body,
        icon: '/icons/icon-192.png',
      });
      return true;
    } catch (err) {
      console.warn('[PWA] Failed to display notification:', err);
      return false;
    }
  };

  return (
    <PwaContext.Provider
      value={{
        isOnline,
        canInstall,
        isStandalone,
        installPwa,
        dismissInstallBanner,
        showInstallBanner,
        notificationPermission,
        requestNotificationPermission,
        sendWebinarReminder,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
};

export const usePwa = (): PwaContextType => {
  const context = useContext(PwaContext);
  if (!context) {
    throw new Error('usePwa must be used within a PwaProvider');
  }
  return context;
};
