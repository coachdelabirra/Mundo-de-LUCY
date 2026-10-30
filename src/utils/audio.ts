// Web Audio and Web Speech synthesizer for "El Mundo de Lucy"

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn('Web Audio not supported', e);
    return null;
  }
}

export const SOUNDS = {
  tap() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  },

  correct() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.26);
    });
  },

  star() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = [880, 1108.73, 1318.51, 1760];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.18, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.32);
    });
  },

  gentleHint() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.26);
  },

  bark() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  },

  petHeart() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [659.25, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.15, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.22);
    });
  },

  fanfare() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 659.25, d: 0.12, t: 0.12 },
      { f: 783.99, d: 0.12, t: 0.24 },
      { f: 1046.5, d: 0.35, t: 0.36 },
    ];
    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.25, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.02);
    });
  },

  // Celebratory triumph sound: ringing golden bells and joyful applause synchronized with confetti
  triumph() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Crystal tubular victory bells (C6, E6, G6, C7)
    const bellFrequencies = [1046.5, 1318.5, 1567.98, 2093.0];
    bellFrequencies.forEach((freq, idx) => {
      const bellTime = now + idx * 0.08;

      // Strike fundamental
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, bellTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.998, bellTime + 0.9);

      gain.gain.setValueAtTime(0.3, bellTime);
      gain.gain.exponentialRampToValueAtTime(0.001, bellTime + 0.95);

      // Higher metallic shimmer harmonic (bells overtone)
      const overtone = ctx.createOscillator();
      const overtoneGain = ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2.76, bellTime);
      overtoneGain.gain.setValueAtTime(0.12, bellTime);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, bellTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      overtone.connect(overtoneGain);
      overtoneGain.connect(ctx.destination);

      osc.start(bellTime);
      osc.stop(bellTime + 1.0);
      overtone.start(bellTime);
      overtone.stop(bellTime + 0.55);
    });

    // 2. Joyful crowd applause / rhythmic hand claps
    const clapTimes = [0.18, 0.32, 0.46, 0.6, 0.74, 0.88, 1.02, 1.16];
    clapTimes.forEach((delay) => {
      const clapTime = now + delay;
      const bufferSize = Math.floor(ctx.sampleRate * 0.07);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1150 + Math.random() * 250, clapTime);
      filter.Q.setValueAtTime(2.2, clapTime);

      const clapGain = ctx.createGain();
      clapGain.gain.setValueAtTime(0.2, clapTime);
      clapGain.gain.exponentialRampToValueAtTime(0.001, clapTime + 0.065);

      noise.connect(filter);
      filter.connect(clapGain);
      clapGain.connect(ctx.destination);

      noise.start(clapTime);
      noise.stop(clapTime + 0.07);
    });
  },
};

// Web Audio and Web Speech synthesizer for "El Mundo de Lucy"
// Explicitly tuned for a young Latina girl voice with a neutral Latin American accent (matching reference audio)

// Strict blacklist of male voice tokens across all browser and OS speech synthesizers.
// Any voice containing any of these keywords will NEVER be selected.
const MALE_VOICE_BLACKLIST = [
  'jorge', 'diego', 'raul', 'carlos', 'pablo', 'enrique', 'alvaro', 'mateo',
  'gonzalo', 'manuel', 'antonio', 'miguel', 'juan', 'david', 'pedro', 'alberto',
  'hector', 'javier', 'luis', 'rodrigo', 'paco', 'pepe', 'jose', 'ignacio',
  'fernando', 'andres', 'hombre', 'male', 'guy', 'boy', 'man', 'father', 'adult male',
  'george', 'paul', 'mark', 'richard', 'edward', 'thomas', 'charles'
];

export function isMaleVoice(voice: SpeechSynthesisVoice): boolean {
  const name = voice.name.toLowerCase();
  const uri = (voice.voiceURI || '').toLowerCase();
  return MALE_VOICE_BLACKLIST.some((m) => name.includes(m) || uri.includes(m));
}

// Reactive voice cache to avoid asynchronous empty getVoices() bugs in Chromium/Safari
let cachedVoices: SpeechSynthesisVoice[] = [];

export function refreshVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const list = window.speechSynthesis.getVoices() || [];
  if (list.length > 0) {
    cachedVoices = list;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    refreshVoices();
  };
}

const STORAGE_KEY_VOICE = 'lucy_preferred_female_voice';

export function getPreferredVoiceName(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_VOICE) || '';
  } catch {
    return '';
  }
}

export function setPreferredVoiceName(name: string) {
  try {
    localStorage.setItem(STORAGE_KEY_VOICE, name);
  } catch {}
}

function isLatinLocale(lang: string): boolean {
  const l = lang.toLowerCase();
  return (
    l.startsWith('es-419') ||
    l.startsWith('es-mx') ||
    l.startsWith('es-us') ||
    l.startsWith('es-co') ||
    l.startsWith('es-ve') ||
    l.startsWith('es-cl') ||
    l.startsWith('es-pe') ||
    l.startsWith('es-ar')
  );
}

// Get all verified non-male Spanish voices available on the client device
export function getAvailableFemaleVoices(): SpeechSynthesisVoice[] {
  const all = refreshVoices();
  const nonMaleSpanish = all.filter((v) => v.lang.toLowerCase().startsWith('es') && !isMaleVoice(v));
  
  return nonMaleSpanish.sort((a, b) => {
    const isALatin = isLatinLocale(a.lang);
    const isBLatin = isLatinLocale(b.lang);
    if (isALatin && !isBLatin) return -1;
    if (!isALatin && isBLatin) return 1;
    return a.name.localeCompare(b.name);
  });
}

