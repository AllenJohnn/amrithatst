/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
          black: "var(--color-bg)",       // Background
          dark: "var(--color-surface-1)",        // Primary surface
          card: "var(--color-surface-2)",        // Secondary surface
          cardHover: "var(--color-surface-3)",   // Elevated surface
          cardActive: "var(--color-surface-4)",  // Hover surface
          
          border: "var(--color-border)",      // Primary border
          borderSubtle: "var(--color-border-subtle)",// Subtle border
          
          accent: "rgb(var(--color-accent) / <alpha-value>)",      // Primary accent
          
          success: "rgb(var(--color-safe) / <alpha-value>)",     // Semantic: Safe / Success
          warning: "rgb(var(--color-warning) / <alpha-value>)",     // Semantic: Warning / Suspicious
          danger: "rgb(var(--color-danger) / <alpha-value>)",      // Semantic: Danger / Phishing
          info: "var(--color-text-dim)",        // Semantic: Info
          
          white: "var(--color-text-primary)",       // Primary text
          textMuted: "var(--color-text-muted)",   // Secondary text alias
          muted: "var(--color-text-muted)",       // Secondary text
          dim: "var(--color-text-dim)",         // Muted text
          veryDim: "var(--color-text-very-dim)",     // Very muted
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
