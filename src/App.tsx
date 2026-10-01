/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Search,
  Filter,
  CheckCircle2,
  Plus,
  Flame,
  Calendar,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Habit, HabitCategory, HabitLogs, TimeOfDay } from './types/habit';
import {
  loadHabitsFromStorage,
  saveHabitsToStorage,
  loadLogsFromStorage,
  saveLogsToStorage,
  loadSoundSetting,
  saveSoundSetting,
  loadThemeSetting,
  saveThemeSetting,
  INITIAL_HABITS,
  generateInitialLogs,
} from './utils/storage';
import {
  formatDateKey,
  getDailyCompletionRate,
  getTodayKey,
  isHabitCompleted,
} from './utils/dateUtils';
import { playSuccessChime, playTickSound, playUndoSound } from './utils/audio';

import { Header, NavTab } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DateNavigator } from './components/DateNavigator';
import { HabitCard } from './components/HabitCard';
import { HabitModal } from './components/HabitModal';
import { WeeklyMatrixView } from './components/WeeklyMatrixView';
import { AnalyticsView } from './components/AnalyticsView';
import { GuideAndSettingsView } from './components/GuideAndSettingsView';
import { MotivationalQuote } from './components/MotivationalQuote';

export default function App() {
  // State Initialization
  const [habits, setHabits] = useState<Habit[]>(() => loadHabitsFromStorage());
  const [logs, setLogs] = useState<HabitLogs>(() => loadLogsFromStorage());
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayKey());
  const [currentTab, setCurrentTab] = useState<NavTab>('daily');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => loadSoundSetting());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadThemeSetting());

  // Filter States for Daily View
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'semua' | HabitCategory>('semua');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'semua' | TimeOfDay>('semua');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'semua' | 'pending' | 'completed'>('semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Sync Theme with DOM
  useEffect(() => {
    saveThemeSetting(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync Habits to LocalStorage
  useEffect(() => {
    saveHabitsToStorage(habits);
  }, [habits]);

  // Sync Logs to LocalStorage
  useEffect(() => {
    saveLogsToStorage(logs);
  }, [logs]);

  // Sync Sound Setting
  useEffect(() => {
    saveSoundSetting(soundEnabled);
  }, [soundEnabled]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // Completion calculation for selected date
  const todayRate = useMemo(() => {
    return getDailyCompletionRate(habits, logs, selectedDate);
  }, [habits, logs, selectedDate]);

  // Check celebration trigger
  const triggerCelebration = () => {
    playSuccessChime(soundEnabled);
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
      });
    } catch {
      // Fallback
    }
  };

  // Toggle Boolean Habit Handler
  const handleToggleBooleanHabit = (habitId: string) => {
    setLogs((prevLogs) => {
      const dayLogs = { ...(prevLogs[selectedDate] || {}) };
      const currentLog = dayLogs[habitId];
      const newCompleted = !currentLog?.completed;

      dayLogs[habitId] = {
        completed: newCompleted,
        completedAt: newCompleted ? new Date().toISOString() : undefined,
      };

      const updated = {
        ...prevLogs,
        [selectedDate]: dayLogs,
      };

      // Sound feedback
      if (newCompleted) {
        playTickSound(soundEnabled);

        // Check if all habits now 100% completed
        const activeHabits = habits.filter((h) => !h.archived);
        const allDone = activeHabits.every((h) => {
          if (h.id === habitId) return true;
          return isHabitCompleted(h, updated, selectedDate);
        });

        if (allDone && activeHabits.length > 0) {
          setTimeout(() => triggerCelebration(), 120);
        }
      } else {
        playUndoSound(soundEnabled);
      }

      return updated;
    });
  };

  // Update Numeric Habit Handler
  const handleUpdateNumericHabit = (habitId: string, newValue: number) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const target = habit.targetValue || 1;
    const isNowCompleted = newValue >= target;

    setLogs((prevLogs) => {
      const dayLogs = { ...(prevLogs[selectedDate] || {}) };
      const wasCompleted = (dayLogs[habitId]?.value ?? 0) >= target;

      dayLogs[habitId] = {
        completed: isNowCompleted,
        value: newValue,
        completedAt: isNowCompleted ? new Date().toISOString() : undefined,
      };

      const updated = {
        ...prevLogs,
        [selectedDate]: dayLogs,
      };

      if (isNowCompleted && !wasCompleted) {
        playTickSound(soundEnabled);
        const activeHabits = habits.filter((h) => !h.archived);
        const allDone = activeHabits.every((h) => {
          if (h.id === habitId) return true;
          return isHabitCompleted(h, updated, selectedDate);
        });

        if (allDone && activeHabits.length > 0) {
          setTimeout(() => triggerCelebration(), 120);
        }
      } else if (!isNowCompleted && wasCompleted) {
        playUndoSound(soundEnabled);
      }

      return updated;
    });
  };

  // Toggle habit directly on a specified date (from weekly view)
  const handleToggleHabitOnDate = (habitId: string, dateKey: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    setLogs((prevLogs) => {
      const dayLogs = { ...(prevLogs[dateKey] || {}) };
      const current = dayLogs[habitId];
      const currentlyCompleted = habit.type === 'boolean'
        ? !!current?.completed
        : (current?.value ?? 0) >= (habit.targetValue || 1);

      const willBeCompleted = !currentlyCompleted;

      if (habit.type === 'boolean') {
        dayLogs[habitId] = {
          completed: willBeCompleted,
          completedAt: willBeCompleted ? new Date().toISOString() : undefined,
        };
      } else {
        const val = willBeCompleted ? (habit.targetValue || 1) : 0;
        dayLogs[habitId] = {
          completed: willBeCompleted,
          value: val,
          completedAt: willBeCompleted ? new Date().toISOString() : undefined,
        };
      }

      if (willBeCompleted) {
        playTickSound(soundEnabled);
      } else {
        playUndoSound(soundEnabled);
      }

      return {
        ...prevLogs,
        [dateKey]: dayLogs,
      };
    });
  };

  // Reset Habit on Selected Day
  const handleResetHabitDay = (habitId: string) => {
    setLogs((prevLogs) => {
      const dayLogs = { ...(prevLogs[selectedDate] || {}) };
      delete dayLogs[habitId];
      playUndoSound(soundEnabled);
      return {
        ...prevLogs,
        [selectedDate]: dayLogs,
      };
    });
  };

  // Save Habit (Create or Update)
  const handleSaveHabit = (savedHabit: Habit) => {
    setHabits((prev) => {
      const existsIndex = prev.findIndex((h) => h.id === savedHabit.id);
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = savedHabit;
        return next;
      }
      return [savedHabit, ...prev];
    });
  };

  // Delete Habit
  const handleDeleteHabit = (habitId: string) => {
    if (confirm('Hapus kebiasaan ini secara permanen?')) {
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
    }
  };

  // Restore Data from Backup
  const handleRestoreData = (newHabits: Habit[], newLogs: HabitLogs) => {
    setHabits(newHabits);
    setLogs(newLogs);
  };

  // Reset to Sample Data
  const handleResetToSample = () => {
    setHabits(INITIAL_HABITS);
    setLogs(generateInitialLogs());
  };

  // Clear All Data
  const handleClearAllData = () => {
    setHabits([]);
    setLogs({});
  };

  // Filtered Habits for Daily Tab
  const filteredHabits = useMemo(() => {
    return habits
      .filter((h) => !h.archived)
      .filter((h) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          h.title.toLowerCase().includes(q) ||
          (h.description && h.description.toLowerCase().includes(q))
        );
      })
      .filter((h) => {
        if (selectedCategoryFilter === 'semua') return true;
        return h.category === selectedCategoryFilter;
      })
      .filter((h) => {
        if (selectedTimeFilter === 'semua') return true;
        return h.timeOfDay === selectedTimeFilter || h.timeOfDay === 'semua';
      })
      .filter((h) => {
        if (selectedStatusFilter === 'semua') return true;
        const completed = isHabitCompleted(h, logs, selectedDate);
        return selectedStatusFilter === 'completed' ? completed : !completed;
      });
  }, [
    habits,
    logs,
    selectedDate,
    searchQuery,
    selectedCategoryFilter,
    selectedTimeFilter,
    selectedStatusFilter,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-20 md:pb-12 transition-colors">
      
      {/* 3-Zone Top Bar */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenNewHabitModal={() => {
          setEditingHabit(null);
          setIsModalOpen(true);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        todayCompletionRate={todayRate.percentage}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* TAB 1: DAILY TRACKER (Hari Ini) */}
        {currentTab === 'daily' && (
          <div className="space-y-6">
            
            {/* Top Row: Motivational Quote & Quick Progress Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <MotivationalQuote />
              </div>

              {/* Progress Summary Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Progres Harian Terpilih
                  </span>
                  <span className={`text-xs font-bold tabular-nums ${
                    todayRate.percentage === 100
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {todayRate.completedCount} dari {todayRate.totalCount} Selesai
                  </span>
                </div>

                <div className="my-3">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {todayRate.percentage}%
                    </span>
                    {todayRate.percentage === 100 && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Target Sempurna!
                      </span>
                    )}
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        todayRate.percentage === 100 ? 'bg-emerald-500' : 'bg-slate-900 dark:bg-white'
                      }`}
                      style={{ width: `${todayRate.percentage}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {todayRate.percentage === 100
                    ? 'Luar biasa! Semua kebiasaan hari ini telah selesai.'
                    : todayRate.percentage > 0
                    ? 'Langkah bagus, lanjutkan sisa kebiasaan hari ini.'
                    : 'Mulai dengan satu kebiasaan kecil sekarang!'}
                </p>
              </div>
            </div>

            {/* Interactive Date Navigator Strip */}
            <DateNavigator
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              habits={habits}
              logs={logs}
            />

            {/* Filter and Search Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari kebiasaan (misal: Air, Meditasi, Olahraga)..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
                  />
                </div>

                {/* Status Segmented Filter */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 self-start sm:self-auto">
                  <button
                    onClick={() => setSelectedStatusFilter('semua')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      selectedStatusFilter === 'semua'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Semua ({habits.filter((h) => !h.archived).length})
                  </button>
                  <button
                    onClick={() => setSelectedStatusFilter('pending')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      selectedStatusFilter === 'pending'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Belum ({todayRate.totalCount - todayRate.completedCount})
                  </button>
                  <button
                    onClick={() => setSelectedStatusFilter('completed')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      selectedStatusFilter === 'completed'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Selesai ({todayRate.completedCount})
                  </button>
                </div>
              </div>

              {/* Secondary Category & Time Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Kategori:</span>
                {(['semua', 'kesehatan', 'belajar', 'mindfulness', 'produktivitas'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      selectedCategoryFilter === cat
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}

                <span className="text-slate-300 dark:text-slate-700 mx-1">|</span>

                <span className="text-slate-400 dark:text-slate-500 font-medium">Waktu:</span>
                {(['semua', 'pagi', 'siang', 'malam'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTimeFilter(t)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                      selectedTimeFilter === t
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Habit Cards Grid */}
            {filteredHabits.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Tidak Ada Kebiasaan yang Cocok
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
                  Coba sesuaikan kata kunci pencarian atau filter status yang Anda pilih, atau buat kebiasaan baru.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategoryFilter('semua');
                    setSelectedTimeFilter('semua');
                    setSelectedStatusFilter('semua');
                    setEditingHabit(null);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  + Tambah Kebiasaan Baru
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    logs={logs}
                    selectedDate={selectedDate}
                    onToggleBooleanHabit={handleToggleBooleanHabit}
                    onUpdateNumericHabit={handleUpdateNumericHabit}
                    onEditHabit={(h) => {
                      setEditingHabit(h);
                      setIsModalOpen(true);
                    }}
                    onDeleteHabit={handleDeleteHabit}
                    onResetHabitDay={handleResetHabitDay}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: WEEKLY MATRIX VIEW (Mingguan) */}
        {currentTab === 'weekly' && (
          <WeeklyMatrixView
            habits={habits}
            logs={logs}
            onToggleHabit={handleToggleHabitOnDate}
            onOpenNewHabitModal={() => {
              setEditingHabit(null);
              setIsModalOpen(true);
            }}
          />
        )}

        {/* TAB 3: STATS & HEATMAP VIEW (Statistik & Heatmap) */}
        {currentTab === 'stats' && (
          <AnalyticsView habits={habits} logs={logs} />
        )}

        {/* TAB 4: GUIDE & BACKUP (Panduan & Cadangan) */}
        {currentTab === 'guide' && (
          <GuideAndSettingsView
            habits={habits}
            logs={logs}
            onRestoreData={handleRestoreData}
            onResetToSample={handleResetToSample}
            onClearAllData={handleClearAllData}
          />
        )}

      </main>

      {/* Floating CTA for Quick Habit Addition on Desktop Bottom Corner */}
      <div className="fixed bottom-6 right-6 z-20 hidden md:block">
        <button
          onClick={() => {
            setEditingHabit(null);
            setIsModalOpen(true);
          }}
          title="Tambah Kebiasaan Baru"
          aria-label="Tambah Kebiasaan Baru"
          className="h-12 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Tambah Kebiasaan</span>
        </button>
      </div>

      {/* Habit Create / Edit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
        onSaveHabit={handleSaveHabit}
        editingHabit={editingHabit}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenNewHabitModal={() => {
          setEditingHabit(null);
          setIsModalOpen(true);
        }}
      />

    </div>
  );
}
