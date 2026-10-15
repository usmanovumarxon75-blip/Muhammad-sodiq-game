import React, { useState } from 'react';
import { TRANSPORT_DATA } from '../data/learningData';
import { TransportItem } from '../types';
import { Volume2, Sparkles, Play, Check } from 'lucide-react';
import { speechService } from '../utils/speech';
import { sounds } from '../utils/soundEffects';

interface TransportViewProps {
  onAddStar: () => void;
}

export const TransportView: React.FC<TransportViewProps> = ({ onAddStar }) => {
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<TransportItem>(TRANSPORT_DATA[0]);

  const handlePlayTransport = (item: TransportItem) => {
    sounds.playPop();
    setActiveSpeakingId(item.id);
    setSelectedItem(item);
    onAddStar();

    speechService.speakTransport(item.name, {
      onEnd: () => {
        setActiveSpeakingId(null);
      },
    });
  };

  const getCategoryLabel = (category: 'ground' | 'air' | 'water') => {
    switch (category) {
      case 'air':
        return { label: 'Havoda', color: 'bg-sky-100 text-sky-800 border-sky-200' };
      case 'water':
        return { label: 'Suvda', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      default:
        return { label: 'Quruqlikda', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-blue-200 mb-8 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-8xl opacity-15 select-none pointer-events-none">
          🚗
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>10 xil transport vositalari</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              Vehicles (Transport - 10 ta)
            </h2>
            <p className="text-white/90 text-sm max-w-xl mt-1">
              Transport ustiga bosing — inglizcha aytib beradi (masalan: <b>Car</b> - <b>Mashina</b>, <b>Bus</b> - <b>Avtobus</b>, <b>Airplane</b> - <b>Samolyot</b>).
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              let idx = 0;
              const playNext = () => {
                if (idx < TRANSPORT_DATA.length) {
                  const t = TRANSPORT_DATA[idx];
                  setActiveSpeakingId(t.id);
                  setSelectedItem(t);
                  speechService.speak(t.name, {
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
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all shadow-md shrink-0 cursor-pointer bg-white text-blue-600 hover:bg-blue-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>10 ta transportni eshitish</span>
          </button>
        </div>
      </div>

      {/* Spotlight Selected Vehicle */}
      <div
        id="transport-spotlight"
        className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-6 sm:p-7 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-5 sm:gap-7">
          <div className="text-6xl sm:text-7xl bg-white p-4 sm:p-5 rounded-3xl shadow-md shadow-blue-100 flex items-center justify-center animate-bounce">
            {selectedItem.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                  getCategoryLabel(selectedItem.category).color
                }`}
              >
                {getCategoryLabel(selectedItem.category).label}
              </span>
              <span className="text-xs text-blue-600 font-bold bg-blue-100/60 px-2 py-0.5 rounded-full">
                {selectedItem.soundLabel}
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight font-display">
              {selectedItem.name}
            </h3>
            <div className="text-lg font-bold text-amber-700 mt-0.5">
              {selectedItem.uzbek}
            </div>
            <div className="text-xs text-slate-500 font-mono mt-1">
              Talaffuz: {selectedItem.transcription}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
          <div className="bg-white/80 border border-blue-100 rounded-2xl p-3 max-w-sm text-xs text-slate-700 font-medium">
            <span className="font-bold text-blue-900 block mb-0.5">💡 Qiziqarli fakt:</span>
            {selectedItem.funFactUz}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handlePlayTransport(selectedItem)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-2xl font-black text-base shadow-md shadow-blue-200 transition-all cursor-pointer active:scale-95"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>Ovozini eshitish ({selectedItem.name})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 10 Vehicles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {TRANSPORT_DATA.map((item) => {
          const isSpeaking = activeSpeakingId === item.id;
          const isSelected = selectedItem.id === item.id;

          return (
            <div
              key={item.id}
              id={`transport-card-${item.id}`}
              onClick={() => handlePlayTransport(item)}
              role="button"
              tabIndex={0}
              className={`group bg-white rounded-3xl p-4 border-2 transition-all cursor-pointer flex flex-col items-center text-center relative select-none shadow-xs hover:shadow-lg hover:-translate-y-1 ${
                isSelected
                  ? 'border-blue-500 ring-4 ring-blue-200'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              {/* Category tag */}
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[10px] text-slate-400 font-bold">
                  {item.soundLabel}
                </span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Emoji Icon */}
              <div className="text-5xl my-2 group-hover:scale-115 transition-transform duration-200">
                {item.emoji}
              </div>

              {/* Vehicle Name */}
              <div className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                {item.name}
              </div>
              <div className="text-xs font-bold text-amber-700 mt-0.5">
                {item.uzbek}
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                {item.transcription}
              </div>

              {/* Audio Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayTransport(item);
                }}
                className={`mt-3 w-full py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                  isSpeaking
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700'
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
