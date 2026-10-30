import React, { useState } from 'react';
import { Sparkles, Trash2, Volume2, Plus, Check, Star } from 'lucide-react';
import { PlacedFurniture } from '../types/game';
import { CATALOG_FURNITURE } from '../data/gameContent';
import { GAME_IMAGES } from '../utils/assets';
import { SOUNDS, speakSpanish } from '../utils/audio';

interface HomeDecoratorProps {
  placedItems: PlacedFurniture[];
  userStars: number;
  onUpdatePlacedItems: (items: PlacedFurniture[]) => void;
  onSpendStars: (stars: number) => boolean;
}

export const HomeDecorator: React.FC<HomeDecoratorProps> = ({
  placedItems,
  userStars,
  onUpdatePlacedItems,
  onSpendStars,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<'Dormitorio' | 'Juegos' | 'Lectura' | 'Deporte'>('Dormitorio');
  const [activeItem, setActiveItem] = useState<PlacedFurniture | null>(null);

  // Handle adding furniture to room
  const handleAddFurniture = (catalogItem: (typeof CATALOG_FURNITURE)[0]) => {
    SOUNDS.tap();
    speakSpanish(`${catalogItem.name}. ¡Colocado en el cuarto de Lucy!`);

    const newItem: PlacedFurniture = {
      id: `placed-${Date.now()}`,
      itemId: catalogItem.id,
      name: catalogItem.name,
      x: 35 + (Math.random() * 30 - 15),
      y: 50 + (Math.random() * 25 - 12),
      icon: catalogItem.icon,
      color: catalogItem.color,
    };

    onUpdatePlacedItems([...placedItems, newItem]);
  };

  // Remove item
  const handleRemoveItem = (id: string) => {
    SOUNDS.tap();
    onUpdatePlacedItems(placedItems.filter((i) => i.id !== id));
    setActiveItem(null);
  };

  // Tap placed item to hear it
  const handleItemTap = (item: PlacedFurniture) => {
    SOUNDS.tap();
    setActiveItem(item);
    speakSpanish(item.name);
  };

  const filteredCatalog = CATALOG_FURNITURE.filter((item) =>
    selectedTheme === 'Dormitorio'
      ? item.category === 'Dormitorio' || item.category === 'Mascotas'
      : item.category === selectedTheme
  );

  return (
    <div className="relative w-full flex-1 flex flex-col p-4 sm:p-6 bg-amber-50 rounded-3xl border-4 border-amber-300 shadow-xl overflow-hidden min-h-[580px]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 bg-white/90 backdrop-blur px-5 py-3 rounded-2xl border-2 border-amber-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>🏠</span> Decorar la Habitación de Lucy
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600">
            Elige muebles, música o gimnasio y colócalos donde más te guste.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-300">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            {userStars} Estrellas
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1">
        {/* Main Room Viewport */}
        <div
          className="relative lg:col-span-3 rounded-3xl border-3 border-amber-300 overflow-hidden shadow-inner min-h-[380px] sm:min-h-[440px]"
          style={{
            backgroundImage: `url(${GAME_IMAGES.roomScene})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Subtle room depth vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />

          {/* Placed Furniture Items */}
          {placedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemTap(item)}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <div
                className={`p-2.5 rounded-2xl border-2 shadow-lg flex flex-col items-center gap-1 bg-white/95 backdrop-blur group-hover:scale-110 transition-transform ${
                  activeItem?.id === item.id ? 'ring-4 ring-rose-400 border-rose-500' : 'border-amber-300'
                }`}
              >
                <span className="text-3xl sm:text-4xl">{item.icon}</span>
                <span className="text-[11px] font-black text-slate-800 tracking-wide px-1">
                  {item.name}
                </span>
              </div>
            </div>
          ))}

          {/* Item details inspector if active */}
          {activeItem && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-30 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border-2 border-rose-300 shadow-xl flex items-center justify-between gap-3 max-w-sm">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{activeItem.icon}</span>
                <div>
                  <h4 className="text-sm font-black text-slate-800">{activeItem.name}</h4>
                  <p className="text-[11px] text-slate-500 font-semibold">Tocado para escuchar</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakSpanish(activeItem.name)}
                  className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                  title="Escuchar"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleRemoveItem(activeItem.id)}
                  className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                  title="Quitar de la habitación"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Catalog Panel */}
        <div className="bg-white rounded-3xl border-3 border-amber-200 p-4 flex flex-col shadow-sm">
          {/* Category Tabs */}
          <span className="text-xs font-black uppercase text-amber-800 mb-2">
            Temas de Habitación:
          </span>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {(['Dormitorio', 'Juegos', 'Lectura', 'Deporte'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  SOUNDS.tap();
                  setSelectedTheme(theme);
                }}
                className={`py-2 px-2 text-xs font-black rounded-xl border-2 transition-all cursor-pointer ${
                  selectedTheme === theme
                    ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                    : 'bg-amber-50 text-slate-700 border-amber-200 hover:bg-amber-100'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>

          {/* Mayi Decorator Guidance */}
          <div
            onClick={() => {
              SOUNDS.tap();
              speakSpanish('Mayi te aconseja: ¡Tu cuarto está quedando precioso! Puedes colocar el rincón de lectura y la casa de muñecas.', {
                pitch: 1.32,
                rate: 0.98,
              });
            }}
            className="mb-3 p-2.5 bg-gradient-to-r from-pink-50 to-amber-50 border-2 border-pink-200 rounded-2xl flex items-center gap-2 cursor-pointer hover:border-pink-300 transition-all shadow-xs"
            title="Consejo de Mayi para decorar"
          >
            <img
              src={GAME_IMAGES.mayiAvatar}
              alt="Mayi"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border border-pink-300 bg-white object-contain animate-float shrink-0"
            />
            <div className="text-left flex-1 min-w-0">
              <span className="text-[10px] font-black text-rose-600 uppercase block leading-tight">Mayi te sugiere:</span>
              <p className="text-[11px] text-slate-700 font-bold truncate">¡Combina colores alegres y juguetes mágicos!</p>
            </div>
            <Volume2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          </div>

          {/* Furniture Catalog List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[320px] pr-1">
            {filteredCatalog.map((catItem) => (
              <div
                key={catItem.id}
                onClick={() => handleAddFurniture(catItem)}
                className="p-2.5 rounded-2xl border-2 border-amber-200 hover:border-rose-400 bg-amber-50/60 hover:bg-rose-50/50 flex items-center justify-between gap-2 cursor-pointer transition-all active:scale-95 group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{catItem.icon}</span>
                  <div>
                    <h5 className="text-xs font-black text-slate-800 group-hover:text-rose-600">
                      {catItem.name}
                    </h5>
                    <span className="text-[10px] font-bold text-slate-500">{catItem.category}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddFurniture(catItem);
                  }}
                  className="p-1.5 rounded-xl bg-white border border-amber-300 text-amber-700 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-amber-200 text-center">
            <span className="text-[11px] font-bold text-slate-500">
              {placedItems.length} objetos colocados en el cuarto
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
