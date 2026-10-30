import React, { useEffect, useState } from 'react';
import { Award, Star, Sparkles, X, CheckCircle2, Volume2, Bell } from 'lucide-react';
import { triggerAchievementCelebration } from '../utils/confetti';
import { SOUNDS, speakSpanish } from '../utils/audio';

export interface AchievementItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  stars: number;
}

interface AchievementOverlayProps {
  achievement: AchievementItem | null;
  onClose: () => void;
}

export const AchievementOverlay: React.FC<AchievementOverlayProps> = ({
  achievement,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);

      // 1. Synchronized triumphant victory sound (campanas de triunfo + aplausos) & confetti
      SOUNDS.triumph();
      triggerAchievementCelebration();

      // 2. Star sparkles sound chime
      setTimeout(() => SOUNDS.star(), 500);

      // 3. Lucy's warm Latin American neutral voice congratulates as the bells ring
      const speechTimer = setTimeout(() => {
        speakSpanish(
          `¡Felicidades amiguito! ¡Has ganado la medalla: ${achievement.title}!`,
          { pitch: 1.34, rate: 0.98 }
        );
      }, 750);

      // Auto dismiss after 7 seconds if not closed manually
      const autoDismissTimer = setTimeout(() => {
        handleDismiss();
      }, 7000);

      return () => {
        clearTimeout(speechTimer);
        clearTimeout(autoDismissTimer);
      };
    } else {
      setIsVisible(false);
    }
  }, [achievement]);

  const handleDismiss = () => {
    SOUNDS.tap();
    setIsVisible(false);
    setTimeout(onClose, 250);
  };

  const handleReplayTriumph = () => {
    SOUNDS.triumph();
    triggerAchievementCelebration();
    setTimeout(() => SOUNDS.star(), 450);
  };

  if (!achievement || !isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onClick={handleDismiss}
    >
      {/* Background Celebration Ray Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[500px] bg-gradient-to-r from-amber-400/20 via-rose-400/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Achievement Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-gradient-to-b from-amber-50 via-white to-amber-50/90 rounded-3xl border-4 border-amber-400 shadow-[0_20px_50px_rgba(234,179,8,0.4)] p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden transform animate-in zoom-in-95 duration-300"
      >
        {/* Close Corner Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Stars Header */}
        <div className="flex items-center gap-1.5 text-amber-500 mb-2">
          <Star className="w-5 h-5 fill-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-amber-700">
            ¡Logro Desbloqueado!
          </span>
          <Star className="w-5 h-5 fill-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        {/* Badge Icon Medallion */}
        <div className="relative my-3">
          {/* Pulsing ring aura */}
          <div className="absolute -inset-3 bg-gradient-to-tr from-amber-400 to-rose-400 rounded-3xl blur-md opacity-60 animate-pulse" />

          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 border-4 border-white shadow-xl flex items-center justify-center text-6xl transform animate-bounce">
            {achievement.icon}
          </div>

          <div className="absolute -top-2 -right-2 text-2xl animate-spin" style={{ animationDuration: '4s' }}>
            ✨
          </div>
          <div className="absolute -bottom-1 -left-2 text-xl animate-float">
            💖
          </div>
        </div>

        {/* Title and Subtitle */}
        <h3 className="text-2xl sm:text-3xl font-black text-rose-800 leading-tight mt-2">
          {achievement.title}
        </h3>
        {achievement.subtitle && (
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1 max-w-xs leading-relaxed">
            {achievement.subtitle}
          </p>
        )}

        {/* Stars Reward Pill */}
        <div className="mt-4 flex items-center gap-2 bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-2 border-amber-300 px-4 py-2 rounded-2xl shadow-xs">
          <Star className="w-6 h-6 fill-amber-400 text-amber-500 animate-spin" style={{ animationDuration: '10s' }} />
          <span className="text-base sm:text-lg font-black text-amber-900">
            +{achievement.stars} Estrellas Ganadas
          </span>
        </div>

        {/* Replay Triumph & Applause Sound Button */}
        <button
          onClick={handleReplayTriumph}
          className="mt-3.5 flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer active:scale-95 transition-all shadow-xs"
          title="Tocar campanas y aplausos de triunfo de nuevo"
        >
          <Bell className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>¡Repetir Campanas y Aplausos! 👏</span>
        </button>

        {/* Action Button */}
        <button
          onClick={handleDismiss}
          className="w-full mt-4 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:brightness-105 active:scale-95 text-white font-black text-base sm:text-lg py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 btn-chunky cursor-pointer"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span>¡Genial, gracias!</span>
        </button>
      </div>
    </div>
  );
};

