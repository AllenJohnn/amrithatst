/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        cyber: {
          black: "#02040A",   // Deeper than slate-950
          dark: "#080C16",    // App shell background
          card: "#0D1321",    // Surface level 1
          cardHover: "#121A2D", // Surface hover
          border: "#1E293B",  // Borders
          borderHigh: "#334155", // Hover borders
          
          // Accent colors
          cyan: "#00E5FF",    // Primary interactive
          blue: "#0070F3",    // Vercel blue
          indigo: "#6366F1",  // Subtle highlights
          violet: "#8B5CF6",  // AI/Machine Learning cues
          
          // Semantic
          mint: "#10B981",    // Safe / Green
          muted: "#94A3B8",   // Secondary text
          dim: "#475569",     // Disabled/Subtle text
          danger: "#F43F5E",  // Threat/Red
          warning: "#F59E0B", // Suspicious/Amber
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #00E5FF 0%, #0070F3 100%)',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glow-sm': '0 0 15px -3px var(--tw-shadow-color)',
        'glow-md': '0 0 25px -5px var(--tw-shadow-color)',
        'glow-lg': '0 0 40px -10px var(--tw-shadow-color)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
};
