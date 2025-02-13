/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        customBlack: "#000000",
        customGray: "#4A4A4A",
        customWhite: "#FFFFFF",
      },
      backgroundImage: {
        'custom-gradient': "linear-gradient(to bottom, #000000, #4A4A4A, #FFFFFF)",
      },
    },
  },
  plugins: [],
};
