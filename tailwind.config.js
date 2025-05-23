/** @type {import('tailwindcss').Config} */

const { colors } = require("./src/Theme/Theme");

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        Primary: `${colors.primary}`,
        Secondary: `${colors.secondary}`,
      },
    },
  },
  plugins: [],
};
