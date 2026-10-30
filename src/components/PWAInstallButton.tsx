import React, { useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { SOUNDS } from '../utils/audio';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'floating' | 'card' | 'compact';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already running in standalone mode (already installed), we don't need to push installation
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    SOUNDS.tap();
    if (isInstallable) {
      // If native browser prompt is ready, try to prompt, but open modal if needed
      const success = await install();
      if (!success) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`p-1.5 sm:p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-300 cursor-pointer transition-colors flex items-center gap-1 text-xs font-black ${className}`}
          title="Instalar como Aplicación (PWA)"
        >
          <Download className="w-4 h-4 text-emerald-600 animate-bounce" />
          <span className="hidden lg:inline">Instalar App</span>
        </button>
        <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm py-2 px-3 sm:px-4 rounded-3xl shadow-xl border-2 border-white cursor-pointer active:scale-95 transition-all ${className}`}
          title="Instalar El Mundo de Lucy como Aplicación Móvil o PC"
        >
          <Download className="w-4 h-4 animate-bounce" />
          <span>Instalar App</span>
        </button>
        <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // Default navbar variant
  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl shadow-sm border border-emerald-300 cursor-pointer active:scale-95 transition-all ${className}`}
        title="Instalar El Mundo de Lucy como PWA"
      >
        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">Instalar</span>
      </button>
      <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
