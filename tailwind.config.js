/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 0.1 },
        }
      },
      colors: {
        'wis-blue': {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#C0DFFF',
          300: '#80BFFF',
          400: '#4097FD',
          500: '#0070F3',
          600: '#005CCB',
          700: '#00489F',
          800: '#003473',
          900: '#001F47',
        },
        'wis-gold': {
          100: '#FFF7E6',
          200: '#FFE8B3',
          300: '#FFD980',
          400: '#FFCB4D',
          500: '#FFBC1A',
          600: '#E6A800',
          700: '#B38300',
          800: '#805E00',
          900: '#4D3800',
        },
        'wis-silver': {
          100: '#F8F9FA',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#6C757D',
          700: '#495057',
          800: '#343A40',
          900: '#212529',
        },
        'wis-bronze': {
          100: '#FFEEE6',
          200: '#FFD6C2',
          300: '#FFBE9E',
          400: '#FFA67A',
          500: '#FF8E56',
          600: '#E67040',
          700: '#B35431',
          800: '#803C23',
          900: '#4D2415',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'Montserrat', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
} 