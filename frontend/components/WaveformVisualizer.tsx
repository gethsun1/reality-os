"use client";

import { motion } from 'framer-motion';

export function WaveformVisualizer({ intensity = 0.6 }: { intensity?: number }) {
  const bars = Array.from({ length: 22 });
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 6,
        height: 72,
        width: '100%',
      }}
    >
      {bars.map((_, i) => {
        const delay = (i % 6) * 0.08;
        const height = 8 + ((i * 13) % 40) * intensity;
        return (
          <motion.div
            key={i}
            initial={{ scaleY: 0.5, opacity: 0.6 }}
            animate={{ scaleY: [0.6, 1.3, 0.8], opacity: [0.5, 1, 0.7] }}
            transition={{ duration: 1.6, repeat: Infinity, delay, ease: 'easeInOut' }}
            style={{
              width: 6,
              height,
              borderRadius: 12,
              background: 'linear-gradient(180deg, #ff7a1a, #ff3faf)',
              boxShadow: '0 0 12px rgba(255,63,175,0.3)',
              transformOrigin: 'bottom',
            }}
          />
        );
      })}
    </div>
  );
}


