import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, RotateCcw } from 'lucide-react';
import { Habit, HabitLogs, COLOR_CLASSES } from '../types/habit';
import {
  formatIndonesianShortDate,
  getDaysOffset,
  getTodayKey,
  getWeekDays,
  INDONESIAN_DAYS_SHORT,
  isHabitCompleted,
  parseDateKey,
} from '../utils/dateUtils';
import { HabitIcon } from './HabitIcon';

interface WeeklyMatrixViewProps {
  habits: Habit[];
  logs: HabitLogs;
  onToggleHabit: (habitId: string, dateKey: string) => void;
  onOpenNewHabitModal: () => void;
}

export const WeeklyMatrixView: React.FC<WeeklyMatrixViewProps> = ({
  habits,
  logs,
  onToggleHabit,
  onOpenNewHabitModal,
}) => {
  const todayKey = getTodayKey();
  const [currentWeekCenter, setCurrentWeekCenter] = useState<string>(todayKey);

  const weekDays = getWeekDays(currentWeekCenter);
  const activeHabits = habits.filter((h) => !h.archived);

  const handlePrevWeek = () => {
    setCurrentWeekCenter(getDaysOffset(currentWeekCenter, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekCenter(getDaysOffset(currentWeekCenter, 7));
  };

  const handleResetToCurrentWeek = () => {
    setCurrentWeekCenter(todayKey);
  };

  const firstDay = weekDays[0];
  const lastDay = weekDays[6];

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Matriks Mingguan Kebiasaan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Periode: {formatIndonesianShortDate(firstDay)} – {formatIndonesianShortDate(lastDay)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToCurrentWeek}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Minggu Ini</span>
          </button>

          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
            <button
              onClick={handlePrevWeek}
              aria-label="Minggu Sebelumnya"
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextWeek}
              aria-label="Minggu Berikutnya"
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {activeHabits.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Belum ada kebiasaan aktif untuk ditampilkan.
            </p>
            <button
              onClick={onOpenNewHabitModal}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl"
            >
              Tambah Kebiasaan Pertama
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40">
                  <th className="py-3.5 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 min-w-[200px]">
                    Kebiasaan
                  </th>
                  {weekDays.map((dKey) => {
                    const dObj = parseDateKey(dKey);
                    const dayName = INDONESIAN_DAYS_SHORT[dObj.getDay()];
                    const dayNum = dObj.getDate();
                    const isToday = dKey === todayKey;

                    return (
                      <th
                        key={dKey}
                        className={`py-3.5 px-2 text-center min-w-[54px] ${
                          isToday ? 'bg-emerald-50/60 dark:bg-emerald-950/20' : ''
                        }`}
                      >
                        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                          {dayName}
                        </div>
                        <div className={`text-xs font-bold tabular-nums mt-0.5 ${
                          isToday ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                        }`}>
                          {dayNum}
                        </div>
                      </th>
                    );
                  })}
                  <th className="py-3.5 px-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 min-w-[70px]">
                    Mingguan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeHabits.map((habit) => {
                  const colorTheme = COLOR_CLASSES[habit.color] || COLOR_CLASSES.emerald;
                  let weekCompletedCount = 0;

                  return (
                    <tr
                      key={habit.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Habit info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorTheme.bgLight} ${colorTheme.bgDark} ${colorTheme.textLight} ${colorTheme.textDark}`}
                          >
                            <HabitIcon name={habit.icon} className="w-4 h-4" />
                          </div>
                          <div className="truncate max-w-[180px] sm:max-w-xs">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                              {habit.title}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                              {habit.type === 'numeric' ? `${habit.targetValue} ${habit.unit}/hari` : 'Checklist'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 7 Days Toggle Buttons */}
                      {weekDays.map((dKey) => {
                        const isCompleted = isHabitCompleted(habit, logs, dKey);
                        if (isCompleted) weekCompletedCount++;
                        const isToday = dKey === todayKey;

                        return (
                          <td
                            key={dKey}
                            className={`py-2 px-1 text-center ${
                              isToday ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''
                            }`}
                          >
                            <button
                              onClick={() => onToggleHabit(habit.id, dKey)}
                              title={`${habit.title} (${dKey})`}
                              className={`w-8 h-8 mx-auto rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'border border-slate-200 dark:border-slate-700 hover:border-slate-400 text-transparent hover:text-slate-300'
                              }`}
                            >
                              <Check className={`w-4 h-4 stroke-[2.5] ${isCompleted ? 'opacity-100' : 'opacity-0'}`} />
                            </button>
                          </td>
                        );
                      })}

                      {/* Weekly Completion Ratio */}
                      <td className="py-3 px-4 text-right">
                        <span className="text-xs font-bold tabular-nums text-slate-700 dark:text-slate-300">
                          {weekCompletedCount}/7
                        </span>
                        <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tabular-nums">
                          {Math.round((weekCompletedCount / 7) * 100)}%
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
