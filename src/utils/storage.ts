import { Habit, HabitLogs } from '../types/habit';
import { formatDateKey, getDaysOffset, getTodayKey } from './dateUtils';

const HABITS_STORAGE_KEY = 'tracker_kebiasaan_habits_v1';
const LOGS_STORAGE_KEY = 'tracker_kebiasaan_logs_v1';
const SOUND_STORAGE_KEY = 'tracker_kebiasaan_sound_v1';
const THEME_STORAGE_KEY = 'tracker_kebiasaan_theme_v1';

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'Minum 2 Liter Air',
    description: 'Target hidrasi 8 gelas air putih per hari.',
    category: 'kesehatan',
    type: 'numeric',
    targetValue: 8,
    unit: 'gelas',
    color: 'blue',
    icon: 'Droplets',
    timeOfDay: 'semua',
    createdAt: getDaysOffset(getTodayKey(), -20),
  },
  {
    id: 'habit-2',
    title: 'Olahraga Pagi 20 Menit',
    description: 'Jogging santai, push-up, atau peregangan tubuh.',
    category: 'kesehatan',
    type: 'boolean',
    color: 'emerald',
    icon: 'Activity',
    timeOfDay: 'pagi',
    createdAt: getDaysOffset(getTodayKey(), -20),
  },
  {
    id: 'habit-3',
    title: 'Membaca Buku 15 Menit',
    description: 'Minimal 10 halaman buku pengembangan diri.',
    category: 'belajar',
    type: 'numeric',
    targetValue: 10,
    unit: 'halaman',
    color: 'amber',
    icon: 'BookOpen',
    timeOfDay: 'siang',
    createdAt: getDaysOffset(getTodayKey(), -20),
  },
  {
    id: 'habit-4',
    title: 'Meditasi & Latihan Nafas',
    description: '10 menit menenangkan pikiran dan kesadaran penuh.',
    category: 'mindfulness',
    type: 'boolean',
    color: 'indigo',
    icon: 'Smile',
    timeOfDay: 'pagi',
    createdAt: getDaysOffset(getTodayKey(), -15),
  },
  {
    id: 'habit-5',
    title: 'Menulis Jurnal & Evaluasi',
    description: 'Refleksi pencapaian hari ini dan target esok.',
    category: 'mindfulness',
    type: 'boolean',
    color: 'purple',
    icon: 'PenTool',
    timeOfDay: 'malam',
    createdAt: getDaysOffset(getTodayKey(), -15),
  },
];

export function generateInitialLogs(): HabitLogs {
  const logs: HabitLogs = {};
  const today = new Date();

  // Populate realistic activity over the past 21 days
  for (let i = 21; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = formatDateKey(d);

    logs[dateKey] = {};

    // habit-1 (air): consistently good with occasional partial
    if (i === 0) {
      logs[dateKey]['habit-1'] = { completed: false, value: 5 };
    } else {
      const glasses = i % 4 === 0 ? 6 : 8;
      logs[dateKey]['habit-1'] = { completed: glasses >= 8, value: glasses };
    }

    // habit-2 (olahraga): 5 days streak up to yesterday
    if (i === 0) {
      logs[dateKey]['habit-2'] = { completed: true };
    } else if (i <= 5) {
      logs[dateKey]['habit-2'] = { completed: true };
    } else if (i % 3 !== 0) {
      logs[dateKey]['habit-2'] = { completed: true };
    } else {
      logs[dateKey]['habit-2'] = { completed: false };
    }

    // habit-3 (membaca): strong consistency
    if (i === 0) {
      logs[dateKey]['habit-3'] = { completed: false, value: 0 };
    } else if (i <= 7) {
      logs[dateKey]['habit-3'] = { completed: true, value: 12 };
    } else if (i % 2 === 0) {
      logs[dateKey]['habit-3'] = { completed: true, value: 10 };
    }

    // habit-4 (meditasi)
    if (i <= 4 && i > 0) {
      logs[dateKey]['habit-4'] = { completed: true };
    } else if (i % 4 === 1) {
      logs[dateKey]['habit-4'] = { completed: true };
    }

    // habit-5 (jurnal malam)
    if (i <= 3 && i > 0) {
      logs[dateKey]['habit-5'] = { completed: true };
    } else if (i % 2 === 1 && i > 0) {
      logs[dateKey]['habit-5'] = { completed: true };
    }
  }

  return logs;
}

export function loadHabitsFromStorage(): Habit[] {
  try {
    const raw = localStorage.getItem(HABITS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load habits from storage', e);
  }
  return INITIAL_HABITS;
}

export function saveHabitsToStorage(habits: Habit[]): void {
  try {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error('Failed to save habits to storage', e);
  }
}

export function loadLogsFromStorage(): HabitLogs {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load logs from storage', e);
  }
  return generateInitialLogs();
}

export function saveLogsToStorage(logs: HabitLogs): void {
  try {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs to storage', e);
  }
}

export function loadSoundSetting(): boolean {
  try {
    const raw = localStorage.getItem(SOUND_STORAGE_KEY);
    return raw !== null ? raw === 'true' : true;
  } catch {
    return true;
  }
}

export function saveSoundSetting(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
  } catch {
    // Ignore
  }
}

export function loadThemeSetting(): 'light' | 'dark' {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === 'dark' || raw === 'light') return raw;
  } catch {
    // fallback
  }
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function saveThemeSetting(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore
  }
}