// Web Speech TTS configured for neutral Latin American young girl voice (matching reference audio)
export function getLatinAmericanVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = refreshVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Check if user has explicitly saved a valid preferred non-male voice
  const savedName = getPreferredVoiceName();
  if (savedName) {
    const saved = voices.find((v) => v.name === savedName && !isMaleVoice(v));
    if (saved) return saved;
  }

  // 2. High-priority explicit Latin American neutral young female voices
  const preferredFemaleNames = [
    'sabina',     // Microsoft Sabina (es-MX) - top neutral female
    'paulina',    // Apple Paulina (es-MX) - standard neutral Latin girl
    'dalia',      // Microsoft Dalia (es-MX)
    'sofia',      // Sofia (es-419 / es-MX)
    'camila',     // Camila (es-419 / es-CO)
    'mia',        // Microsoft Mia (es-MX)
    'paloma',     // Paloma
    'luciana',    // Luciana
    'valentina',  // Valentina
    'salome',     // Salome
    'soledad',    // Soledad (es-CL)
    'francisca',  // Francisca (es-CL)
    'lupe',       // Lupe (es-US)
    'penelope',   // Penelope (es-US)
    'alva',       // Alva
    'rosa',       // Rosa
    'victoria',   // Victoria
    'natural',    // Microsoft/Edge Natural female
    'online',     // Edge Online female
    'female',     // Generic female indicator
    'mujer',
    'girl',
    'niña',
  ];

  // Filter out any voice matching the male blacklist first
  const nonMaleVoices = voices.filter((v) => !isMaleVoice(v));

  // Search among Latin American locales first (es-419, es-MX, es-US, es-CO, es-VE, es-CL, es-PE)
  const latinVoices = nonMaleVoices.filter((v) => isLatinLocale(v.lang));

  for (const name of preferredFemaleNames) {
    const found = latinVoices.find((v) => v.name.toLowerCase().includes(name));
    if (found) return found;
  }

  // Any female or natural voice in Latin American Spanish
  const naturalLatin = latinVoices.find(
    (v) =>
      v.name.toLowerCase().includes('natural') ||
      v.name.toLowerCase().includes('online') ||
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('mujer')
  );
  if (naturalLatin) return naturalLatin;
  if (latinVoices.length > 0) return latinVoices[0];

  // Secondary fallback: Any Spanish non-male voice matching preferred female name (e.g. Monica, Elena, Laura)
  const allSpanishNonMale = nonMaleVoices.filter((v) => v.lang.toLowerCase().startsWith('es'));
  for (const name of preferredFemaleNames) {
    const found = allSpanishNonMale.find((v) => v.name.toLowerCase().includes(name));
    if (found) return found;
  }

  // Fallback to any non-male Spanish voice
  if (allSpanishNonMale.length > 0) {
    return allSpanishNonMale[0];
  }

  // NEVER return a male voice. If all available voices are male, return null to let pitch-shifted utterance handle it safely.
  return null;
}

export function speakSpanish(
  text: string,
  options?: { pitch?: number; rate?: number; onEnd?: () => void }
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not available in this browser');
    return;
  }

  window.speechSynthesis.cancel(); // Stop any pending voice

  const cleanText = text.replace(/[*#_~]/g, '').trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Neutral Latin American Spanish locale (es-419 ensures no Castilian ceceo/lisp)
  utterance.lang = 'es-419';
  
  // Sweet, bright, youthful girl pitch (1.34 - 1.38) matching the lively female voice in reference audio
  utterance.pitch = options?.pitch ?? 1.34;
  
  // Natural, cheerful, energetic tempo (0.98 - 1.0)
  utterance.rate = options?.rate ?? 0.98;

  const latinVoice = getLatinAmericanVoice();
  if (latinVoice) {
    utterance.voice = latinVoice;
  }

  if (options?.onEnd) {
    utterance.onend = options.onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

// Helper to test the voice sample
export function testLucyVoiceSample() {
  speakSpanish(
    '¡Hola amiguitos! Soy Lucy, una niña alegre con mis perritas Happy y Federica. ¡Vamos a jugar en el parque y aprender a leer juntos con acento latino neutro!',
    { pitch: 1.34, rate: 0.98 }
  );
}

// Speak letters phonetically (sound before name) with sweet young girl voice
export function speakPhoneme(letter: string) {
  const upper = letter.toUpperCase();
  const phoneticMap: Record<string, string> = {
    M: '¡Mmmmmm! Como el sonido de mmm.',
    P: '¡P-p-p! La letra P.',
    S: '¡Ssssss! Como una serpiente sssss.',
    L: '¡Lllll! La letra L.',
    T: '¡T-t-t! La letra T.',
    D: '¡D-d-d! La letra D.',
    N: '¡Nnnnn! La letra N.',
    A: '¡Aaaaa! La vocal A.',
    E: '¡Eeeee! La vocal E.',
    I: '¡Iiiii! La vocal I.',
    O: '¡Ooooo! La vocal O.',
    U: '¡Uuuuu! La vocal U.',
    B: '¡B-b-b! La letra B.',
    C: '¡K-k-k! La letra C.',
    F: '¡Fffff! La letra F.',
    R: '¡Rrrrr! La letra R.',
  };

  const toSpeak = phoneticMap[upper] || `La letra ${upper}`;
  speakSpanish(toSpeak, { pitch: 1.34, rate: 0.95 });
}
