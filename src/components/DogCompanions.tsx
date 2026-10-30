import React, { useState } from 'react';
import { PetCustomization } from '../types/game';
import { SOUNDS, speakSpanish } from '../utils/audio';
import { GAME_IMAGES } from '../utils/assets';

interface DogCompanionsProps {
  customization?: PetCustomization;
  onPetHappy?: () => void;
  onPetFede?: () => void;
  happyAffection?: number;
  fedeAffection?: number;
  fedeHint?: string | null;
  happyClue?: string | null;
}

export const DogCompanions: React.FC<DogCompanionsProps> = ({
  customization,
  onPetHappy,
  onPetFede,
  happyAffection = 50,
  fedeAffection = 50,
  fedeHint,
  happyClue,
}) => {
  const [showHappyHeart, setShowHappyHeart] = useState(false);
  const [showFedeHeart, setShowFedeHeart] = useState(false);

  const handleHappyTap = () => {
    SOUNDS.bark();
    SOUNDS.petHeart();
    setShowHappyHeart(true);
    setTimeout(() => setShowHappyHeart(false), 1200);
    speakSpanish('¡Guau! Happy mueve la cola de alegría.', { pitch: 1.45, rate: 1.0 });
    onPetHappy?.();
  };

  const handleFedeTap = () => {
    SOUNDS.petHeart();
    setShowFedeHeart(true);
    setTimeout(() => setShowFedeHeart(false), 1200);
    speakSpanish('Federica te da un suave lengüetazo con mucho cariño.', { pitch: 1.18, rate: 0.95 });
    onPetFede?.();
  };

  const collarName =
    customization?.happyCollar === 'azul'
      ? 'Azul 🔵'
      : customization?.happyCollar === 'dorado'
      ? 'Dorado 🥇'
      : 'Rojo 🔴';

  const fedeAcc = customization?.fedeAccessory;

  return (
    <div className="flex items-end gap-3 select-none">
      {/* HAPPY - Border Collie Mix (Young, Energetic, Black & White) */}
      <div className="relative flex flex-col items-center cursor-pointer group" onClick={handleHappyTap}>
        {/* Heart particle on tap */}
        {showHappyHeart && (
          <div className="absolute -top-12 text-xl animate-bounce text-rose-500 font-black z-30">
            💖 +Cariño!
          </div>
        )}

        {/* Happy clue or balloon */}
        {happyClue && (
          <div className="absolute -top-16 z-30 bg-amber-50 border-2 border-amber-300 text-amber-900 text-[11px] font-bold px-2 py-1 rounded-xl shadow-md whitespace-nowrap animate-soft-pulse">
            🐾 {happyClue}
          </div>
        )}

        {/* Happy Image Card with Transparency */}
        <div className="relative group-hover:scale-105 transition-transform duration-200 flex flex-col items-center">
          <div className="w-24 sm:w-28 h-26 sm:h-30 flex items-center justify-center relative">
            <img
              src={GAME_IMAGES.happyAvatar}
              alt="Happy la perrita"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
            />
            {/* Wagging tail badge */}
            <span className="absolute bottom-1 right-1 text-xs animate-tail bg-white/90 p-0.5 rounded-full shadow-2xs">
              🐾
            </span>

            {/* Collar color indicator badge */}
            <span className="absolute top-1 left-1 text-[8px] font-black bg-white/95 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
              {collarName}
            </span>
          </div>

          <div className="w-20 h-2.5 bg-black/25 rounded-full blur-xs mx-auto -mt-1" />
        </div>

        <div className="flex flex-col items-center mt-0.5">
          <span className="text-[10px] font-black tracking-wide text-slate-800 bg-white/90 px-2 py-0.5 rounded-full border border-sky-200 shadow-xs">
            Happy 🐶
          </span>
          <div className="w-12 bg-slate-200 h-1.5 rounded-full mt-0.5 overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: `${happyAffection}%` }} />
          </div>
        </div>
      </div>

      {/* FEDERICA (FEDE) - Older Mixed Breed Dog (Soft Yellow/Cream & White, Calm, Guide) */}
      <div className="relative flex flex-col items-center cursor-pointer group" onClick={handleFedeTap}>
        {/* Heart particle on tap */}
        {showFedeHeart && (
          <div className="absolute -top-12 text-xl animate-bounce text-amber-500 font-black z-30">
            💛 +Amor!
          </div>
        )}

        {/* Fede hint / guide balloon */}
        {fedeHint && (
          <div className="absolute -top-16 z-30 bg-yellow-50 border-2 border-yellow-400 text-amber-950 text-[11px] font-bold px-2.5 py-1.5 rounded-xl shadow-lg whitespace-nowrap animate-soft-pulse max-w-[200px] text-center">
            💡 {fedeHint}
          </div>
        )}

        {/* Fede Image Card with Transparency */}
        <div className="relative group-hover:scale-105 transition-transform duration-200 flex flex-col items-center">
          <div className="w-26 sm:w-32 h-26 sm:h-30 flex items-center justify-center relative">
            <img
              src={GAME_IMAGES.fedeAvatar}
              alt="Federica la perrita guía"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
            />
            {/* Guide flower/bandana badge */}
            {fedeAcc === 'panuelo' && (
              <span className="absolute top-1 right-1 text-sm bg-white/90 p-0.5 rounded-full shadow-2xs">
                🧣
              </span>
            )}
            {fedeAcc === 'corona_flores' && (
              <span className="absolute top-1 right-1 text-sm bg-white/90 p-0.5 rounded-full shadow-2xs">
                🌸
              </span>
            )}
            <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-amber-100/95 text-amber-900 px-1.5 py-0.5 rounded shadow-2xs">
              Calma 🕊️
            </span>
          </div>

          <div className="w-22 h-2.5 bg-black/25 rounded-full blur-xs mx-auto -mt-1" />
        </div>

        <div className="flex flex-col items-center mt-0.5">
          <span className="text-[10px] font-black tracking-wide text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 shadow-xs">
            Fede (Guía) 🐕
          </span>
          <div className="w-12 bg-slate-200 h-1.5 rounded-full mt-0.5 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${fedeAffection}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
