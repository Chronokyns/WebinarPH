import React from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';
import { usePwa } from '../../context/PwaContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = usePwa();

  if (isOnline) return null;

  return (
    <aside
      aria-label="Offline Mode Notice"
      className="bg-amber-500/95 dark:bg-amber-600/95 text-slate-950 font-semibold px-4 py-2.5 text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-md animate-in slide-in-from-top duration-200 z-50 sticky top-0"
    >
      <WifiOff className="w-4 h-4 shrink-0 text-slate-900" />
      <span>
        <strong>Offline Mode:</strong> You are browsing cached content. Live webinar seat counts, registration deadlines, and bookings require an active internet connection.
      </span>
    </aside>
  );
};
