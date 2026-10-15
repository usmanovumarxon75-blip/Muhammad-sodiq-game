import React from 'react';
import { Volume2, VolumeX, Sparkles, Trophy, Rabbit, Turtle } from 'lucide-react';
import { speechService } from '../utils/speech';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  stars: number;
  speedMode: 'normal' | 'slow';
  onToggleSpeed: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stars,
  speedMode,
  onToggleSpeed,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-amber-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-white shadow-md shadow-orange-200 text-2xl font-bold">
            🇬🇧
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight font-display">
                English Kids <span className="text-amber-500">7-9 Yosh</span>
              </h1>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200">
                O‘rganamiz!
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Alifbo, Ranglar, 1-50 Raqamlar, Transport va Qiziqarli Testlar
            </p>
          </div>
        </div>

        {/* Action Controls: Stars, AI Voice Test, Audio Speed, Sound FX */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-wrap sm:flex-nowrap">
          {/* AI Voice Test Button */}
          <button
            id="test-ai-voice-btn"
            type="button"
            onClick={() => {
              sounds.playPop();
              speechService.speakLetterAndWord('A', 'Apple');
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black shadow-xs transition-all cursor-pointer active:scale-95"
            title="AI Ovozni sinab ko‘rish: A, Apple!"
          >
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>AI Ovozni sinash</span>
          </button>

          {/* Stars Collected */}
          <div
            id="stars-badge"
            className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-sm font-black shadow-xs"
            title="To‘plangan yulduzchalar"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
            <span>{stars}</span>
            <span className="text-xs text-amber-700 hidden sm:inline">yulduz</span>
          </div>

          {/* Speed Toggle (Normal / Slow for clear kid learning) */}
          <button
            id="toggle-speech-speed-btn"
            type="button"
            onClick={onToggleSpeed}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs border ${
              speedMode === 'slow'
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="Talaffuz tezligi (Sekin / Normal)"
          >
            {speedMode === 'slow' ? (
              <>
                <Turtle className="w-4 h-4 text-emerald-600" />
                <span>Sekin</span>
              </>
            ) : (
              <>
                <Rabbit className="w-4 h-4 text-slate-600" />
                <span>Normal</span>
              </>
            )}
          </button>

          {/* Sound FX Toggle */}
          <button
            id="toggle-sound-effects-btn"
            type="button"
            onClick={onToggleSound}
            className={`p-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs border ${
              soundEnabled
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
            title={soundEnabled ? 'Ovoz effektlarini o‘chirish' : 'Ovoz effektlarini yoqish'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
