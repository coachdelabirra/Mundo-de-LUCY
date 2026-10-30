import React from 'react';
import { Star, CheckCircle, Play, X, Award, Sparkles } from 'lucide-react';
import { Mission } from '../../types/game';
import { MISSIONS } from '../../data/gameContent';
import { SOUNDS, speakSpanish } from '../../utils/audio';
import { GAME_IMAGES } from '../../utils/assets';
import { AchievementItem } from '../AchievementOverlay';

interface MissionsDrawerProps {
  completedMissions: number[];
  onSelectMission: (mission: Mission) => void;
  onClose: () => void;
  onShowCelebration?: (achievement: AchievementItem) => void;
}

export const MissionsDrawer: React.FC<MissionsDrawerProps> = ({
  completedMissions,
  onSelectMission,
  onClose,
  onShowCelebration,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-amber-50 rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-4 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📜</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Las {MISSIONS.length} Misiones de Lectoescritura
              </h2>
              <span className="text-xs text-rose-100 font-medium">
                Aprende jugando con Lucy, Happy, Federica y Mayi
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

        {/* Missions list */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {/* Mayi Guía Banner */}
          <div
            onClick={() => {
              SOUNDS.tap();
              speakSpanish('Mayi te guía: ¡Elige la misión que más te guste! Cada misión completada te da estrellas doradas y medallas para tu álbum.', {
                pitch: 1.32,
                rate: 0.98,
              });
            }}
            className="p-3 bg-gradient-to-r from-pink-100 via-rose-50 to-amber-100 border-2 border-pink-300 rounded-2xl flex items-center gap-3 shadow-xs cursor-pointer hover:border-pink-400 transition-all group"
            title="Consejo de Mayi sobre las misiones"
          >
            <img
              src={GAME_IMAGES.mayiAvatar}
              alt="Mayi Guía"
              referrerPolicy="no-referrer"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain bg-white border-2 border-pink-300 shadow-2xs group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex-1 text-left min-w-0">
              <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-200/80 px-2 py-0.5 rounded-full inline-block">
                Mayi · Tu Guía de Aventuras
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight mt-0.5">
                &quot;¡Elige tu misión favorita! Cada intento con Lucy te acerca a nuevas insignias.&quot;
              </p>
            </div>
            <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">✨</span>
          </div>

          {MISSIONS.map((mission) => {
            const isDone = completedMissions.includes(mission.id);
            return (
              <div
                key={mission.id}
                className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  isDone
                    ? 'bg-white border-emerald-300 shadow-xs'
                    : mission.id === 7
                    ? 'bg-gradient-to-r from-pink-50/70 to-amber-50/70 border-rose-300 hover:border-rose-400 shadow-xs'
                    : 'bg-white border-amber-200 hover:border-rose-400 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl border shrink-0 ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-200'
                        : mission.id === 7
                        ? 'bg-pink-100 border-pink-300'
                        : 'bg-amber-100 border-amber-300'
                    }`}
                  >
                    {mission.badgeIcon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-rose-600 uppercase">
                        Misión {mission.id}
                      </span>
                      {mission.id === 7 && (
                        <span className="text-[10px] font-black text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full border border-pink-300">
                          🧁 Con Mayi · Álbum de Dulces
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {mission.recommendedAge}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-800 leading-tight">
                      {mission.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      {mission.subtitle}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] font-bold text-amber-700">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        +{mission.rewardStars} Estrellas
                      </span>
                      <span className="text-slate-400">·</span>
                      <span>Insignia: {mission.badgeName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {isDone && (
                    <button
                      onClick={() => {
                        if (onShowCelebration) {
                          onShowCelebration({
                            id: mission.badgeId,
                            title: mission.badgeName,
                            subtitle: `¡Logro de la Misión ${mission.id}: ${mission.title}!`,
                            icon: mission.badgeIcon,
                            stars: mission.rewardStars,
                          });
                        }
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-1.5 rounded-xl border border-amber-300 transition-colors cursor-pointer"
                      title="Ver celebración con confeti y estrellas"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Celebrar</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      SOUNDS.tap();
                      onSelectMission(mission);
                    }}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer btn-chunky"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isDone ? 'Rejugar' : 'Jugar'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
