/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'sky-blue': {
          '50': '#f0f9ff', '100': '#e0f2fe', '200': '#bae6fd',
          '300': '#7dd3fc', '400': '#38bdf8', '500': '#0ea5e9',
          '600': '#0284c7', '700': '#0369a1', '800': '#075985',
          '900': '#0c4a6e',
        },
        'teal-green': {
          '50': '#f0fdfa', '100': '#ccfbf1', '200': '#99f6e4',
          '300': '#5eead4', '400': '#2dd4bf', '500': '#14b8a6',
          '600': '#0d9488', '700': '#0f766e', '800': '#115e59',
          '900': '#134e4a',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      backgroundColor: {
        'dark-primary': '#1a1a1a',
        'dark-secondary': '#2d2d2d',
        'dark-tertiary': '#404040',
      },
      textColor: {
        'dark-primary': '#ffffff',
        'dark-secondary': '#e5e5e5',
        'dark-tertiary': '#cccccc',
      },
      maxWidth: {
        '8xl': '90rem',
      }
    },
  },
  plugins: [],
} 
 