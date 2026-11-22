import React from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { usePwa } from '../../context/PwaContext';

export const PwaInstallBanner: React.FC = () => {
  const { canInstall, isStandalone, showInstallBanner, installPwa, dismissInstallBanner } = usePwa();

  if (!canInstall || isStandalone || !showInstallBanner) {
    return null;
  }

  const handleInstallClick = async () => {
    await installPwa();
  };

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-blue-500/30 rounded-2xl p-4 shadow-2xl shadow-blue-900/20 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shrink-0 shadow-md">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
              Install WebinarPH App
            </h4>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              PWA
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
            Add to your home screen for quick, fullscreen mobile access and webinar reminders.
          </p>
          <div className="flex items-center gap-2 mt-2.5">
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Now</span>
            </button>
            <button
              onClick={dismissInstallBanner}
              className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>
        <button
          onClick={dismissInstallBanner}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
