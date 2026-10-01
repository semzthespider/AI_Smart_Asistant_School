import React, { useState } from 'react';
import {
  Check,
  Flame,
  Plus,
  Minus,
  MoreVertical,
  Edit2,
  Trash2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Habit, HabitLogs, COLOR_CLASSES, CATEGORY_LABELS } from '../types/habit';
import { HabitIcon } from './HabitIcon';
import { calculateHabitStats, getHabitProgressValue, isHabitCompleted } from '../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  logs: HabitLogs;
  selectedDate: string;
  onToggleBooleanHabit: (habitId: string) => void;
  onUpdateNumericHabit: (habitId: string, newValue: number) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onResetHabitDay: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  logs,
  selectedDate,
  onToggleBooleanHabit,
  onUpdateNumericHabit,
  onEditHabit,
  onDeleteHabit,
  onResetHabitDay,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const completed = isHabitCompleted(habit, logs, selectedDate);
  const currentValue = getHabitProgressValue(habit, logs, selectedDate);
  const targetValue = habit.targetValue || 1;
  const stats = calculateHabitStats(habit, logs);
  const colorTheme = COLOR_CLASSES[habit.color] || COLOR_CLASSES.emerald;

  const progressPercent = habit.type === 'numeric'
    ? Math.min(100, Math.round((currentValue / targetValue) * 100))
    : completed ? 100 : 0;

  const timeLabel = habit.timeOfDay === 'semua' ? 'Setiap Waktu' : `Waktu: ${habit.timeOfDay.charAt(0).toUpperCase() + habit.timeOfDay.slice(1)}`;

  const handleIncrement = () => {
    onUpdateNumericHabit(habit.id, currentValue + 1);
  };

  const handleDecrement = () => {
    if (currentValue > 0) {
      onUpdateNumericHabit(habit.id, currentValue - 1);
    }
  };

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900 ${
        completed
          ? 'border-emerald-200/80 dark:border-emerald-800/40 shadow-xs'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Header row: Metadata unboxed & menu */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {CATEGORY_LABELS[habit.category]}
            </span>
            <span aria-hidden="true">·</span>
            <span>{timeLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{habit.type === 'numeric' ? `Target ${targetValue} ${habit.unit || 'unit'}` : 'Harian'}</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Opsi kebiasaan"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-7 z-30 w-44 py-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs font-medium">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEditHabit(habit);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Kebiasaan</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onResetHabitDay(habit.id);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Tanggal Ini</span>
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDeleteHabit(habit.id);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Kebiasaan</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Middle row: Icon, Title, and Action control */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                completed
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                  : `${colorTheme.bgLight} ${colorTheme.bgDark} ${colorTheme.textLight} ${colorTheme.textDark}`
              }`}
            >
              <HabitIcon name={habit.icon} className="w-5 h-5" />
            </div>

            <div>
              <h3 className={`text-base font-semibold transition-colors ${
                completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-white'
              }`}>
                {habit.title}
              </h3>
              {habit.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {habit.description}
                </p>
              )}

              {/* Streak Info */}
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className={`inline-flex items-center gap-1 font-semibold tabular-nums ${
                  stats.currentStreak > 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}>
                  <Flame className={`w-3.5 h-3.5 ${stats.currentStreak > 0 ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>{stats.currentStreak} hari beruntun</span>
                </span>
                <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">·</span>
                <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                  Rekor: {stats.bestStreak} hari
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Checkbox / Counter Action */}
          <div className="shrink-0 flex items-center">
            {habit.type === 'boolean' ? (
              <button
                onClick={() => onToggleBooleanHabit(habit.id)}
                aria-label={completed ? `Tandai ${habit.title} belum selesai` : `Tandai ${habit.title} selesai`}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                  completed
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 text-transparent hover:text-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Check className={`w-5 h-5 stroke-[2.5] ${completed ? 'scale-100' : 'scale-75'}`} />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <button
                  onClick={handleDecrement}
                  disabled={currentValue <= 0}
                  aria-label="Kurangi nilai"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm tabular-nums text-slate-800 dark:text-slate-100">
                  {currentValue}
                </span>
                <button
                  onClick={handleIncrement}
                  aria-label="Tambah nilai"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar for Numeric Habits */}
        {habit.type === 'numeric' && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 dark:text-slate-400">
                Progres: <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{currentValue}</span> / {targetValue} {habit.unit}
              </span>
              <span className={`font-semibold tabular-nums ${completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  completed ? 'bg-emerald-500' : 'bg-slate-800 dark:bg-slate-200'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
