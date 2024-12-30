/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', ],
  theme: {
      extend: {
          colors: {
              blue: {
                  500: '#1E3A8A',
                  700: '#1E40AF',
              },
          },
          transitionTimingFunction: {
              smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
          },
      },
  },
  plugins: [],
};
