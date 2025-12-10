"use client";

export function ScanningBeam() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 120,
        borderRadius: 16,
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, rgba(255,124,40,0.06), rgba(255,63,175,0.06)), radial-gradient(circle at 50% 50%, rgba(255,63,175,0.18), transparent 55%)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), rgba(255,124,40,0.16), transparent)',
          transform: 'translateX(-40%)',
          animation: 'beam-scan 2.3s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 14px)',
        }}
      />
    </div>
  );
}


