/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f8',
          100: '#d6e0ee',
          200: '#adc1dd',
          300: '#84a2cc',
          400: '#5b83bb',
          500: '#3a65a0',
          600: '#264a7d',
          700: '#1b345a',
          800: '#11213b',
          900: '#0a1526',
          950: '#060d17',
        },
        gold: {
          50: '#fdf8ec',
          100: '#faedc7',
          200: '#f5db8f',
          300: '#f0c757',
          400: '#e9b52f',
          500: '#d69b1e',
          600: '#b37a17',
          700: '#8c5c16',
          800: '#734a18',
          900: '#623d19',
        },
        teal: {
          50: '#eefbfa',
          100: '#d2f4f1',
          200: '#a9e8e3',
          300: '#75d4cd',
          400: '#43b7b0',
          500: '#2a9a94',
          600: '#217b78',
          700: '#1f6462',
          800: '#1e5150',
          900: '#1c4443',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Open Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
