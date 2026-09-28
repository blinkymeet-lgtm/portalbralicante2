/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        'brand-navy': {
          50: '#f0f4f9',
          100: '#d9e2ef',
          200: '#b3c5df',
          300: '#8da8cf',
          400: '#5e7db0',
          500: '#3a5a91',
          600: '#2d4675',
          700: '#243759',
          800: '#1a2a44',
          900: '#0f1c33',
          950: '#0a1426',
        },
        'brand-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          DEFAULT: '#16a34a',
          dark: '#15803d',
        },
        'brand-yellow': {
          400: '#facc15',
          500: '#eab308',
        },
        'brand-red': {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(15, 28, 51, 0.06)',
        'card': '0 4px 20px -4px rgba(15, 28, 51, 0.08)',
        'card-hover': '0 8px 30px -4px rgba(15, 28, 51, 0.12)',
      },
    },
  },
  plugins: [],
};
