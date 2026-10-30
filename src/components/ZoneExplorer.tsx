import React, { useState } from 'react';
import { Volume2, Sparkles, MapPin, Play, Heart, HelpCircle } from 'lucide-react';
import { InteractiveItem, LucyCustomization, Mission, PetCustomization, ZoneId } from '../types/game';
import { ZONES, MISSIONS } from '../data/gameContent';
import { CharacterLucy } from './CharacterLucy';
import { DogCompanions } from './DogCompanions';
import { GAME_IMAGES } from '../utils/assets';
import { SOUNDS, speakSpanish } from '../utils/audio';

interface ZoneExplorerProps {
  zoneId: ZoneId;
  customizationLucy: LucyCustomization;
  customizationPets: PetCustomization;
  happyAffection: number;
  fedeAffection: number;
  activeMission?: Mission;
  onOpenMission: (mission: Mission) => void;
  onPetHappy: () => void;
  onPetFede: () => void;
  onWordDiscovered: (word: string) => void;
}

export const ZoneExplorer: React.FC<ZoneExplorerProps> = ({
  zoneId,
  customizationLucy,
  customizationPets,
  happyAffection,
  fedeAffection,
  activeMission,
  onOpenMission,
  onPetHappy,
  onPetFede,
  onWordDiscovered,
}) => {
  const zone = ZONES[zoneId];

  // Lucy position in the scene (percentages)
  const [lucyPos, setLucyPos] = useState({ x: 50, y: 70 });
  const [isWalking, setIsWalking] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InteractiveItem | null>(null);
  const [lucySpeech, setLucySpeech] = useState<string | null>(null);
  const [fedeHint, setFedeHint] = useState<string | null>(null);
  const [happyClue, setHappyClue] = useState<string | null>(null);

  // Background image based on zone
  const getBackgroundImage = () => {
    switch (zoneId) {
      case 'cuarto':
        return GAME_IMAGES.roomScene;
      case 'parque':
        return GAME_IMAGES.parkScene;
      case 'panaderia':
        return GAME_IMAGES.bakeryScene;
      case 'peluqueria':
        return GAME_IMAGES.salonScene;
      case 'patio':
        return GAME_IMAGES.parkScene; // Green sunny courtyard
      default:
        return GAME_IMAGES.roomScene;
    }
  };

  // Clicking on background moves Lucy
  const handleSceneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking an interactive button directly, do not move
    if ((e.target as HTMLElement).closest('button')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Constrain to walkable floor (45% - 85% vertically)
    const targetY = Math.max(48, Math.min(84, clickY));
    const targetX = Math.max(15, Math.min(85, clickX));

    setIsWalking(true);
    SOUNDS.tap();
    setLucyPos({ x: targetX, y: targetY });
    setTimeout(() => setIsWalking(false), 600);
  };

  // Touching an interactive item
  const handleItemClick = (item: InteractiveItem, e: React.MouseEvent) => {
    e.stopPropagation();
    SOUNDS.correct();
    setSelectedItem(item);
    setLucySpeech(`¡Descubrimos: ${item.word}!`);
    setTimeout(() => setLucySpeech(null), 3000);

    // Speak word with phonetics and Spanish voice
    speakSpanish(`${item.word}. ${item.phoneticSound}`, {
      pitch: 1.25,
      rate: 0.9,
    });

    onWordDiscovered(item.word);

    // Move Lucy next to item
    setIsWalking(true);
    setLucyPos({
      x: Math.max(15, Math.min(85, item.x + (item.x > 50 ? -12 : 12))),
      y: Math.max(50, Math.min(82, item.y + 10)),
    });
    setTimeout(() => setIsWalking(false), 500);
  };

  // Ask Fede for gentle hint
  const handleAskFedeHint = () => {
    SOUNDS.gentleHint();
    const hints = [
      'Federica dice: Toca los objetos brillantes para aprender sus palabras mágicas.',
      'Fede te guía: Busca la misión del día para ganar estrellas y nuevas aventuras.',
      'Fede sonríe: Recuerda que cada letra tiene su propio sonido especial y mágico.',
    ];
    const picked = hints[Math.floor(Math.random() * hints.length)];
    setFedeHint(picked);
    speakSpanish(picked, { pitch: 1.18, rate: 0.95 });
    setTimeout(() => setFedeHint(null), 4000);
  };

  // Ask Mayi for interactive zone guidance
  const handleAskMayiAdvice = () => {
    SOUNDS.tap();
    const adviceMap: Record<ZoneId, string> = {
      cuarto: 'Mayi te acompaña en tu cuarto: Toca tu cama, el oso y la casa de muñecas para descubrir palabras y escuchar sus sonidos.',
      patio: 'Mayi te acompaña en el patio: Happy y Fede te quieren mucho. Toca el plato de comida y el agua fresca para mimarlos.',
      parque: 'Mayi te acompaña en el parque: ¡Mira cuántas flores! Pídele a Happy que olfatee las pistas mágicas escondidas.',
      panaderia: '¡Bienvenida a mi pastelería! Toca el mostrador para hornear 8 pedidos dulces en la Misión 7.',
      peluqueria: 'Mayi te acompaña en la peluquería: Carmen tiene cepillos y lazos para dejar a Happy y Fede radiantes.',
    };
    const text = adviceMap[zoneId] || 'Mayi te guía: ¡Explora con alegría cada rincón!';
    speakSpanish(text, { pitch: 1.32, rate: 0.98 });
    setFedeHint(text);
    setTimeout(() => setFedeHint(null), 4500);
  };

  // Ask Happy to sniff for secrets
  const handleHappySniff = () => {
    SOUNDS.bark();
    const clues = [
      'Happy olfatea: ¡Guau! ¡Huelo letras escondidas por aquí!',
      'Happy salta alegre: ¡Vamos al parque a jugar a la pelota!',
      'Happy mueve la cola: ¡Guau guau! ¡Huele a pan calentito!',
    ];
    const picked = clues[Math.floor(Math.random() * clues.length)];
    setHappyClue(picked);
    speakSpanish(picked, { pitch: 1.45, rate: 1.0 });
    setTimeout(() => setHappyClue(null), 3500);
  };

  return (
    <div className="relative w-full flex-1 flex flex-col min-h-[580px] select-none overflow-hidden rounded-3xl border-4 border-amber-300 shadow-xl bg-slate-900">
      {/* Top zone banner */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border-2 border-amber-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
            <MapPin className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
              {zone.name}
            </h1>
            <p className="text-xs font-semibold text-slate-500">{zone.tagline}</p>
          </div>
        </div>

        {/* Companion Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={handleHappySniff}
            className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs px-3 py-2 rounded-2xl shadow-md active:scale-95 transition-all btn-chunky cursor-pointer"
            title="Happy olfatea secretos"
          >
            <span>🐶</span>
            <span className="hidden sm:inline">Olfatear</span>
          </button>
          <button
            onClick={handleAskFedeHint}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs px-3 py-2 rounded-2xl shadow-md active:scale-95 transition-all btn-chunky cursor-pointer"
            title="Pedir pista a Fede"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Pista de Fede</span>
          </button>
          <button
            onClick={handleAskMayiAdvice}
            className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs px-3 py-2 rounded-2xl shadow-md active:scale-95 transition-all btn-chunky cursor-pointer"
            title="Consejo interactivo de Mayi"
          >
            <img
              src={GAME_IMAGES.mayiAvatar}
              alt="Mayi"
              referrerPolicy="no-referrer"
              className="w-4 h-4 rounded-full bg-white object-contain"
            />
            <span className="hidden sm:inline">Guía Mayi</span>
          </button>
        </div>
      </div>

      {/* Main interactive viewport */}
      <div
        onClick={handleSceneClick}
        className="relative flex-1 w-full h-full cursor-pointer overflow-hidden"
        style={{
          backgroundImage: `url(${getBackgroundImage()})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Soft atmosphere overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15 pointer-events-none" />

        {/* Interactive glowing objects */}
        {zone.items.map((item) => (
          <div
            key={item.id}
            onClick={(e) => handleItemClick(item, e)}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {/* Pulsing glow aura */}
            <div className="absolute -inset-3 bg-amber-300/40 rounded-full blur-md group-hover:bg-amber-400/70 animate-pulse pointer-events-none" />

            {/* Word bubble badge */}
            <div className="flex flex-col items-center">
              <div
                className={`px-3 py-1.5 rounded-2xl border-2 shadow-lg flex items-center gap-1.5 group-hover:scale-110 transition-transform ${item.color} bg-white/95 backdrop-blur`}
              >
                <span className="text-xl sm:text-2xl">{item.icon}</span>
                <span className="text-sm sm:text-base font-black tracking-wider">{item.word}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakSpanish(item.word);
                  }}
                  className="text-slate-400 hover:text-slate-700 p-0.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Little ground shadow */}
              <div className="w-8 h-2 bg-black/20 rounded-full blur-xs mt-1" />
            </div>
          </div>
        ))}

        {/* Mayi Character present in La Pastelería (Mission 7 guide) */}
        {zoneId === 'panaderia' && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              SOUNDS.tap();
              speakSpanish(
                '¡Hola Lucy, Happy y Fede! Soy Mayi y atiendo La Pastelería de la Srta Chantal. ¡Toca aquí para preparar los 8 pedidos dulces en la Misión 7!',
                { pitch: 1.32, rate: 0.98 }
              );
              const m7 = MISSIONS.find((m) => m.id === 7);
              if (m7) {
                onOpenMission(m7);
              }
            }}
            className="absolute z-25 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: '84%', top: '64%' }}
            title="Toca para hablar con Mayi en la pastelería"
          >
            <div className="flex flex-col items-center">
              <div className="bg-white/95 border-2 border-pink-400 px-3 py-1 rounded-2xl shadow-md flex items-center gap-1.5 group-hover:scale-105 transition-transform">
                <span className="text-base">👩‍🍳</span>
                <span className="text-xs font-black text-rose-700">Mayi (Pastelería)</span>
                <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-full font-bold">
                  Misión 7
                </span>
              </div>
              <div className="relative mt-1">
                <img
                  src={GAME_IMAGES.mayiAvatar}
                  alt="Mayi"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="w-12 h-2.5 bg-black/25 rounded-full blur-xs mt-0.5" />
            </div>
          </div>
        )}

        {/* Lucy & Pets character group moving across the floor */}
        <div
          className="absolute z-30 transition-all duration-700 ease-out pointer-events-none"
          style={{
            left: `${lucyPos.x}%`,
            top: `${lucyPos.y}%`,
            transform: 'translate(-50%, -85%)',
          }}
        >
          <div className="flex items-end gap-3 pointer-events-auto">
            {/* Dog Companions walking right alongside Lucy */}
            <DogCompanions
              customization={customizationPets}
              happyAffection={happyAffection}
              fedeAffection={fedeAffection}
              onPetHappy={onPetHappy}
              onPetFede={onPetFede}
              fedeHint={fedeHint}
              happyClue={happyClue}
            />

            {/* Protagonist Lucy */}
            <CharacterLucy
              customization={customizationLucy}
              isWalking={isWalking}
              speechText={lucySpeech}
              onTap={() => {
                SOUNDS.tap();
                speakSpanish('¡Hola! Soy Lucy, ¡vamos a explorar juntos!', { pitch: 1.34, rate: 0.98 });
                setLucySpeech('¡Hola! 💖');
                setTimeout(() => setLucySpeech(null), 2000);
              }}
            />
          </div>
        </div>

        {/* Zone Mission Prompt Widget if available */}
        {activeMission && (
          <div className="absolute bottom-4 left-4 z-40 bg-white/95 backdrop-blur-md border-3 border-amber-400 rounded-2xl p-3 shadow-xl max-w-sm animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeMission.badgeIcon}</span>
              <div className="flex-1">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider">
                  Misión Disponible
                </span>
                <h4 className="text-sm font-black text-slate-800 leading-tight">
                  {activeMission.title}
                </h4>
              </div>
              <button
                onClick={() => onOpenMission(activeMission)}
                className="bg-rose-500 hover:bg-rose-600 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1 active:scale-95 transition-all cursor-pointer btn-chunky"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Jugar</span>
              </button>
            </div>
          </div>
        )}

        {/* Word card popover when item selected */}
        {selectedItem && (
          <div className="absolute bottom-4 right-4 z-40 bg-white/95 backdrop-blur-md border-3 border-indigo-300 rounded-2xl p-3.5 shadow-xl max-w-xs animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedItem.icon}</span>
                <div>
                  <h4 className="text-lg font-black text-slate-800 tracking-wider">
                    {selectedItem.word}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">{selectedItem.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-600">
                Letra inicial: <strong className="text-sm">{selectedItem.word[0]}</strong>
              </span>
              <button
                onClick={() => speakSpanish(selectedItem.word)}
                className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg hover:bg-rose-100 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Escuchar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
