import React from 'react';
import { AlertTriangle, Clock, Calendar, X } from 'lucide-react';
import { Webinar } from '../../types';

interface ConflictWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetWebinar: Webinar;
  conflictingWebinars: Webinar[];
  actionLabel?: string;
}

export const ConflictWarningModal: React.FC<ConflictWarningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  targetWebinar,
  conflictingWebinars,
  actionLabel = 'Proceed Anyway',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-amber-200 dark:border-amber-900/50 p-6 overflow-hidden">
        
        {/* Header Alert */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Schedule Conflict Detected
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              This webinar overlaps with one or more webinars already on your personal schedule.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Webinar Info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs mb-3">
          <div className="font-semibold text-slate-900 dark:text-slate-200 truncate">
            {targetWebinar.title}
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>
              {new Date(targetWebinar.start_time).toLocaleDateString()} • {new Date(targetWebinar.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(targetWebinar.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Existing Conflicting Webinar(s) */}
        <div className="space-y-2 mb-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Overlaps with your existing scheduled webinar:
          </span>
          {conflictingWebinars.map((cw) => (
            <div
              key={cw.id}
              className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-800/40 text-xs"
            >
              <div className="font-medium text-slate-900 dark:text-slate-200 truncate">
                {cw.title}
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {new Date(cw.start_time).toLocaleDateString()} • {new Date(cw.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(cw.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md shadow-amber-600/20 transition-colors"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
