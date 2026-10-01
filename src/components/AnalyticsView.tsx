import React, { useState } from 'react';
import { Flame, Trophy, CheckCircle2, TrendingUp, Calendar, Zap } from 'lucide-react';
import { Habit, HabitLogs, CATEGORY_LABELS, COLOR_CLASSES } from '../types/habit';
import {
  calculateHabitStats,
  generateHeatmapData,
  isHabitCompleted,
} from '../utils/dateUtils';
import { HabitIcon } from './HabitIcon';

interface AnalyticsViewProps {
  habits: Habit[];
  logs: HabitLogs;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ habits, logs }) => {
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{
    date: string;
    completed: number;
    total: number;
    label: string;
  } | null>(null);

  const activeHabits = habits.filter((h) => !h.archived);
  const heatmapDays = generateHeatmapData(habits, logs, 70); // 10 weeks

  // Calculate high-level metrics
  let totalCompletionsAllTime = 0;
  let topStreakHabit: { habit: Habit; streak: number } | null = null;
  let bestAllTimeStreak = 0;

  for (const habit of activeHabits) {
    const stats = calculateHabitStats(habit, logs);
    totalCompletionsAllTime += stats.totalCompletions;
    const currentTopStreak = topStreakHabit ? topStreakHabit.streak : 0;
    if (stats.currentStreak > currentTopStreak) {
      topStreakHabit = { habit, streak: stats.currentStreak };
    }
    if (stats.bestStreak > bestAllTimeStreak) {
      bestAllTimeStreak = stats.bestStreak;
    }
  }

  // Calculate 30-day average rate
  const last30Days = heatmapDays.slice(heatmapDays.length - 30);
  const totalRatios = last30Days.reduce((acc, cur) => acc + cur.ratio, 0);
  const avg30DayRate = last30Days.length > 0 ? Math.round((totalRatios / last30Days.length) * 100) : 0;

  // Category breakdown
  const categoryStats: Record<string, { total: number; completed: number }> = {};
  for (const h of activeHabits) {
    if (!categoryStats[h.category]) {
      categoryStats[h.category] = { total: 0, completed: 0 };
    }
    categoryStats[h.category].total++;
    // Check completion across last 7 days
    for (const d of last30Days.slice(-7)) {
      if (isHabitCompleted(h, logs, d.dateKey)) {
        categoryStats[h.category].completed++;
      }
    }
  }

  return (
    <div className="space-y-6">
      
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Active Habits */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Kebiasaan Aktif</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {activeHabits.length}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Rutinitas terpantau setiap hari
          </p>
        </div>

        {/* 30-Day Completion Rate */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Tingkat Konsistensi (30 Hari)</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {avg30DayRate}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Rata-rata kepatuhan harian
          </p>
        </div>

        {/* Top Streak */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Streak Berjalan Tertinggi</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
            {topStreakHabit?.streak || 0} <span className="text-sm font-semibold">hari</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {topStreakHabit?.habit.title || 'Belum ada streak'}
          </p>
        </div>

        {/* All-time record streak */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Ceklis Selesai</span>
            <Trophy className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {totalCompletionsAllTime}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Rekor terpanjang: {bestAllTimeStreak} hari
          </p>
        </div>

      </div>

      {/* Heatmap Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Peta Konsistensi (Heatmap 70 Hari Terakhir)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Setiap kotak mewakili tingkat keberhasilan penyelesaian kebiasaan per hari.
            </p>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Rendah</span>
            <div className="w-3 h-3 rounded-xs bg-slate-100 dark:bg-slate-800" />
            <div className="w-3 h-3 rounded-xs bg-emerald-200 dark:bg-emerald-900/60" />
            <div className="w-3 h-3 rounded-xs bg-emerald-400 dark:bg-emerald-700" />
            <div className="w-3 h-3 rounded-xs bg-emerald-600 dark:bg-emerald-500" />
            <span>100%</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[500px]">
            {heatmapDays.map((day) => {
              const bgClass =
                day.level === 0
                  ? 'bg-slate-100 dark:bg-slate-800/80 hover:ring-2 hover:ring-slate-400'
                  : day.level === 1
                  ? 'bg-emerald-200 dark:bg-emerald-950 text-emerald-900'
                  : day.level === 2
                  ? 'bg-emerald-300 dark:bg-emerald-800'
                  : day.level === 3
                  ? 'bg-emerald-500 dark:bg-emerald-600'
                  : 'bg-emerald-600 dark:bg-emerald-400';

              return (
                <button
                  key={day.dateKey}
                  type="button"
                  onClick={() =>
                    setSelectedHeatmapCell({
                      date: day.dateKey,
                      completed: day.completed,
                      total: day.total,
                      label: day.label,
                    })
                  }
                  title={`${day.label}: ${day.completed}/${day.total} selesai (${Math.round(day.ratio * 100)}%)`}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-xs transition-transform hover:scale-125 cursor-pointer ${bgClass}`}
                />
              );
            })}
          </div>
        </div>

        {/* Selected Heatmap Cell Info */}
        {selectedHeatmapCell && (
          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {selectedHeatmapCell.label}
              </span>
              <span className="text-slate-500 dark:text-slate-400 ml-2">
                — {selectedHeatmapCell.completed} dari {selectedHeatmapCell.total} kebiasaan terselesaikan
              </span>
            </div>
            <button
              onClick={() => setSelectedHeatmapCell(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Streak Leaderboard & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Streak Leaderboard */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Peringkat Konsistensi (Streak)</span>
          </h3>

          <div className="space-y-3">
            {activeHabits.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">Belum ada data kebiasaan.</p>
            ) : (
              activeHabits
                .map((h) => ({
                  habit: h,
                  stats: calculateHabitStats(h, logs),
                }))
                .sort((a, b) => b.stats.currentStreak - a.stats.currentStreak)
                .map(({ habit, stats }, idx) => {
                  const colorTheme = COLOR_CLASSES[habit.color] || COLOR_CLASSES.emerald;

                  return (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-center font-bold text-xs text-slate-400 tabular-nums">
                          #{idx + 1}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorTheme.bgLight} ${colorTheme.bgDark} ${colorTheme.textLight} ${colorTheme.textDark}`}
                        >
                          <HabitIcon name={habit.icon} className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">
                            {habit.title}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500">
                            Total {stats.totalCompletions} hari selesai
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400 tabular-nums flex items-center justify-end gap-1">
                          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{stats.currentStreak} hari</span>
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                          Rekor: {stats.bestStreak} hari
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Penyebaran Berdasarkan Kategori</span>
          </h3>

          <div className="space-y-3.5">
            {Object.keys(CATEGORY_LABELS).map((catKey) => {
              const catHabits = activeHabits.filter((h) => h.category === catKey);
              if (catHabits.length === 0) return null;

              const label = CATEGORY_LABELS[catKey as keyof typeof CATEGORY_LABELS];

              return (
                <div key={catKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {label}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                      {catHabits.length} kebiasaan
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (catHabits.length / activeHabits.length) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
