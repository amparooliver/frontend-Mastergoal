/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'size-pulse': 'sizePulse 1.5s infinite ease-in-out',
      },
      keyframes: {
        sizePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
      fontSize: {
        '10xl': '10rem',  // 160px
        '11xl': '12rem',  // 192px
        '12xl': '14rem',  // 224px
        '1.7xl': '1.7rem',
        '1.5xl': '1.5rem',
        '1.3xl': '1.3rem',
      },
      letterSpacing: {
        'tighter-plus': '-0.05em',
        'wide-mini': '0.01em',
        'wide-plus': '0.05em',
      },
      fontFamily: {
        bebas: ["Bebas Neue", "sans-serif"], // Add Bebas Neue here
      },
    },
  },
  plugins: [],
};
