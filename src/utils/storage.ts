import { PlayerProfile } from '../types/game';

const STORAGE_KEY = 'el_mundo_de_lucy_save_v1';

export const INITIAL_PROFILE: PlayerProfile = {
  name: 'Lucia',
  age: 5,
  level: 'pre-lectores',
  stars: 6,
  completedMissions: [1], // Mission 1 partially unlocked/completed for instant enjoyment
  unlockedBadges: ['primera_palabra', 'amiga_perruna'],
  lettersMastered: ['M', 'P', 'A', 'O', 'S'],
  wordsLearned: ['PAN', 'SOL', 'OSO', 'CASA', 'LUNA'],
  petAffection: {
    happy: 65,
    fede: 75,
  },
  customization: {
    lucy: {
      hairstyle: 'liso_largo',
      hairColor: '#8b5a2b',
      outfit: 'clasico_lucy',
      accessory: 'ninguno',
    },
    pets: {
      happyCollar: 'rojo',
      fedeAccessory: 'panuelo',
    },
  },
  placedRoomItems: [
    { id: 'item-1', itemId: 'cama', name: 'Cama cómoda', x: 20, y: 55, icon: '🛏️', color: 'bg-pink-100 text-pink-700' },
    { id: 'item-2', itemId: 'casa_munecas', name: 'Casa de muñecas', x: 50, y: 40, icon: '🏠', color: 'bg-purple-100 text-purple-700' },
    { id: 'item-3', itemId: 'oso', name: 'Oso de peluche', x: 75, y: 65, icon: '🧸', color: 'bg-amber-100 text-amber-700' },
    { id: 'item-4', itemId: 'pelota', name: 'Pelota roja', x: 35, y: 75, icon: '⚽', color: 'bg-emerald-100 text-emerald-700' },
  ],
  albumPhotosUnlocked: ['foto_parque_pelota', 'foto_abrazo_perras'],
  sweetsUnlocked: ['galleta'],
};

export function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_PROFILE,
      ...parsed,
      sweetsUnlocked: parsed.sweetsUnlocked || ['galleta'],
    };
  } catch (e) {
    console.error('Error loading save data:', e);
    return INITIAL_PROFILE;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
}

export function resetProfile(): PlayerProfile {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error resetting profile:', e);
  }
  return INITIAL_PROFILE;
}
