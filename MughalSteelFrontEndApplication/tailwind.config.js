/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#070b12',        // Deep Black Navy
          navy: '#0c1322',        // Dark Navy base
          medium: '#111a2e',      // Panel / card background
          light: '#1e293b',       // Steel Slate Border & divider
          steel: '#334155',       // Steel Gray secondary
          'steel-light': '#64748b',
          gold: '#c5a880',        // Metallic Gold accent
          'gold-dark': '#a68a62',  // Darker gold shade for hover states
          'gold-light': '#e2d5c3',
          'gold-metallic': '#d4af37',
          stone: '#FAF9F6',
          'stone-medium': '#E7E5E4',
          'stone-dark': '#44403C'
        }
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'premium-gold': '0 10px 30px -10px rgba(197, 168, 128, 0.3)',
        'premium-hover': '0 30px 60px -15px rgba(197, 168, 128, 0.2)',
        'glow-gold': '0 0 25px rgba(197, 168, 128, 0.35)',
      },
    },
  },
  plugins: [],
}
