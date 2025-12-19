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
          DEFAULT: '#00c9a7', // Wag-like teal
          dark: '#009e82',
          light: '#e0f7f4',
          accent: '#ff6b6b', // Coral accent
        },
        leaf: {
          DEFAULT: '#4ade80', // Vibrant Green
          dark: '#16a34a',
          light: '#dcfce7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
