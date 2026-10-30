import React, { useState } from 'react';
import { Download, CheckCircle, Sparkles, X, Smartphone, Monitor, Apple, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { SOUNDS, speakSpanish } from '../utils/audio';
import { GAME_IMAGES } from '../utils/assets';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'auto' | 'android' | 'ios' | 'desktop'>('auto');
  const [isInstalling, setIsInstalling] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    SOUNDS.tap();
    setIsInstalling(true);
    try {
      const outcome = await install();
      if (outcome) {
        setInstalledSuccess(true);
        SOUNDS.triumph();
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        speakSpanish('¡Excelente! El Mundo de Lucy se ha instalado como aplicación en tu pantalla.');
      }
    } catch {
      // Prompt dismissed or error handled gracefully
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-rose-50 via-amber-50/40 to-white rounded-3xl border-4 border-rose-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-5 py-3.5 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-float">📲</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                Instalador de El Mundo de Lucy
              </h2>
              <span className="text-xs text-rose-100 font-medium">
                Instalar como aplicación móvil o de escritorio (PWA)
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              SOUNDS.tap();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors cursor-pointer"
            title="Cerrar instalador"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-center sm:text-left">
          {/* Hero showcase */}
          <div className="bg-white rounded-3xl border-2 border-rose-200 p-4 flex flex-col sm:flex-row items-center gap-4 shadow-xs">
            <div className="relative shrink-0">
              <img
                src={GAME_IMAGES.lucyAvatar}
                alt="El Mundo de Lucy"
                className="w-20 h-20 rounded-2xl object-contain bg-rose-50 p-1 border-2 border-rose-300 shadow-md animate-float"
              />
              <span className="absolute -bottom-1 -right-1 text-xl">⭐</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                  Aplicación Oficial PWA
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  Sin Descargas Pesadas
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                El Mundo de Lucy en tu Pantalla
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Juega a pantalla completa sin barra de direcciones, con acceso directo desde tu celular, tablet o computadora.
              </p>
            </div>
          </div>

          {/* Direct Install Status */}
          {installedSuccess || isInstalled ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-left">
              <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-black text-emerald-900">¡Aplicación Ya Instalada!</h4>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  El Mundo de Lucy ya está disponible en tu pantalla de inicio o escritorio con acceso instantáneo.
                </p>
              </div>
            </div>
          ) : isInstallable ? (
            <div className="space-y-2">
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:brightness-105 active:scale-95 text-white font-black text-sm sm:text-base py-3 px-5 rounded-2xl shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer btn-chunky"
              >
                <Download className="w-5 h-5 animate-bounce" />
                <span>{isInstalling ? 'Instalando...' : '¡Instalar Aplicación Ahora! (1 clic)'}</span>
              </button>
              <p className="text-[11px] text-center text-slate-500 font-medium">
                Tu navegador es compatible. Al hacer clic se añadirá directamente a tus aplicaciones.
              </p>
            </div>
          ) : null}

          {/* Guided tabs for platforms */}
          <div className="space-y-2.5">
            <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
              <span>📖</span>
              <span>Instrucciones según tu dispositivo:</span>
            </span>

            {/* Device tabs */}
            <div className="flex rounded-2xl bg-slate-100 p-1 gap-1">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'android' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android / Chrome</span>
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'ios' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'desktop' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>PC / Mac</span>
              </button>
            </div>

            {/* Platform Instructions */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-3.5 text-xs text-slate-700 space-y-2 text-left">
              {(activeTab === 'android' || activeTab === 'auto') && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-rose-700">
                    <Smartphone className="w-4 h-4" />
                    <span>En Android (Google Chrome / Edge):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 font-medium pl-1 text-slate-600">
                    <li>Toca el menú de tres puntos (<strong>⋮</strong>) en la esquina superior derecha.</li>
                    <li>Selecciona <strong>&quot;Instalar aplicación&quot;</strong> o <strong>&quot;Agregar a la pantalla principal&quot;</strong>.</li>
                    <li>Confirma tocando <strong>&quot;Instalar&quot;</strong> y ¡listo!</li>
                  </ol>
                </div>
              )}

              {activeTab === 'ios' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-rose-700">
                    <Apple className="w-4 h-4" />
                    <span>En iPhone o iPad (Safari):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 font-medium pl-1 text-slate-600">
                    <li>Abre este juego en el navegador <strong>Safari</strong>.</li>
                    <li>Toca el botón <strong>Compartir</strong> (el ícono de cuadrado con flecha hacia arriba <strong>⎋</strong>).</li>
                    <li>Desplázate hacia abajo y pulsa <strong>&quot;Agregar a pantalla de inicio&quot; (➕)</strong>.</li>
                    <li>Toca <strong>&quot;Agregar&quot;</strong> en la esquina superior derecha.</li>
                  </ol>
                </div>
              )}

              {activeTab === 'desktop' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-rose-700">
                    <Monitor className="w-4 h-4" />
                    <span>En Computadora (Chrome, Edge, Brave):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 font-medium pl-1 text-slate-600">
                    <li>Busca el ícono de computadora o flecha hacia abajo (<strong>⬇️</strong>) en la barra de direcciones del navegador.</li>
                    <li>Haz clic en <strong>&quot;Instalar El Mundo de Lucy&quot;</strong>.</li>
                    <li>Se abrirá en su propia ventana sin barras ni pestañas.</li>
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2 text-left">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-[11px] font-black text-amber-950 block leading-tight">Carga Instantánea</span>
                <span className="text-[10px] text-amber-800">Guarda en caché</span>
              </div>
            </div>
            <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-2.5 flex items-center gap-2 text-left">
              <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="text-[11px] font-black text-rose-950 block leading-tight">100% Segura</span>
                <span className="text-[10px] text-rose-800">Sin publicidad externa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Progreso y estrellas guardados localmente
          </span>
          <button
            onClick={() => {
              SOUNDS.tap();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
