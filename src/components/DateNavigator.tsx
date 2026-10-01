import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import {
  formatDateKey,
  formatIndonesianFullDate,
  formatIndonesianShortDate,
  getDateStrip,
  getDaysOffset,
  getTodayKey,
  INDONESIAN_DAYS_SHORT,
  isDateToday,
  parseDateKey,
} from '../utils/dateUtils';
import { Habit, HabitLogs } from '../types/habit';
import { getDailyCompletionRate } from '../utils/dateUtils';

interface DateNavigatorProps {
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  habits: Habit[];
  logs: HabitLogs;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  selectedDate,
  onSelectDate,
  habits,
  logs,
}) => {
  const todayKey = getTodayKey();
  const dateStrip = getDateStrip(selectedDate, 7);

  const handlePrevDay = () => {
    onSelectDate(getDaysOffset(selectedDate, -1));
  };

  const handleNextDay = () => {
    onSelectDate(getDaysOffset(selectedDate, 1));
  };

  const handleJumpToday = () => {
    onSelectDate(todayKey);
  };

  const fullDateText = formatIndonesianFullDate(selectedDate);
  const isToday = isDateToday(selectedDate);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-colors">
      {/* Top row: Selected Date info & Quick navigations */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {fullDateText}
              </h2>
              {isToday && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  Hari Ini
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pilih tanggal untuk melihat atau memperbarui riwayat kebiasaan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {!isToday && (
            <button
              onClick={handleJumpToday}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ke Hari Ini</span>
            </button>
          )}

          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
            <button
              onClick={handlePrevDay}
              title="Hari Sebelumnya"
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextDay}
              title="Hari Berikutnya"
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Date Strip */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {dateStrip.map((dKey) => {
          const dObj = parseDateKey(dKey);
          const dayName = INDONESIAN_DAYS_SHORT[dObj.getDay()];
          const dayNum = dObj.getDate();
          const isSelected = dKey === selectedDate;
          const isCurrentToday = dKey === todayKey;
          const { completedCount, totalCount, percentage } = getDailyCompletionRate(habits, logs, dKey);

          return (
            <button
              key={dKey}
              onClick={() => onSelectDate(dKey)}
              className={`relative flex flex-col items-center justify-between py-2.5 sm:py-3 px-1 rounded-xl transition-all border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/60'
              }`}
            >
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {dayName}
              </span>

              <span className={`text-base sm:text-lg font-bold my-0.5 tabular-nums ${
                isSelected ? 'text-white dark:text-slate-900' : 'text-slate-800 dark:text-slate-100'
              }`}>
                {dayNum}
              </span>

              {/* Completion micro indicator */}
              <div className="flex items-center gap-1 mt-1">
                {totalCount > 0 ? (
                  <span className={`text-[10px] tabular-nums font-semibold ${
                    isSelected
                      ? percentage === 100
                        ? 'text-emerald-400 dark:text-emerald-600'
                        : 'text-slate-300 dark:text-slate-600'
                      : percentage === 100
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {completedCount}/{totalCount}
                  </span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                )}
              </div>

              {/* Small dot for today if not selected */}
              {isCurrentToday && !isSelected && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
