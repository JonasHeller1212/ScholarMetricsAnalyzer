/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          start: '#019DD4',
          end: '#E84E10',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #019DD4, #E84E10)',
      },
    },
  },
  plugins: [],
};