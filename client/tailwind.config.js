/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-200" : "#1C1F29",
        "primary-100" : "#74D4FF",
        "secondary-200" : "#00b050",
        "secondary-100" : "#0b1a78",
      }
    },
  },
  plugins: [],
}

