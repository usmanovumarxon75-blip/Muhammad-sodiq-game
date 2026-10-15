// Speech manager providing high-fidelity AI voice audio for English learning

export interface SpeechOptions {
  rate?: number; // playback rate
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

class SpeechManager {
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  public isSupported: boolean = true;
  public speedMode: 'normal' | 'slow' = 'normal';
  private audioUnlocked: boolean = false;
  private listeners: Set<(isSpeaking: boolean) => void> = new Set();
  public isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Pre-unlock audio on first touch/click
      const unlock = () => {
        if (!this.audioUnlocked) {
          try {
            const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
            silentAudio.play().catch(() => {});
          } catch {
            // ignore
          }
          this.audioUnlocked = true;
          window.removeEventListener('click', unlock);
          window.removeEventListener('touchstart', unlock);
        }
      };
      window.addEventListener('click', unlock, { once: true });
      window.addEventListener('touchstart', unlock, { once: true });
    }
  }

  public addSpeakingListener(fn: (isSpeaking: boolean) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private setSpeaking(status: boolean) {
    this.isSpeaking = status;
    this.listeners.forEach((fn) => fn(status));
  }

  public stop() {
    // Stop HTML Audio
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }

    // Stop Web Speech Synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
      this.currentUtterance = null;
    }

    this.setSpeaking(false);
  }

  // Primary speech method using /api/tts, with Web Speech fallback
  public speak(text: string, options?: SpeechOptions) {
    const cleaned = text.trim();
    if (!cleaned) {
      options?.onEnd?.();
      return;
    }

    this.stop();
    this.setSpeaking(true);
    options?.onStart?.();

    const playbackRate = options?.rate ?? (this.speedMode === 'slow' ? 0.78 : 1.0);

    // Try server-side TTS first (/api/tts)
    const ttsUrl = `/api/tts?text=${encodeURIComponent(cleaned)}&lang=en`;
    const audio = new Audio(ttsUrl);
    this.currentAudio = audio;
    audio.playbackRate = playbackRate;

    let ended = false;
    const finish = () => {
      if (!ended) {
        ended = true;
        this.currentAudio = null;
        this.setSpeaking(false);
        options?.onEnd?.();
      }
    };

    audio.onended = () => {
      finish();
    };

    audio.onerror = (e) => {
      console.warn('Server TTS playback error, attempting fallback to SpeechSynthesis...', e);
      this.currentAudio = null;
      this.speakWithSpeechSynthesis(cleaned, options, finish);
    };

    audio.play().catch((playError) => {
      console.warn('Audio.play() failed or blocked, falling back to SpeechSynthesis...', playError);
      this.currentAudio = null;
      this.speakWithSpeechSynthesis(cleaned, options, finish);
    });
  }

  // Fallback using browser speechSynthesis
  private speakWithSpeechSynthesis(text: string, options?: SpeechOptions, onFinish?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.setSpeaking(false);
      options?.onError?.('No speech engine available');
      onFinish?.();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      utterance.lang = 'en-US';
      utterance.rate = options?.rate ?? (this.speedMode === 'slow' ? 0.65 : 0.88);
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(
        (v) => (v.lang === 'en-US' || v.lang.startsWith('en')) && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Natural'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (enVoice) {
        utterance.voice = enVoice;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        this.setSpeaking(false);
        onFinish?.();
      };

      utterance.onerror = (err) => {
        this.currentUtterance = null;
        this.setSpeaking(false);
        options?.onError?.(err);
        onFinish?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      this.setSpeaking(false);
      options?.onError?.(err);
      onFinish?.();
    }
  }

  // Specialized kid-friendly methods
  // "Ani bosa a apple desin" -> e.g. "A, Apple!"
  public speakLetterAndWord(letter: string, word: string, options?: SpeechOptions) {
    this.speak(`${letter}, ${word}`, options);
  }

  public speakLetter(letter: string, options?: SpeechOptions) {
    this.speak(letter, options);
  }

  public speakColor(colorEn: string, options?: SpeechOptions) {
    this.speak(colorEn, options);
  }

  public speakNumber(numText: string, options?: SpeechOptions) {
    this.speak(numText, options);
  }

  public speakTransport(transportEn: string, options?: SpeechOptions) {
    this.speak(transportEn, options);
  }
}

export const speechService = new SpeechManager();
