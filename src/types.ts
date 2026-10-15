export type CategoryType = 'alphabet' | 'colors' | 'numbers' | 'transport' | 'quiz';

export interface AlphabetItem {
  id: string;
  letter: string;
  lowerLetter: string;
  word: string;
  uzbek: string;
  transcription: string;
  emoji: string;
  sampleSentenceEn: string;
  sampleSentenceUz: string;
  bgGradient: string;
  textColor: string;
}

export interface ColorItem {
  id: string;
  name: string;
  uzbek: string;
  hex: string;
  borderHex?: string;
  isLight?: boolean;
  exampleEmoji: string;
  exampleWordEn: string;
  exampleWordUz: string;
  transcription: string;
}

export interface NumberItem {
  number: number;
  wordEn: string;
  wordUz: string;
  transcription: string;
  tensGroup: number; // 1 for 1-10, 2 for 11-20, etc.
}

export interface TransportItem {
  id: string;
  name: string;
  uzbek: string;
  emoji: string;
  transcription: string;
  category: 'ground' | 'air' | 'water';
  funFactEn: string;
  funFactUz: string;
  soundLabel: string;
}

export type QuizType = 'all' | 'alphabet' | 'colors' | 'numbers' | 'transport';

export interface QuizQuestion {
  id: string;
  category: 'alphabet' | 'colors' | 'numbers' | 'transport';
  promptUz: string;
  promptEn: string;
  speakText: string;
  displayVisual?: string; // emoji or color or big letter
  displayColor?: string;
  options: {
    id: string;
    textEn: string;
    textUz: string;
    visual?: string;
    colorHex?: string;
    isCorrect: boolean;
  }[];
}
