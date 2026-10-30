import React from 'react';
import { Sparkles, Play, Volume2, Heart, Compass, BookOpen, MessageCircle, X, Palette, Star, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GAME_IMAGES } from '../utils/assets';
import { SOUNDS, speakSpanish } from '../utils/audio';
import { ActiveTab } from './Navbar';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (tab: ActiveTab) => void;
  onOpenLiveChat: () => void;
  onOpenImageStudio: () => void;
  onOpenMayiGuide?: () => void;
  onOpenInstaller?: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  onOpenLiveChat,
  onOpenImageStudio,
  onOpenMayiGuide,
  onOpenInstaller,
}) => {
  if (!isOpen) return null;

  const handleStartPlaying = () => {
    SOUNDS.triumph();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    speakSpanish('¡Bienvenida a El Mundo de Lucy! ¡Vamos a jugar y aprender juntos!', {
      pitch: 1.34,
      rate: 0.98,
    });
    onClose();
  };

  const handleQuickAction = (action: () => void, textToSpeak?: string) => {
    SOUNDS.tap();
    if (textToSpeak) {
      speakSpanish(textToSpeak, { pitch: 1.34, rate: 0.98 });
    }
    action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-sky-50 via-rose-50/50 to-white rounded-3xl border-4 border-rose-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Decorative Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 px-5 sm:px-6 py-3.5 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-float">🌟</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                ¡Bienvenida a El Mundo de Lucy!
              </h2>
              <span className="text-xs text-rose-100 font-semibold">
                Videojuego educativo de lectoescritura con Lucy, Happy y Fede
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              SOUNDS.tap();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Main Visual Presentation: Official Lucy Standing Illustration + Companions */}
          <div className="relative bg-gradient-to-tr from-rose-100/80 via-white to-amber-100/70 rounded-3xl border-3 border-rose-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm overflow-hidden">
            {/* Background sparkle accents */}
            <div className="absolute top-2 right-4 text-2xl opacity-40 animate-float pointer-events-none">✨</div>
            <div className="absolute bottom-2 left-4 text-xl opacity-30 animate-float pointer-events-none" style={{ animationDelay: '1.5s' }}>💖</div>

            {/* Lucy Official Character Showcase with Transparency */}
            <div className="relative flex flex-col items-center shrink-0 group">
              <div className="relative w-36 sm:w-40 h-54 sm:h-60 flex items-end justify-center">
                <img
                  src={GAME_IMAGES.lucyStanding}
                  alt="Lucy Oficial"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain object-bottom filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() =>
                    speakSpanish('¡Hola! Soy Lucy, una niña alegre de 5 años. ¡Toca para jugar conmigo!', {
                      pitch: 1.34,
                      rate: 0.98,
                    })
                  }
                  className="absolute top-2 right-1 p-2 rounded-2xl bg-white/95 hover:bg-rose-100 text-rose-600 shadow-md border-2 border-rose-300 transition-colors cursor-pointer"
                  title="Escuchar a Lucy con voz latina de niña"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Lucy Tag */}
              <span className="text-xs font-black text-rose-800 bg-rose-100/90 border border-rose-300 px-3.5 py-0.5 rounded-full -mt-1 shadow-2xs">
                Lucy (5 años) 👧
              </span>
            </div>

            {/* Welcome Greeting & Companions */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <span className="text-[11px] font-black uppercase text-amber-700 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Aventura Interactiva Infantil
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
                  Aprende letras, palabras y empatía
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-1">
                  Explora libremente con Lucy, resuelve misiones fonéticas y cuida con cariño a sus dos perritas fieles.
                </p>
              </div>

              {/* Dog Companions Badges with Official Transparent Images */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                {/* Happy */}
                <div
                  onClick={() =>
                    speakSpanish('¡Guau guau! Soy Happy, la Border Collie saltarina y juguetona.', {
                      pitch: 1.45,
                      rate: 1.0,
                    })
                  }
                  className="flex items-center gap-1.5 bg-sky-50/90 hover:bg-sky-100 border border-sky-300 px-2.5 py-1.5 rounded-2xl cursor-pointer transition-colors shadow-xs"
                  title="Escuchar a Happy"
                >
                  <img
                    src={GAME_IMAGES.happyAvatar}
                    alt="Happy"
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-xl object-contain p-0.5 bg-white/80 border border-sky-300 filter drop-shadow-xs"
                  />
                  <div className="text-left">
                    <div className="text-[11px] font-black text-sky-900 leading-none">Happy 🐶</div>
                    <div className="text-[9px] text-sky-700 font-medium">Border Collie</div>
                  </div>
                </div>

                {/* Fede */}
                <div
                  onClick={() =>
                    speakSpanish('Hola, soy Federica. Tu amiga mayor, sabia y paciente.', {
                      pitch: 1.18,
                      rate: 0.95,
                    })
                  }
                  className="flex items-center gap-1.5 bg-amber-50/90 hover:bg-amber-100 border border-amber-300 px-2.5 py-1.5 rounded-2xl cursor-pointer transition-colors shadow-xs"
                  title="Escuchar a Federica"
                >
                  <img
                    src={GAME_IMAGES.fedeAvatar}
                    alt="Federica"
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-xl object-contain p-0.5 bg-white/80 border border-amber-300 filter drop-shadow-xs"
                  />
                  <div className="text-left">
                    <div className="text-[11px] font-black text-amber-900 leading-none">Fede 🐕</div>
                    <div className="text-[9px] text-amber-700 font-medium">Guía Dorada</div>
                  </div>
                </div>

                {/* Mayi Interactive Guide */}
                <div
                  onClick={() => {
                    SOUNDS.tap();
                    speakSpanish('¡Hola, Lucy! Soy Mayi, tu guía interactiva en todo el juego. ¡Ven a la pastelería o tócame en cualquier momento para ayudarte!', {
                      pitch: 1.32,
                      rate: 0.98,
                    });
                  }}
                  className="flex items-center gap-1.5 bg-pink-50/90 hover:bg-pink-100 border border-pink-300 px-2.5 py-1.5 rounded-2xl cursor-pointer transition-colors shadow-xs"
                  title="Escuchar a Mayi, Guía Interactiva"
                >
                  <img
                    src={GAME_IMAGES.mayiAvatar}
                    alt="Mayi"
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-xl object-contain p-0.5 bg-white/80 border border-pink-300 filter drop-shadow-xs"
                  />
                  <div className="text-left">
                    <div className="text-[11px] font-black text-rose-900 leading-none">Mayi 👩‍🍳</div>
                    <div className="text-[9px] text-rose-700 font-medium">Guía Oficial</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Integrative Action Grid */}
          <div>
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-2 flex items-center gap-1.5">
              <span>🚀</span>
              <span>Acceso Rápido e Integrativo:</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleQuickAction(() => onSelectAction('mundo'), '¡Vamos a explorar las zonas del mapa!')}
                className="p-3 bg-white hover:bg-rose-50 border-2 border-rose-200 hover:border-rose-400 rounded-2xl flex flex-col items-center text-center gap-1.5 cursor-pointer transition-all shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  🎮
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800">Explorar</div>
                  <div className="text-[10px] text-slate-500 font-medium">Mundo abierto</div>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction(() => onSelectAction('avatar'), '¡Vamos a personalizar el vestuario!')}
                className="p-3 bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 rounded-2xl flex flex-col items-center text-center gap-1.5 cursor-pointer transition-all shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  ✨
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800">Avatares</div>
                  <div className="text-[10px] text-slate-500 font-medium">Ropa y collares</div>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction(onOpenLiveChat, '¡Hola amiguito! Vamos a charlar.')}
                className="p-3 bg-white hover:bg-sky-50 border-2 border-sky-200 hover:border-sky-400 rounded-2xl flex flex-col items-center text-center gap-1.5 cursor-pointer transition-all shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  🎙️
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800">Chat con Lucy</div>
                  <div className="text-[10px] text-slate-500 font-medium">Voz latina neutra</div>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction(() => onSelectAction('historia'), '¡Vamos a leer el cuento!')}
                className="p-3 bg-white hover:bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-400 rounded-2xl flex flex-col items-center text-center gap-1.5 cursor-pointer transition-all shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  📖
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800">Cuento</div>
                  <div className="text-[10px] text-slate-500 font-medium">Historia guiada</div>
                </div>
              </button>
            </div>
          </div>

          {/* Install as PWA Feature Banner */}
          {onOpenInstaller && (
            <div
              onClick={() => {
                SOUNDS.tap();
                onOpenInstaller();
              }}
              className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-400 transition-all shadow-xs group"
              title="Abrir instalador de la aplicación PWA"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Download className="w-5 h-5 animate-bounce" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded-full inline-block">
                    Instalar en este Dispositivo
                  </span>
                  <h5 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                    ¿Quieres jugar a pantalla completa sin internet?
                  </h5>
                  <p className="text-[11px] text-slate-600 font-medium hidden sm:block">
                    Instala como app en Android, iPhone, iPad, PC o Mac.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white text-xs font-black shadow-xs shrink-0">
                Instalar PWA
              </span>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            onClick={handleStartPlaying}
            className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-black text-base sm:text-lg py-3.5 px-6 rounded-2xl shadow-lg hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2.5 btn-chunky cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white text-white" />
            <span>¡Entrar a Jugar con Lucy, Happy y Fede!</span>
          </button>

          {/* User Requested Attribution in Small Letters */}
          <div className="text-center text-[11px] sm:text-xs text-slate-500 font-semibold tracking-wide border-t border-rose-200/80 pt-3 pb-1 space-y-0.5">
            <p className="text-slate-500 text-[11px]">Creado e inventado por:</p>
            <p className="font-bold text-rose-700 text-xs sm:text-sm">
              LucyYoly-Soft , &quot;Papito es el Mejor&quot; Company.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
