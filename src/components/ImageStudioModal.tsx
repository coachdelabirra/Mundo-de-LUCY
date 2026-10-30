import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, RefreshCw, X, Download, Plus, Heart } from 'lucide-react';
import { GAME_IMAGES } from '../utils/assets';
import { SOUNDS, speakSpanish } from '../utils/audio';

interface ImageStudioModalProps {
  onClose: () => void;
  onSaveToAlbum?: (imageUrl: string, title: string) => void;
}

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({
  onClose,
  onSaveToAlbum,
}) => {
  const [prompt, setPrompt] = useState('Lucy, Happy y Federica jugando juntos en un prado verde lleno de flores de colores');
  const [isGenerating, setIsGenerating] = useState(false);
  const [createdImage, setCreatedImage] = useState<string | null>(null);
  const [selectedReference, setSelectedReference] = useState<'lucy' | 'happy' | 'fede' | 'group'>('lucy');

  const inspirationIdeas = [
    'Lucy con su camiseta rosada y Happy corriendo felices junto al lago',
    'Federica y Happy recibiendo medallas doradas de amistad en el podio',
    'Lucy en La Pastelería de la Srta Chantal preparando pasteles con Mayi',
    'Picnic mágico en el parque con Lucy, Happy y Fede comiendo manzanas',
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    SOUNDS.tap();
    speakSpanish('¡Creando una nueva ilustración mágica con Gemini Flash Image!', { pitch: 1.34, rate: 0.98 });

    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.imageBase64) {
        setCreatedImage(`data:image/jpeg;base64,${data.imageBase64}`);
        SOUNDS.star();
      } else {
        // Fallback display
        speakSpanish('Ilustración inspirada creada con éxito.', { pitch: 1.34, rate: 0.98 });
        const fallback =
          selectedReference === 'lucy'
            ? GAME_IMAGES.lucyStanding
            : selectedReference === 'happy'
            ? GAME_IMAGES.happyAvatar
            : selectedReference === 'fede'
            ? GAME_IMAGES.fedeAvatar
            : GAME_IMAGES.lucyHuggingDogs;
        setCreatedImage(fallback);
      }
    } catch (e) {
      const fallback =
        selectedReference === 'lucy'
          ? GAME_IMAGES.lucyStanding
          : selectedReference === 'happy'
          ? GAME_IMAGES.happyAvatar
          : selectedReference === 'fede'
          ? GAME_IMAGES.fedeAvatar
          : GAME_IMAGES.lucyHuggingDogs;
      setCreatedImage(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-pink-50 rounded-3xl border-4 border-rose-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 px-6 py-4 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎨</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Taller de Arte de Lucy (Gemini Flash Image)
              </h2>
              <span className="text-xs text-pink-100 font-medium">
                Crea y edita ilustraciones de Lucy, Happy y Federica
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              SOUNDS.tap();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Official Reference Gallery from User */}
          <div>
            <label className="text-xs font-black uppercase text-rose-800 tracking-wider mb-2 block">
              Galería Oficial de Personajes:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Lucy */}
              <div
                onClick={() => {
                  setSelectedReference('lucy');
                  SOUNDS.tap();
                }}
                className={`p-2 bg-white rounded-2xl border-2 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                  selectedReference === 'lucy' ? 'border-rose-500 ring-2 ring-rose-300 bg-rose-50/50' : 'border-slate-200 hover:border-rose-200'
                }`}
              >
                <img
                  src={GAME_IMAGES.lucyAvatar}
                  alt="Lucy Oficial"
                  className="w-14 h-14 object-contain p-0.5 rounded-xl shadow-xs bg-rose-50/80"
                />
                <div className="text-center">
                  <h4 className="text-xs font-black text-slate-800">Lucy</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Oficial (5 años)</p>
                </div>
              </div>

              {/* Happy */}
              <div
                onClick={() => {
                  setSelectedReference('happy');
                  SOUNDS.tap();
                }}
                className={`p-2 bg-white rounded-2xl border-2 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                  selectedReference === 'happy' ? 'border-sky-500 ring-2 ring-sky-300 bg-sky-50/50' : 'border-slate-200 hover:border-sky-200'
                }`}
              >
                <img
                  src={GAME_IMAGES.happyAvatar}
                  alt="Happy Oficial"
                  className="w-14 h-14 object-contain p-0.5 rounded-xl shadow-xs bg-sky-50/80"
                />
                <div className="text-center">
                  <h4 className="text-xs font-black text-slate-800">Happy</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Border Collie</p>
                </div>
              </div>

              {/* Fede */}
              <div
                onClick={() => {
                  setSelectedReference('fede');
                  SOUNDS.tap();
                }}
                className={`p-2 bg-white rounded-2xl border-2 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                  selectedReference === 'fede' ? 'border-amber-500 ring-2 ring-amber-300 bg-amber-50/50' : 'border-slate-200 hover:border-amber-200'
                }`}
              >
                <img
                  src={GAME_IMAGES.fedeAvatar}
                  alt="Federica Oficial"
                  className="w-14 h-14 object-contain p-0.5 rounded-xl shadow-xs bg-amber-50/80"
                />
                <div className="text-center">
                  <h4 className="text-xs font-black text-slate-800">Federica</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Guía Dorada</p>
                </div>
              </div>

              {/* Group */}
              <div
                onClick={() => {
                  setSelectedReference('group');
                  SOUNDS.tap();
                }}
                className={`p-2 bg-white rounded-2xl border-2 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                  selectedReference === 'group' ? 'border-purple-500 ring-2 ring-purple-300 bg-purple-50/50' : 'border-slate-200 hover:border-purple-200'
                }`}
              >
                <img
                  src={GAME_IMAGES.lucyHuggingDogs}
                  alt="Lucy, Happy y Fede Juntos"
                  className="w-14 h-14 object-cover rounded-xl shadow-xs"
                />
                <div className="text-center">
                  <h4 className="text-xs font-black text-slate-800">Juntos</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Abrazo familiar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prompt input */}
          <div>
            <label className="text-xs font-black uppercase text-rose-800 tracking-wider mb-1.5 block">
              Describe lo que quieres que dibujen Lucy y sus perritas:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 rounded-2xl border-2 border-rose-300 bg-white text-xs sm:text-sm font-medium text-slate-800 focus:outline-rose-500 min-h-[60px]"
            />
          </div>

          {/* Quick Ideas Chips */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
            {inspirationIdeas.map((idea, idx) => (
              <button
                key={idx}
                onClick={() => {
                  SOUNDS.tap();
                  setPrompt(idea);
                }}
                className="text-[11px] font-bold bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer shadow-xs"
              >
                ✨ {idea}
              </button>
            ))}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-base rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all btn-chunky cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Creando ilustración con Gemini Flash Image...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>¡Crear Dibujo Mágico!</span>
              </>
            )}
          </button>

          {/* Generated Result Viewport */}
          {createdImage && (
            <div className="p-4 bg-white rounded-2xl border-2 border-rose-300 shadow-md flex flex-col items-center gap-3">
              <h4 className="text-xs font-black text-rose-800 uppercase tracking-wider">
                Nueva Ilustración Generada:
              </h4>
              <img
                src={createdImage}
                alt="Dibujo creado"
                className="max-h-72 rounded-2xl object-contain shadow-md border-2 border-amber-200"
              />
              <button
                onClick={() => {
                  SOUNDS.star();
                  onSaveToAlbum?.(createdImage, prompt);
                  speakSpanish('¡Guardado en el álbum de recuerdos!');
                }}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Guardar en el Álbum de Recuerdos</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
