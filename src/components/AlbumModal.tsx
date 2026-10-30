import React from 'react';
import { Star, Award, Heart, Camera, Volume2, X, Sparkles, Cookie } from 'lucide-react';
import { MISSIONS } from '../data/gameContent';
import { GAME_IMAGES } from '../utils/assets';
import { SOUNDS, speakSpanish } from '../utils/audio';
import { AchievementItem } from './AchievementOverlay';
import { SWEETS_COLLECTION } from '../types/game';

interface AlbumModalProps {
  unlockedBadges: string[];
  userStars: number;
  completedMissions: number[];
  sweetsUnlocked?: string[];
  onClose: () => void;
  onShowCelebration?: (achievement: AchievementItem) => void;
}

export const AlbumModal: React.FC<AlbumModalProps> = ({
  unlockedBadges,
  userStars,
  completedMissions,
  sweetsUnlocked = ['galleta'],
  onClose,
  onShowCelebration,
}) => {
  const photoMemories = [
    {
      id: 'foto-oficial-1',
      title: 'Aventuras de Lucy, Happy y Federica (Oficial)',
      desc: 'Lucy abrazando con todo su amor a Happy y Fede con corazones flotando en el parque.',
      image: GAME_IMAGES.lucyHuggingDogs,
      unlocked: true,
    },
    {
      id: 'foto-oficial-lucy',
      title: 'Lucy Oficial (Retrato y Traje Original)',
      desc: 'Lucy con su camiseta rosada oficial "LUCY", ojos verdes y cabello castaño ondulado.',
      image: GAME_IMAGES.lucyStanding,
      unlocked: true,
    },
    {
      id: 'foto-oficial-happy',
      title: 'Happy Oficial (Border Collie)',
      desc: 'Happy sentada con su pelaje blanco y negro, manchas características en el pecho y su cola alegre.',
      image: GAME_IMAGES.happyAvatar,
      unlocked: true,
    },
    {
      id: 'foto-oficial-fede',
      title: 'Federica Oficial (Perrita Guía)',
      desc: 'Fede descansando feliz con su pelaje dorado y crema, ojos cerrados sonriendo en paz.',
      image: GAME_IMAGES.fedeAvatar,
      unlocked: true,
    },
    {
      id: 'foto-oficial-2',
      title: 'Aventuras de Lucy en el Parque (Oficial)',
      desc: 'Lucy feliz con su camiseta rosada y ojos verdes junto al tobogán y las flores.',
      image: GAME_IMAGES.lucyParkPortrait,
      unlocked: true,
    },
    {
      id: 'foto-1',
      title: 'Tarde en los Columpios',
      desc: 'Happy y Fede mirando felices a Lucy mientras vuela alto en el columpio.',
      image: GAME_IMAGES.parkScene,
      unlocked: completedMissions.includes(1) || completedMissions.includes(3),
    },
    {
      id: 'foto-2',
      title: 'Mañana de Juegos en el Cuarto',
      desc: 'Construyendo historias en la casa de muñecas con las perritas echadas a los pies.',
      image: GAME_IMAGES.roomScene,
      unlocked: true,
    },
    {
      id: 'foto-3',
      title: 'La Pastelería de la Srta Chantal',
      desc: 'Horneando con Mayi en la pastelería de la Srta Chantal y aprendiendo las letras de los ingredientes.',
      image: GAME_IMAGES.bakeryScene,
      unlocked: completedMissions.includes(4),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-amber-50 rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-pink-400 px-6 py-4 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📖</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white drop-shadow-xs">
                Álbum de Recuerdos e Insignias de Lucy
              </h2>
              <span className="text-xs text-amber-100 font-medium">
                Tus fotos desbloqueadas y medallas logradas con Happy y Fede
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              SOUNDS.tap();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Summary counters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200 flex items-center gap-3 shadow-xs">
              <span className="text-3xl">⭐</span>
              <div>
                <span className="text-xs text-slate-500 font-bold">Estrellas</span>
                <p className="text-lg font-black text-amber-600">{userStars}</p>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border-2 border-rose-200 flex items-center gap-3 shadow-xs">
              <span className="text-3xl">🏅</span>
              <div>
                <span className="text-xs text-slate-500 font-bold">Insignias</span>
                <p className="text-lg font-black text-rose-600">
                  {unlockedBadges.length} de {MISSIONS.length}
                </p>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border-2 border-emerald-200 flex items-center gap-3 shadow-xs col-span-2 sm:col-span-1">
              <span className="text-3xl">📸</span>
              <div>
                <span className="text-xs text-slate-500 font-bold">Fotos de Recuerdos</span>
                <p className="text-lg font-black text-emerald-600">
                  {photoMemories.filter((p) => p.unlocked).length} Desbloqueadas
                </p>
              </div>
            </div>
          </div>

          {/* Insignias section */}
          <div>
            <h3 className="text-sm font-black uppercase text-amber-900 tracking-wider mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Insignias de Aventura y Bondad:</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MISSIONS.map((m) => {
                const isEarned = unlockedBadges.includes(m.badgeId);
                return (
                  <div
                    key={m.badgeId}
                    onClick={() => {
                      if (isEarned && onShowCelebration) {
                        onShowCelebration({
                          id: m.badgeId,
                          title: m.badgeName,
                          subtitle: `Medalla conseguida en Misión ${m.id}: ${m.title}`,
                          icon: m.badgeIcon,
                          stars: m.rewardStars,
                        });
                      } else if (!isEarned) {
                        SOUNDS.tap();
                        speakSpanish(`Esta medalla se desbloquea en la Misión ${m.id}. ¡Juega para ganarla!`);
                      }
                    }}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all cursor-pointer ${
                      isEarned
                        ? 'bg-white border-amber-300 shadow-sm hover:border-rose-400 hover:scale-102 active:scale-98'
                        : 'bg-slate-100/70 border-dashed border-slate-300 opacity-60'
                    }`}
                    title={isEarned ? 'Toca para ver celebración' : 'Medalla bloqueada'}
                  >
                    <span className="text-3xl">{isEarned ? m.badgeIcon : '🔒'}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-800 leading-tight">
                          {m.badgeName}
                        </h4>
                        {isEarned && <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold">
                        {isEarned ? '¡Toca para celebrar!' : `Misión ${m.id}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pastry Sweets Album section (Misión 7 - La Pastelería de la Srta Chantal) */}
          <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 p-4 rounded-3xl border-2 border-rose-300 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-rose-900">
                <Cookie className="w-5 h-5 text-rose-500" />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-rose-900">
                    Álbum de Dulces Coleccionables
                  </h3>
                  <p className="text-[11px] text-rose-700 font-medium">
                    Atendido por Mayi en La Pastelería de la Srta. Chantal (Misión 7)
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-rose-700 bg-white/90 border border-rose-200 px-3 py-1 rounded-full shadow-2xs">
                {SWEETS_COLLECTION.filter((s) => sweetsUnlocked.includes(s.id)).length} de {SWEETS_COLLECTION.length} Coleccionados
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SWEETS_COLLECTION.map((sweet) => {
                const isCollected = sweetsUnlocked.includes(sweet.id);
                return (
                  <div
                    key={sweet.id}
                    onClick={() => {
                      SOUNDS.tap();
                      if (isCollected) {
                        SOUNDS.star();
                        speakSpanish(`¡Dulce coleccionado: ${sweet.name}! ${sweet.description}`, { pitch: 1.32, rate: 0.98 });
                      } else {
                        speakSpanish(`Este dulce: ${sweet.name}, se desbloquea resolviendo pedidos en la Misión 7 con Mayi.`);
                      }
                    }}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all cursor-pointer ${
                      isCollected
                        ? 'bg-white border-pink-300 shadow-sm hover:border-rose-400 hover:scale-102 active:scale-98'
                        : 'bg-white/50 border-dashed border-rose-200 opacity-60'
                    }`}
                  >
                    <span className="text-3xl filter drop-shadow-xs">{isCollected ? sweet.icon : '🔒'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-black text-slate-800 leading-tight truncate">
                          {sweet.name}
                        </h4>
                        {isCollected && <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium line-clamp-1">
                        {isCollected ? sweet.description : `Pedido ${sweet.orderNumber} en pastelería`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Photo memories section */}
          <div>
            <h3 className="text-sm font-black uppercase text-rose-900 tracking-wider mb-3 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-rose-600" />
              <span>Fotos Mágicas de Lucy y sus Perras:</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {photoMemories.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-2xl border-2 border-amber-200 overflow-hidden shadow-sm flex flex-col group"
                >
                  <div className="relative h-44 overflow-hidden bg-gradient-to-b from-sky-50 via-rose-50 to-amber-50 flex items-center justify-center">
                    {photo.unlocked ? (
                      <img
                        src={photo.image}
                        alt={photo.title}
                        className={`w-full h-full ${
                          photo.id.startsWith('foto-oficial')
                            ? 'object-contain p-2 filter drop-shadow-md'
                            : 'object-cover'
                        } group-hover:scale-105 transition-transform duration-500`}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2">
                        <span className="text-4xl">🔒</span>
                        <span className="text-xs font-bold">Completa más misiones para revelar</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-black text-slate-800 leading-tight">
                          {photo.title}
                        </h4>
                        {photo.unlocked && (
                          <button
                            onClick={() => speakSpanish(photo.desc)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-1 leading-snug">
                        {photo.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
