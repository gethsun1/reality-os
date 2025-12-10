"use client";

export function LightGrid({ className }: { className?: string }) {
  const rows = 10;
  const cols = 16;
  return (
    <svg
      className={className}
      viewBox="0 0 800 400"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      aria-hidden="true"
      style={{ opacity: 0.25 }}
    >
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#FF3FAF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[...Array(rows)].map((_, r) =>
        [...Array(cols)].map((__, c) => {
          const x = (c / (cols - 1)) * 800;
          const y = (r / (rows - 1)) * 400;
          const delay = (r + c) * 0.08;
          return (
            <g key={`${r}-${c}`} style={{ animation: `pulse-soft 5s ease-in-out ${delay}s infinite` }}>
              <circle cx={x} cy={y} r={3} fill="#ff7a1a" opacity="0.7" />
              <circle cx={x} cy={y} r={16} fill="url(#nodeGlow)" />
            </g>
          );
        })
      )}
    </svg>
  );
}


