import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  AlertTriangle,
  Download,
  CheckCircle2,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { Webinar, SavedWebinar, WebinarRegistration } from '../types';

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarWebinars, setCalendarWebinars] = useState<Webinar[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<Webinar[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>(() =>
    typeof window !== 'undefined' && window.innerWidth < 640 ? 'agenda' : 'month'
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCalendarWebinars();
  }, []);

  const loadCalendarWebinars = async () => {
    setIsLoading(true);
    try {
      const [saved, tracked] = await Promise.all([
        api.getSavedWebinars(),
        api.getTrackedRegistrations(),
      ]);

      // Combine unique webinars
      const map = new Map<number, Webinar>();
      saved.forEach((s) => map.set(s.webinar_id, s.webinar));
      tracked.forEach((t) => map.set(t.webinar_id, t.webinar));

      const list = Array.from(map.values()).sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );

      setCalendarWebinars(list);

      // Default selected date webinars (today)
      const todayStr = new Date().toDateString();
      setSelectedDateEvents(list.filter((e) => new Date(e.start_time).toDateString() === todayStr));
    } catch (e) {
      console.error('Failed to load calendar webinars', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Calendar month math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (dayNum: number) => {
    const d = new Date(year, month, dayNum);
    setSelectedDate(d);
    const dayWebinars = calendarWebinars.filter((e) => new Date(e.start_time).toDateString() === d.toDateString());
    setSelectedDateEvents(dayWebinars);
  };

  // Check conflicts among scheduled webinars
  const hasConflict = (webinar: Webinar): boolean => {
    const wStart = new Date(webinar.start_time).getTime();
    const wEnd = new Date(webinar.end_time).getTime();

    return calendarWebinars.some((other) => {
      if (other.id === webinar.id) return false;
      const oStart = new Date(other.start_time).getTime();
      const oEnd = new Date(other.end_time).getTime();
      return wStart < oEnd && wEnd > oStart;
    });
  };

  // Export to .ics format
  const exportToICS = () => {
    if (calendarWebinars.length === 0) return;

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//WebinarPH//Student Calendar//EN\n";

    calendarWebinars.forEach((ev) => {
      const startIso = new Date(ev.start_time).toISOString().replace(/-|:|\.\d+/g, "");
      const endIso = new Date(ev.end_time).toISOString().replace(/-|:|\.\d+/g, "");
      icsContent += `BEGIN:VEVENT\nSUMMARY:${ev.title}\nDESCRIPTION:${ev.short_description}\nLOCATION:${ev.webinar_platform}\nDTSTART:${startIso}\nDTEND:${endIso}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'webinarph_schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Personal Webinar Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track saved sessions, prevent schedule conflicts, and stay on top of webinar deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Month Grid
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'agenda'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Agenda List
            </button>
          </div>

          {/* Export to ICS */}
          <button
            onClick={exportToICS}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export .ICS</span>
          </button>
        </div>
      </div>

      {viewMode === 'month' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Interactive Month Grid */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm space-y-4">
            
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {monthNames[month]} {year}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2 border-b border-slate-100 dark:border-slate-700/60">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-xl bg-slate-50/50 dark:bg-slate-900/20"></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const cellDate = new Date(year, month, dayNum);
                const isToday = cellDate.toDateString() === new Date().toDateString();
                const isSelected = cellDate.toDateString() === selectedDate.toDateString();

                const dayWebinars = calendarWebinars.filter(
                  (e) => new Date(e.start_time).toDateString() === cellDate.toDateString()
                );

                const dayHasConflict = dayWebinars.length > 1;

                return (
                  <div
                    key={dayNum}
                    onClick={() => handleDayClick(dayNum)}
                    className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                        : isToday
                        ? 'border-blue-300 dark:border-blue-700 bg-blue-50/20'
                        : 'border-slate-100 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        isToday ? 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center' : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {dayNum}
                      </span>
                      {dayHasConflict && (
                        <span title="Overlapping webinars scheduled">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        </span>
                      )}
                    </div>

                    {dayWebinars.length > 0 && (
                      <div className="mt-1">
                        {/* Mobile dot indicators */}
                        <div className="flex sm:hidden items-center gap-1 justify-center py-0.5">
                          {dayWebinars.slice(0, 3).map((ev) => (
                            <span
                              key={ev.id}
                              className={`w-1.5 h-1.5 rounded-full ${
                                hasConflict(ev) ? 'bg-amber-500' : 'bg-blue-600 dark:bg-blue-400'
                              }`}
                            />
                          ))}
                          {dayWebinars.length > 3 && (
                            <span className="text-[8px] text-slate-400 font-bold">+</span>
                          )}
                        </div>

                        {/* Tablet and Desktop text pills */}
                        <div className="hidden sm:block space-y-0.5">
                          {dayWebinars.slice(0, 2).map((ev) => (
                            <div
                              key={ev.id}
                              className={`text-[9px] sm:text-[10px] truncate px-1 py-0.5 rounded font-medium ${
                                hasConflict(ev)
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                                  : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                              }`}
                            >
                              {ev.title}
                            </div>
                          ))}
                          {dayWebinars.length > 2 && (
                            <div className="text-[9px] text-slate-400 font-semibold text-center">
                              +{dayWebinars.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 1 Col: Selected Date Webinar Details */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Selected Day Schedule
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
            </div>

            {selectedDateEvents.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <CalendarIcon className="w-8 h-8 mx-auto text-slate-300" />
                <p>No webinars scheduled for this date.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((ev) => {
                  const conflict = hasConflict(ev);
                  return (
                    <div
                      key={ev.id}
                      className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                        conflict
                          ? 'border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40'
                      }`}
                    >
                      {conflict && (
                        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Overlap Warning: Double-booked time!</span>
                        </div>
                      )}

                      <Link to={`/webinar/${ev.id}`}>
                        <h4 className="font-bold text-slate-900 dark:text-white hover:text-blue-600 line-clamp-2">
                          {ev.title}
                        </h4>
                      </Link>

                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>
                          {new Date(ev.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                          {new Date(ev.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({ev.timezone})
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          {ev.webinar_platform}
                        </span>

                        <a
                          href={ev.registration_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                        >
                          Join Link
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Agenda List View */
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Upcoming Chronological Agenda
          </h2>

          {calendarWebinars.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No upcoming scheduled webinars.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {calendarWebinars.map((ev) => {
                const conflict = hasConflict(ev);
                const startDate = new Date(ev.start_time);
                return (
                  <div key={ev.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          {startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({ev.timezone})
                        </span>
                        {conflict && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            <AlertTriangle className="w-3 h-3" /> Overlap
                          </span>
                        )}
                      </div>

                      <Link to={`/webinar/${ev.id}`}>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600">
                          {ev.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-400">
                        {ev.speaker_name} • {ev.organizer_name} • Platform: {ev.webinar_platform}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={ev.registration_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                      >
                        Launch Webinar
                      </a>
                      <Link
                        to={`/webinar/${ev.id}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
