/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#080B11",   // Deep Obsidian Void
          dark: "#0C111D",    // Polished Slate Panel
          card: "#111726",    // Elevated Glass Card
          cardHover: "#161F33",
          border: "#1E293B",  // Crisp Slate Border
          green: "#00F2FE",   // Vibrant Electric Cyan
          cyan: "#00F2FE",    // Primary Radiant Cyan
          blue: "#38BDF8",    // Sky Blue
          indigo: "#6366F1",  // Electric Indigo Accent
          violet: "#8B5CF6",  // AI Radar Violet
          mint: "#00F59B",    // Luminous Safe Mint
          muted: "#94A3B8",   // Clean Slate 400 Text
          dim: "#64748B",     // Subtle Muted Slate 500
          danger: "#FF2E63",  // High-Voltage Threat Crimson
          warning: "#FFB703", // Radiant Caution Amber
        },
      },
      backgroundImage: {
        'cyan-blue': 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)',
        'violet-cyan': 'linear-gradient(135deg, #8B5CF6 0%, #00F2FE 100%)',
        'threat-gradient': 'linear-gradient(135deg, #FF2E63 0%, #FF5E7E 100%)',
        'safe-gradient': 'linear-gradient(135deg, #00F59B 0%, #00D287 100%)',
      },
      boxShadow: {
        glow: "0 0 25px rgba(0, 242, 254, 0.22)",
        'glow-lg': "0 0 40px rgba(0, 242, 254, 0.35)",
        'glow-violet': "0 0 30px rgba(139, 92, 246, 0.25)",
        'glow-danger': "0 0 30px rgba(255, 46, 99, 0.35)",
        'glow-mint': "0 0 30px rgba(0, 245, 155, 0.30)",
      },
    },
  },
  plugins: [],
};
