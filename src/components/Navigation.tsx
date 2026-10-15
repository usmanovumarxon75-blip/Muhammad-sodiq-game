import React from 'react';
import { CategoryType } from '../types';
import { BookOpen, Palette, Hash, Car, Award } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface NavigationProps {
  activeTab: CategoryType;
  onSelectTab: (tab: CategoryType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'alphabet' as CategoryType,
      labelUz: 'Alifbo',
      labelEn: 'Alphabet (A-Z)',
      count: '26 ta',
      icon: BookOpen,
      color: 'from-amber-400 to-orange-500',
      activeBorder: 'border-orange-500',
      activeText: 'text-orange-600',
      activeBg: 'bg-orange-50',
    },
    {
      id: 'colors' as CategoryType,
      labelUz: 'Ranglar',
      labelEn: 'Colors',
      count: '10 xil',
      icon: Palette,
      color: 'from-pink-400 to-rose-500',
      activeBorder: 'border-rose-500',
      activeText: 'text-rose-600',
      activeBg: 'bg-rose-50',
    },
    {
      id: 'numbers' as CategoryType,
      labelUz: 'Raqamlar',
      labelEn: 'Numbers',
      count: '1-50',
      icon: Hash,
      color: 'from-emerald-400 to-teal-500',
      activeBorder: 'border-teal-500',
      activeText: 'text-teal-600',
      activeBg: 'bg-teal-50',
    },
    {
      id: 'transport' as CategoryType,
      labelUz: 'Transport',
      labelEn: 'Vehicles',
      count: '10 ta',
      icon: Car,
      color: 'from-sky-400 to-blue-500',
      activeBorder: 'border-blue-500',
      activeText: 'text-blue-600',
      activeBg: 'bg-blue-50',
    },
    {
      id: 'quiz' as CategoryType,
      labelUz: 'Test Rejimi',
      labelEn: 'Quiz Game',
      count: 'Topish!',
      icon: Award,
      color: 'from-purple-400 to-indigo-500',
      activeBorder: 'border-purple-500',
      activeText: 'text-purple-600',
      activeBg: 'bg-purple-50',
    },
  ];

  return (
    <nav className="w-full bg-slate-50/80 border-b border-slate-200 py-3 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => {
                sounds.playPop();
                onSelectTab(tab.id);
              }}
              className={`group flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl font-bold transition-all text-sm whitespace-nowrap shrink-0 border-2 ${
                isActive
                  ? `${tab.activeBg} ${tab.activeBorder} ${tab.activeText} shadow-md shadow-orange-100 scale-102`
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-white bg-gradient-to-tr ${tab.color} shadow-xs`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs sm:text-sm font-black leading-tight flex items-center gap-1">
                  <span>{tab.labelUz}</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-slate-200/70 rounded-full font-bold text-slate-700">
                    {tab.count}
                  </span>
                </div>
                <div className="text-[10px] opacity-70 font-semibold">{tab.labelEn}</div>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
