import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, ArrowRight, X, Heart, Award, Cookie } from 'lucide-react';
import { Mission, MissionActivity, SWEETS_COLLECTION } from '../../types/game';
import { SOUNDS, speakSpanish, speakPhoneme } from '../../utils/audio';
import { triggerAchievementCelebration } from '../../utils/confetti';
import { GAME_IMAGES } from '../../utils/assets';

interface MissionModalProps {
  mission: Mission;
  sweetsUnlocked?: string[];
  onUnlockSweet?: (sweetId: string) => void;
  onClose: () => void;
  onComplete: (earnedStars: number, badgeId: string) => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  mission,
  sweetsUnlocked = ['galleta'],
  onUnlockSweet,
  onClose,
  onComplete,
}) => {
  const [stepIndex, setStepIndex] = useState(0); // 0 = intro, 1 = activities, 2 = completion
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [fedeHintVisible, setFedeHintVisible] = useState(false);

  // State for spelling activity
  const [spellingSlots, setSpellingSlots] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ id: string; char: string }[]>([]);

  // State for syllables activity (three syllables like ga-lle-ta)
  const [syllableSlots, setSyllableSlots] = useState<string[]>([]);
  const [availableSyllables, setAvailableSyllables] = useState<{ id: string; part: string }[]>([]);

  // State for tracing activity
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tracedPoints, setTracedPoints] = useState<number[]>([]);

  // Companion visual reactions (Happy and Fede react to correct answers)
  const [happyReacting, setHappyReacting] = useState(false);
  const [fedeReacting, setFedeReacting] = useState(false);
  const [unlockedSweetAlert, setUnlockedSweetAlert] = useState<string | null>(null);

  // Mayi interactive animations state (entrance, exit, cheering, talking, idle)
  const [mayiAnimState, setMayiAnimState] = useState<'entering' | 'idle' | 'cheering' | 'talking' | 'exiting'>('entering');
  const [isMayiSpeaking, setIsMayiSpeaking] = useState(false);

  const currentActivity: MissionActivity | undefined = mission.activities[currentActivityIndex];

  // Helper to trigger pet joy reactions & Mayi encouragement
  const triggerPetReactions = () => {
    setHappyReacting(true);
    setFedeReacting(true);
    setMayiAnimState('cheering');
    SOUNDS.petHeart();
    setTimeout(() => {
      setHappyReacting(false);
      setFedeReacting(false);
      setMayiAnimState('idle');
    }, 2400);
  };

  // Helper to trigger Mayi speech interaction with lively bounce animation
  const handleSpeakMayi = (text: string) => {
    setIsMayiSpeaking(true);
    setMayiAnimState('talking');
    speakSpanish(text, { pitch: 1.32, rate: 0.98 });
    setTimeout(() => {
      setIsMayiSpeaking(false);
      setMayiAnimState('idle');
    }, 2800);
  };

  // Helper to unlock sweet in collection for Mission 7
  const handleCheckUnlockSweet = (activityIdx: number) => {
    if (mission.id === 7 && onUnlockSweet) {
      const sweetIdx = Math.min(activityIdx, SWEETS_COLLECTION.length - 1);
      const sweet = SWEETS_COLLECTION[sweetIdx];
      if (sweet) {
        onUnlockSweet(sweet.id);
        setUnlockedSweetAlert(sweet.name);
        setTimeout(() => setUnlockedSweetAlert(null), 3500);
      }
    }
  };

  // Initialize activity state when activity changes
  useEffect(() => {
    if (!currentActivity) return;
    setMistakesCount(0);
    setFedeHintVisible(false);
    setMayiAnimState('entering');
    const mayiTimer = setTimeout(() => setMayiAnimState('idle'), 500);

    if (currentActivity.type === 'fonema') {
      speakPhoneme(currentActivity.targetLetter);
    } else if (currentActivity.type === 'construir') {
      setSpellingSlots([]);
      setAvailableLetters(
        currentActivity.scrambledLetters.map((char, idx) => ({
          id: `${char}-${idx}-${Math.random()}`,
          char,
        }))
      );
      speakSpanish(currentActivity.prompt);
    } else if (currentActivity.type === 'asociar') {
      speakSpanish(`Encuentra: ${currentActivity.word}`);
    } else if (currentActivity.type === 'trazar') {
      setTracedPoints([]);
      speakSpanish(currentActivity.instruction);
    } else if (currentActivity.type === 'pedido') {
      speakSpanish(currentActivity.spokenHint || currentActivity.prompt, { pitch: 1.32, rate: 0.98 });
    } else if (currentActivity.type === 'silabas') {
      setSyllableSlots([]);
      setAvailableSyllables(
        currentActivity.scrambledSyllables.map((part, idx) => ({
          id: `${part}-${idx}-${Math.random()}`,
          part,
        }))
      );
      speakSpanish(currentActivity.prompt, { pitch: 1.32, rate: 0.98 });
    }
  }, [currentActivityIndex, stepIndex]);

  // Audio intro playback with Mayi exit transition
  const handleStartMission = () => {
    SOUNDS.tap();
    setMayiAnimState('exiting');
    setTimeout(() => {
      setStepIndex(1); // Move to activities
    }, 280);
  };

  // 1. Phonics selection handler
  const handleSelectPhoneme = (letter: string) => {
    if (currentActivity?.type !== 'fonema') return;

    if (letter === currentActivity.targetLetter) {
      SOUNDS.correct();
      SOUNDS.star();
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
      triggerPetReactions();
      handleCheckUnlockSweet(currentActivityIndex);
      speakSpanish(`¡Excelente! La letra ${letter} suena así de bonito.`);
      setTimeout(() => advanceActivity(), 1200);
    } else {
      SOUNDS.gentleHint();
      const newMistakes = mistakesCount + 1;
      setMistakesCount(newMistakes);
      if (newMistakes >= 2) {
        setFedeHintVisible(true);
        speakSpanish(currentActivity.feedbackHint, { pitch: 1.18, rate: 0.95 });
      } else {
        speakSpanish(`Esa es la letra ${letter}. ¡Escuchemos de nuevo!`, { pitch: 1.34, rate: 0.98 });
        setTimeout(() => speakPhoneme(currentActivity.targetLetter), 800);
      }
    }
  };

  // 2. Spelling handler
  const handleSelectLetterForSpelling = (item: { id: string; char: string }) => {
    if (currentActivity?.type !== 'construir') return;
    SOUNDS.tap();
    speakSpanish(item.char, { pitch: 1.3, rate: 1 });

    const newSlots = [...spellingSlots, item.char];
    setSpellingSlots(newSlots);
    setAvailableLetters((prev) => prev.filter((l) => l.id !== item.id));

    if (newSlots.length === currentActivity.word.length) {
      const spelledWord = newSlots.join('');
      if (spelledWord === currentActivity.word) {
        SOUNDS.correct();
        SOUNDS.star();
        confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
        triggerPetReactions();
        handleCheckUnlockSweet(currentActivityIndex);
        speakSpanish(`¡Súper! Has formado la palabra ${currentActivity.word}.`);
        setTimeout(() => advanceActivity(), 1400);
      } else {
        SOUNDS.gentleHint();
        speakSpanish('¡Casi casi! Vamos a intentar ordenar las letras otra vez.', { pitch: 1.1 });
        setTimeout(() => {
          setSpellingSlots([]);
          setAvailableLetters(
            currentActivity.scrambledLetters.map((char, idx) => ({
              id: `${char}-${idx}-${Math.random()}`,
              char,
            }))
          );
        }, 1200);
      }
    }
  };

  const handleResetSpelling = () => {
    if (currentActivity?.type !== 'construir') return;
    SOUNDS.tap();
    setSpellingSlots([]);
    setAvailableLetters(
      currentActivity.scrambledLetters.map((char, idx) => ({
        id: `${char}-${idx}-${Math.random()}`,
        char,
      }))
    );
  };

  // 3. Association handler
  const handleSelectOption = (isCorrect: boolean, label: string) => {
    if (currentActivity?.type !== 'asociar') return;

    if (isCorrect) {
      SOUNDS.correct();
      SOUNDS.star();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      triggerPetReactions();
      handleCheckUnlockSweet(currentActivityIndex);
      speakSpanish(`¡Muy bien! Esa es: ${label}.`);
      setTimeout(() => advanceActivity(), 1200);
    } else {
      SOUNDS.gentleHint();
      speakSpanish(`Ese es ${label}. Prueba con otra opción.`);
    }
  };

  // 4. Pedido handler (lectura pura)
  const handleSelectPedidoOption = (isCorrect: boolean, word: string) => {
    if (currentActivity?.type !== 'pedido') return;

    if (isCorrect) {
      SOUNDS.correct();
      SOUNDS.star();
      confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } });
      triggerPetReactions();
      handleCheckUnlockSweet(currentActivityIndex);
      const praise =
        mission.id === 7
          ? `¡Excelente! Mayi entrega el pedido de: ${word}.`
          : `¡Muy bien! Leíste y acertaste: ${word}.`;
      speakSpanish(praise, { pitch: 1.32, rate: 0.98 });
      setTimeout(() => advanceActivity(), 1400);
    } else {
      SOUNDS.gentleHint();
      speakSpanish(
        `¡Casi! Lee con atención: ${currentActivity.targetWord}. Toca el dibujo que coincide.`,
        { pitch: 1.32, rate: 0.98 }
      );
    }
  };

  // 5. Syllables handler (armado en tres sílabas como ga-lle-ta)
  const handleSelectSyllable = (item: { id: string; part: string }) => {
    if (currentActivity?.type !== 'silabas') return;
    SOUNDS.tap();
    speakSpanish(item.part, { pitch: 1.32, rate: 1.0 });

    const newSlots = [...syllableSlots, item.part];
    setSyllableSlots(newSlots);
    setAvailableSyllables((prev) => prev.filter((s) => s.id !== item.id));

    if (newSlots.length === currentActivity.syllables.length) {
      const spelled = newSlots.join('');
      const expected = currentActivity.syllables.join('');
      if (
        spelled.toLowerCase() === expected.toLowerCase() ||
        spelled.toLowerCase() === currentActivity.word.toLowerCase()
      ) {
        SOUNDS.correct();
        SOUNDS.star();
        confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
        triggerPetReactions();
        handleCheckUnlockSweet(currentActivityIndex);
        speakSpanish(`¡Delicioso! Armaste la palabra: ${currentActivity.word}.`, {
          pitch: 1.32,
          rate: 0.98,
        });
        setTimeout(() => advanceActivity(), 1400);
      } else {
        SOUNDS.gentleHint();
        speakSpanish('¡Casi casi! Vamos a intentar ordenar las sílabas otra vez.', {
          pitch: 1.32,
          rate: 0.98,
        });
        setTimeout(() => {
          setSyllableSlots([]);
          setAvailableSyllables(
            currentActivity.scrambledSyllables.map((part, idx) => ({
              id: `${part}-${idx}-${Math.random()}`,
              part,
            }))
          );
        }, 1200);
      }
    }
  };

  const handleResetSyllables = () => {
    if (currentActivity?.type !== 'silabas') return;
    SOUNDS.tap();
    setSyllableSlots([]);
    setAvailableSyllables(
      currentActivity.scrambledSyllables.map((part, idx) => ({
        id: `${part}-${idx}-${Math.random()}`,
        part,
      }))
    );
  };

  // 6. Tracing canvas handlers
  const handleCanvasStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    handleCanvasMove(e);
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentActivity?.type !== 'trazar' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(
        ((clientX - rect.left) / rect.width) * canvas.width,
        ((clientY - rect.top) / rect.height) * canvas.height,
        14,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    currentActivity.pointsGuide.forEach((pt, idx) => {
      const dist = Math.hypot(pt.x - x, pt.y - y);
      if (dist < 18 && !tracedPoints.includes(idx)) {
        SOUNDS.tap();
        setTracedPoints((prev) => [...prev, idx]);
      }
    });
  };

  const handleCanvasEnd = () => {
    setIsDrawing(false);
    if (currentActivity?.type === 'trazar') {
      const threshold = Math.max(2, Math.floor(currentActivity.pointsGuide.length * 0.7));
      if (tracedPoints.length >= threshold) {
        SOUNDS.correct();
        SOUNDS.star();
        confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
        triggerPetReactions();
        handleCheckUnlockSweet(currentActivityIndex);
        speakSpanish(`¡Qué trazo tan bonito! Has escrito la letra ${currentActivity.letter}.`);
        setTimeout(() => advanceActivity(), 1400);
      }
    }
  };

  const handleClearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setTracedPoints([]);
    SOUNDS.tap();
  };

  // Progress logic with smooth Mayi exit & entrance animations
  const advanceActivity = () => {
    setMayiAnimState('exiting');
    setTimeout(() => {
      if (currentActivityIndex + 1 < mission.activities.length) {
        setCurrentActivityIndex((prev) => prev + 1);
      } else {
        setStepIndex(2); // Victory screen
        SOUNDS.triumph();
        triggerAchievementCelebration();
        if (mission.id === 7 && onUnlockSweet) {
          SWEETS_COLLECTION.forEach((s) => onUnlockSweet(s.id));
        }
        setTimeout(() => {
          if (mission.id === 7) {
            speakSpanish(
              '¡Maravilloso, Lucy! Soy la Srta. Chantal. Has completado los 8 pedidos con Mayi a la perfección. ¡Te concedo la Medalla de Oro Pastelera!',
              { pitch: 1.25, rate: 0.96 }
            );
          } else {
            speakSpanish(`¡Felicidades, campeona! Completaste la misión: ${mission.title}.`, {
              pitch: 1.22,
              rate: 0.94,
            });
          }
        }, 700);
      }
    }, 280);
  };

  const handleFinalClaimReward = () => {
    SOUNDS.star();
    onComplete(mission.rewardStars, mission.badgeId);
  };

  // Helper for Sweet Progress percentage in Mission 7
  const sweetsUnlockedCount = SWEETS_COLLECTION.filter((s) => sweetsUnlocked.includes(s.id)).length;
  const sweetsProgressPercent = Math.round((sweetsUnlockedCount / SWEETS_COLLECTION.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-amber-50 rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 px-4 sm:px-5 py-3 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl filter drop-shadow-xs">{mission.badgeIcon}</span>
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-black tracking-wide text-white drop-shadow-xs">
                Misión {mission.id}: {mission.title}
              </h2>
              <span className="text-[11px] sm:text-xs text-rose-100 font-medium line-clamp-1">
                {mission.subtitle}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              SOUNDS.tap();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
            title="Cerrar misión"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VISUAL PROGRESS BAR FOR SWEETS ALBUM (Requirement 6 - Mission 7) */}
        {mission.id === 7 && (
          <div className="bg-gradient-to-r from-pink-100/90 via-amber-100/90 to-rose-100/90 border-b-2 border-amber-200 px-3 sm:px-4 py-2 sm:py-2.5 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 text-amber-900">
                <Cookie className="w-4 h-4 text-rose-500 animate-spin-slow" />
                <span className="text-xs sm:text-sm font-black tracking-tight">
                  Álbum de Dulces de la Pastelería Chantal
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-black text-rose-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                {sweetsUnlockedCount} de {SWEETS_COLLECTION.length} coleccionados ({sweetsProgressPercent}%)
              </span>
            </div>

            {/* Progress track */}
            <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden border border-amber-300/80 mb-2">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-pink-400 to-rose-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(8, sweetsProgressPercent)}%` }}
              />
            </div>

            {/* Sweets items strip */}
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
              {SWEETS_COLLECTION.map((sweet, sIdx) => {
                const isUnlocked = sweetsUnlocked.includes(sweet.id);
                return (
                  <button
                    key={sweet.id}
                    onClick={() => {
                      SOUNDS.tap();
                      if (isUnlocked) {
                        SOUNDS.star();
                        speakSpanish(`¡Has conseguido: ${sweet.name}! ${sweet.description}`, { pitch: 1.32, rate: 0.98 });
                      } else {
                        speakSpanish(`Dulce coleccionable ${sIdx + 1}: ${sweet.name}. Resuelve los pedidos para hornearlo.`);
                      }
                    }}
                    className={`py-1 px-1 sm:px-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isUnlocked
                        ? 'bg-white border-amber-400 shadow-xs hover:scale-105 active:scale-95'
                        : 'bg-amber-50/50 border-dashed border-amber-300/60 opacity-60 hover:opacity-85'
                    }`}
                    title={isUnlocked ? `${sweet.name} (Desbloqueado)` : `${sweet.name} (Por desbloquear)`}
                  >
                    <span className="text-lg sm:text-xl filter drop-shadow-xs">{isUnlocked ? sweet.icon : '🔒'}</span>
                    <span className="text-[9px] sm:text-[10px] font-black text-slate-700 truncate w-full text-center">
                      {isUnlocked ? sweet.name.split(' ')[0] : `P.${sIdx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Floating unlock celebration alert */}
            {unlockedSweetAlert && (
              <div className="mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black py-1 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-md animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
                <span>¡Nuevo dulce desbloqueado para tu Álbum: {unlockedSweetAlert}!</span>
              </div>
            )}
          </div>
        )}

        {/* Content body */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 flex flex-col">
          {/* STEP 0: Dialogue Intro */}
          {stepIndex === 0 && (
            <div className="flex flex-col items-center text-center space-y-4 my-auto">
              {/* Mission Hero Badge with Mayi Guide */}
              {mission.id === 7 ? (
                <div className="w-full bg-gradient-to-r from-pink-100 via-rose-50 to-amber-100 border-2 border-rose-300 rounded-3xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3.5 shadow-xs animate-mayi-in">
                  <div className="relative shrink-0 group">
                    <img
                      src={GAME_IMAGES.mayiAvatar}
                      alt="Mayi"
                      referrerPolicy="no-referrer"
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-contain p-1 bg-white border-3 border-pink-400 shadow-md filter drop-shadow-sm transition-transform ${
                        isMayiSpeaking ? 'animate-mayi-wave scale-105' : 'animate-float'
                      }`}
                    />
                    <span className="absolute -bottom-1 -right-1 text-2xl animate-soft-pulse" title="Chef Pastelera">
                      🧁
                    </span>
                    {isMayiSpeaking && (
                      <span className="absolute -top-2 -right-1 text-base animate-bounce" title="Mayi hablando">
                        💬✨
                      </span>
                    )}
                  </div>
                  <div className="text-left flex-1 space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 bg-rose-200/70 px-2.5 py-0.5 rounded-full inline-block">
                      Guía Interactiva Oficial
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-rose-900 leading-tight">
                      Mayi te da la bienvenida a La Pastelería
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-snug">
                      &quot;¡Hola, Lucy! Soy Mayi y atiendo la pastelería de la Srta. Chantal… Tenemos 8 pedidos especiales que rotan letras, pedidos escritos, sílabas y trazos.&quot;
                    </p>
                    <button
                      onClick={() =>
                        handleSpeakMayi(
                          '¡Hola, Lucy! Soy Mayi y atiendo la pastelería de la Srta. Chantal. ¡Qué alegría que vinieras con Happy y Fede! Tenemos 8 pedidos especiales para hornear.'
                        )
                      }
                      className={`inline-flex items-center gap-1.5 text-xs font-black text-rose-700 bg-white hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-300 shadow-2xs cursor-pointer transition-all active:scale-95 mt-1 ${
                        isMayiSpeaking ? 'animate-soft-pulse bg-rose-100 border-rose-400' : ''
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isMayiSpeaking ? 'Mayi hablando...' : '🔊 Escuchar saludo de Mayi'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full bg-gradient-to-r from-pink-50 via-white to-amber-50 border-2 border-pink-200 rounded-3xl p-3 sm:p-3.5 flex items-center gap-3 shadow-xs animate-mayi-in">
                  <div className="relative shrink-0">
                    <img
                      src={GAME_IMAGES.mayiAvatar}
                      alt="Mayi Guía"
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-contain p-0.5 bg-pink-50 border-2 border-pink-300 shadow-2xs animate-float"
                    />
                    <span className="absolute -bottom-1 -right-1 text-base">🧁</span>
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                        Mayi · Tu Guía
                      </span>
                      <span className="text-xs font-bold text-slate-500">Misión {mission.id}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 font-bold leading-tight mt-1">
                      &quot;¡Hola, Lucy! Te acompañaré con Happy y Fede para aprender las palabras de esta aventura.&quot;
                    </p>
                    <button
                      onClick={() =>
                        handleSpeakMayi(
                          `¡Hola, Lucy! Te acompaño como tu guía en la Misión ${mission.id}: ${mission.title}. ¡Vamos a aprender y jugar juntos!`
                        )
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-white hover:bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200 shadow-2xs cursor-pointer mt-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Escuchar a Mayi</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <h3 className="text-lg sm:text-2xl font-black text-rose-800">{mission.title}</h3>
                <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">
                  Nivel recomendado: {mission.recommendedAge}
                </p>
              </div>

              {/* Character Dialogue Bubble Cards */}
              <div className="w-full space-y-2 max-w-lg text-left">
                {mission.dialogueIntro.map((dlg, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 sm:p-3 rounded-2xl border-2 flex items-start gap-2.5 sm:gap-3 ${
                      dlg.speaker === 'Lucy'
                        ? 'bg-rose-50 border-rose-200'
                        : dlg.speaker === 'Happy'
                        ? 'bg-sky-50 border-sky-200'
                        : dlg.speaker === 'Fede'
                        ? 'bg-amber-50 border-amber-200'
                        : dlg.speaker === 'Mayi'
                        ? 'bg-pink-50 border-pink-300'
                        : 'bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    <div className="shrink-0">
                      {dlg.speaker === 'Lucy' ? (
                        <img
                          src={GAME_IMAGES.lucyAvatar}
                          alt="Lucy"
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-contain p-0.5 bg-white/80 border-2 border-rose-300 shadow-2xs filter drop-shadow-xs animate-soft-pulse hover:scale-105 transition-transform"
                        />
                      ) : dlg.speaker === 'Happy' ? (
                        <img
                          src={GAME_IMAGES.happyAvatar}
                          alt="Happy"
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-contain p-0.5 bg-white/80 border-2 border-sky-300 shadow-2xs filter drop-shadow-xs hover:scale-105 transition-transform"
                        />
                      ) : dlg.speaker === 'Fede' ? (
                        <img
                          src={GAME_IMAGES.fedeAvatar}
                          alt="Fede"
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-contain p-0.5 bg-white/80 border-2 border-amber-300 shadow-2xs filter drop-shadow-xs hover:scale-105 transition-transform"
                        />
                      ) : dlg.speaker === 'Mayi' ? (
                        <img
                          src={GAME_IMAGES.mayiAvatar}
                          alt="Mayi"
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-contain p-0.5 bg-white/80 border-2 border-pink-400 shadow-2xs filter drop-shadow-xs animate-mayi-wave hover:scale-105 transition-transform"
                        />
                      ) : dlg.speaker === 'Srta Chantal' ? (
                        <img
                          src={GAME_IMAGES.chantalAvatar}
                          alt="Srta Chantal"
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-contain p-0.5 bg-white/80 border-2 border-amber-400 shadow-2xs filter drop-shadow-xs hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl border border-emerald-300 shadow-2xs">
                          {dlg.speaker === 'Carmen' ? '✂️' : '👩‍🍳'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800">{dlg.speaker}</span>
                        <button
                          onClick={() =>
                            speakSpanish(`${dlg.speaker} dice: ${dlg.text}`, {
                              pitch:
                                dlg.speaker === 'Lucy'
                                  ? 1.34
                                  : dlg.speaker === 'Happy'
                                  ? 1.45
                                  : dlg.speaker === 'Fede'
                                  ? 1.18
                                  : dlg.speaker === 'Mayi'
                                  ? 1.32
                                  : 1.25,
                              rate: 0.98,
                            })
                          }
                          className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                          title="Escuchar diálogo"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">{dlg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartMission}
                className="w-full max-w-sm mt-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-base sm:text-lg py-3 px-6 rounded-2xl shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 btn-chunky cursor-pointer"
              >
                <span>¡Empezar Aventura!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 1: Activities (The 4 core mechanics rotated across 8 orders) */}
          {stepIndex === 1 && currentActivity && (
            <div className="flex flex-col flex-1">
              {/* Activity Progress indicator */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200">
                <span className="text-xs font-bold text-amber-900">
                  {mission.id === 7 ? 'Pedido Dulce' : 'Actividad'} {currentActivityIndex + 1} de {mission.activities.length}
                </span>
                <div className="flex gap-1.5">
                  {mission.activities.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2.5 rounded-full transition-all ${
                        i === currentActivityIndex
                          ? 'w-6 bg-rose-500'
                          : i < currentActivityIndex
                          ? 'w-2.5 bg-emerald-500'
                          : 'w-2.5 bg-amber-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* MAYI INTERACTIVE GUIDE BANNER IN ALL MISSIONS */}
              <div
                key={`mayi-guide-${currentActivityIndex}`}
                className={`bg-white/95 border-2 border-pink-300 rounded-2xl p-2.5 sm:p-3 mb-4 shadow-2xs flex items-center gap-2.5 sm:gap-3 transition-all ${
                  mayiAnimState === 'entering'
                    ? 'animate-mayi-in'
                    : mayiAnimState === 'exiting'
                    ? 'animate-mayi-out opacity-60'
                    : mayiAnimState === 'cheering'
                    ? 'bg-pink-50/95 border-pink-400 scale-[1.02] shadow-md'
                    : ''
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={GAME_IMAGES.mayiAvatar}
                    alt="Mayi Guía"
                    referrerPolicy="no-referrer"
                    className={`w-12 h-12 rounded-xl object-contain p-0.5 bg-pink-50 border-2 border-pink-400 shadow-2xs filter drop-shadow-xs transition-transform ${
                      mayiAnimState === 'entering'
                        ? 'animate-mayi-in'
                        : mayiAnimState === 'exiting'
                        ? 'animate-mayi-out'
                        : mayiAnimState === 'cheering'
                        ? 'animate-bounce'
                        : isMayiSpeaking
                        ? 'animate-mayi-wave scale-105'
                        : 'animate-float'
                    }`}
                  />
                  <span className={`absolute -bottom-1 -right-1 text-sm ${mayiAnimState === 'cheering' ? 'animate-bounce' : ''}`}>
                    {mayiAnimState === 'cheering' ? '✨' : '👩‍🍳'}
                  </span>
                  {isMayiSpeaking && (
                    <span className="absolute -top-2 -right-1 text-xs animate-bounce" title="Mayi hablando">
                      💬
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-black text-rose-600 uppercase">
                        {mission.id === 7 ? 'Mayi en la Pastelería:' : 'Mayi · Guía de la Misión:'}
                      </span>
                      {mayiAnimState === 'cheering' && (
                        <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full animate-soft-pulse border border-amber-300">
                          ¡Excelente, Lucy! 💖
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const guideText = currentActivity.type === 'trazar' ? currentActivity.instruction : currentActivity.prompt;
                        handleSpeakMayi(`Mayi dice: ${guideText}`);
                      }}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-xl border border-rose-200 cursor-pointer transition-all active:scale-95 ${
                        isMayiSpeaking ? 'animate-soft-pulse bg-rose-100 border-rose-400 shadow-xs' : ''
                      }`}
                      title="Escuchar consejo de Mayi"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isMayiSpeaking ? 'Mayi hablando...' : 'Escuchar a Mayi'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-bold leading-tight line-clamp-2 mt-0.5">
                    {currentActivity.type === 'trazar' ? currentActivity.instruction : currentActivity.prompt}
                  </p>
                </div>
              </div>

              {/* 1. FONEMA ACTIVITY (Letra Inicial) */}
              {currentActivity.type === 'fonema' && (
                <div className="flex flex-col items-center text-center space-y-5 my-auto">
                  <div className="space-y-1">
                    <span className="text-xs font-black tracking-wider text-rose-500 uppercase bg-rose-100 px-3 py-1 rounded-full">
                      Reconocimiento de Letra Inicial y Sonido
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-800 px-2">
                      {currentActivity.prompt}
                    </h3>
                  </div>

                  {/* Sound Replay Button */}
                  <button
                    onClick={() => speakPhoneme(currentActivity.targetLetter)}
                    className="flex items-center gap-2 bg-rose-500 text-white font-black py-2.5 px-5 rounded-2xl shadow-md hover:bg-rose-600 active:scale-95 transition-all cursor-pointer animate-soft-pulse"
                  >
                    <Volume2 className="w-5 h-5" />
                    <span className="text-sm sm:text-base">Escuchar Sonido de la Letra</span>
                  </button>

                  {/* Letters Options */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md pt-1">
                    {currentActivity.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectPhoneme(opt)}
                        className="h-18 sm:h-22 bg-white border-3 border-amber-300 rounded-2xl text-4xl sm:text-5xl font-black text-slate-800 shadow-md hover:border-rose-400 hover:bg-rose-50 active:scale-95 transition-all flex items-center justify-center cursor-pointer btn-chunky"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {/* Fede gentle guide hint */}
                  {fedeHintVisible && (
                    <div className="flex items-center gap-2.5 bg-amber-100/90 border-2 border-amber-300 p-2.5 rounded-2xl max-w-md text-left animate-in fade-in">
                      <span className="text-2xl">🐕</span>
                      <p className="text-xs sm:text-sm text-amber-950 font-bold">
                        {currentActivity.feedbackHint}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 2. PEDIDO ACTIVITY (Lectura Pura: palabra escrita -> toca dibujo) */}
              {currentActivity.type === 'pedido' && (
                <div className="flex flex-col items-center text-center space-y-4 my-auto">
                  <div className="space-y-1">
                    <span className="text-xs font-black tracking-wider text-teal-600 uppercase bg-teal-100 px-3 py-1 rounded-full">
                      Lectura Pura del Pedido Escrito
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-800 px-2">
                      {currentActivity.prompt}
                    </h3>
                  </div>

                  {/* Target Word Display Card */}
                  <div className="bg-gradient-to-r from-amber-100 via-rose-100 to-pink-100 border-3 border-amber-300 rounded-3xl px-6 py-4 shadow-sm flex flex-col items-center gap-2 w-full max-w-md">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                      Orden escrita en el cartel:
                    </span>
                    <span className="text-4xl sm:text-5xl font-black text-rose-600 tracking-widest drop-shadow-xs font-mono">
                      {currentActivity.targetWord}
                    </span>
                    <button
                      onClick={() =>
                        speakSpanish(
                          currentActivity.spokenHint || currentActivity.targetWord,
                          { pitch: 1.32, rate: 0.96 }
                        )
                      }
                      className="flex items-center gap-1.5 bg-white/95 hover:bg-white text-rose-600 border border-rose-300 px-3.5 py-1.5 rounded-2xl font-bold text-xs sm:text-sm shadow-2xs cursor-pointer active:scale-95 transition-all mt-1"
                    >
                      <Volume2 className="w-4 h-4 text-rose-500" />
                      <span>🔊 Escuchar Pedido (Ayuda de Mayi)</span>
                    </button>
                  </div>

                  {/* Options: touch corresponding drawing */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg pt-1">
                    {currentActivity.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectPedidoOption(opt.isCorrect, opt.word)}
                        className="bg-white border-3 border-amber-300 hover:border-rose-400 p-3.5 rounded-2xl flex flex-col items-center gap-2 shadow-md hover:bg-rose-50 active:scale-95 transition-all cursor-pointer btn-chunky"
                      >
                        <span className="text-5xl filter drop-shadow-xs">{opt.icon}</span>
                        <span className="text-xs sm:text-sm font-black text-slate-800 text-center leading-snug">
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. SILABAS ACTIVITY (Armado en Sílabas, ej. GA-LLE-TA) */}
              {currentActivity.type === 'silabas' && (
                <div className="flex flex-col items-center text-center space-y-4 my-auto">
                  <div className="space-y-1">
                    <span className="text-xs font-black tracking-wider text-purple-600 uppercase bg-purple-100 px-3 py-1 rounded-full">
                      Armado en Sílabas de Pastelería
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-800 px-2">
                      {currentActivity.prompt}
                    </h3>
                  </div>

                  {/* Word icon & meaning card */}
                  <div className="flex items-center gap-2.5 bg-white/90 border-2 border-amber-200 px-4 py-2 rounded-2xl shadow-2xs">
                    <span className="text-3xl">{currentActivity.icon}</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-700">{currentActivity.meaning}</span>
                    <button
                      onClick={() => speakSpanish(currentActivity.word, { pitch: 1.32, rate: 0.98 })}
                      className="text-rose-500 hover:text-rose-700 ml-1 p-0.5 cursor-pointer"
                      title="Escuchar palabra completa"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Syllables landing slots */}
                  <div className="flex items-center justify-center gap-2.5">
                    {Array.from({ length: currentActivity.syllables.length }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`px-3 sm:px-4 h-14 sm:h-18 min-w-16 rounded-2xl border-3 flex items-center justify-center text-2xl sm:text-3xl font-black transition-all ${
                          syllableSlots[idx]
                            ? 'bg-gradient-to-br from-rose-500 to-pink-500 border-rose-600 text-white shadow-md scale-105'
                            : 'bg-white/90 border-dashed border-amber-400 text-slate-300'
                        }`}
                      >
                        {syllableSlots[idx] || '···'}
                      </div>
                    ))}
                  </div>

                  {/* Scrambled syllable buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md pt-1">
                    {availableSyllables.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleSelectSyllable(s)}
                        className="h-14 sm:h-18 px-5 bg-white border-3 border-amber-400 text-amber-900 rounded-2xl text-2xl sm:text-3xl font-black shadow-md hover:bg-amber-100 hover:border-amber-500 active:scale-95 transition-all flex items-center justify-center cursor-pointer btn-chunky"
                      >
                        {s.part}
                      </button>
                    ))}
                  </div>

                  {/* Reset button */}
                  {syllableSlots.length > 0 && (
                    <button
                      onClick={handleResetSyllables}
                      className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-100 px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reintentar sílabas</span>
                    </button>
                  )}
                </div>
              )}

              {/* 4. TRAZAR ACTIVITY (Trazo con el dedo) */}
              {currentActivity.type === 'trazar' && (
                <div className="flex flex-col items-center text-center space-y-3.5 my-auto">
                  <div className="space-y-1">
                    <span className="text-xs font-black tracking-wider text-purple-600 uppercase bg-purple-100 px-3 py-1 rounded-full">
                      Grafomotricidad: Trazo de la Primera Letra
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-800">
                      {currentActivity.instruction}
                    </h3>
                    <p className="text-xs text-amber-700 font-bold">{currentActivity.soundCue}</p>
                  </div>

                  {/* Interactive Canvas container */}
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 bg-white rounded-3xl border-4 border-dashed border-rose-300 shadow-inner flex items-center justify-center touch-none overflow-hidden">
                    <span className="absolute text-slate-200 text-[160px] font-black select-none pointer-events-none">
                      {currentActivity.letter}
                    </span>

                    {currentActivity.pointsGuide.map((pt, idx) => {
                      const isReached = tracedPoints.includes(idx);
                      return (
                        <div
                          key={idx}
                          className={`absolute w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-transform select-none pointer-events-none ${
                            isReached
                              ? 'bg-emerald-500 border-white text-white scale-110 shadow-md'
                              : 'bg-amber-300 border-amber-500 text-amber-900 animate-pulse'
                          }`}
                          style={{
                            left: `${pt.x}%`,
                            top: `${pt.y}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          {idx + 1}
                        </div>
                      );
                    })}

                    <canvas
                      ref={canvasRef}
                      width={256}
                      height={256}
                      onMouseDown={handleCanvasStart}
                      onMouseMove={handleCanvasMove}
                      onMouseUp={handleCanvasEnd}
                      onTouchStart={handleCanvasStart}
                      onTouchMove={handleCanvasMove}
                      onTouchEnd={handleCanvasEnd}
                      className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                    />
                  </div>

                  {/* Tracing Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleClearCanvas}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-300 px-3 py-1.5 rounded-xl hover:bg-slate-50 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Borrar Trazo</span>
                    </button>
                    <button
                      onClick={() => speakPhoneme(currentActivity.letter)}
                      className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl hover:bg-rose-100 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Escuchar Sonido</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 5. CONSTRUIR / SPELLING ACTIVITY */}
              {currentActivity.type === 'construir' && (
                <div className="flex flex-col items-center text-center space-y-4 my-auto">
                  <div className="space-y-1">
                    <span className="text-xs font-black tracking-wider text-indigo-500 uppercase bg-indigo-100 px-3 py-1 rounded-full">
                      Construcción de Palabras Letra a Letra
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-800 px-2">
                      {currentActivity.prompt}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white/80 border-2 border-amber-200 px-4 py-2 rounded-2xl shadow-2xs">
                    <span className="text-3xl">{currentActivity.icon}</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-700">{currentActivity.meaning}</span>
                    <button
                      onClick={() => speakSpanish(currentActivity.word)}
                      className="text-rose-500 hover:text-rose-700 ml-1 p-0.5 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: currentActivity.word.length }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-12 h-14 sm:w-15 sm:h-18 rounded-2xl border-3 flex items-center justify-center text-2xl sm:text-3xl font-black transition-all ${
                          spellingSlots[idx]
                            ? 'bg-rose-500 border-rose-600 text-white shadow-md scale-105'
                            : 'bg-white/90 border-dashed border-amber-400 text-slate-300'
                        }`}
                      >
                        {spellingSlots[idx] || '_'}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2.5 w-full max-w-sm pt-1">
                    {availableLetters.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => handleSelectLetterForSpelling(l)}
                        className="w-12 h-14 sm:w-15 sm:h-18 bg-white border-3 border-indigo-400 text-indigo-700 rounded-2xl text-2xl sm:text-3xl font-black shadow-md hover:bg-indigo-50 active:scale-95 transition-all flex items-center justify-center cursor-pointer btn-chunky"
                      >
                        {l.char}
                      </button>
                    ))}
                  </div>

                  {spellingSlots.length > 0 && (
                    <button
                      onClick={handleResetSpelling}
                      className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-100 px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reintentar letras</span>
                    </button>
                  )}
                </div>
              )}

              {/* 6. ASOCIAR / PICTURE-WORD ASSOCIATION */}
              {currentActivity.type === 'asociar' && (
                <div className="flex flex-col items-center text-center space-y-4 my-auto">
                  <div className="space-y-1">
                    <span className="text-xs font-black tracking-wider text-emerald-600 uppercase bg-emerald-100 px-3 py-1 rounded-full">
                      Asociación de Palabra e Imagen
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-800 px-2">
                      {currentActivity.prompt}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 bg-amber-100 px-4 py-1.5 rounded-2xl">
                    <span className="text-sm font-black text-slate-800">Palabra clave:</span>
                    <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-wider">
                      {currentActivity.word}
                    </span>
                    <button
                      onClick={() => speakSpanish(currentActivity.word)}
                      className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
                    {currentActivity.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt.isCorrect, opt.label)}
                        className="bg-white border-3 border-amber-300 hover:border-emerald-400 p-3.5 rounded-2xl flex flex-col items-center gap-2 shadow-md hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer btn-chunky"
                      >
                        <span className="text-4xl sm:text-5xl">{opt.icon}</span>
                        <span className="text-xs sm:text-sm font-black text-slate-800">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* HAPPY & FEDE COMPANION REACTION BAR (Requirement 4) */}
              <div className="mt-auto pt-3 border-t border-amber-200/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => {
                      SOUNDS.bark();
                      speakSpanish('Happy mueve su colita de alegría: ¡Guau guau!');
                    }}
                    className={`flex items-center gap-1.5 bg-white/90 border-2 rounded-2xl px-2.5 py-1 shadow-2xs cursor-pointer transition-all ${
                      happyReacting ? 'border-sky-400 bg-sky-50 scale-105 animate-bounce' : 'border-sky-200'
                    }`}
                    title="Happy te acompaña en la pastelería"
                  >
                    <img
                      src={GAME_IMAGES.happyAvatar}
                      alt="Happy"
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-lg object-contain"
                    />
                    <span className="text-[11px] font-black text-sky-900">
                      {happyReacting ? '¡Guau! 💖' : 'Happy'}
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      SOUNDS.petHeart();
                      speakSpanish('Federica te anima: ¡Qué bien lo estás haciendo, Lucy!');
                    }}
                    className={`flex items-center gap-1.5 bg-white/90 border-2 rounded-2xl px-2.5 py-1 shadow-2xs cursor-pointer transition-all ${
                      fedeReacting ? 'border-amber-400 bg-amber-50 scale-105 animate-pulse' : 'border-amber-200'
                    }`}
                    title="Fede te acompaña en la pastelería"
                  >
                    <img
                      src={GAME_IMAGES.fedeAvatar}
                      alt="Fede"
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-lg object-contain"
                    />
                    <span className="text-[11px] font-black text-amber-900">
                      {fedeReacting ? '¡Bravo! 🐾' : 'Fede'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] sm:text-xs font-semibold text-slate-500">
                  Los errores no quitan puntos · ¡Aprende con alegría!
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: VICTORY CELEBRATION */}
          {stepIndex === 2 && (
            <div className="flex flex-col items-center text-center space-y-4 my-auto">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-4xl sm:text-5xl shadow-xl animate-bounce">
                  {mission.badgeIcon}
                </div>
                <div className="absolute -top-2 -right-2 text-2xl animate-spin">
                  ✨
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-rose-800">
                  ¡Misión Completada con Éxito!
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-700">
                  {mission.id === 7
                    ? '¡La Srta. Chantal y Mayi están encantadas con tu ayuda en la pastelería!'
                    : 'Lucy, Happy y Federica están muy orgullosas de tu gran esfuerzo.'}
                </p>
              </div>

              {/* Characters final congratulation card with Mayi */}
              <div className="w-full max-w-md bg-gradient-to-r from-pink-50 via-amber-50 to-rose-50 border-2 border-pink-300 p-3.5 rounded-2xl shadow-sm space-y-2.5 text-left animate-mayi-in">
                {mission.id === 7 && (
                  <div className="flex items-center gap-3 pb-2 border-b border-amber-200/70">
                    <img
                      src={GAME_IMAGES.chantalAvatar}
                      alt="Srta Chantal"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-contain p-0.5 bg-white border-2 border-amber-300 shadow-2xs animate-float"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-900">La Srta. Chantal (Dueña)</span>
                        <button
                          onClick={() =>
                            speakSpanish(
                              '¡Maravilloso, Lucy! Soy la Srta. Chantal. Has completado los 8 pedidos con Mayi a la perfección. ¡Te concedo la Medalla de Oro Pastelera!',
                              { pitch: 1.25, rate: 0.96 }
                            )
                          }
                          className="text-amber-700 hover:text-amber-900 p-0.5 cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">
                        &quot;¡Te otorgo la Medalla de Oro Pastelera! Tu Álbum de Dulces está completo.&quot;
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <img
                    src={GAME_IMAGES.mayiAvatar}
                    alt="Mayi"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-contain p-0.5 bg-white border-2 border-pink-300 shadow-2xs animate-mayi-wave"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-rose-800">
                        {mission.id === 7 ? 'Mayi (Encargada)' : 'Mayi (Tu Guía)'}
                      </span>
                      <button
                        onClick={() =>
                          handleSpeakMayi(
                            mission.id === 7
                              ? '¡Muchísimas gracias Lucy, Happy y Fede! ¡Fue un honor hornear juntos!'
                              : `¡Lo lograste, Lucy! Completaste la Misión ${mission.id}: ${mission.title}. ¡Aprendiste cosas increíbles!`
                          )
                        }
                        className="text-rose-700 hover:text-rose-900 p-0.5 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">
                      {mission.id === 7
                        ? '"¡Muchísimas gracias! Todos los dulces quedaron riquísimos."'
                        : '"¡Qué orgullo verte aprender y divertirte con Happy y Fede!"'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rewards Earned Card */}
              <div className="w-full max-w-sm bg-white/90 border-2 border-amber-300 p-3.5 rounded-2xl shadow-md space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-black text-amber-900 border-b border-amber-100 pb-2">
                  <span>Recompensas Ganadas:</span>
                  <span className="flex items-center gap-1 text-amber-500 font-extrabold text-sm sm:text-base">
                    +{mission.rewardStars} ⭐ Estrellas
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{mission.badgeIcon}</span>
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Insignia Desbloqueada:</span>
                    <p className="text-xs sm:text-sm font-black text-slate-800">{mission.badgeName}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFinalClaimReward}
                className="w-full max-w-sm bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-base sm:text-lg py-3 px-6 rounded-2xl shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 btn-chunky cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>¡Guardar y Continuar!</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
