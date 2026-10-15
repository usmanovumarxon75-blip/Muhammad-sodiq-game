import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../data/learningData';
import { QuizQuestion, QuizType } from '../types';
import { Volume2, Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Star } from 'lucide-react';
import { speechService } from '../utils/speech';
import { sounds } from '../utils/soundEffects';

interface QuizViewProps {
  onAddStar: (count?: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onAddStar }) => {
  const [selectedCategory, setSelectedCategory] = useState<QuizType>('all');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Initialize questions
  useEffect(() => {
    resetQuiz(selectedCategory);
  }, [selectedCategory]);

  const resetQuiz = (category: QuizType) => {
    let filtered =
      category === 'all'
        ? [...QUIZ_QUESTIONS]
        : QUIZ_QUESTIONS.filter((q) => q.category === category);

    // Shuffle
    filtered = filtered.sort(() => Math.random() - 0.5);

    setQuestions(filtered);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setIsCompleted(false);

    // Auto play current question prompt
    if (filtered.length > 0) {
      setTimeout(() => {
        speechService.speak(filtered[0].speakText);
      }, 400);
    }
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = (option: QuizQuestion['options'][0]) => {
    if (isAnswered) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);

    if (option.isCorrect) {
      setIsCorrect(true);
      setScore((prev) => prev + 1);
      sounds.playCorrect();
      onAddStar(10);
      speechService.speak(`Correct! ${option.textEn}`);
    } else {
      setIsCorrect(false);
      sounds.playWrong();
      speechService.speak('Try again!');
    }
  };

  const handleNextQuestion = () => {
    sounds.playPop();
    if (currentIndex + 1 < questions.length) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setIsCorrect(false);

      // Play audio for next question
      speechService.speak(questions[nextIndex].speakText);
    } else {
      setIsCompleted(true);
      sounds.playCelebration();
      speechService.speak('Congratulations! Great job!');
    }
  };

  const playCurrentAudio = () => {
    if (currentQ) {
      sounds.playPop();
      speechService.speak(currentQ.speakText);
    }
  };

  if (!currentQ && !isCompleted) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 font-bold">Savollar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-purple-200 mb-6 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-8xl opacity-15 select-none pointer-events-none">
          🏆
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>O‘rganganlaringizni sinab ko‘ring!</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              Kichik Test Rejimi (Quiz Mode)
            </h2>
            <p className="text-white/90 text-sm max-w-xl mt-1">
              Savolni o‘qing, ovozini tinglang va to‘g‘ri javobni tanlang. Har bir to‘g‘ri javob uchun <b>+10 yulduzcha</b> olasiz!
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 self-start sm:self-auto border border-white/20">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="font-extrabold text-sm">
              Natija: {score} / {questions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {[
          { id: 'all' as QuizType, label: 'Hammasi (Aralash)' },
          { id: 'alphabet' as QuizType, label: '🔤 Alifbo testi' },
          { id: 'colors' as QuizType, label: '🎨 Ranglar testi' },
          { id: 'numbers' as QuizType, label: '🔢 Raqamlar testi' },
          { id: 'transport' as QuizType, label: '🚗 Transport testi' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              sounds.playPop();
              setSelectedCategory(cat.id);
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300 hover:bg-purple-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Quiz Card */}
      {!isCompleted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md">
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full mb-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
            <span>Savol {currentIndex + 1} / {questions.length}</span>
            <span className="uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              {currentQ.category}
            </span>
          </div>

          {/* Question Text */}
          <div className="text-center my-4">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight font-display mb-2">
              {currentQ.promptUz}
            </h3>
            <p className="text-sm font-semibold text-slate-500">
              {currentQ.promptEn}
            </p>

            {/* Audio Listen Button */}
            <div className="mt-4 flex items-center justify-center">
              <button
                id="quiz-listen-again-btn"
                type="button"
                onClick={playCurrentAudio}
                className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-800 px-5 py-2.5 rounded-2xl font-black text-sm transition-all shadow-xs cursor-pointer border border-purple-200 active:scale-95"
              >
                <Volume2 className="w-5 h-5 text-purple-600 animate-bounce" />
                <span>Qayta eshitish: "{currentQ.speakText}"</span>
              </button>
            </div>
          </div>

          {/* Answer Options (4 big interactive buttons) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-8">
            {currentQ.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              let btnStyle = 'bg-slate-50 border-slate-200 hover:bg-purple-50 hover:border-purple-300 text-slate-700';

              if (isAnswered) {
                if (option.isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300';
                } else if (isSelected && !option.isCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-300';
                } else {
                  btnStyle = 'opacity-50 bg-slate-50 border-slate-200';
                }
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 font-bold transition-all text-left shadow-xs cursor-pointer ${btnStyle}`}
                >
                  {/* Visual: Emoji or Color swatch */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner bg-white border border-slate-100"
                    style={
                      option.colorHex
                        ? { backgroundColor: option.colorHex }
                        : {}
                    }
                  >
                    {option.visual || '✨'}
                  </div>

                  {/* Text details */}
                  <div className="flex-1">
                    <div className="text-xl font-black leading-tight text-slate-900">
                      {option.textEn}
                    </div>
                    <div className="text-sm font-semibold text-slate-500 mt-0.5">
                      {option.textUz}
                    </div>
                  </div>

                  {/* Option audio preview button */}
                  <button
                    type="button"
                    title={`Eshitish: ${option.textEn}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playPop();
                      speechService.speak(option.textEn);
                    }}
                    className="w-8 h-8 rounded-full bg-white/80 hover:bg-purple-100 text-slate-500 hover:text-purple-700 flex items-center justify-center transition-all border border-slate-200 shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {/* Icon indicator */}
                  {isAnswered && (
                    <div className="shrink-0">
                      {option.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : isSelected ? (
                        <XCircle className="w-6 h-6 text-rose-500" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
              <div>
                {isCorrect ? (
                  <div className="flex items-center gap-2 text-emerald-700 font-black text-lg">
                    <CheckCircle2 className="w-6 h-6" />
                    <span>Barakalla! To‘g‘ri topdingiz! (+10 ⭐)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-sm sm:text-base">
                    <XCircle className="w-5 h-5 shrink-0" />
                    <span>Xato bo‘ldi, lekin xavotir olmang! To‘g‘ri javob yashil rangda ko‘rsatildi.</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-7 py-3 rounded-2xl font-black text-base shadow-md shadow-purple-200 transition-all cursor-pointer active:scale-95"
              >
                <span>Keyingi savol</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Completion Screen */
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-purple-200 text-center shadow-xl">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 mx-auto flex items-center justify-center text-5xl shadow-lg shadow-amber-200 mb-4 animate-bounce">
            🏆
          </div>

          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
            Ajoyib Natija!
          </h3>
          <p className="text-slate-600 text-base mt-2 max-w-md mx-auto">
            Test muvaffaqiyatli yakunlandi. Siz ingliz tilidagi so‘zlarni juda yaxshi o‘rganmoqdasiz!
          </p>

          {/* Star rating */}
          <div className="flex items-center justify-center gap-2 my-5">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-10 h-10 ${
                  score >= (questions.length / 3) * starIdx
                    ? 'text-amber-400 fill-amber-400 animate-pulse'
                    : 'text-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="inline-block bg-purple-50 border border-purple-200 text-purple-900 px-6 py-3 rounded-2xl font-black text-xl mb-6">
            To‘g‘ri javoblar: {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => resetQuiz(selectedCategory)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black text-base shadow-md shadow-purple-200 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Qaytadan boshlash</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
