/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
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
        'ezra': ['"Ezra SIL SR"', 'serif'],
        'guttman': ['"Guttman Keren"', 'sans-serif'],
        'david': ['David', 'sans-serif'],
        'davidbd': ['DavidBD', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem', // 10px
      },
    },
  },
  plugins: [],
}

