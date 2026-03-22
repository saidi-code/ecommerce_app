/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        accent: "#FF6347",
        primary: "#111111",

        secondary: "#666666",
        inactive: "#CDCDE0",
        background: "#FFFFFF",
        surface: "#F7F7F7",

        border: "#EEEEEE",
        error: "#FF4444",
      },
    },
  },
  plugins: [],
};
