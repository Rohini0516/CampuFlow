/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Peach Pink Palette
        peach: {
          50: '#FFF5F1',
          100: '#F0D9D5',
          200: '#FFD6C9',
          300: '#EFA7B5',
          400: '#D9828B',
          500: '#F4A6A6',
          600: '#E27B88',
          700: '#A95763',
          800: '#7E3B46',
          900: '#52222A',
          950: '#2D2526',
        },
        // Re-map brand to Peach Pink so existing brand-* utility classes inherit peach pink theme
        brand: {
          50: '#FFF5F1',
          100: '#F0D9D5',
          200: '#FFD6C9',
          300: '#EFA7B5',
          400: '#D9828B',
          500: '#F4A6A6',
          600: '#E27B88',
          700: '#A95763',
          800: '#7E3B46',
          900: '#52222A',
          950: '#2D2526',
        },
        roseAccent: {
          light: '#FFD6C9',
          DEFAULT: '#D9828B',
          dark: '#A95763',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'peach-sm': '0 2px 8px -2px rgba(244, 166, 166, 0.2)',
        'peach-md': '0 8px 24px -6px rgba(244, 166, 166, 0.25)',
        'peach-lg': '0 16px 32px -8px rgba(169, 87, 99, 0.2)',
      }
    },
  },
  plugins: [],
}
