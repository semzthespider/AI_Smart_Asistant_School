import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import {
  Habit,
  HabitCategory,
  HabitColor,
  HabitType,
  POPULAR_PRESETS,
  TimeOfDay,
  CATEGORY_LABELS,
} from '../types/habit';
import { ICON_OPTIONS, HabitIcon } from './HabitIcon';
import { getTodayKey } from '../utils/dateUtils';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveHabit: (habit: Habit) => void;
  editingHabit: Habit | null;
}

const COLOR_OPTIONS: { id: HabitColor; name: string; bg: string }[] = [
  { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-500' },
  { id: 'blue', name: 'Biru', bg: 'bg-blue-500' },
  { id: 'indigo', name: 'Indigo', bg: 'bg-indigo-500' },
  { id: 'purple', name: 'Ungu', bg: 'bg-purple-500' },
  { id: 'amber', name: 'Kuning Amber', bg: 'bg-amber-500' },
  { id: 'rose', name: 'Mawar', bg: 'bg-rose-500' },
  { id: 'teal', name: 'Teal', bg: 'bg-teal-500' },
];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSaveHabit,
  editingHabit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('kesehatan');
  const [type, setType] = useState<HabitType>('boolean');
  const [targetValue, setTargetValue] = useState<number>(8);
  const [unit, setUnit] = useState<string>('kali');
  const [color, setColor] = useState<HabitColor>('emerald');
  const [icon, setIcon] = useState<string>('CheckCircle2');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('semua');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editingHabit) {
      setTitle(editingHabit.title);
      setDescription(editingHabit.description || '');
      setCategory(editingHabit.category);
      setType(editingHabit.type);
      setTargetValue(editingHabit.targetValue || 5);
      setUnit(editingHabit.unit || 'kali');
      setColor(editingHabit.color);
      setIcon(editingHabit.icon);
      setTimeOfDay(editingHabit.timeOfDay);
    } else {
      setTitle('');
      setDescription('');
      setCategory('kesehatan');
      setType('boolean');
      setTargetValue(8);
      setUnit('kali');
      setColor('emerald');
      setIcon('Activity');
      setTimeOfDay('semua');
    }
    setError('');
  }, [editingHabit, isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof POPULAR_PRESETS[0]) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setCategory(preset.category);
    setType(preset.type);
    if (preset.targetValue) setTargetValue(preset.targetValue);
    if (preset.unit) setUnit(preset.unit);
    setColor(preset.color);
    setIcon(preset.icon);
    setTimeOfDay(preset.timeOfDay);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Mohon masukkan nama kebiasaan.');
      return;
    }

    const newHabit: Habit = {
      id: editingHabit ? editingHabit.id : `habit-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      type,
      targetValue: type === 'numeric' ? Math.max(1, Number(targetValue)) : undefined,
      unit: type === 'numeric' ? unit.trim() || 'kali' : undefined,
      color,
      icon,
      timeOfDay,
      createdAt: editingHabit ? editingHabit.createdAt : getTodayKey(),
    };

    onSaveHabit(newHabit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingHabit ? 'Edit Kebiasaan' : 'Tambah Kebiasaan Baru'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Bangun rutinitas konsisten dengan target terukur.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Presets Bar (only when creating) */}
          {!editingHabit && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pilih Cepat dari Rekomendasi Populer:</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {POPULAR_PRESETS.slice(0, 5).map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <HabitIcon name={preset.icon} className="w-3.5 h-3.5" />
                    <span>{preset.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Habit Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nama Kebiasaan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Contoh: Minum 2L Air, Membaca Buku, Jalan Kaki"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
            />
            {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
          </div>

          {/* Habit Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Keterangan / Motivasi Singkat (Opsional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Menjaga stamina dan hidrasi tubuh optimal"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
            />
          </div>

          {/* Category & Time of Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white cursor-pointer"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Waktu Pelaksanaan
              </label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white cursor-pointer"
              >
                <option value="semua">Kapanpun / Fleksibel</option>
                <option value="pagi">Pagi Hari</option>
                <option value="siang">Siang Hari</option>
                <option value="sore">Sore Hari</option>
                <option value="malam">Malam Hari</option>
              </select>
            </div>
          </div>

          {/* Type of Target */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Tipe Pelacakan
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setType('boolean')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  type === 'boolean'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Ceklis Ya / Tidak (Selesai)
              </button>
              <button
                type="button"
                onClick={() => setType('numeric')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  type === 'numeric'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Target Angka / Hitungan
              </button>
            </div>
          </div>

          {/* Numeric Target Configuration */}
          {type === 'numeric' && (
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Target Jumlah Harian
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={targetValue}
                  onChange={(e) => setTargetValue(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Satuan
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="gelas, halaman, menit, km"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>
          )}

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Pilih Ikon
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-36 overflow-y-auto p-1.5 border border-slate-200 dark:border-slate-800 rounded-xl">
              {ICON_OPTIONS.map((item) => {
                const isSelected = icon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIcon(item.name)}
                    title={item.label}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm scale-105'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Warna Tema
            </label>
            <div className="flex items-center gap-3">
              {COLOR_OPTIONS.map((c) => {
                const isSelected = color === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    title={c.name}
                    className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center transition-transform cursor-pointer ${
                      isSelected ? 'ring-3 ring-offset-2 ring-slate-900 dark:ring-white scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              {editingHabit ? 'Simpan Perubahan' : 'Buat Kebiasaan'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
