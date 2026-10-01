import React, { useState } from 'react';
import { Quote, RefreshCw } from 'lucide-react';

const QUOTES = [
  {
    quote: "Anda tidak naik ke tingkat tujuan Anda. Anda jatuh ke tingkat sistem Anda.",
    author: "James Clear",
    source: "Atomic Habits",
  },
  {
    quote: "Kemenangan kecil yang diulang setiap hari akan melipatgandakan hasil dalam jangka panjang.",
    author: "BJ Fogg",
    source: "Tiny Habits",
  },
  {
    quote: "Disiplin adalah jembatan antara tujuan dan pencapaian.",
    author: "Jim Rohn",
    source: "Filosofi Sukses",
  },
  {
    quote: "Kita adalah apa yang kita lakukan berulang kali. Keunggulan bukanlah sebuah tindakan, melainkan sebuah kebiasaan.",
    author: "Aristoteles",
    source: "Etika Nikomakea",
  },
  {
    quote: "Jangan mematahkan rantai kebiasaan. Jika terlewat satu hari, jangan pernah biarkan terlewat dua hari berturut-turut.",
    author: "Kaizen Mindset",
    source: "Prinsip Konsistensi",
  },
  {
    quote: "Satu persen lebih baik setiap hari akan membuat Anda 37 kali lebih baik dalam satu tahun.",
    author: "James Clear",
    source: "Atomic Habits",
  },
];

export const MotivationalQuote: React.FC = () => {
  const [index, setIndex] = useState(0);

  const nextQuote = () => {
    setIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const current = QUOTES[index];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 md:p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white/10 text-amber-300 shrink-0 mt-0.5">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm md:text-base font-medium leading-relaxed text-slate-100 italic">
              "{current.quote}"
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-amber-400">{current.author}</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-slate-300">{current.source}</span>
            </div>
          </div>
        </div>

        <button
          onClick={nextQuote}
          title="Kutipan berikutnya"
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
