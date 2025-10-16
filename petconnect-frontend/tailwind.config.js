/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#72BD92',
          green: '#1b5e20',
          leaf: '#2e7d32',
          meadow: '#43a047',
          sky: '#87ceeb',
          sand: '#f1e5c6',
          bark: '#5d4037',
          dusk: '#37474f',
          night: '#0f172a',
          moss: '#3b7f58'
        }
      },
      fontFamily: {
        display: ['ui-sans-serif','system-ui','Segoe UI','Roboto','Helvetica Neue','Arial','Noto Sans','sans-serif'],
        body: ['ui-sans-serif','system-ui','Segoe UI','Roboto','Helvetica Neue','Arial','Noto Sans','sans-serif']
      },
      boxShadow: {
        soft: '0 10px 25px rgba(0,0,0,0.08)'
      },
      backgroundImage: {
        'paw-pattern': "radial-gradient(rgba(27,94,32,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        'paw': '20px 20px',
      }
    },
  },
  plugins: [],
}


