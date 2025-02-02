/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class', // Add this line
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        text: 'var(--text)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        card: 'var(--card)',
        border: 'var(--border)',
      },
      fontFamily: {
        'ezra': ['"Ezra SIL SR"'],
        'guttman': ['"Guttman Keren"'],
        'david': ['David'],
        'davidbd': ['DavidBD'],
      }
    },
  },
  plugins: [],
}

