import React, { useState } from 'react';
import { COLORS_DATA } from '../data/learningData';
import { ColorItem } from '../types';
import { Volume2, Sparkles, Play, Pause, Check } from 'lucide-react';
import { speechService } from '../utils/speech';
import { sounds } from '../utils/soundEffects';

interface ColorsViewProps {
  onAddStar: () => void;
}

export const ColorsView: React.FC<ColorsViewProps> = ({ onAddStar }) => {
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorItem>(COLORS_DATA[0]);

  const handlePlayColor = (color: ColorItem) => {
    sounds.playPop();
    setActiveSpeakingId(color.id);
    setSelectedColor(color);
    onAddStar();

    speechService.speak(color.name, {
      onEnd: () => {
        setActiveSpeakingId(null);
      },
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-pink-200 mb-8 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-8xl opacity-15 select-none pointer-events-none">
          🎨
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>10 xil rang va talaffuz</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              Colors (Ranglar - 10 ta)
            </h2>
            <p className="text-white/90 text-sm max-w-xl mt-1">
              Ranglar ustiga bosing — inglizcha aytib beradi (masalan: <b>Red</b> - <b>Qizil</b>, <b>Blue</b> - <b>Ko‘k</b>). Misol narsalari bilan birga eslab qoling!
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              // Read all 10 colors in sequence
              let idx = 0;
              const playNext = () => {
                if (idx < COLORS_DATA.length) {
                  const c = COLORS_DATA[idx];
                  setActiveSpeakingId(c.id);
                  setSelectedColor(c);
                  speechService.speak(c.name, {
                    onEnd: () => {
                      idx++;
                      setTimeout(playNext, 600);
                    },
                  });
                } else {
                  setActiveSpeakingId(null);
                  sounds.playCelebration();
                }
              };
              playNext();
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all shadow-md shrink-0 cursor-pointer bg-white text-rose-600 hover:bg-rose-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>10 ta rangni eshitish</span>
          </button>
        </div>
      </div>

      {/* Hero Showcase of the Selected Color */}
      <div
        id="color-showcase-card"
        className="mb-8 rounded-3xl p-6 sm:p-8 transition-all border-3 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{
          backgroundColor: selectedColor.isLight ? '#F8FAFC' : selectedColor.hex,
          borderColor: selectedColor.isLight ? '#CBD5E1' : selectedColor.hex,
          color: selectedColor.isLight ? '#1E293B' : '#FFFFFF',
        }}
      >
        <div className="flex items-center gap-5">
          <div className="text-6xl sm:text-7xl bg-white/20 p-4 rounded-2xl backdrop-blur-xs shadow-inner">
            {selectedColor.exampleEmoji}
          </div>
          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1 ${
                selectedColor.isLight ? 'bg-slate-200 text-slate-800' : 'bg-black/20 text-white'
              }`}
            >
              Tanlangan rang
            </span>
            <h3 className="text-4xl sm:text-5xl font-black tracking-tight font-display">
              {selectedColor.name}
            </h3>
            <p className="text-xl sm:text-2xl font-bold opacity-90 mt-0.5">
              {selectedColor.uzbek}
            </p>
            <p className="text-sm opacity-75 font-mono mt-1">
              Talaffuz: {selectedColor.transcription}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
          <div
            className={`px-4 py-2 rounded-2xl text-sm font-bold text-center ${
              selectedColor.isLight ? 'bg-slate-100 text-slate-700' : 'bg-white/20 text-white backdrop-blur-xs'
            }`}
          >
            Misol: <b>{selectedColor.exampleWordEn}</b> ({selectedColor.exampleWordUz})
          </div>

          <button
            type="button"
            onClick={() => handlePlayColor(selectedColor)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-base shadow-lg transition-transform active:scale-95 cursor-pointer ${
              selectedColor.isLight
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-white text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Volume2 className="w-5 h-5 animate-pulse" />
            <span>Ovozini eshitish ({selectedColor.name})</span>
          </button>
        </div>
      </div>

      {/* Grid of 10 Colors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {COLORS_DATA.map((color) => {
          const isSpeaking = activeSpeakingId === color.id;
          const isSelected = selectedColor.id === color.id;

          return (
            <div
              key={color.id}
              id={`color-card-${color.id}`}
              onClick={() => handlePlayColor(color)}
              role="button"
              tabIndex={0}
              className={`group bg-white rounded-3xl p-4 border-2 transition-all cursor-pointer flex flex-col items-center text-center relative select-none shadow-xs hover:shadow-lg hover:-translate-y-1 ${
                isSelected
                  ? 'border-rose-500 ring-4 ring-rose-200'
                  : 'border-slate-200 hover:border-rose-300'
              }`}
            >
              {/* Color Circle Swatch */}
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl shadow-inner mb-3 transition-transform group-hover:scale-108 relative"
                style={{
                  backgroundColor: color.hex,
                  border: color.isLight ? '2px solid #CBD5E1' : 'none',
                }}
              >
                <span>{color.exampleEmoji}</span>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-rose-600 shadow-md flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Color Name & Uzbek */}
              <div className="text-lg font-black text-slate-800 group-hover:text-rose-600 transition-colors">
                {color.name}
              </div>
              <div className="text-xs font-bold text-amber-700 mt-0.5">
                {color.uzbek}
              </div>

              {/* Transcription */}
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                {color.transcription}
              </div>

              {/* Quick Speaker Pill */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayColor(color);
                }}
                className={`mt-3 w-full py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                  isSpeaking
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-700'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Eshitish</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
