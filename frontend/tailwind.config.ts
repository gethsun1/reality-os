import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Sora', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'electric-orange': {
          DEFAULT: '#FF7A1A',
          strong: '#FF5C00',
        },
        'digital-pink': {
          DEFAULT: '#FF3FAF',
          strong: '#FF2B8C',
        },
        violet: {
          deep: '#0b0424',
          dusk: '#1b123b',
          neon: '#7d6bff',
        },
        slate: {
          bg: '#060914',
          card: 'rgba(255,255,255,0.04)',
          stroke: 'rgba(255,255,255,0.08)',
        },
      },
      borderRadius: {
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
      },
      boxShadow: {
        glow: '0 10px 50px rgba(255,124,40,0.25)',
        glass: '0 20px 60px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at 20% 20%, rgba(255,124,40,0.18), transparent 35%), radial-gradient(circle at 80% 10%, rgba(255,63,175,0.18), transparent 35%), linear-gradient(135deg, #0b0424 0%, #120a2f 40%, #1b123b 100%)',
        'cta-gradient': 'linear-gradient(120deg, #FF7A1A, #FF3FAF)',
        'cta-gradient-strong': 'linear-gradient(120deg, #FF5C00, #FF2B8C)',
      },
      spacing: {
        'section-sm': '24px',
        'section': '32px',
        'section-lg': '48px',
      },
      blur: {
        glass: '24px',
        modal: '30px',
      },
      animation: {
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'gradient-sweep': 'gradient-sweep 8s ease infinite',
        'beam-scan': 'beam-scan 2.2s ease-in-out infinite',
        'waveform': 'waveform 2.6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%,100%': { opacity: 0.85, filter: 'drop-shadow(0 0 12px rgba(255,124,40,0.35))' },
          '50%': { opacity: 1, filter: 'drop-shadow(0 0 20px rgba(255,63,175,0.4))' },
        },
        'gradient-sweep': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'beam-scan': {
          '0%': { transform: 'translateX(-30%)', opacity: 0.3 },
          '50%': { transform: 'translateX(0%)', opacity: 0.65 },
          '100%': { transform: 'translateX(30%)', opacity: 0.3 },
        },
        waveform: {
          '0%,100%': { clipPath: 'inset(5% 0 0 0)' },
          '50%': { clipPath: 'inset(0 0 5% 0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

