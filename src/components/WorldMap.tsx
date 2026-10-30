import React from 'react';
import { MapPin, Sparkles, Star, ChevronRight, Volume2 } from 'lucide-react';
import { ZoneId } from '../types/game';
import { ZONES, MISSIONS } from '../data/gameContent';
import { GAME_IMAGES } from '../utils/assets';
import { SOUNDS, speakSpanish } from '../utils/audio';

interface WorldMapProps {
  currentZone: ZoneId;
  completedMissions: number[];
  onSelectZone: (zoneId: ZoneId) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  currentZone,
  completedMissions,
  onSelectZone,
}) => {
  const zoneList: {
    id: ZoneId;
    image: string;
    badgeIcon: string;
    coords: string;
  }[] = [
    { id: 'cuarto', image: GAME_IMAGES.roomScene, badgeIcon: '🛏️', coords: 'top-8 left-6 sm:left-12' },
    { id: 'patio', image: GAME_IMAGES.heroCover, badgeIcon: '🐕', coords: 'top-12 right-6 sm:right-16' },
    { id: 'parque', image: GAME_IMAGES.parkScene, badgeIcon: '🌳', coords: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' },
    { id: 'panaderia', image: GAME_IMAGES.bakeryScene, badgeIcon: '🥖', coords: 'bottom-8 left-8 sm:left-16' },
    { id: 'peluqueria', image: GAME_IMAGES.salonScene, badgeIcon: '🎀', coords: 'bottom-8 right-8 sm:right-16' },
  ];

  const handleZoneClick = (zoneId: ZoneId) => {
    SOUNDS.tap();
    const zone = ZONES[zoneId];
    speakSpanish(`Viajando a: ${zone.name}`, { pitch: 1.2 });
    onSelectZone(zoneId);
  };

  return (
    <div className="relative w-full flex-1 flex flex-col p-4 sm:p-6 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 rounded-3xl border-4 border-amber-300 shadow-xl overflow-hidden min-h-[560px]">
      {/* Decorative whimsical clouds and sun */}
      <div className="absolute top-4 left-6 text-4xl animate-float opacity-80 pointer-events-none">☁️</div>
      <div className="absolute top-10 right-12 text-5xl animate-spin opacity-90 pointer-events-none" style={{ animationDuration: '40s' }}>
        ☀️
      </div>
      <div className="absolute top-36 right-48 text-3xl animate-float opacity-70 pointer-events-none" style={{ animationDelay: '1.5s' }}>
        ☁️
      </div>

      {/* Map Header */}
      <div className="relative z-10 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl border-2 border-amber-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <span className="text-2xl">🗺️</span> El Mapa del Barrio de Lucy
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600">
            Toca cualquier lugar para explorarlo con Lucy, Happy y Fede.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300">
            5 Zonas Abiertas
          </span>
        </div>
      </div>

      {/* Mayi Interactive Map Guide banner */}
      <div
        onClick={() => {
          SOUNDS.tap();
          speakSpanish('Mayi te guía en el mapa: Toca el parque, el cuarto, el patio, la peluquería o mi pastelería para viajar con Lucy y los perritos.', {
            pitch: 1.32,
            rate: 0.98,
          });
        }}
        className="relative z-10 mb-4 bg-gradient-to-r from-pink-100/95 via-white to-amber-100/95 border-2 border-pink-300 p-2.5 sm:p-3 rounded-2xl flex items-center gap-3 shadow-xs cursor-pointer hover:border-pink-400 transition-all group"
        title="Consejo de Mayi en el Mapa"
      >
        <div className="relative shrink-0">
          <img
            src={GAME_IMAGES.mayiAvatar}
            alt="Mayi Guía"
            referrerPolicy="no-referrer"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain bg-white border-2 border-pink-300 shadow-2xs group-hover:scale-105 transition-transform"
          />
          <span className="absolute -bottom-1 -right-1 text-xs">🧁</span>
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
              Mayi · Guía del Vecindario
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 font-bold mt-0.5 truncate sm:whitespace-normal">
            &quot;¡Elige a dónde quieres ir hoy, Lucy! Cada lugar tiene letras y aventuras.&quot;
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            SOUNDS.tap();
            speakSpanish('Mayi te guía en el mapa: Toca el parque, el cuarto, el patio, la peluquería o mi pastelería para viajar con Lucy y los perritos.', {
              pitch: 1.32,
              rate: 0.98,
            });
          }}
          className="p-2 rounded-xl bg-white hover:bg-pink-50 border border-pink-300 text-rose-600 shadow-2xs shrink-0 cursor-pointer"
          title="Escuchar a Mayi"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Visual Map Grid */}
      <div className="relative z-10 flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 my-auto">
        {zoneList.map((item) => {
          const zone = ZONES[item.id];
          const isSelected = currentZone === item.id;
          const zoneMissions = MISSIONS.filter((m) => m.zone === item.id);
          const finishedMissions = zoneMissions.filter((m) => completedMissions.includes(m.id));

          return (
            <div
              key={item.id}
              onClick={() => handleZoneClick(item.id)}
              className={`group relative bg-white rounded-3xl border-3 overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col ${
                isSelected
                  ? 'border-rose-500 ring-4 ring-rose-300/60 scale-[1.02]'
                  : 'border-amber-200 hover:border-amber-400'
              }`}
            >
              {/* Image Thumbnail */}
              <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={zone.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badge icon */}
                <div className="absolute top-2.5 left-2.5 w-10 h-10 rounded-2xl bg-white/95 shadow-md flex items-center justify-center text-2xl border border-amber-200">
                  {item.badgeIcon}
                </div>

                {/* Status indicator */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 bg-rose-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>¡Estás Aquí!</span>
                  </div>
                )}

                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <h3 className="text-base sm:text-lg font-black leading-tight drop-shadow-md">
                    {zone.name}
                  </h3>
                  <p className="text-[11px] text-white/90 font-medium truncate drop-shadow-sm">
                    {zone.tagline}
                  </p>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="p-3.5 flex flex-col justify-between flex-1 bg-amber-50/50">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                  <span className="font-bold text-amber-900">
                    {zone.items.length} Palabras para aprender
                  </span>
                  {zoneMissions.length > 0 && (
                    <span className="text-xs font-black text-rose-600 flex items-center gap-1">
                      ⭐ {finishedMissions.length}/{zoneMissions.length} misiones
                    </span>
                  )}
                </div>

                <button className="w-full bg-white hover:bg-rose-50 border-2 border-amber-300 group-hover:border-rose-400 text-slate-800 group-hover:text-rose-600 font-black text-xs sm:text-sm py-2 px-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1">
                  <span>Ir a este lugar</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
