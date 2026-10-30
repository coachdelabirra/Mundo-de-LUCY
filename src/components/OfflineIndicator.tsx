import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-amber-500/95 backdrop-blur-xs px-3.5 py-2 text-xs font-black text-white shadow-xl border-2 border-white/60 animate-in fade-in slide-in-from-bottom duration-300">
      <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
      <span>Modo sin conexión — Jugando desde la memoria guardada</span>
    </div>
  );
};
