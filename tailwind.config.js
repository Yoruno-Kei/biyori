module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
// tailwind.config.js
theme: {
  extend: {
    animation: {
      'bounce-fast': 'bounce 0.5s',
      'drop': 'drop 0.4s',
    },
    keyframes: {
      drop: {
        '0%': { transform: 'translateY(-40px)' },
        '100%': { transform: 'translateY(0)' },
      },
    },
  },
},
  plugins: [],
};
