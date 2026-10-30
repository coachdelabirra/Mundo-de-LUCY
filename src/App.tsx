/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlayerProfile, ZoneId, Mission, PedagogicalLevel, LucyCustomization, PetCustomization, PlacedFurniture } from './types/game';
import { loadProfile, saveProfile, resetProfile } from './utils/storage';
import { ZONES, MISSIONS } from './data/gameContent';
import { SOUNDS, speakSpanish } from './utils/audio';

import { Navbar, ActiveTab } from './components/Navbar';
import { ZoneExplorer } from './components/ZoneExplorer';
import { WorldMap } from './components/WorldMap';
import { HomeDecorator } from './components/HomeDecorator';
import { AvatarCustomizer } from './components/AvatarCustomizer';
import { StoryMode } from './components/StoryMode';
import { MissionModal } from './components/missions/MissionModal';
import { MissionsDrawer } from './components/missions/MissionsDrawer';
import { AlbumModal } from './components/AlbumModal';
import { ParentsDashboard } from './components/ParentsDashboard';
import { VoiceChatModal } from './components/VoiceChatModal';
import { ImageStudioModal } from './components/ImageStudioModal';
import { AchievementOverlay, AchievementItem } from './components/AchievementOverlay';
import { WelcomeModal } from './components/WelcomeModal';
import { MayiGuideModal } from './components/MayiGuideModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { GAME_IMAGES } from './utils/assets';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile);
  const [activeTab, setActiveTab] = useState<ActiveTab>('mundo');
  const [currentZone, setCurrentZone] = useState<ZoneId>('cuarto');

  // Modal & Overlay states
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);
  const [isMayiGuideOpen, setIsMayiGuideOpen] = useState(false);
  const [isInstallerOpen, setIsInstallerOpen] = useState(false);
  const [activeAchievement, setActiveAchievement] = useState<AchievementItem | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [isMissionsDrawerOpen, setIsMissionsDrawerOpen] = useState(false);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  const [isParentsOpen, setIsParentsOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isImageStudioOpen, setIsImageStudioOpen] = useState(false);

  // Sync profile changes to localStorage
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // Initial welcome voice
  useEffect(() => {
    const timer = setTimeout(() => {
      // Warm introductory greeting in sweet young Latina girl voice
      speakSpanish('¡Bienvenida a El Mundo de Lucy! Toca la pantalla para jugar y aprender.', {
        pitch: 1.34,
        rate: 0.98,
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handlers for companion affection
  const handlePetHappy = () => {
    setProfile((prev) => ({
      ...prev,
      petAffection: {
        ...prev.petAffection,
        happy: Math.min(100, prev.petAffection.happy + 5),
      },
    }));
  };

  const handlePetFede = () => {
    setProfile((prev) => ({
      ...prev,
      petAffection: {
        ...prev.petAffection,
        fede: Math.min(100, prev.petAffection.fede + 5),
      },
    }));
  };

  // Word discovered in zone exploration
  const handleWordDiscovered = (word: string) => {
    if (!profile.wordsLearned.includes(word)) {
      setProfile((prev) => ({
        ...prev,
        wordsLearned: [...prev.wordsLearned, word],
        stars: prev.stars + 1,
      }));
    }
  };

  // Mission completed handler
  const handleCompleteMission = (earnedStars: number, badgeId: string) => {
    if (!activeMission) return;
    const missionId = activeMission.id;
    const completedBadge = activeMission;

    setProfile((prev) => {
      const alreadyDone = prev.completedMissions.includes(missionId);
      const newCompleted = alreadyDone ? prev.completedMissions : [...prev.completedMissions, missionId];
      const newBadges = prev.unlockedBadges.includes(badgeId) ? prev.unlockedBadges : [...prev.unlockedBadges, badgeId];

      return {
        ...prev,
        stars: prev.stars + earnedStars,
        completedMissions: newCompleted,
        unlockedBadges: newBadges,
        petAffection: {
          happy: Math.min(100, prev.petAffection.happy + 10),
          fede: Math.min(100, prev.petAffection.fede + 10),
        },
      };
    });

    setActiveMission(null);

    // Trigger full-screen celebratory achievement layer with confetti and stars
    setTimeout(() => {
      setActiveAchievement({
        id: badgeId,
        title: completedBadge.badgeName,
        subtitle: `¡Completaste con éxito la Misión ${completedBadge.id}: ${completedBadge.title}!`,
        icon: completedBadge.badgeIcon,
        stars: earnedStars,
      });
    }, 200);
  };

  // Sweets collection handler for Mission 7
  const handleUnlockSweet = (sweetId: string) => {
    setProfile((prev) => {
      const current = prev.sweetsUnlocked || [];
      if (current.includes(sweetId)) return prev;
      return {
        ...prev,
        sweetsUnlocked: [...current, sweetId],
      };
    });
  };

  // Customization update handlers
  const handleUpdateLucy = (newCustomization: LucyCustomization) => {
    setProfile((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        lucy: newCustomization,
      },
    }));
  };

  const handleUpdatePets = (newPets: PetCustomization) => {
    setProfile((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        pets: newPets,
      },
    }));
  };

  // Decorator update handlers
  const handleUpdatePlacedItems = (newItems: PlacedFurniture[]) => {
    setProfile((prev) => ({
      ...prev,
      placedRoomItems: newItems,
    }));
  };

  const handleSpendStars = (starsAmount: number): boolean => {
    if (profile.stars >= starsAmount) {
      setProfile((prev) => ({ ...prev, stars: prev.stars - starsAmount }));
      return true;
    }
    return false;
  };

  // Parents settings handlers
  const handleChangeLevel = (newLevel: PedagogicalLevel) => {
    setProfile((prev) => ({ ...prev, level: newLevel }));
  };

  const handleResetProgress = () => {
    const fresh = resetProfile();
    setProfile(fresh);
    setIsParentsOpen(false);
  };

  // Zone specific mission lookup
  const zoneAvailableMission = MISSIONS.find(
    (m) => m.zone === currentZone && !profile.completedMissions.includes(m.id)
  ) || MISSIONS.find((m) => m.zone === currentZone);

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col font-sans select-none antialiased text-slate-800">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        stars={profile.stars}
        completedMissionsCount={profile.completedMissions.length}
        totalMissionsCount={MISSIONS.length}
        onOpenMissionsList={() => setIsMissionsDrawerOpen(true)}
        onOpenAlbum={() => setIsAlbumOpen(true)}
        onOpenParents={() => setIsParentsOpen(true)}
        onOpenLiveChat={() => setIsLiveChatOpen(true)}
        onOpenImageStudio={() => setIsImageStudioOpen(true)}
        onOpenWelcome={() => setIsWelcomeOpen(true)}
        onOpenMayiGuide={() => setIsMayiGuideOpen(true)}
      />

      {/* Main Workspace / Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 flex flex-col">
        {activeTab === 'mundo' && (
          <ZoneExplorer
            zoneId={currentZone}
            customizationLucy={profile.customization.lucy}
            customizationPets={profile.customization.pets}
            happyAffection={profile.petAffection.happy}
            fedeAffection={profile.petAffection.fede}
            activeMission={zoneAvailableMission}
            onOpenMission={(m) => setActiveMission(m)}
            onPetHappy={handlePetHappy}
            onPetFede={handlePetFede}
            onWordDiscovered={handleWordDiscovered}
          />
        )}

        {activeTab === 'mapa' && (
          <WorldMap
            currentZone={currentZone}
            completedMissions={profile.completedMissions}
            onSelectZone={(selected) => {
              setCurrentZone(selected);
              setActiveTab('mundo');
            }}
          />
        )}

        {activeTab === 'decorar' && (
          <HomeDecorator
            placedItems={profile.placedRoomItems}
            userStars={profile.stars}
            onUpdatePlacedItems={handleUpdatePlacedItems}
            onSpendStars={handleSpendStars}
          />
        )}

        {activeTab === 'avatar' && (
          <AvatarCustomizer
            lucyConfig={profile.customization.lucy}
            petConfig={profile.customization.pets}
            onUpdateLucy={handleUpdateLucy}
            onUpdatePets={handleUpdatePets}
          />
        )}

        {activeTab === 'historia' && <StoryMode />}
      </main>

      {/* Floating Bottom Quick Controls for Tablets and Kids */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-amber-300 shadow-lg">
        <button
          onClick={() => {
            SOUNDS.tap();
            setActiveTab('mundo');
          }}
          className={`px-3 py-1 rounded-full text-xs font-black cursor-pointer transition-all ${
            activeTab === 'mundo' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-700 hover:text-rose-600'
          }`}
        >
          🎮 Explorar
        </button>
        <button
          onClick={() => {
            SOUNDS.tap();
            setActiveTab('mapa');
          }}
          className={`px-3 py-1 rounded-full text-xs font-black cursor-pointer transition-all ${
            activeTab === 'mapa' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-700 hover:text-rose-600'
          }`}
        >
          🗺️ Mapa
        </button>
        <button
          onClick={() => {
            SOUNDS.tap();
            setIsMissionsDrawerOpen(true);
          }}
          className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-amber-950 hover:bg-amber-500 cursor-pointer shadow-xs"
        >
          📜 Misiones ({profile.completedMissions.length}/{MISSIONS.length})
        </button>
        <button
          onClick={() => {
            SOUNDS.tap();
            setIsWelcomeOpen(true);
          }}
          className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 hover:bg-rose-200 cursor-pointer shadow-xs"
          title="Ver presentación y bienvenida con Lucy"
        >
          🌟 Lucy
        </button>
        <button
          onClick={() => {
            SOUNDS.tap();
            setIsMayiGuideOpen(true);
          }}
          className="px-3 py-1 rounded-full text-xs font-black bg-pink-100 text-pink-800 hover:bg-pink-200 cursor-pointer shadow-xs flex items-center gap-1"
          title="Abrir a Mayi, tu Guía Interactiva"
        >
          <span>🧁</span>
          <span>Mayi Guía</span>
        </button>
        <button
          onClick={() => {
            SOUNDS.tap();
            setIsInstallerOpen(true);
          }}
          className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer shadow-xs flex items-center gap-1"
          title="Instalar El Mundo de Lucy como Aplicación (PWA)"
        >
          <span>📲</span>
          <span>Instalar PWA</span>
        </button>
      </div>

      {/* Floating Mayi Interactive Guide Widget across the whole game */}
      <div className="fixed bottom-14 sm:bottom-16 right-3 sm:right-6 z-40">
        <button
          onClick={() => {
            SOUNDS.tap();
            setIsMayiGuideOpen(true);
          }}
          className="group flex items-center gap-2 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs sm:text-sm py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-3xl shadow-xl border-2 border-white cursor-pointer active:scale-95 transition-all animate-float"
          title="Toca a Mayi para consejos y ayuda interactiva en todo el juego"
        >
          <div className="relative">
            <img
              src={GAME_IMAGES.mayiAvatar}
              alt="Mayi Guía"
              referrerPolicy="no-referrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-contain bg-white/95 p-0.5 border-2 border-pink-300 shadow-md group-hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-1 -right-1 text-xs">🧁</span>
          </div>
          <div className="text-left hidden xs:block">
            <span className="text-[9px] font-bold text-pink-100 uppercase block leading-none">Guía Interactiva</span>
            <span className="text-xs sm:text-sm font-black drop-shadow-xs">¡Mayi te ayuda!</span>
          </div>
        </button>
      </div>

      {/* Footer attribution */}
      <footer className="py-4 px-4 text-center border-t border-sky-200/60 bg-white/70 backdrop-blur-xs mt-auto">
        <p className="text-slate-500 text-[11px] font-semibold">Creado e inventado por:</p>
        <p className="font-bold text-rose-700 text-xs sm:text-sm">
          LucyYoly-Soft , &quot;Papito es el Mejor&quot; Company.
        </p>
      </footer>

      {/* Modals */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        onSelectAction={(tab) => {
          setActiveTab(tab);
          setIsWelcomeOpen(false);
        }}
        onOpenLiveChat={() => {
          setIsWelcomeOpen(false);
          setIsLiveChatOpen(true);
        }}
        onOpenImageStudio={() => {
          setIsWelcomeOpen(false);
          setIsImageStudioOpen(true);
        }}
        onOpenMayiGuide={() => {
          setIsWelcomeOpen(false);
          setIsMayiGuideOpen(true);
        }}
        onOpenInstaller={() => {
          setIsWelcomeOpen(false);
          setIsInstallerOpen(true);
        }}
      />

      <MayiGuideModal
        isOpen={isMayiGuideOpen}
        onClose={() => setIsMayiGuideOpen(false)}
        currentZone={currentZone}
        activeTab={activeTab}
        completedMissions={profile.completedMissions}
        sweetsUnlocked={profile.sweetsUnlocked}
        onOpenMission={(mission) => {
          setIsMayiGuideOpen(false);
          setActiveMission(mission);
        }}
        onOpenLiveChat={() => {
          setIsMayiGuideOpen(false);
          setIsLiveChatOpen(true);
        }}
        onOpenAlbum={() => {
          setIsMayiGuideOpen(false);
          setIsAlbumOpen(true);
        }}
        onNavigateTab={(tab) => {
          setIsMayiGuideOpen(false);
          setActiveTab(tab);
        }}
      />

      {activeMission && (
        <MissionModal
          mission={activeMission}
          sweetsUnlocked={profile.sweetsUnlocked}
          onUnlockSweet={handleUnlockSweet}
          onClose={() => setActiveMission(null)}
          onComplete={handleCompleteMission}
        />
      )}

      {isMissionsDrawerOpen && (
        <MissionsDrawer
          completedMissions={profile.completedMissions}
          onSelectMission={(m) => {
            setIsMissionsDrawerOpen(false);
            setActiveMission(m);
          }}
          onClose={() => setIsMissionsDrawerOpen(false)}
          onShowCelebration={(ach) => {
            setIsMissionsDrawerOpen(false);
            setActiveAchievement(ach);
          }}
        />
      )}

      {isAlbumOpen && (
        <AlbumModal
          unlockedBadges={profile.unlockedBadges}
          userStars={profile.stars}
          completedMissions={profile.completedMissions}
          sweetsUnlocked={profile.sweetsUnlocked}
          onClose={() => setIsAlbumOpen(false)}
          onShowCelebration={(ach) => setActiveAchievement(ach)}
        />
      )}

      {isParentsOpen && (
        <ParentsDashboard
          profile={profile}
          onChangeLevel={handleChangeLevel}
          onResetProgress={handleResetProgress}
          onClose={() => setIsParentsOpen(false)}
        />
      )}

      {isLiveChatOpen && (
        <VoiceChatModal onClose={() => setIsLiveChatOpen(false)} />
      )}

      {isImageStudioOpen && (
        <ImageStudioModal
          onClose={() => setIsImageStudioOpen(false)}
          onSaveToAlbum={(imgUrl, _title) => {
            setProfile((prev) => ({
              ...prev,
              albumPhotosUnlocked: [...prev.albumPhotosUnlocked, imgUrl],
              stars: prev.stars + 2,
            }));
          }}
        />
      )}

      {/* PWA Installer Modal */}
      <PWAInstallModal
        isOpen={isInstallerOpen}
        onClose={() => setIsInstallerOpen(false)}
      />

      {/* Offline Connectivity Status Toast */}
      <OfflineIndicator />

      {/* Layer of Celebratory Achievements */}
      <AchievementOverlay
        achievement={activeAchievement}
        onClose={() => setActiveAchievement(null)}
      />
    </div>
  );
}
