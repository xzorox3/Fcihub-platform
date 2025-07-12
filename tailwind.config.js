/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "../node_modules/flowbite",
  ],
  safelist: [
    // Department gradient colors
    'from-orange-500',
    'to-orange-600',
    'from-teal-500',
    'to-teal-600',
    'from-blue-600',
    'to-blue-700',
    'from-blue-500',
    'to-blue-600',
    'from-green-500',
    'to-green-600',
    'from-green-600',
    'to-green-700',
    // Background gradients
    'bg-gradient-to-br',
    'bg-gradient-to-r',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E88E5',
        darkblue: '#001A4F',
        accent: '#48A8EE',
        lightblue: '#90CAF9',
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "bounce-slow": "bounce 2s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      boxShadow: {
        "3xl": "0 35px 60px -12px rgba(0, 0, 0, 0.25)",
        glow: "0 0 20px rgba(59, 130, 246, 0.5)",
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.5)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwindcss-animate")],
};
