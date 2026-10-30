import React, { useState } from 'react';
import { Volume2, Play, Pause, ChevronLeft, ChevronRight, Heart, Sparkles, BookOpen } from 'lucide-react';
import { GAME_IMAGES } from '../utils/assets';
import { SOUNDS, speakSpanish } from '../utils/audio';

export const StoryMode: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isReading, setIsReading] = useState(false);

  const storyChapters = [
    {
      title: 'Capítulo 1: Aventuras de Lucy, Happy y Federica',
      image: GAME_IMAGES.lucyHuggingDogs,
      text: 'En una casita acogedora con un jardín lleno de margaritas, Lucía, una niña de cinco años de grandes ojos verdes y camiseta rosada con su nombre, abraza con alegría infinita a sus dos perritas: Happy, la saltarina Border Collie, y Federica, su fiel y sabia protectora.',
      dialogue: 'Lucy: «¡Buenos días, mis perritas del alma! Hoy vamos a aprender cómo cuidarnos, respetarnos y ser el mejor equipo del mundo.»',
      moralMessage: 'La bondad empieza en el hogar: amando, alimentando con cuidado y escuchando a nuestros fieles amigos animales.',
    },
    {
      title: 'Capítulo 2: Un Día Soleado en el Parque',
      image: GAME_IMAGES.lucyParkPortrait,
      text: 'Bajo el cielo azul despejado, Lucy camina por el sendero amarillo del parque. Las flores rojas y azules bailan con el viento suave, y el tobogán brilla invitando a jugar mientras Happy olfatea pistas misteriosas.',
      dialogue: 'Lucy: «¡Miren qué hermosa es la naturaleza cuando la cuidamos con cariño y dejamos limpio cada rincón donde jugamos!»',
      moralMessage: 'Cuando jugamos en el parque, protegemos los árboles y flores, compartimos con los demás y tratamos a la naturaleza como nuestro gran hogar.',
    },
    {
      title: 'Capítulo 3: El Rescate del Patito y la Moraleja',
      image: GAME_IMAGES.parkScene,
      text: 'Cerca del estanque de juncos, Lucy escucha un llanto suave: ¡un patito amarillo se ha alejado de su mamá pata! Gracias al fino olfato de Happy y la paciencia de Fede, Lucy lee los carteles y ayuda al patito a reunirse con su familia.',
      dialogue: 'Lucy: «¡A través de la bondad hacia los animales, aprendemos empatía y sentimos que todo en la naturaleza está conectado por el amor!»',
      moralMessage: 'Moraleja: Cuidar a los seres vivos más pequeños nos hace más sabios, compasivos y grandes de corazón.',
    },
  ];

  const current = storyChapters[currentSlide];

  const handleReadSlide = () => {
    setIsReading(true);
    SOUNDS.tap();
    speakSpanish(`${current.title}. ${current.text} ${current.dialogue} ${current.moralMessage}`, {
      pitch: 1.34,
      rate: 0.98,
      onEnd: () => setIsReading(false),
    });
  };

  const handleNext = () => {
    SOUNDS.tap();
    window.speechSynthesis?.cancel();
    setIsReading(false);
    if (currentSlide < storyChapters.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    SOUNDS.tap();
    window.speechSynthesis?.cancel();
    setIsReading(false);
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col p-4 sm:p-6 bg-amber-50/70 rounded-3xl border-4 border-amber-300 shadow-xl overflow-hidden min-h-[580px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 bg-white/90 backdrop-blur px-5 py-3 rounded-2xl border-2 border-amber-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-2xl">
            <BookOpen className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Historia Animada: El Mundo de Lucy
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Un cuento de animación sobre empatía, respeto animal y conexión con la naturaleza.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-black text-rose-700 bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>Capítulo {currentSlide + 1} de {storyChapters.length}</span>
        </div>
      </div>

      {/* Main Story Book Card */}
      <div className="flex-1 bg-white rounded-3xl border-3 border-amber-200 overflow-hidden shadow-md flex flex-col lg:flex-row">
        {/* Story Illustration Viewport */}
        <div className="relative lg:w-1/2 min-h-[260px] lg:min-h-[400px] overflow-hidden bg-slate-900">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
              Estilo Pixar 2D
            </span>
            <h3 className="text-lg sm:text-xl font-black drop-shadow-md">{current.title}</h3>
          </div>
        </div>

        {/* Narrative & Audio Player */}
        <div className="lg:w-1/2 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Story text */}
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
              {current.text}
            </p>

            {/* Spoken dialogue quote */}
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-start gap-3">
              <span className="text-2xl">👧</span>
              <p className="text-xs sm:text-sm font-black text-rose-900 leading-snug">
                {current.dialogue}
              </p>
            </div>

            {/* Moral takeaway banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-start gap-3">
              <span className="text-2xl">🌱</span>
              <p className="text-xs sm:text-sm font-bold text-emerald-900 leading-snug">
                {current.moralMessage}
              </p>
            </div>

            {/* Mayi Reading Guide Reflection */}
            <div
              onClick={() => {
                SOUNDS.tap();
                speakSpanish('Mayi te acompaña en el cuento: ¡Qué hermosa historia, Lucy! La bondad con los animales y la alegría de aprender nos hacen los mejores amigos.', {
                  pitch: 1.32,
                  rate: 0.98,
                });
              }}
              className="p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-amber-50 border-2 border-pink-200 flex items-center gap-3 cursor-pointer hover:border-pink-300 transition-all shadow-xs"
              title="Consejo de lectura de Mayi"
            >
              <img
                src={GAME_IMAGES.mayiAvatar}
                alt="Mayi Guía"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-xl object-contain bg-white border border-pink-300 shadow-2xs animate-mayi-wave shrink-0"
              />
              <div className="flex-1 text-left min-w-0">
                <span className="text-[10px] font-black uppercase text-rose-700 block leading-tight">Mayi · Guía de Lectura</span>
                <p className="text-xs text-slate-700 font-bold truncate sm:whitespace-normal">
                  «Las palabras nos abren los ojos y los cuentos nos llenan de amor.»
                </p>
              </div>
              <Volume2 className="w-4 h-4 text-rose-500 shrink-0" />
            </div>
          </div>

          {/* Action & Navigation controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={handleReadSlide}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm px-5 py-2.5 rounded-2xl shadow-md active:scale-95 transition-all btn-chunky cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>{isReading ? 'Reproduciendo Cuento...' : 'Escuchar Narración en Voz Alta'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className="p-2.5 rounded-xl border-2 border-slate-200 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed bg-white shadow-xs cursor-pointer"
                title="Capítulo Anterior"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentSlide === storyChapters.length - 1}
                className="p-2.5 rounded-xl border-2 border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs cursor-pointer font-bold flex items-center gap-1"
                title="Siguiente Capítulo"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
