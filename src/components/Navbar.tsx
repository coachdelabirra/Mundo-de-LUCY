import React from 'react';
import { Map, Sparkles, Home, BookOpen, Award, Users, Volume2, Star, ShieldCheck } from 'lucide-react';
import { SOUNDS, speakSpanish } from '../utils/audio';
import { GAME_IMAGES } from '../utils/assets';
import { PWAInstallButton } from './PWAInstallButton';

export type ActiveTab = 'mundo' | 'mapa' | 'decorar' | 'avatar' | 'historia';

interface NavbarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  stars: number;
  completedMissionsCount: number;
  totalMissionsCount: number;
  onOpenMissionsList: () => void;
  onOpenAlbum: () => void;
  onOpenParents: () => void;
  onOpenLiveChat: () => void;
  onOpenImageStudio: () => void;
  onOpenWelcome?: () => void;
  onOpenMayiGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onChangeTab,
  stars,
  completedMissionsCount,
  totalMissionsCount,
  onOpenMissionsList,
  onOpenAlbum,
  onOpenParents,
  onOpenLiveChat,
  onOpenImageStudio,
  onOpenWelcome,
  onOpenMayiGuide,
}) => {
  const handleNav = (tab: ActiveTab) => {
    SOUNDS.tap();
    onChangeTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-3 border-amber-300 shadow-sm px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            SOUNDS.tap();
            onOpenWelcome?.();
            speakSpanish('¡El Mundo de Lucy! Juega, aprende y cuida a los animales.', { pitch: 1.34, rate: 0.98 });
          }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          title="Ver pantalla de bienvenida con Lucy"
        >
          <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-rose-400 shadow-md group-hover:scale-105 transition-transform bg-rose-50 flex items-center justify-center shrink-0">
            <img
              src={GAME_IMAGES.lucyAvatar}
              alt="Lucy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain p-0.5 filter drop-shadow-xs"
            />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black tracking-tight text-rose-600 leading-none">
              El Mundo de Lucy
            </h1>
            <span className="text-[10px] sm:text-xs font-bold text-amber-600 tracking-wide">
              con Happy 🐶 y Fede 🐕
            </span>
          </div>
        </div>

        {/* Center Navigation Buttons */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => handleNav('mundo')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'mundo'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                : 'bg-rose-50/70 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <span>🎮</span>
            <span>Explorar</span>
          </button>

          <button
            onClick={() => handleNav('mapa')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'mapa'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Mapa</span>
          </button>

          <button
            onClick={() => handleNav('decorar')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'decorar'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Mi Cuarto</span>
          </button>

          <button
            onClick={() => handleNav('avatar')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'avatar'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Avatares</span>
          </button>

          <button
            onClick={() => handleNav('historia')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'historia'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cuento</span>
          </button>
        </nav>

        {/* Right Action Icons (Stars, Missions, Album, Parents) */}
        <div className="flex items-center gap-2">
          {/* Stars Pill */}
          <div
            onClick={() => {
              SOUNDS.star();
              speakSpanish(`Tienes ${stars} estrellas mágicas.`);
            }}
            className="flex items-center gap-1 bg-amber-100/90 border-2 border-amber-300 px-2.5 sm:px-3 py-1 rounded-2xl shadow-xs cursor-pointer hover:bg-amber-200 transition-colors"
            title="Tus estrellas ganadas"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span className="text-xs sm:text-sm font-black text-amber-900">{stars}</span>
          </div>

          {/* PWA Install Button / Installer Trigger */}
          <PWAInstallButton />

          {/* Mayi Interactive Guide Button */}
          <button
            onClick={() => {
              SOUNDS.tap();
              onOpenMayiGuide?.();
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl shadow-sm border border-pink-300 cursor-pointer active:scale-95 transition-all"
            title="Mayi · Tu Guía Interactiva en todo el juego"
          >
            <img
              src={GAME_IMAGES.mayiAvatar}
              alt="Mayi"
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-contain bg-white/90 p-0.5 border border-pink-200"
            />
            <span className="hidden sm:inline">Guía Mayi</span>
            <span className="sm:hidden">Mayi</span>
          </button>

          {/* Missions List trigger */}
          <button
            onClick={() => {
              SOUNDS.tap();
              onOpenMissionsList();
            }}
            className="hidden md:flex items-center gap-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 border-2 border-rose-300 text-xs font-black px-2.5 py-1 rounded-2xl cursor-pointer transition-colors"
          >
            <span>📜</span>
            <span>Misiones {completedMissionsCount}/{totalMissionsCount}</span>
          </button>

          {/* Live Voice Chat trigger */}
          <button
            onClick={() => {
              SOUNDS.tap();
              onOpenLiveChat();
            }}
            className="p-1.5 sm:p-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl border border-sky-300 cursor-pointer transition-colors"
            title="Charla en Vivo con Lucy (Gemini Live)"
          >
            <span className="text-sm sm:text-base">🎙️</span>
          </button>

          {/* Flash Image Studio trigger */}
          <button
            onClick={() => {
              SOUNDS.tap();
              onOpenImageStudio();
            }}
            className="p-1.5 sm:p-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl border border-rose-300 cursor-pointer transition-colors"
            title="Taller de Arte (Gemini Flash Image)"
          >
            <span className="text-sm sm:text-base">🎨</span>
          </button>

          {/* Album trigger */}
          <button
            onClick={() => {
              SOUNDS.tap();
              onOpenAlbum();
            }}
            className="p-1.5 sm:p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl border border-amber-300 cursor-pointer transition-colors"
            title="Álbum de Recuerdos y Medallas"
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
          </button>

          {/* Parents trigger */}
          <button
            onClick={() => {
              SOUNDS.tap();
              onOpenParents();
            }}
            className="p-1.5 sm:p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl border border-indigo-200 cursor-pointer transition-colors"
            title="Panel para Padres y Docentes"
          >
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
