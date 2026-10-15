import React, { useState, useEffect } from 'react';
import { CategoryType } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { AlphabetView } from './components/AlphabetView';
import { ColorsView } from './components/ColorsView';
import { NumbersView } from './components/NumbersView';
import { TransportView } from './components/TransportView';
import { QuizView } from './components/QuizView';
import { speechService } from './utils/speech';
import { sounds } from './utils/soundEffects';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<CategoryType>('alphabet');
  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('kids_english_stars');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [speedMode, setSpeedMode] = useState<'normal' | 'slow'>('normal');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Save stars to local storage
  useEffect(() => {
    try {
      localStorage.setItem('kids_english_stars', stars.toString());
    } catch {
      // local storage error ignored
    }
  }, [stars]);

  // Handle star reward
  const handleAddStar = (count: number = 1) => {
    setStars((prev) => prev + count);
  };

  // Toggle audio rate
  const handleToggleSpeed = () => {
    sounds.playPop();
    const nextSpeed = speedMode === 'normal' ? 'slow' : 'normal';
    setSpeedMode(nextSpeed);
    speechService.speedMode = nextSpeed;
    if (nextSpeed === 'slow') {
      speechService.speak('Slow speed mode enabled');
    } else {
      speechService.speak('Normal speed mode enabled');
    }
  };

  // Toggle sound effects
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    sounds.enabled = nextVal;
    if (nextVal) {
      sounds.playPop();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Header */}
      <Header
        stars={stars}
        speedMode={speedMode}
        onToggleSpeed={handleToggleSpeed}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Navigation */}
      <Navigation activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Dynamic View Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'alphabet' && <AlphabetView onAddStar={handleAddStar} />}
        {activeTab === 'colors' && <ColorsView onAddStar={handleAddStar} />}
        {activeTab === 'numbers' && <NumbersView onAddStar={handleAddStar} />}
        {activeTab === 'transport' && <TransportView onAddStar={handleAddStar} />}
        {activeTab === 'quiz' && <QuizView onAddStar={handleAddStar} />}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <span>Kids English 7-9 Yosh</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-emerald-700">Ovozli ta’lim dasturi</span>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <span>Bolalar uchun mehr bilan yaratilgan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block" />
          </div>

          <div className="text-slate-400 font-medium text-[11px]">
            Tugmalarni bosing va inglizcha talaffuzni tinglang!
          </div>
        </div>
      </footer>
    </div>
  );
}
