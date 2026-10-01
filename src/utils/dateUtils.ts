import { Habit, HabitLogs } from '../types/habit';

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const INDONESIAN_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
];

export const INDONESIAN_DAYS = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

export const INDONESIAN_DAYS_SHORT = [
  'Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'
];

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function formatIndonesianFullDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  const dayName = INDONESIAN_DAYS[date.getDay()];
  const dayNumber = date.getDate();
  const monthName = INDONESIAN_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${dayNumber} ${monthName} ${year}`;
}

export function formatIndonesianShortDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  const dayNumber = date.getDate();
  const monthName = INDONESIAN_MONTHS_SHORT[date.getMonth()];
  return `${dayNumber} ${monthName}`;
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return formatDateKey(d1) === formatDateKey(d2);
}

export function isDateToday(dateKey: string): boolean {
  return dateKey === getTodayKey();
}

export function getDaysOffset(dateKey: string, offset: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + offset);
  return formatDateKey(date);
}

export function getDateStrip(centerDateKey: string, totalDays: number = 7): string[] {
  const centerDate = parseDateKey(centerDateKey);
  const half = Math.floor(totalDays / 2);
  const dates: string[] = [];

  for (let i = -half; i <= half; i++) {
    const d = new Date(centerDate);
    d.setDate(d.getDate() + i);
    dates.push(formatDateKey(d));
  }
  return dates;
}

export function getWeekDays(dateKey: string): string[] {
  const date = parseDateKey(dateKey);
  // Start week from Monday (1) to Sunday (0)
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(monday.getDate() + diffToMonday);

  const week: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    week.push(formatDateKey(d));
  }
  return week;
}

export function isHabitCompleted(habit: Habit, logs: HabitLogs, dateKey: string): boolean {
  const dayLog = logs[dateKey]?.[habit.id];
  if (!dayLog) return false;
  if (habit.type === 'boolean') {
    return !!dayLog.completed;
  }
  if (habit.type === 'numeric') {
    const val = dayLog.value ?? 0;
    const target = habit.targetValue || 1;
    return val >= target;
  }
  return false;
}

export function getHabitProgressValue(habit: Habit, logs: HabitLogs, dateKey: string): number {
  const dayLog = logs[dateKey]?.[habit.id];
  if (!dayLog) return 0;
  if (habit.type === 'boolean') {
    return dayLog.completed ? 1 : 0;
  }
  return dayLog.value ?? 0;
}

export function calculateHabitStats(habit: Habit, logs: HabitLogs) {
  let currentStreak = 0;
  let bestStreak = 0;
  let totalCompletions = 0;

  const today = new Date();
  const todayKey = formatDateKey(today);
  const yesterdayKey = getDaysOffset(todayKey, -1);

  // Check if today or yesterday is completed to keep streak alive
  let isCurrentStreakActive = false;
  let checkDate = new Date(today);

  if (isHabitCompleted(habit, logs, todayKey)) {
    isCurrentStreakActive = true;
  } else if (isHabitCompleted(habit, logs, yesterdayKey)) {
    isCurrentStreakActive = true;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  if (isCurrentStreakActive) {
    while (true) {
      const dKey = formatDateKey(checkDate);
      if (isHabitCompleted(habit, logs, dKey)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate best streak and total across all recorded days
  const allDates = Object.keys(logs).sort();
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dateKey of allDates) {
    if (isHabitCompleted(habit, logs, dateKey)) {
      totalCompletions++;
      const curDate = parseDateKey(dateKey);

      if (prevDate) {
        const diffTime = curDate.getTime() - prevDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }

      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
      prevDate = curDate;
    }
  }

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  return {
    currentStreak,
    bestStreak,
    totalCompletions,
  };
}

export function getDailyCompletionRate(habits: Habit[], logs: HabitLogs, dateKey: string): {
  completedCount: number;
  totalCount: number;
  percentage: number;
} {
  const activeHabits = habits.filter(h => !h.archived);
  if (activeHabits.length === 0) {
    return { completedCount: 0, totalCount: 0, percentage: 0 };
  }

  let completedCount = 0;
  for (const h of activeHabits) {
    if (isHabitCompleted(h, logs, dateKey)) {
      completedCount++;
    }
  }

  const percentage = Math.round((completedCount / activeHabits.length) * 100);
  return {
    completedCount,
    totalCount: activeHabits.length,
    percentage,
  };
}

export function generateHeatmapData(habits: Habit[], logs: HabitLogs, daysCount: number = 70) {
  const activeHabits = habits.filter(h => !h.archived);
  const today = new Date();
  const days: Array<{
    dateKey: string;
    completed: number;
    total: number;
    ratio: number;
    level: 0 | 1 | 2 | 3 | 4;
    label: string;
    dayOfWeek: number;
  }> = [];

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = formatDateKey(d);

    let completed = 0;
    for (const h of activeHabits) {
      if (isHabitCompleted(h, logs, dateKey)) {
        completed++;
      }
    }

    const total = activeHabits.length || 1;
    const ratio = completed / total;

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (completed === 0) level = 0;
    else if (ratio <= 0.25) level = 1;
    else if (ratio <= 0.5) level = 2;
    else if (ratio <= 0.75) level = 3;
    else level = 4;

    days.push({
      dateKey,
      completed,
      total: activeHabits.length,
      ratio,
      level,
      label: formatIndonesianFullDate(dateKey),
      dayOfWeek: d.getDay(),
    });
  }

  return days;
}
