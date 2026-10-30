import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Download, RotateCcw, Volume2, CheckCircle, BookOpen, Star, X, CheckCircle2 } from 'lucide-react';
import { PedagogicalLevel, PlayerProfile } from '../types/game';
import {
  SOUNDS,
  speakSpanish,
  speakPhoneme,
  testLucyVoiceSample,
  getAvailableFemaleVoices,
  getPreferredVoiceName,
  setPreferredVoiceName,
  getLatinAmericanVoice,
} from '../utils/audio';

interface ParentsDashboardProps {
  profile: PlayerProfile;
  onChangeLevel: (level: PedagogicalLevel) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const ParentsDashboard: React.FC<ParentsDashboardProps> = ({
  profile,
  onChangeLevel,
  onResetProgress,
  onClose,
}) => {
  const [availableFemaleVoices, setAvailableFemaleVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoiceName, setCurrentVoiceName] = useState<string>(getPreferredVoiceName());

  useEffect(() => {
    const refresh = () => {
      const list = getAvailableFemaleVoices();
      setAvailableFemaleVoices(list);
      const active = getLatinAmericanVoice();
      if (active && !currentVoiceName) {
        setCurrentVoiceName(active.name);
      }
    };
    refresh();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = refresh;
    }
  }, [currentVoiceName]);

  const handleSelectVoice = (name: string) => {
    SOUNDS.tap();
    setCurrentVoiceName(name);
    setPreferredVoiceName(name);
    speakSpanish('Voz configurada con éxito. ¡Soy Lucy, tu amiguita latina!', { pitch: 1.34, rate: 0.98 });
  };
  const levels: { id: PedagogicalLevel; label: string; ageRange: string; desc: string }[] = [
    {
      id: 'pre-lectores',
      label: 'Pre-Lectores',
      ageRange: '4 - 5 Años',
      desc: 'Enfoque fonético directo (sonido "mmm"), trazos guiados de letras, asociación palabra-dibujo.',
    },
    {
      id: 'lectores-iniciales',
      label: 'Lectores Iniciales',
      ageRange: '6 - 7 Años',
      desc: 'Construcción de sílabas directas, formación de palabras cortas (PAN, SOL, MESA), dictados visuales.',
    },
    {
      id: 'consolidacion',
      label: 'Consolidación',
      ageRange: '8 - 9 Años',
      desc: 'Oraciones, lectura de carteles, seguimiento de pistas complejas y mini-historias narradas.',
    },
  ];

  const handleExportData = () => {
    SOUNDS.tap();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `progreso_lucy_${profile.name.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleConfirmReset = () => {
    if (window.confirm('¿Deseas reiniciar el progreso de lectoescritura para comenzar de nuevo?')) {
      onResetProgress();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border-4 border-indigo-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Panel para Madres, Padres y Docentes
              </h2>
              <span className="text-xs text-indigo-100 font-medium">
                Monitoreo pedagógico y configuración de lectoescritura
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

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50">
          {/* Key pedagogical metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Nivel Actual</span>
              <p className="text-base font-black text-indigo-700 capitalize mt-0.5">
                {profile.level.replace('-', ' ')}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Estrellas Ganadas</span>
              <p className="text-base font-black text-amber-600 mt-0.5 flex items-center gap-1">
                ⭐ {profile.stars}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Letras Dominadas</span>
              <p className="text-base font-black text-emerald-600 mt-0.5">
                {profile.lettersMastered.length} Letras
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Palabras Leídas</span>
              <p className="text-base font-black text-rose-600 mt-0.5">
                {profile.wordsLearned.length} Palabras
              </p>
            </div>
          </div>

          {/* Level selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">
              Ajustar Nivel Pedagógico de Dificultad:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {levels.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => {
                    SOUNDS.tap();
                    onChangeLevel(lvl.id);
                  }}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    profile.level === lvl.id
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-indigo-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-900">{lvl.label}</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {lvl.ageRange}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                    {lvl.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Phonetic vocabulary & letters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-2">
                Fonemas y Letras Dominadas:
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.lettersMastered.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => speakPhoneme(letter)}
                    className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-800 font-black text-base flex items-center justify-center transition-colors cursor-pointer"
                    title="Escuchar sonido fonético"
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-medium">
                Toca cualquier letra para escuchar su pronunciación fonética (fonema).
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-2">
                Palabras Aprendidas en el Juego:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.wordsLearned.map((word) => (
                  <button
                    key={word}
                    onClick={() => speakSpanish(word)}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 font-black text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{word}</span>
                    <Volume2 className="w-3 h-3 text-rose-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Latin American Neutral Young Girl Voice Section */}
          <div className="bg-rose-50/90 p-4 sm:p-5 rounded-2xl border-2 border-rose-300 flex flex-col gap-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👧</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider">
                      Voz Latina de Niña Joven (Acento Neutro)
                    </h4>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Cero Voces Masculinas</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-800 font-medium mt-0.5">
                    Tono dulce, agudo y melodioso de niña de 5 años con acento neutro latinoamericano, exactamente como locutora juvenil infantil.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  SOUNDS.tap();
                  testLucyVoiceSample();
                }}
                className="bg-rose-500 hover:bg-rose-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0"
              >
                <Volume2 className="w-4 h-4" />
                <span>Probar Voz de Lucy</span>
              </button>
            </div>

            {/* If device has multiple female voices, give parents choice */}
            {availableFemaleVoices.length > 1 && (
              <div className="bg-white/90 p-2.5 rounded-xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <span>🎙️</span>
                  <span>Voz femenina seleccionada en tu dispositivo:</span>
                </span>
                <select
                  value={currentVoiceName}
                  onChange={(e) => handleSelectVoice(e.target.value)}
                  className="bg-white border border-rose-300 text-rose-900 font-bold rounded-lg px-2.5 py-1 text-xs focus:outline-rose-500"
                >
                  {availableFemaleVoices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Pedagogy Principles in Spanish Early Literacy */}
          <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1.5">
            <h5 className="font-black text-amber-900 flex items-center gap-1.5">
              <span>💡</span> Claves Pedagógicas Aplicadas en "El Mundo de Lucy":
            </h5>
            <ul className="list-disc list-inside space-y-1 font-medium text-amber-900/90 leading-relaxed">
              <li>
                <strong>Enfoque Fonético:</strong> Se enseña el fonema de la consonante ("mmmmm", "sssss") antes que su nombre, para facilitar la síntesis de sílabas directas (ma, me, mi, mo, mu).
              </li>
              <li>
                <strong>Grafomotricidad:</strong> El niño practica el trazo con guía visual y tolerancia adecuada a la motricidad fina de 4 a 6 años.
              </li>
              <li>
                <strong>Pedagogía del error sin castigo:</strong> Nunca hay penalización; ante errores se ofrecen pistas progresivas y el perro guía (Fede) interviene amablemente.
              </li>
            </ul>
          </div>

          {/* Data Export & Reset Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <button
              onClick={handleExportData}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Informe de Progreso (JSON)</span>
            </button>
            <button
              onClick={handleConfirmReset}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-black text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar Progreso de Partida</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
