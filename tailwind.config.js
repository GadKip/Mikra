/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        text: 'var(--text)',
        secondary: 'var(--secondary)',
        card: 'var(--card)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
}

