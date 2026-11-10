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
          50: '#E7F5F1', 100: '#D3EEE7', 200: '#A8DDD2',
          300: '#79CDBD', 400: '#42B8A6', 500: '#167D72',
          600: '#12685F', 700: '#10554E', 800: '#103B35', 900: '#092A26',
        },
        blue: {
          50: '#E7F5F1', 100: '#D3EEE7', 200: '#A8DDD2',
          300: '#79CDBD', 400: '#42B8A6', 500: '#167D72',
          600: '#12685F', 700: '#10554E', 800: '#103B35', 900: '#092A26',
          950: '#061F1C',
        },
      },
      boxShadow: {
        soft: "0 2px 10px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
}

