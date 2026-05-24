/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#05081d",
        deepblue: "#09153b",
        sapphire: "#1f5eff",
        periwinkle: "#8da2ff",
        lavender: "#d39cff",
        ice: "#d8f7ff",
        aqua: "#5de2e7",
        blush: "#ffc7e8",
        champagne: "#ffe8b6"
      },
      boxShadow: {
        glow: "0 0 10px rgba(141, 162, 255, 0.14)",
        lavender: "0 0 14px rgba(211, 156, 255, 0.14)",
        ice: "0 0 10px rgba(216, 247, 255, 0.1)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"]
      }
    }
  },
  plugins: []
};
