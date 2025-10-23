/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        tamil: ['Noto Sans Tamil', 'Lohit Tamil', 'Tamil MN', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
