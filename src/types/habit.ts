export type HabitCategory = 'kesehatan' | 'produktivitas' | 'mindfulness' | 'belajar' | 'keuangan' | 'sosial';

export type HabitType = 'boolean' | 'numeric';

export type TimeOfDay = 'semua' | 'pagi' | 'siang' | 'sore' | 'malam';

export type HabitColor = 'emerald' | 'blue' | 'indigo' | 'purple' | 'amber' | 'rose' | 'teal';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  type: HabitType;
  targetValue?: number;
  unit?: string;
  color: HabitColor;
  icon: string;
  timeOfDay: TimeOfDay;
  createdAt: string; // YYYY-MM-DD
  archived?: boolean;
}

export interface DayHabitLog {
  completed: boolean;
  value?: number;
  completedAt?: string;
}

export type HabitLogs = Record<string, Record<string, DayHabitLog>>; // date -> { habitId -> log }

export interface HabitPreset {
  title: string;
  description: string;
  category: HabitCategory;
  type: HabitType;
  targetValue?: number;
  unit?: string;
  color: HabitColor;
  icon: string;
  timeOfDay: TimeOfDay;
}

export const CATEGORY_LABELS: Record<HabitCategory, string> = {
  kesehatan: 'Kesehatan',
  produktivitas: 'Produktivitas',
  mindfulness: 'Mindfulness',
  belajar: 'Belajar & Skill',
  keuangan: 'Keuangan',
  sosial: 'Relasi & Sosial',
};

export const COLOR_CLASSES: Record<HabitColor, {
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
  accent: string;
  borderLight: string;
  borderDark: string;
  ring: string;
}> = {
  emerald: {
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/40',
    textLight: 'text-emerald-700',
    textDark: 'dark:text-emerald-300',
    accent: 'bg-emerald-600 dark:bg-emerald-500',
    borderLight: 'border-emerald-200',
    borderDark: 'dark:border-emerald-800/60',
    ring: 'ring-emerald-500',
  },
  blue: {
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-950/40',
    textLight: 'text-blue-700',
    textDark: 'dark:text-blue-300',
    accent: 'bg-blue-600 dark:bg-blue-500',
    borderLight: 'border-blue-200',
    borderDark: 'dark:border-blue-800/60',
    ring: 'ring-blue-500',
  },
  indigo: {
    bgLight: 'bg-indigo-50',
    bgDark: 'dark:bg-indigo-950/40',
    textLight: 'text-indigo-700',
    textDark: 'dark:text-indigo-300',
    accent: 'bg-indigo-600 dark:bg-indigo-500',
    borderLight: 'border-indigo-200',
    borderDark: 'dark:border-indigo-800/60',
    ring: 'ring-indigo-500',
  },
  purple: {
    bgLight: 'bg-purple-50',
    bgDark: 'dark:bg-purple-950/40',
    textLight: 'text-purple-700',
    textDark: 'dark:text-purple-300',
    accent: 'bg-purple-600 dark:bg-purple-500',
    borderLight: 'border-purple-200',
    borderDark: 'dark:border-purple-800/60',
    ring: 'ring-purple-500',
  },
  amber: {
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-950/40',
    textLight: 'text-amber-700',
    textDark: 'dark:text-amber-300',
    accent: 'bg-amber-600 dark:bg-amber-500',
    borderLight: 'border-amber-200',
    borderDark: 'dark:border-amber-800/60',
    ring: 'ring-amber-500',
  },
  rose: {
    bgLight: 'bg-rose-50',
    bgDark: 'dark:bg-rose-950/40',
    textLight: 'text-rose-700',
    textDark: 'dark:text-rose-300',
    accent: 'bg-rose-600 dark:bg-rose-500',
    borderLight: 'border-rose-200',
    borderDark: 'dark:border-rose-800/60',
    ring: 'ring-rose-500',
  },
  teal: {
    bgLight: 'bg-teal-50',
    bgDark: 'dark:bg-teal-950/40',
    textLight: 'text-teal-700',
    textDark: 'dark:text-teal-300',
    accent: 'bg-teal-600 dark:bg-teal-500',
    borderLight: 'border-teal-200',
    borderDark: 'dark:border-teal-800/60',
    ring: 'ring-teal-500',
  },
};

export const POPULAR_PRESETS: HabitPreset[] = [
  {
    title: 'Minum 2 Liter Air',
    description: 'Menjaga tubuh tetap terhidrasi dan fokus optimal.',
    category: 'kesehatan',
    type: 'numeric',
    targetValue: 8,
    unit: 'gelas',
    color: 'blue',
    icon: 'Droplets',
    timeOfDay: 'semua',
  },
  {
    title: 'Olahraga Pagi 20 Menit',
    description: 'Jogging, peregangan, atau latihan kardio ringan.',
    category: 'kesehatan',
    type: 'boolean',
    color: 'emerald',
    icon: 'Activity',
    timeOfDay: 'pagi',
  },
  {
    title: 'Membaca Buku 15 Menit',
    description: 'Membangun wawasan dan kebiasaan literasi setiap hari.',
    category: 'belajar',
    type: 'numeric',
    targetValue: 15,
    unit: 'halaman',
    color: 'amber',
    icon: 'BookOpen',
    timeOfDay: 'malam',
  },
  {
    title: 'Meditasi & Latihan Nafas',
    description: 'Menenangkan pikiran dan melatih kesadaran mindful.',
    category: 'mindfulness',
    type: 'boolean',
    color: 'indigo',
    icon: 'Smile',
    timeOfDay: 'pagi',
  },
  {
    title: 'Menulis Jurnal Harian',
    description: 'Mencatat evaluasi hari ini dan 3 hal yang disyukuri.',
    category: 'mindfulness',
    type: 'boolean',
    color: 'purple',
    icon: 'PenTool',
    timeOfDay: 'malam',
  },
  {
    title: 'Belajar Coding / Skill Baru',
    description: 'Menyelesaikan 1 topik atau latihan studi 30 menit.',
    category: 'belajar',
    type: 'boolean',
    color: 'teal',
    icon: 'Code',
    timeOfDay: 'siang',
  },
  {
    title: 'Tidur Tepat Waktu (< 22:30)',
    description: 'Tidur berkualitas 7-8 jam untuk pemulihan energi.',
    category: 'kesehatan',
    type: 'boolean',
    color: 'rose',
    icon: 'Moon',
    timeOfDay: 'malam',
  },
];
