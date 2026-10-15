import React, { useState, useEffect } from 'react';
import { ALPHABET_DATA } from '../data/learningData';
import { AlphabetItem } from '../types';
import { Volume2, Play, Pause, Sparkles, ChevronRight, X } from 'lucide-react';
import { speechService } from '../utils/speech';
import { sounds } from '../utils/soundEffects';

interface AlphabetViewProps {
  onAddStar: () => void;
}

export const AlphabetView: React.FC<AlphabetViewProps> = ({ onAddStar }) => {
  const [selectedLetter, setSelectedLetter] = useState<AlphabetItem | null>(null);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [autoPlayIndex, setAutoPlayIndex] = useState<number>(0);

  // Play letter pronunciation
  const handlePlayLetter = (item: AlphabetItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sounds.playPop();
    setActiveSpeakingId(item.id);
    onAddStar();

    speechService.speakLetterAndWord(item.letter, item.word, {
      onEnd: () => {
        setActiveSpeakingId(null);
      },
    });
  };

  // Open detail spotlight
  const handleOpenDetail = (item: AlphabetItem) => {
    setSelectedLetter(item);
    handlePlayLetter(item);
  };

  // Auto-play through the alphabet
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isAutoPlaying) {
      if (autoPlayIndex < ALPHABET_DATA.length) {
        const current = ALPHABET_DATA[autoPlayIndex];
        setActiveSpeakingId(current.id);

        speechService.speakLetterAndWord(current.letter, current.word, {
          onEnd: () => {
            timeoutId = setTimeout(() => {
              setAutoPlayIndex((prev) => prev + 1);
            }, 800);
          },
        });
      } else {
        setIsAutoPlaying(false);
        setAutoPlayIndex(0);
        sounds.playCelebration();
      }
    }
    return () => clearTimeout(timeoutId);
  }, [isAutoPlaying, autoPlayIndex]);

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      speechService.stop();
      setActiveSpeakingId(null);
    } else {
      setIsAutoPlaying(true);
      setAutoPlayIndex(0);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Banner / Instructions */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-orange-200 mb-8 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-8xl opacity-15 select-none pointer-events-none">
          🔤
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>Har bir harfni bosing va tinglang!</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              English Alphabet (A - Z)
            </h2>
            <p className="text-white/90 text-sm max-w-xl mt-1">
              Harf ustiga bosing — ovozli aytib beradi (masalan: <b>A</b> - <b>Apple</b>, <b>B</b> - <b>Ball</b>). O‘zbekcha tarjimasi va talaffuzini o‘rganing!
            </p>
          </div>

          <button
            id="alphabet-autoplay-btn"
            type="button"
            onClick={toggleAutoPlay}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all shadow-md shrink-0 cursor-pointer ${
              isAutoPlaying
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                : 'bg-white text-orange-600 hover:bg-amber-50'
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>To‘xtatish ({autoPlayIndex + 1}/26)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Ketma-ket eshitish (A-Z)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alphabet Grid 26 Letters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {ALPHABET_DATA.map((item) => {
          const isSpeaking = activeSpeakingId === item.id;
          return (
            <div
              key={item.id}
              id={`letter-card-${item.letter.toLowerCase()}`}
              onClick={() => handleOpenDetail(item)}
              role="button"
              tabIndex={0}
              className={`group relative bg-white rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col items-center justify-between text-center select-none shadow-xs hover:shadow-md hover:-translate-y-1 ${
                isSpeaking
                  ? 'border-orange-500 ring-4 ring-orange-200 bg-orange-50/50 scale-103'
                  : 'border-slate-200 hover:border-orange-300'
              }`}
            >
              {/* Top Row: Letter & Sound Icon */}
              <div className="w-full flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-800 font-display">
                    {item.letter}
                  </span>
                  <span className="text-lg font-bold text-slate-400">
                    {item.lowerLetter}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handlePlayLetter(item, e)}
                  title="Qayta eshitish"
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isSpeaking
                      ? 'bg-orange-500 text-white scale-110 shadow-xs'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
                </button>
              </div>

              {/* Center: Emoji Illustration */}
              <div className="my-2 text-4xl sm:text-5xl group-hover:scale-115 transition-transform duration-200">
                {item.emoji}
              </div>

              {/* Bottom: English Word & Uzbek Meaning */}
              <div className="w-full pt-1 border-t border-slate-100">
                <div className="font-extrabold text-slate-800 text-base leading-tight group-hover:text-orange-600 transition-colors">
                  {item.word}
                </div>
                <div className="text-xs text-amber-700 font-bold mt-0.5">
                  {item.uzbek}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {item.transcription}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spotlight / Detail Modal when a letter is clicked */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            id="letter-detail-modal"
            className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border-4 border-amber-200 relative animate-in fade-in zoom-in duration-200"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedLetter(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="text-center pt-2">
              <div className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs uppercase tracking-wider mb-2">
                Inglizcha Alifbo
              </div>

              {/* Big Letters */}
              <div className="flex items-center justify-center gap-3">
                <span className="text-6xl sm:text-7xl font-black text-slate-900 font-display">
                  {selectedLetter.letter}
                </span>
                <span className="text-4xl sm:text-5xl font-bold text-slate-400">
                  {selectedLetter.lowerLetter}
                </span>
              </div>

              {/* Emoji */}
              <div className="my-4 text-7xl sm:text-8xl drop-shadow-md animate-bounce">
                {selectedLetter.emoji}
              </div>

              {/* Word & Uzbek */}
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                {selectedLetter.word}
              </h3>
              <div className="text-lg font-bold text-amber-600 mt-1">
                {selectedLetter.uzbek}
              </div>
              <div className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-mono font-bold mt-2">
                O‘qilishi: {selectedLetter.transcription}
              </div>

              {/* Sample Sentences */}
              <div className="bg-amber-50/80 rounded-2xl p-4 mt-5 border border-amber-200/70 text-left">
                <div className="text-xs font-extrabold text-amber-800 uppercase tracking-wide">
                  Misol gap:
                </div>
                <div className="text-slate-800 font-bold text-sm mt-1">
                  "{selectedLetter.sampleSentenceEn}"
                </div>
                <div className="text-slate-600 text-xs mt-0.5">
                  "{selectedLetter.sampleSentenceUz}"
                </div>
              </div>

              {/* Play Buttons */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => handlePlayLetter(selectedLetter)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3 px-4 rounded-2xl font-black text-base shadow-md shadow-orange-200 transition-all cursor-pointer active:scale-98"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Qayta eshitish</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    speechService.speak(selectedLetter.sampleSentenceEn);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-2xl font-bold text-xs transition-all border border-slate-200"
                  title="Gapni eshitish"
                >
                  Gapni o‘qish 💬
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
