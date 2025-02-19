/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    daisyui: {
      themes: [ "aqua","dim","dark","cyberpunk","valentine"],
    },
  },
  plugins: [require("daisyui")],
};
