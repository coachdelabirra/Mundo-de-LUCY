import React, { useState } from 'react';
import { Volume2, Sparkles, BookOpen, Play, Cookie, Heart, X, Award, MessageCircle, Lightbulb } from 'lucide-react';
import { GAME_IMAGES } from '../utils/assets';
import { SOUNDS, speakSpanish } from '../utils/audio';
import { MISSIONS, ZONES } from '../data/gameContent';
import { Mission, SWEETS_COLLECTION, ZoneId } from '../types/game';
import { ActiveTab } from './Navbar';

interface MayiGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentZone: ZoneId;
  activeTab: ActiveTab;
  completedMissions: number[];
  sweetsUnlocked: string[];
  onOpenMission: (mission: Mission) => void;
  onOpenLiveChat: () => void;
  onOpenAlbum: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const MayiGuideModal: React.FC<MayiGuideModalProps> = ({
  isOpen,
  onClose,
  currentZone,
  activeTab,
  completedMissions,
  sweetsUnlocked,
  onOpenMission,
  onOpenLiveChat,
  onOpenAlbum,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  const [isSpeaking, setIsSpeaking] = useState(false);

  // Determine current contextual advice based on where Lucy is
  const getContextAdvice = () => {
    if (activeTab === 'mapa') {
      return {
        title: 'Explorando el Mapa',
        text: '¡Este es el mapa de nuestro vecindario! Toca el parque, el cuarto, el patio, la pastelería o la peluquería para viajar al instante.',
        icon: '🗺️',
      };
    }
    if (activeTab === 'decorar') {
      return {
        title: 'Decorando tu Cuarto',
        text: '¡Qué lindo está quedando tu cuarto, Lucy! Puedes usar tus estrellas ganadas para colocar más muebles y juguetes mágicos.',
        icon: '🏠',
      };
    }
    if (activeTab === 'avatar') {
      return {
        title: 'Cambiando de Estilo',
        text: '¡Prueba peinados nuevos para Lucy o cámbiales los collares y lazos a Happy y Federica!',
        icon: '👗',
      };
    }
    if (activeTab === 'historia') {
      return {
        title: 'Historias del Corazón',
        text: '¡Me encantan estos cuentos! Nos enseñan sobre la bondad con los animales y cómo las palabras abren puertas mágicas.',
        icon: '📖',
      };
    }

    // Default: in active zone in 'mundo'
    switch (currentZone) {
      case 'cuarto':
        return {
          title: 'El Cuarto de Lucy',
          text: 'En tu cuarto puedes tocar tu cama, el osito de peluche, la pelota y la casa de muñecas para escuchar cómo suenan sus letras.',
          icon: '🛏️',
        };
      case 'patio':
        return {
          title: 'Cuidando a Happy y Fede',
          text: '¡Happy y Fede tienen hambre y sed! Toca el agua fresca y el plato de pienso para alimentarlos con mucho cariño.',
          icon: '🥣',
        };
      case 'parque':
        return {
          title: 'El Gran Parque',
          text: '¡El sol brilla en el parque! Pídele a Happy que olfatee las flores para encontrar pistas y letras doradas escondidas.',
          icon: '🌳',
        };
      case 'panaderia':
        return {
          title: 'La Pastelería de la Srta. Chantal',
          text: '¡Bienvenida a mi pastelería! Ven a hornear tortas, dulces y galletas conmigo en la Misión 7. ¡Completarás tu álbum de dulces!',
          icon: '🧁',
        };
      case 'peluqueria':
        return {
          title: 'Peluquería de Mascotas',
          text: '¡Burbujas y mimos para las perritas! Carmen tiene cepillos suaves y lazos bonitos para dejar el pelaje brillante.',
          icon: '🛁',
        };
      default:
        return {
          title: '¡Aventura con Lucy!',
          text: '¡Qué alegría jugar juntos! Cada letra tiene su propio sonido mágico. ¡Diviértete descubriendo palabras!',
          icon: '🌟',
        };
    }
  };

  const advice = getContextAdvice();

  // Find next recommended mission
  const nextMission =
    MISSIONS.find((m) => !completedMissions.includes(m.id)) || MISSIONS[0];

  const handleSpeak = (text: string) => {
    SOUNDS.tap();
    setIsSpeaking(true);
    speakSpanish(text, { pitch: 1.32, rate: 0.98 });
    setTimeout(() => setIsSpeaking(false), 3200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-pink-50 via-rose-50/60 to-white rounded-3xl border-4 border-pink-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-mayi-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 px-5 py-3.5 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-float">🧁</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                Mayi · Tu Guía Interactiva
              </h2>
              <span className="text-xs text-pink-100 font-medium">
                Consejos, misiones y apoyo con amor para Lucy
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              SOUNDS.tap();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
            title="Cerrar guía"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Mayi Hero Showcase */}
          <div className="bg-white/95 border-2 border-pink-200 rounded-3xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-xs">
            <div className="relative shrink-0 group">
              <img
                src={GAME_IMAGES.mayiAvatar}
                alt="Mayi"
                referrerPolicy="no-referrer"
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-contain p-1 bg-pink-50 border-3 border-pink-400 shadow-md filter drop-shadow-xs transition-transform ${
                  isSpeaking ? 'animate-mayi-wave scale-105' : 'animate-float'
                }`}
              />
              <span className="absolute -bottom-1 -right-1 text-2xl animate-soft-pulse">
                👩‍🍳
              </span>
              {isSpeaking && (
                <span className="absolute -top-2 -right-1 text-base animate-bounce">
                  💬✨
                </span>
              )}
            </div>

            <div className="text-left flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                  Guía Oficial de Lucy
                </span>
                <span className="text-[11px] text-slate-500 font-bold">
                  {advice.icon} {advice.title}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-rose-900 leading-snug">
                &quot;¡Hola, Lucy! Aquí estoy para ayudarte.&quot;
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                {advice.text}
              </p>
              <button
                onClick={() => handleSpeak(`Mayi dice: ${advice.text}`)}
                className={`inline-flex items-center gap-1.5 text-xs font-black text-rose-700 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-xl border border-pink-300 shadow-2xs cursor-pointer transition-all active:scale-95 ${
                  isSpeaking ? 'animate-soft-pulse bg-pink-100 border-pink-400' : ''
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isSpeaking ? 'Mayi hablando...' : '🔊 Escuchar consejo de Mayi'}</span>
              </button>
            </div>
          </div>

          {/* Quick Interactive Actions with Mayi */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>¿Qué te gustaría hacer con Mayi?</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Recommended Mission Action */}
              <button
                onClick={() => {
                  SOUNDS.tap();
                  onClose();
                  onOpenMission(nextMission);
                }}
                className="p-3 bg-white hover:bg-rose-50 border-2 border-rose-200 hover:border-rose-300 rounded-2xl flex items-center gap-3 text-left transition-all shadow-xs active:scale-98 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                  {nextMission.badgeIcon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-rose-600 uppercase">Misión Recomendada:</span>
                  <p className="text-xs font-black text-slate-800 truncate">{nextMission.title}</p>
                </div>
                <Play className="w-4 h-4 text-rose-500 shrink-0" />
              </button>

              {/* Sweets Album Action */}
              <button
                onClick={() => {
                  SOUNDS.tap();
                  onClose();
                  onOpenAlbum();
                }}
                className="p-3 bg-white hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-300 rounded-2xl flex items-center gap-3 text-left transition-all shadow-xs active:scale-98 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                  🍪
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-amber-700 uppercase">Álbum de Dulces:</span>
                  <p className="text-xs font-black text-slate-800">
                    {sweetsUnlocked.length} de {SWEETS_COLLECTION.length} recolectados
                  </p>
                </div>
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
              </button>

              {/* Live Chat with Mayi */}
              <button
                onClick={() => {
                  SOUNDS.tap();
                  onClose();
                  onOpenLiveChat();
                }}
                className="p-3 bg-white hover:bg-sky-50 border-2 border-sky-200 hover:border-sky-300 rounded-2xl flex items-center gap-3 text-left transition-all shadow-xs active:scale-98 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                  🎙️
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-sky-700 uppercase">Charlar con Mayi:</span>
                  <p className="text-xs font-black text-slate-800">Voz y chat en vivo</p>
                </div>
                <MessageCircle className="w-4 h-4 text-sky-500 shrink-0" />
              </button>

              {/* Visit Pastelería shortcut */}
              <button
                onClick={() => {
                  SOUNDS.tap();
                  onClose();
                  onNavigateTab('mundo');
                  const mission7 = MISSIONS.find((m) => m.id === 7);
                  if (mission7) {
                    onOpenMission(mission7);
                  }
                }}
                className="p-3 bg-white hover:bg-pink-50 border-2 border-pink-200 hover:border-pink-300 rounded-2xl flex items-center gap-3 text-left transition-all shadow-xs active:scale-98 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                  🎂
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-pink-700 uppercase">Pastelería Chantal:</span>
                  <p className="text-xs font-black text-slate-800">8 pedidos dulces (M.7)</p>
                </div>
                <Play className="w-4 h-4 text-pink-500 shrink-0" />
              </button>
            </div>
          </div>

          {/* Child-friendly encouragement message */}
          <div className="bg-gradient-to-r from-amber-100/90 to-pink-100/90 border border-amber-300 p-3 rounded-2xl flex items-center gap-2.5 text-left">
            <span className="text-2xl">💖</span>
            <p className="text-xs text-amber-950 font-bold leading-snug">
              &quot;Recuerda, Lucy: no hay prisa ni errores castigados. Cada intento te hace más lista y segura.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
