/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fontFamily } = require('tailwindcss/defaultTheme')
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: '380px',
      },
      // font sizes
      fontSize: {
        '3xs': '0.5rem',
        '2xs': '0.625rem',
      },
      animation: {
        float: 'float 2s ease infinite',
        floatDelay: 'float 2s ease infinite 1s',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5%)' },
        },
      },
      colors: {
        brand: {
          900: '#101624',
          800: '#192137',
          700: '#212C49',
          DEFAULT: '#29375B',
          500: '#465B81',
          400: '#6480A7',
          300: '#A7BFDC',
          200: '#C0D2E6',
          100: '#DBE4EE',
          50: '#EDF2F7',
        },
        secondary: {
          900: '#EDC052',
          800: '#FFC857',
          700: '#FED162',
          DEFAULT: '#FCD95B',
          500: '#FCDD6B',
          400: '#FDE17C',
          300: '#FDE48C',
          200: '#FEECAD',
          100: '#FEF4CE',
          50: '#FFFBEF',
        },
        black: {
          DEFAULT: '#000000',
        },
        white: {
          DEFAULT: '#FFFFFF',
        },
        gray: {
          DEFAULT: '#C4C4C4',
        },
        error: {
          dark: '#E11D48',
          DEFAULT: '#FB7185',
          light: '#FFF1F2',
        },
        warning: {
          dark: '#E6B44E',
          DEFAULT: '#FFCD66',
          light: '#FFEBC2',
        },
        success: {
          dark: '#0D9488',
          DEFAULT: '#2DD4BF',
          light: '#F0FDFA',
        },
      },
      fontFamily: {
        sans: ['var(--font-quicksand)', ...fontFamily.sans],
        quicksand: ['var(--font-quicksand)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
}
