/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dbe4fe',
          200: '#bfcffe',
          300: '#93b0fd',
          400: '#6088fa',
          500: '#3b62f6',
          600: '#2544eb',
          700: '#1d32d8',
          800: '#1e2bb0',
          900: '#1e298a',
          950: '#171c54',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
