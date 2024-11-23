/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: '#2c3e50',
          hover: '#34495e',
        },
        header: {
          DEFAULT: '#3498db',
        },
      },
    },
  },
  plugins: [],
};