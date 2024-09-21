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
          "50": "#f2f4fe",
          "100": "#e4e9fd",
          "200": "#c9d3fb",
          "300": "#afbef8",
          "400": "#94a8f6",
          "500": "#7992f4",
          "600": "#6175c3",
          "700": "#495892",
          "800": "#303a62",
          "900": "#181d31"
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

