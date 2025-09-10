/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cosmic Fantasy Color Palette
        cosmic: {
          purple: '#6B46C1',    // Main purple
          blue: '#1E40AF',      // Deep blue
          cyan: '#0891B2',      // Bright cyan
          teal: '#0D9488',      // Teal accent
          gold: '#F59E0B',      // Gold highlights
          silver: '#9CA3AF',    // Silver text
          rose: '#EC4899',      // Rose accent
          emerald: '#10B981',   // Success green
          dark: '#111827',      // Dark background
          gray: '#374151',      // Medium gray
          light: '#F9FAFB',     // Light text
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          'from': { boxShadow: '0 0 5px #6B46C1, 0 0 10px #6B46C1, 0 0 15px #6B46C1' },
          'to': { boxShadow: '0 0 10px #6B46C1, 0 0 20px #6B46C1, 0 0 30px #6B46C1' }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
