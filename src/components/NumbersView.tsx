import React, { useState, useEffect } from 'react';
import { NUMBERS_DATA } from '../data/learningData';
import { NumberItem } from '../types';
import { Volume2, Play, Pause, Sparkles, RefreshCw } from 'lucide-react';
import { speechService } from '../utils/speech';
import { sounds } from '../utils/soundEffects';

interface NumbersViewProps {
  onAddStar: () => void;
}

export const NumbersView: React.FC<NumbersViewProps> = ({ onAddStar }) => {
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>(1);
  const [activeNumber, setActiveNumber] = useState<NumberItem>(NUMBERS_DATA[0]);
  const [activeSpeakingNum, setActiveSpeakingNum] = useState<number | null>(null);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [currentCountIndex, setCurrentCountIndex] = useState<number>(0);

  const groups = [
    { id: 1, label: '1 - 10', title: 'Boshlang‘ich' },
    { id: 2, label: '11 - 20', title: 'O‘nliklar' },
    { id: 3, label: '21 - 30', title: 'Yigirmaliklar' },
    { id: 4, label: '31 - 40', title: 'O‘ttizliklar' },
    { id: 5, label: '41 - 50', title: 'Qirqliklar' },
    { id: 'all' as const, label: 'Barchasi (1-50)', title: 'To‘liq' },
  ];

  const filteredNumbers =
    selectedGroup === 'all'
      ? NUMBERS_DATA
      : NUMBERS_DATA.filter((n) => n.tensGroup === selectedGroup);

  const handlePlayNumber = (numItem: NumberItem) => {
    sounds.playPop();
    setActiveNumber(numItem);
    setActiveSpeakingNum(numItem.number);
    onAddStar();

    speechService.speakNumber(numItem.wordEn, {
      onEnd: () => {
        setActiveSpeakingNum(null);
      },
    });
  };

  // Auto count sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCounting) {
      if (currentCountIndex < filteredNumbers.length) {
        const item = filteredNumbers[currentCountIndex];
        setActiveNumber(item);
        setActiveSpeakingNum(item.number);

        speechService.speakNumber(item.wordEn, {
          onEnd: () => {
            timer = setTimeout(() => {
              setCurrentCountIndex((prev) => prev + 1);
            }, 700);
          },
        });
      } else {
        setIsCounting(false);
        setCurrentCountIndex(0);
        sounds.playCelebration();
      }
    }
    return () => clearTimeout(timer);
  }, [isCounting, currentCountIndex, filteredNumbers]);

  const toggleAutoCount = () => {
    if (isCounting) {
      setIsCounting(false);
      speechService.stop();
      setActiveSpeakingNum(null);
    } else {
      setIsCounting(true);
      setCurrentCountIndex(0);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-teal-200 mb-8 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-8xl opacity-15 select-none pointer-events-none">
          🔢
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>1 dan 50 gacha to‘liq raqamlar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              Numbers (Raqamlar: 1 - 50)
            </h2>
            <p className="text-white/90 text-sm max-w-xl mt-1">
              Har bir raqamni bosing — inglizcha aytib beradi (masalan: <b>1</b> - <b>One</b>, <b>2</b> - <b>Two</b>, <b>50</b> - <b>Fifty</b>). Sanashni o‘rganamiz!
            </p>
          </div>

          <button
            id="numbers-autocount-btn"
            type="button"
            onClick={toggleAutoCount}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all shadow-md shrink-0 cursor-pointer ${
              isCounting
                ? 'bg-rose-500 text-white hover:bg-rose-600 animate-pulse'
                : 'bg-white text-teal-700 hover:bg-teal-50'
            }`}
          >
            {isCounting ? (
              <>
                <Pause className="w-4 h-4" />
                <span>To‘xtatish ({currentCountIndex + 1}/{filteredNumbers.length})</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Ketma-ket sanash 🔊</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Featured Big Number Display */}
      <div
        id="active-number-banner"
        className="bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-3xl p-6 sm:p-7 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-5 sm:gap-7">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center text-5xl sm:text-6xl font-black font-display shadow-md shadow-teal-200">
            {activeNumber.number}
          </div>
          <div>
            <div className="text-xs font-black text-teal-700 uppercase tracking-wider mb-0.5">
              Inglizcha nomi:
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
              {activeNumber.wordEn}
            </h3>
            <div className="text-lg font-bold text-amber-700 mt-0.5">
              O‘zbekcha: <b>{activeNumber.wordUz}</b>
            </div>
            <div className="text-xs text-slate-500 font-mono mt-1">
              Talaffuz: [{activeNumber.transcription}]
            </div>
          </div>
        </div>

        {/* Visual Count representation (dots / stars for up to 10) */}
        <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
          {activeNumber.number <= 10 && (
            <div className="flex flex-wrap justify-center gap-1.5 max-w-xs bg-white/70 p-2.5 rounded-2xl border border-teal-100">
              {Array.from({ length: activeNumber.number }).map((_, i) => (
                <span key={i} className="text-xl animate-bounce" style={{ animationDelay: `${i * 0.05}s` }}>
                  ⭐
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => handlePlayNumber(activeNumber)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-6 py-3.5 rounded-2xl font-black text-base shadow-md shadow-teal-200 transition-all cursor-pointer active:scale-95"
          >
            <Volume2 className="w-5 h-5 animate-pulse" />
            <span>Ovozini eshitish ({activeNumber.wordEn})</span>
          </button>
        </div>
      </div>

      {/* Tens Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {groups.map((g) => {
          const isCurrent = selectedGroup === g.id;
          return (
            <button
              key={String(g.id)}
              type="button"
              onClick={() => {
                sounds.playPop();
                setSelectedGroup(g.id);
                setIsCounting(false);
              }}
              className={`px-4 py-2 rounded-2xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all border ${
                isCurrent
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-teal-50/50'
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      {/* Numbers Grid (Responsive 1-50) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3">
        {filteredNumbers.map((num) => {
          const isSpeaking = activeSpeakingNum === num.number;
          const isSelected = activeNumber.number === num.number;

          return (
            <div
              key={num.number}
              id={`number-tile-${num.number}`}
              onClick={() => handlePlayNumber(num)}
              role="button"
              tabIndex={0}
              className={`group relative bg-white rounded-2xl p-3 border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center select-none shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
                isSpeaking
                  ? 'border-teal-500 ring-4 ring-teal-200 bg-teal-50 scale-105'
                  : isSelected
                  ? 'border-teal-400 bg-teal-50/30'
                  : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              {/* Digit */}
              <div className="text-2xl sm:text-3xl font-black text-slate-800 font-display group-hover:text-teal-600 transition-colors">
                {num.number}
              </div>

              {/* English Word */}
              <div className="text-xs font-bold text-teal-800 truncate w-full mt-0.5">
                {num.wordEn}
              </div>

              {/* Uzbek Translation */}
              <div className="text-[10px] text-amber-700 font-semibold truncate w-full">
                {num.wordUz}
              </div>

              {/* Audio indicator */}
              <div
                className={`mt-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isSpeaking ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-teal-100 group-hover:text-teal-600'
                }`}
              >
                <Volume2 className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
