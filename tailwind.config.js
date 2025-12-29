/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./client/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#ff5200',
          red: '#e23744',
          yellow: '#f5cd47',
          dark: '#1c1c24',
        }
      }
    },
  },
  plugins: [],
}




