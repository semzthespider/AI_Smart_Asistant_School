import React from 'react';
import {
  Droplets,
  Activity,
  Dumbbell,
  BookOpen,
  Smile,
  PenTool,
  Code,
  Moon,
  Sunrise,
  Coffee,
  Flame,
  Heart,
  Sparkles,
  Brain,
  Bike,
  Apple,
  Music,
  CheckCircle2,
  Feather,
  Target,
  LucideProps,
} from 'lucide-react';

export const ICON_OPTIONS: { name: string; label: string; icon: React.ComponentType<LucideProps> }[] = [
  { name: 'Droplets', label: 'Air / Hidrasi', icon: Droplets },
  { name: 'Activity', label: 'Olahraga / Kardio', icon: Activity },
  { name: 'Dumbbell', label: 'Fitness / Kekuatan', icon: Dumbbell },
  { name: 'BookOpen', label: 'Membaca', icon: BookOpen },
  { name: 'Smile', label: 'Mindfulness', icon: Smile },
  { name: 'PenTool', label: 'Jurnal / Menulis', icon: PenTool },
  { name: 'Code', label: 'Coding / Studi', icon: Code },
  { name: 'Moon', label: 'Tidur Berkualitas', icon: Moon },
  { name: 'Sunrise', label: 'Bangun Pagi', icon: Sunrise },
  { name: 'Coffee', label: 'Fokus / Produktif', icon: Coffee },
  { name: 'Flame', label: 'Disiplin & Streak', icon: Flame },
  { name: 'Heart', label: 'Kesehatan Jiwa', icon: Heart },
  { name: 'Brain', label: 'Asah Otak', icon: Brain },
  { name: 'Bike', label: 'Bersepeda / Aktif', icon: Bike },
  { name: 'Apple', label: 'Pola Makan Sehat', icon: Apple },
  { name: 'Music', label: 'Latihan Alat Musik', icon: Music },
  { name: 'Feather', label: 'Ketenangan', icon: Feather },
  { name: 'Target', label: 'Target Sasaran', icon: Target },
  { name: 'Sparkles', label: 'Kreativitas', icon: Sparkles },
  { name: 'CheckCircle2', label: 'Tugas Rutin', icon: CheckCircle2 },
];

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Droplets,
  Activity,
  Dumbbell,
  BookOpen,
  Smile,
  PenTool,
  Code,
  Moon,
  Sunrise,
  Coffee,
  Flame,
  Heart,
  Brain,
  Bike,
  Apple,
  Music,
  Feather,
  Target,
  Sparkles,
  CheckCircle2,
};

interface HabitIconProps extends LucideProps {
  name: string;
}

export const HabitIcon: React.FC<HabitIconProps> = ({ name, ...props }) => {
  const IconComponent = ICON_MAP[name] || CheckCircle2;
  return <IconComponent {...props} />;
};
