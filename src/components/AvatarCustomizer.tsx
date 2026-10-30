import React, { useState } from 'react';
import { Sparkles, Check, RefreshCw, Volume2 } from 'lucide-react';
import { LucyCustomization, PetCustomization } from '../types/game';
import { CharacterLucy } from './CharacterLucy';
import { DogCompanions } from './DogCompanions';
import { SOUNDS, speakSpanish } from '../utils/audio';
import { GAME_IMAGES } from '../utils/assets';

interface AvatarCustomizerProps {
  lucyConfig: LucyCustomization;
  petConfig: PetCustomization;
  onUpdateLucy: (newConfig: LucyCustomization) => void;
  onUpdatePets: (newConfig: PetCustomization) => void;
}

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({
  lucyConfig,
  petConfig,
  onUpdateLucy,
  onUpdatePets,
}) => {
  const [activeTab, setActiveTab] = useState<'lucy' | 'mascotas'>('lucy');

  const outfits = [
    { id: 'clasico_lucy', name: 'Camisa Rosada "LUCY"', icon: '👕', desc: 'Su camiseta favorita con letras blancas' },
    { id: 'vestido_rosa', name: 'Vestido de Fiesta Rosa', icon: '👗', desc: 'Elegante y fresco con flores' },
    { id: 'overol_azul', name: 'Overol de Aventuras Azul', icon: '👖', desc: 'Cómodo para jugar en la tierra y parque' },
    { id: 'exploradora', name: 'Traje de Exploradora', icon: '🧭', desc: 'Con bolsillos para guardar letras y tesoros' },
  ];

  const hairstyles = [
    { id: 'liso_largo', name: 'Cabello Largo Liso Suelto', icon: '👧', desc: 'Castaño claro original de Lucy' },
    { id: 'coletas', name: 'Dos Coletas Divertidas', icon: '🎀', desc: 'Alegres para correr con Happy' },
  ];

  const hairColors = [
    { color: '#8b5a2b', name: 'Marrón Claro (Original)' },
    { color: '#543310', name: 'Castaño Oscuro' },
    { color: '#D4A373', name: 'Rubio Caramelo' },
    { color: '#A0522D', name: 'Cobrizo Brillante' },
  ];

  const accessories = [
    { id: 'ninguno', name: 'Sin accesorio', icon: '✨' },
    { id: 'flor', name: 'Flor en el Pelo', icon: '🌸' },
    { id: 'corona', name: 'Corona Mágica', icon: '👑' },
    { id: 'lentes', name: 'Gafas de Lectora', icon: '👓' },
  ];

  const happyCollars = [
    { id: 'rojo', name: 'Collar Rojo Alegre', color: 'bg-red-500' },
    { id: 'azul', name: 'Collar Azul Marino', color: 'bg-blue-600' },
    { id: 'dorado', name: 'Medalla Dorada', color: 'bg-amber-400' },
  ];

  const fedeAccessories = [
    { id: 'ninguno', name: 'Natural', icon: '🐕' },
    { id: 'panuelo', name: 'Pañuelo Coqueto', icon: '🧣' },
    { id: 'corona_flores', name: 'Corona de Flores', icon: '🌸' },
  ];

  return (
    <div className="relative w-full flex-1 flex flex-col p-4 sm:p-6 bg-pink-50/70 rounded-3xl border-4 border-rose-300 shadow-xl overflow-hidden min-h-[580px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 bg-white/90 backdrop-blur px-5 py-3 rounded-2xl border-2 border-rose-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-rose-800 flex items-center gap-2">
            <span>✨</span> Personalización de Avatares
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600">
            Cambia el estilo de Lucy y viste a Happy y Federica con accesorios.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-rose-100 rounded-xl">
          <button
            onClick={() => {
              SOUNDS.tap();
              setActiveTab('lucy');
            }}
            className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
              activeTab === 'lucy'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-900 hover:text-rose-600'
            }`}
          >
            👧 Lucy
          </button>
          <button
            onClick={() => {
              SOUNDS.tap();
              setActiveTab('mascotas');
            }}
            className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
              activeTab === 'mascotas'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-900 hover:text-rose-600'
            }`}
          >
            🐶 Mascotas
          </button>
        </div>
      </div>

      {/* Official Avatars Showcase Banner */}
      <div className="mb-4 bg-white/90 backdrop-blur p-3 rounded-2xl border-2 border-rose-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎨</span>
          <span className="text-xs font-black text-rose-900 uppercase tracking-wider">
            Avatares Oficiales del Juego:
          </span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto py-0.5">
          {/* Lucy Avatar */}
          <div
            onClick={() => {
              SOUNDS.tap();
              speakSpanish('¡Hola! Soy Lucy, con mi camiseta rosada y ojos verdes.', { pitch: 1.34, rate: 0.98 });
            }}
            className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 p-1.5 pr-3 rounded-xl border border-rose-300 cursor-pointer transition-all active:scale-95 shadow-2xs"
            title="Escuchar a Lucy"
          >
            <img
              src={GAME_IMAGES.lucyAvatar}
              alt="Avatar oficial de Lucy"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-contain p-0.5 bg-white/70 border border-rose-400"
            />
            <span className="text-xs font-black text-rose-800">Lucy</span>
            <Volume2 className="w-3 h-3 text-rose-500" />
          </div>

          {/* Happy Avatar */}
          <div
            onClick={() => {
              SOUNDS.tap();
              speakSpanish('¡Guau guau! Soy Happy, la Border Collie juguetona.', { pitch: 1.45, rate: 1.0 });
            }}
            className="flex items-center gap-2 bg-sky-50 hover:bg-sky-100 p-1.5 pr-3 rounded-xl border border-sky-300 cursor-pointer transition-all active:scale-95 shadow-2xs"
            title="Escuchar a Happy"
          >
            <img
              src={GAME_IMAGES.happyAvatar}
              alt="Avatar oficial de Happy"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-contain p-0.5 bg-white/70 border border-sky-400"
            />
            <span className="text-xs font-black text-sky-800">Happy</span>
            <Volume2 className="w-3 h-3 text-sky-500" />
          </div>

          {/* Fede Avatar */}
          <div
            onClick={() => {
              SOUNDS.tap();
              speakSpanish('Hola, soy Federica. Tu amiga sabia y paciente.', { pitch: 1.18, rate: 0.95 });
            }}
            className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 p-1.5 pr-3 rounded-xl border border-amber-300 cursor-pointer transition-all active:scale-95 shadow-2xs"
            title="Escuchar a Federica"
          >
            <img
              src={GAME_IMAGES.fedeAvatar}
              alt="Avatar oficial de Federica"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-contain p-0.5 bg-white/70 border border-amber-400"
            />
            <span className="text-xs font-black text-amber-800">Fede</span>
            <Volume2 className="w-3 h-3 text-amber-500" />
          </div>

          {/* Mayi Avatar */}
          <div
            onClick={() => {
              SOUNDS.tap();
              speakSpanish('Mayi dice: ¡Qué hermosa te ves, Lucy! Y Happy y Fede lucen adorables con sus nuevos accesorios.', {
                pitch: 1.32,
                rate: 0.98,
              });
            }}
            className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 p-1.5 pr-3 rounded-xl border border-pink-300 cursor-pointer transition-all active:scale-95 shadow-2xs"
            title="Escuchar a Mayi"
          >
            <img
              src={GAME_IMAGES.mayiAvatar}
              alt="Avatar oficial de Mayi"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-contain p-0.5 bg-white/70 border border-pink-400"
            />
            <span className="text-xs font-black text-rose-800">Mayi 👩‍🍳</span>
            <Volume2 className="w-3 h-3 text-rose-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-center">
        {/* Live Visual Stage (Left side) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-sky-100 via-rose-50 to-emerald-100 rounded-3xl border-3 border-rose-300 p-6 flex flex-col items-center justify-center min-h-[360px] shadow-inner relative overflow-hidden">
          {/* Sunny background accents */}
          <div className="absolute top-4 left-6 text-2xl animate-float opacity-75">☀️</div>
          <div className="absolute top-12 right-6 text-xl animate-float opacity-75" style={{ animationDelay: '1s' }}>
            🌸
          </div>

          {/* Group Presentation */}
          <div className="flex items-end justify-center gap-4 py-4">
            <DogCompanions customization={petConfig} happyAffection={85} fedeAffection={90} />
            <CharacterLucy customization={lucyConfig} scale={1.2} />
          </div>

          <div className="mt-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full border border-rose-200 text-xs font-black text-rose-800 shadow-xs">
            ¡Listos para la aventura! 🌟
          </div>
        </div>

        {/* Controls Panel (Right side) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-3 border-rose-200 p-5 flex flex-col gap-4 shadow-sm max-h-[500px] overflow-y-auto">
          {activeTab === 'lucy' ? (
            <>
              {/* Outfits selection */}
              <div>
                <span className="text-xs font-black uppercase text-rose-700 tracking-wider">
                  Vestimenta de Lucy:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {outfits.map((outfit) => (
                    <button
                      key={outfit.id}
                      onClick={() => {
                        SOUNDS.tap();
                        onUpdateLucy({ ...lucyConfig, outfit: outfit.id as any });
                        speakSpanish(outfit.name);
                      }}
                      className={`p-3 rounded-2xl border-2 text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        lucyConfig.outfit === outfit.id
                          ? 'border-rose-500 bg-rose-50 shadow-xs'
                          : 'border-slate-200 hover:border-rose-300 bg-white'
                      }`}
                    >
                      <span className="text-2xl">{outfit.icon}</span>
                      <div className="flex-1">
                        <div className="text-xs font-black text-slate-800 leading-tight">
                          {outfit.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                          {outfit.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hairstyles selection */}
              <div>
                <span className="text-xs font-black uppercase text-rose-700 tracking-wider">
                  Peinado:
                </span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {hairstyles.map((hair) => (
                    <button
                      key={hair.id}
                      onClick={() => {
                        SOUNDS.tap();
                        onUpdateLucy({ ...lucyConfig, hairstyle: hair.id as any });
                      }}
                      className={`p-2.5 rounded-2xl border-2 flex items-center gap-2 transition-all cursor-pointer ${
                        lucyConfig.hairstyle === hair.id
                          ? 'border-rose-500 bg-rose-50 shadow-xs'
                          : 'border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      <span className="text-2xl">{hair.icon}</span>
                      <span className="text-xs font-black text-slate-800">{hair.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair color selection */}
              <div>
                <span className="text-xs font-black uppercase text-rose-700 tracking-wider">
                  Color de Cabello:
                </span>
                <div className="flex items-center gap-3 mt-2">
                  {hairColors.map((hc) => (
                    <button
                      key={hc.color}
                      onClick={() => {
                        SOUNDS.tap();
                        onUpdateLucy({ ...lucyConfig, hairColor: hc.color });
                      }}
                      className={`w-9 h-9 rounded-full border-3 transition-transform cursor-pointer flex items-center justify-center ${
                        lucyConfig.hairColor === hc.color
                          ? 'scale-110 border-rose-500 shadow-md ring-2 ring-rose-300'
                          : 'border-white shadow-xs hover:scale-105'
                      }`}
                      style={{ backgroundColor: hc.color }}
                      title={hc.name}
                    >
                      {lucyConfig.hairColor === hc.color && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessories selection */}
              <div>
                <span className="text-xs font-black uppercase text-rose-700 tracking-wider">
                  Accesorio:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {accessories.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => {
                        SOUNDS.tap();
                        onUpdateLucy({ ...lucyConfig, accessory: acc.id as any });
                      }}
                      className={`p-2 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        lucyConfig.accessory === acc.id
                          ? 'border-rose-500 bg-rose-50 shadow-xs'
                          : 'border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      <span className="text-xl">{acc.icon}</span>
                      <span className="text-[11px] font-black text-slate-800">{acc.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Pet Customization */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🐕‍🦺</span>
                  <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                    Collar para Happy (Border Collie):
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {happyCollars.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        SOUNDS.tap();
                        onUpdatePets({ ...petConfig, happyCollar: c.id as any });
                        speakSpanish(`Collar ${c.name} para Happy.`);
                      }}
                      className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        petConfig.happyCollar === c.id
                          ? 'border-sky-500 bg-sky-50 shadow-xs'
                          : 'border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full ${c.color} shadow-xs`} />
                      <span className="text-[11px] font-black text-slate-800">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🐕</span>
                  <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                    Accesorio para Federica (Fede):
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {fedeAccessories.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        SOUNDS.tap();
                        onUpdatePets({ ...petConfig, fedeAccessory: f.id as any });
                        speakSpanish(`Accesorio ${f.name} para Federica.`);
                      }}
                      className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        petConfig.fedeAccessory === f.id
                          ? 'border-amber-500 bg-amber-50 shadow-xs'
                          : 'border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <span className="text-2xl">{f.icon}</span>
                      <span className="text-[11px] font-black text-slate-800">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
