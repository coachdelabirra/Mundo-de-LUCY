import confetti from 'canvas-confetti';

/**
 * High-performance mobile-friendly celebratory confetti and stars explosion
 * using canvas-confetti.
 */
export function triggerAchievementCelebration() {
  // Check if prefers-reduced-motion is enabled
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // 1. Center star burst
  confetti({
    particleCount: 45,
    spread: 80,
    origin: { y: 0.45 },
    colors: ['#FFD700', '#FF69B4', '#00E5FF', '#76FF03', '#FF9100'],
    shapes: ['star', 'circle'],
    scalar: 1.2,
    ticks: 180,
  });

  // 2. Left and right festive cannons (twin bursts)
  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.6 },
      colors: ['#F43F5E', '#FBBF24', '#38BDF8'],
      ticks: 150,
    });
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.6 },
      colors: ['#F43F5E', '#FBBF24', '#34D399'],
      ticks: 150,
    });
  }, 250);

  // 3. Gentle golden shower
  setTimeout(() => {
    confetti({
      particleCount: 25,
      spread: 100,
      origin: { y: 0.2 },
      colors: ['#FACC15', '#F472B6', '#60A5FA'],
      shapes: ['star'],
      scalar: 1.4,
      ticks: 160,
    });
  }, 500);
}
