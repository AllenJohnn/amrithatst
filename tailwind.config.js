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
          black: "#090909",       // Background
          dark: "#0F0F0F",        // Primary surface
          card: "#141414",        // Secondary surface
          cardHover: "#191919",   // Elevated surface
          cardActive: "#1E1E1E",  // Hover surface
          
          border: "#282828",      // Primary border
          borderSubtle: "#202020",// Subtle border
          
          accent: "#B5C69A",      // Primary accent (Muted sage)
          
          success: "#83A783",     // Semantic: Safe / Success
          warning: "#C3A467",     // Semantic: Warning / Suspicious
          danger: "#C77B7B",      // Semantic: Danger / Phishing
          info: "#8E9995",        // Semantic: Info
          
          white: "#F3F3EE",       // Primary text
          muted: "#A6A69F",       // Secondary text
          dim: "#70706A",         // Muted text
          veryDim: "#4D4D49",     // Very muted
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
