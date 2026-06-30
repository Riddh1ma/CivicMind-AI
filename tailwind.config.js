/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        cardBg: "rgba(255, 255, 255, 0.03)",
        cardBorder: "rgba(255, 255, 255, 0.08)",
        primary: {
          DEFAULT: "#2563EB", // Royal Blue
          hover: "#1D4ED8",
          glow: "rgba(37, 99, 235, 0.15)",
        },
        secondary: {
          DEFAULT: "#8B5CF6", // Purple
          hover: "#7C3AED",
          glow: "rgba(139, 92, 246, 0.15)",
        },
        accent: {
          DEFAULT: "#10B981", // Emerald
          hover: "#059669",
          glow: "rgba(16, 185, 129, 0.15)",
        },
        darkGray: "#18181B",
        mutedGray: "#71717A",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: 0.8, filter: 'drop-shadow(0 0 15px rgba(37, 99, 235, 0.3))' },
          '50%': { opacity: 1, filter: 'drop-shadow(0 0 25px rgba(139, 92, 246, 0.5))' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 8px 32px 0 rgba(37, 99, 235, 0.1)',
      },
      backdropBlur: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
}
