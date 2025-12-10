"use client";

export function SignalWaves({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 220"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      aria-hidden="true"
      style={{ opacity: 0.55, filter: 'drop-shadow(0 0 20px rgba(255,124,40,0.15))' }}
    >
      <defs>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FF3FAF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {Array.from({ length: 5 }).map((_, i) => {
        const y = 40 + i * 30;
        const amp = 10 + i * 4;
        return (
          <path
            key={i}
            d={`M0 ${y} C 120 ${y - amp}, 180 ${y + amp}, 300 ${y} S 480 ${y - amp}, 600 ${y}`}
            fill="none"
            stroke="url(#waveGrad)"
            strokeWidth={i === 2 ? 2.2 : 1.4}
            opacity={0.3 + i * 0.12}
          />
        );
      })}
    </svg>
  );
}


