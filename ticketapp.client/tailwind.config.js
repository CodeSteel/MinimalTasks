/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          "50": "#f1e9ff",
          "100": "#e3d2ff",
          "200": "#c7a5ff",
          "300": "#ac79ff",
          "400": "#904cff",
          "500": "#741fff",
          "600": "#5d19cc",
          "700": "#461399",
          "800": "#2e0c66",
          "900": "#170633",
          "950": "#0d031c"
        },
        "true-gray": {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
    },
  },
  plugins: [],
}

