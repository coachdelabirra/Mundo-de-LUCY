export type PedagogicalLevel = 'pre-lectores' | 'lectores-iniciales' | 'consolidacion';

export type ZoneId = 'cuarto' | 'patio' | 'parque' | 'panaderia' | 'peluqueria';

export interface InteractiveItem {
  id: string;
  name: string;
  word: string;
  phoneticSound: string;
  category: 'mueble' | 'juguete' | 'comida' | 'naturaleza' | 'herramienta';
  x: number; // percentage in scene (0-100)
  y: number; // percentage in scene (0-100)
  icon: string;
  color: string;
  description: string;
}

export type LiteracyActivityType = 'fonema' | 'construir' | 'asociar' | 'trazar' | 'pedido' | 'silabas';

export interface PhonicsActivity {
  type: 'fonema';
  prompt: string;
  phonemeSound: string; // e.g. "mmmm"
  targetLetter: string;
  options: string[];
  feedbackHint: string;
}

export interface SpellingActivity {
  type: 'construir';
  prompt: string;
  word: string;
  scrambledLetters: string[];
  meaning: string;
  icon: string;
}

export interface AssociationActivity {
  type: 'asociar';
  prompt: string;
  word: string;
  options: { label: string; icon: string; isCorrect: boolean }[];
}

export interface TracingActivity {
  type: 'trazar';
  letter: string;
  soundCue: string;
  pointsGuide: { x: number; y: number }[];
  instruction: string;
}

export interface PedidoActivity {
  type: 'pedido';
  prompt: string;
  targetWord: string;
  spokenHint?: string;
  options: { label: string; word: string; icon: string; isCorrect: boolean }[];
}

export interface SyllablesActivity {
  type: 'silabas';
  prompt: string;
  word: string;
  syllables: string[];
  scrambledSyllables: string[];
  meaning: string;
  icon: string;
}

export type MissionActivity =
  | PhonicsActivity
  | SpellingActivity
  | AssociationActivity
  | TracingActivity
  | PedidoActivity
  | SyllablesActivity;

export interface SweetCollectible {
  id: string;
  name: string;
  icon: string;
  orderNumber: number;
  description: string;
}

export const SWEETS_COLLECTION: SweetCollectible[] = [
  { id: 'galleta', name: 'Galleta de Chispas', icon: '🍪', orderNumber: 1, description: 'Horneada con chispas de chocolate mágico.' },
  { id: 'cupcake', name: 'Cupcake de Fresa', icon: '🧁', orderNumber: 2, description: 'Esponjoso con crema suave de fresa.' },
  { id: 'pastelito', name: 'Pastelito de Vainilla', icon: '🍰', orderNumber: 3, description: 'Porción dorada con crema batida dulce.' },
  { id: 'donut', name: 'Donut Glaseado', icon: '🍩', orderNumber: 4, description: 'Rosquilla esponjosa con chispitas de colores.' },
  { id: 'torta', name: 'Gran Torta de Fiesta', icon: '🎂', orderNumber: 5, description: 'Torta de pisos con velas de celebración.' },
  { id: 'medalla_dulce', name: 'Medalla Pastelera', icon: '🏅', orderNumber: 6, description: 'Condecoración de oro de la Srta. Chantal.' },
];

export interface Mission {
  id: number;
  title: string;
  zone: ZoneId;
  subtitle: string;
  description: string;
  recommendedAge: string;
  level: PedagogicalLevel;
  rewardStars: number;
  badgeId: string;
  badgeName: string;
  badgeIcon: string;
  dialogueIntro: {
    speaker: 'Lucy' | 'Happy' | 'Fede' | 'Mayi' | 'Srta Chantal' | 'Don Mario' | 'Carmen' | 'Narrador';
    text: string;
    dogEmotion?: 'happy' | 'bark' | 'curious' | 'calm';
  }[];
  activities: MissionActivity[];
}

export interface LucyCustomization {
  hairstyle: 'liso_largo' | 'coletas' | 'trenzas' | 'gorro';
  hairColor: string;
  outfit: 'clasico_lucy' | 'vestido_rosa' | 'overol_azul' | 'exploradora';
  accessory: 'ninguno' | 'lentes' | 'flor' | 'corona';
}

export interface PetCustomization {
  happyCollar: 'rojo' | 'azul' | 'dorado' | 'capa';
  fedeAccessory: 'ninguno' | 'panuelo' | 'corona_flores' | 'chaleco';
}

export interface PlacedFurniture {
  id: string;
  itemId: string;
  name: string;
  x: number;
  y: number;
  icon: string;
  color: string;
}

export interface PlayerProfile {
  name: string;
  age: number;
  level: PedagogicalLevel;
  stars: number;
  completedMissions: number[];
  unlockedBadges: string[];
  lettersMastered: string[];
  wordsLearned: string[];
  petAffection: {
    happy: number; // 0 - 100
    fede: number;  // 0 - 100
  };
  customization: {
    lucy: LucyCustomization;
    pets: PetCustomization;
  };
  placedRoomItems: PlacedFurniture[];
  albumPhotosUnlocked: string[];
  sweetsUnlocked: string[]; // Progression of sweets collected in Mission 7
}
