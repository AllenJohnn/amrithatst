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
          // Charcoal / Graphite foundation
          black: "#08090B",   // Background
          dark: "#0D0F12",    // Primary surface
          card: "#111418",    // Secondary surface
          cardHover: "#16191E", // Elevated surface
          
          // Borders
          border: "#23272D",  
          borderHigh: "#2D323A", 
          borderSubtle: "#1B1E23",
          
          // Semantic Colors (Muted, professional)
          cyan: "#AEB99A",    // Primary accent (Muted sage) - keeping 'cyan' key to avoid massive refactoring but it's sage now
          blue: "#8799B5",    // Info (Muted blue)
          indigo: "#8799B5",  // Re-mapped to info
          violet: "#A19EBA",  // Muted purple
          
          // Status
          mint: "#7FA889",    // Success (Muted green)
          danger: "#C87878",  // Threat (Muted red)
          warning: "#C6A86A", // Suspicious (Muted amber)
          
          // Text
          white: "#F1F2F4",   // Primary text
          muted: "#A0A5AE",   // Secondary text
          dim: "#656B74",     // Muted text
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
      },
      boxShadow: {
        'panel': '0 2px 8px -2px rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'modal': '0 8px 32px -4px rgba(0, 0, 0, 0.6), 0 4px 16px -2px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
