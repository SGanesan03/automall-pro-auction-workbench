/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        plum: {
          950: '#1D0C2E',
          900: '#2E054E',
          800: '#45126E',
          700: '#631D9B',
          100: '#F5EEFA',
          50: '#FAF6FD',
        },
        coral: {
          500: '#ED264F',
          600: '#D11B40',
          50: '#FFF1F4',
        },
      },
    },
  },
  plugins: [],
};
