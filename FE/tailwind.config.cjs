/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        brick: {
          DEFAULT: '#B33A2B',
          light: '#C94D3E',
          dark: '#8A2D21'
        },
        // Earth tones
        earth: {
          DEFAULT: '#6B4F3A',
          light: '#8B6F5A',
          dark: '#4B3525'
        },
        // Cream/beige
        cream: {
          DEFAULT: '#F5E6D3',
          light: '#FBF5ED',
          dark: '#E8D4BC'
        },
        // Cement gray
        cement: {
          DEFAULT: '#D1D1D1',
          light: '#E8E8E8',
          dark: '#A8A8A8'
        },
        // Gold accent
        gold: {
          DEFAULT: '#C9A14A',
          light: '#D9B85A',
          dark: '#A8843A'
        },
        // Legacy color
        orange: '#ee4d2d'
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-bg.jpg')",
        'cta-pattern': "url('/images/cta-bg.jpg')"
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: '1280px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        }
      })
    }),
    require('@tailwindcss/line-clamp')
  ]
}
