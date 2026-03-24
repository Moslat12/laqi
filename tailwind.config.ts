import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // لاقي Brand Colors
        'laqi-dark': '#0a0a0f',
        'laqi-darker': '#06060a',
        'laqi-card': '#12121a',
        'laqi-border': '#1e1e2e',
        'laqi-neon': '#00ff88',
        'laqi-neon-dim': '#00cc6a',
        'laqi-neon-glow': '#00ff8833',
        'laqi-purple': '#a855f7',
        'laqi-blue': '#3b82f6',
        'laqi-yellow': '#fbbf24',
        'laqi-red': '#ef4444',
        'laqi-text': '#e2e8f0',
        'laqi-muted': '#94a3b8',
      },
      fontFamily: {
        'arabic': ['Tajawal', 'IBM Plex Sans Arabic', 'sans-serif'],
        'qahwa': ['QahwaArabic', 'Tajawal', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 255, 136, 0.1)',
        'neon-sm': '0 0 10px rgba(0, 255, 136, 0.2)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
