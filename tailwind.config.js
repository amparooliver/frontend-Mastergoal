// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: { // Add this section
        '13': '3.25rem', // Defines w-13, h-13, p-13, m-13 etc. as 52px
      },
      fontFamily: {
        'oswald': ['Oswald', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      letterSpacing: {
        '1p': '0.01em',
      }
    },
  },
  plugins: [],
}