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
          50:  "#f5f9ff",
          100: "#e0edff",
          200: "#bcd9ff",
          300: "#8abaff",
          400: "#5394ff",
          500: "#2970ff",  // main
          600: "#1d58e0",  // hover
          700: "#1847b3",
          800: "#163d91",
          900: "#142f70",
        },
      },
      boxShadow: {
        soft: "0 2px 10px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
}

