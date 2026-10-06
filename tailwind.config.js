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
        sage: {
          50: '#f4f6f4',
          100: '#e5e9e4',
          200: '#cbd4c8',
          300: '#a7b6a2',
          400: '#83987d',
          500: '#667d60',
          600: '#4f624a',
          700: '#404f3d',
          800: '#344032',
          900: '#2b342a',
          950: '#161c16',
        },
        cyber: {
          black: "#090909",       // Background
          dark: "#0F0F0F",        // Primary surface
          card: "#141414",        // Secondary surface
          cardHover: "#191919",   // Elevated surface
          cardActive: "#1E1E1E",  // Hover surface
          
          border: "#1F1F1F",      // Primary border
          borderSubtle: "#202020",// Subtle border
          
          accent: "#a7b6a2",      // Primary accent
          
          success: "#4ade80",     // Semantic: Safe / Success
          warning: "#fbbf24",     // Semantic: Warning / Suspicious
          danger: "#f87171",      // Semantic: Danger / Phishing
          info: "#9ca3af",        // Semantic: Info
          
          white: "#F2F2F2",       // Primary text
          textMuted: "#888888",   // Secondary text alias
          muted: "#888888",       // Secondary text
          dim: "#666666",         // Muted text
          veryDim: "#444444",     // Very muted
        },
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '6px',
        'md': '6px',
        'lg': '8px',
        'xl': '10px',
        '2xl': '12px',
        '3xl': '16px',
        'full': '9999px',
      }
    },
  },
  plugins: [],
};
