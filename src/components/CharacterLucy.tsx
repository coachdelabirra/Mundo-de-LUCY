import React from 'react';
import { LucyCustomization } from '../types/game';
import { GAME_IMAGES } from '../utils/assets';

interface CharacterLucyProps {
  customization?: LucyCustomization;
  isWalking?: boolean;
  scale?: number;
  speechText?: string | null;
  onTap?: () => void;
}

export const CharacterLucy: React.FC<CharacterLucyProps> = ({
  customization,
  isWalking = false,
  scale = 1,
  speechText,
  onTap,
}) => {
  const outfit = customization?.outfit || 'clasico_lucy';
  const accessory = customization?.accessory || 'ninguno';

  // Badge or ribbon label based on active outfit
  const outfitTag =
    outfit === 'vestido_rosa'
      ? 'Vestido Rosa 🌸'
      : outfit === 'overol_azul'
      ? 'Overol Aventurero 👖'
      : outfit === 'exploradora'
      ? 'Exploradora 🧭'
      : 'Clásico Rosado "LUCY"';

  return (
    <div
      onClick={onTap}
      className={`relative inline-flex flex-col items-center select-none cursor-pointer group transition-all duration-300 ${
        isWalking ? 'animate-bounce' : ''
      }`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}
    >
      {/* Speech balloon if talking */}
      {speechText && (
        <div className="absolute -top-14 z-30 bg-white/95 backdrop-blur px-3 py-1.5 rounded-2xl shadow-xl border-2 border-rose-300 text-xs font-bold text-rose-800 whitespace-nowrap animate-soft-pulse max-w-[220px] text-center">
          {speechText}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-rose-300" />
        </div>
      )}

      {/* Official Lucy Character Container with Transparency */}
      <div className="relative group-hover:scale-105 transition-transform duration-200 flex flex-col items-center">
        <div className="relative w-32 sm:w-36 h-52 sm:h-60 flex items-end justify-center">
          <img
            src={GAME_IMAGES.lucyStanding}
            alt="Lucy oficial"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain object-bottom filter drop-shadow-xl"
          />

          {/* Accessory badges overlaid on character */}
          {accessory === 'flor' && (
            <div className="absolute top-3 right-3 text-2xl animate-float filter drop-shadow-md">
              🌸
            </div>
          )}
          {accessory === 'corona' && (
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-2xl animate-float filter drop-shadow-md">
              👑
            </div>
          )}
          {accessory === 'lentes' && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-2xl filter drop-shadow-md">
              👓
            </div>
          )}

          {/* Outfit overlay badge if customized */}
          {outfit !== 'clasico_lucy' && (
            <div className="absolute bottom-2 right-1 bg-rose-500/90 backdrop-blur-xs text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
              {outfitTag}
            </div>
          )}
        </div>

        {/* Soft realistic shadow on ground */}
        <div className="w-24 h-3 bg-black/25 rounded-full blur-xs mx-auto -mt-1" />
      </div>

      <span className="text-[11px] font-black tracking-wide text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 mt-1 shadow-xs flex items-center gap-1">
        <span>👧</span>
        <span>Lucy (5 años)</span>
      </span>
    </div>
  );
};
