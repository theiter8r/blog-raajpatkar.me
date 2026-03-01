import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        mono: ['var(--font-jetbrains)', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          bg: '#FAF9F7',
          'bg-dark': '#1C1917',
          surface: '#F5F0EB',
          'surface-dark': '#292524',
          card: '#FFFFFF',
          'card-dark': '#1C1917',
          text: '#1C1917',
          'text-dark': '#F5F5F4',
          muted: '#78716C',
          'muted-dark': '#A8A29E',
          accent: '#D97706',
          'accent-dark': '#F59E0B',
          border: '#E7E5E4',
          'border-dark': '#44403C',
          hover: '#F5F0EB',
          'hover-dark': '#292524',
        },
      },
      lineHeight: {
        'relaxed-body': '1.8',
      },
      maxWidth: {
        'content': '680px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
