import React from 'react';
import { CalendarCheck, CalendarDays, BarChart3, HelpCircle, Plus } from 'lucide-react';
import { NavTab } from './Header';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenNewHabitModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenNewHabitModal,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        
        <button
          onClick={() => onTabChange('daily')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            currentTab === 'daily'
              ? 'text-slate-900 dark:text-white font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CalendarCheck className={`w-5 h-5 ${currentTab === 'daily' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-1">Hari Ini</span>
        </button>

        <button
          onClick={() => onTabChange('weekly')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            currentTab === 'weekly'
              ? 'text-slate-900 dark:text-white font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CalendarDays className={`w-5 h-5 ${currentTab === 'weekly' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-1">Mingguan</span>
        </button>

        {/* Center Quick Add Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={onOpenNewHabitModal}
            aria-label="Tambah Kebiasaan Baru"
            className="w-11 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 transition-transform"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        <button
          onClick={() => onTabChange('stats')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            currentTab === 'stats'
              ? 'text-slate-900 dark:text-white font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BarChart3 className={`w-5 h-5 ${currentTab === 'stats' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-1">Statistik</span>
        </button>

        <button
          onClick={() => onTabChange('guide')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            currentTab === 'guide'
              ? 'text-slate-900 dark:text-white font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <HelpCircle className={`w-5 h-5 ${currentTab === 'guide' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-1">Panduan</span>
        </button>

      </div>
    </div>
  );
};
