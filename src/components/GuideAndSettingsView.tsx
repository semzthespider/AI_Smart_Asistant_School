import React, { useRef, useState } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  Trash2,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { Habit, HabitLogs } from '../types/habit';

interface GuideAndSettingsViewProps {
  habits: Habit[];
  logs: HabitLogs;
  onRestoreData: (habits: Habit[], logs: HabitLogs) => void;
  onResetToSample: () => void;
  onClearAllData: () => void;
}

export const GuideAndSettingsView: React.FC<GuideAndSettingsViewProps> = ({
  habits,
  logs,
  onRestoreData,
  onResetToSample,
  onClearAllData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showNotification = (msg: string, isError: boolean = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 4000);
    } else {
      setFeedbackMessage(msg);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleExportJSON = () => {
    try {
      const dataToExport = {
        app: 'Tracker Kebiasaan Harian',
        exportedAt: new Date().toISOString(),
        version: '1.0',
        habits,
        logs,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `cadangan_kebiasaan_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showNotification('Cadangan data berhasil diunduh dalam format JSON.');
    } catch {
      showNotification('Gagal mengekspor data cadangan.', true);
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.habits && Array.isArray(parsed.habits)) {
          onRestoreData(parsed.habits, parsed.logs || {});
          showNotification(`Berhasil memulihkan ${parsed.habits.length} kebiasaan dari file cadangan!`);
        } else {
          showNotification('Format berkas tidak sesuai. Pastikan berkas cadangan valid.', true);
        }
      } catch {
        showNotification('Gagal membaca berkas JSON. Format tidak valid.', true);
      }
    };
    reader.readAsText(file);
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Guide Cards: Atomic Habit Principles */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>4 Hukum Utama Membangun Kebiasaan Positif</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Diadopsi dari riset sains perilaku dan prinsip Atomic Habits untuk membangun konsistensi tanpa beban.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              01. Buat Menjadi Sangat Jelas (Obvious)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tentukan waktu dan lokasi spesifik. Daripada berkata "Saya akan olahraga", katakan "Pukul 06:30 pagi saya akan jogging 15 menit di teras".
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              02. Aturan 2 Menit (Make It Easy)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Kecilkan kebiasaan awal sehingga butuh kurang dari dua menit untuk dimulai. Membaca 1 halaman jauh lebih baik daripada tidak membaca sama sekali.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              03. Jangan Pernah Lewat Dua Hari Berturut-turut
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Kelewatan satu hari adalah ketidaksengajaan manusiawi. Melewatkannya dua hari berturut-turut adalah awal dari terbentuknya kebiasaan baru yang merugikan.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              04. Rayakan dan Pantau Progres (Satisfying)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tindakan mencentang kotak di aplikasi ini memberikan lonjakan dopamin alami yang memperkuat sirkuit saraf bahwa Anda adalah orang yang konsisten.
            </p>
          </div>

        </div>
      </div>

      {/* Backup, Restore & Data Privacy Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Pengelolaan Data & Cadangan Lokal</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Seluruh data kebiasaan Anda disimpan secara privat di penyimpanan peramban (browser LocalStorage). Anda memegang kendali penuh atas data Anda.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors flex flex-col justify-between cursor-pointer"
          >
            <div>
              <Download className="w-5 h-5 text-blue-500 mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Ekspor Cadangan</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Simpan data ke format file JSON
              </p>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-3 inline-block">
              Unduh File →
            </span>
          </button>

          {/* Import JSON */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors flex flex-col justify-between cursor-pointer"
            >
              <div>
                <Upload className="w-5 h-5 text-emerald-500 mb-2" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Impor Cadangan</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Pulihkan dari file JSON sebelumnya
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-3 inline-block">
                Pilih Berkas →
              </span>
            </button>
          </div>

          {/* Reset to Sample */}
          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin memuat ulang kebiasaan contoh rekomendasi?')) {
                onResetToSample();
                showNotification('Data contoh berhasil dimuat ulang.');
              }
            }}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors flex flex-col justify-between cursor-pointer"
          >
            <div>
              <RotateCcw className="w-5 h-5 text-amber-500 mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Muat Ulang Contoh</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Kembalikan dataset rekomendasi awal
              </p>
            </div>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-3 inline-block">
              Muat Ulang →
            </span>
          </button>

          {/* Clear All */}
          <button
            onClick={() => {
              if (confirm('Hapus seluruh kebiasaan dan riwayat data? Tindakan ini tidak dapat dibatalkan.')) {
                onClearAllData();
                showNotification('Semua data berhasil dibersihkan.');
              }
            }}
            className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors flex flex-col justify-between cursor-pointer"
          >
            <div>
              <Trash2 className="w-5 h-5 text-rose-500 mb-2" />
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400">Kosongkan Semua Data</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Mulai lembaran baru dari nol
              </p>
            </div>
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-3 inline-block">
              Hapus Bersih →
            </span>
          </button>

        </div>
      </div>

    </div>
  );
};
