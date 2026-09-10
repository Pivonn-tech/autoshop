/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--bg-color)',
        'brand-secondary': 'var(--text-color)',
        'brand-accent': 'var(--accent-color)',
        'brand-muted': 'var(--color-muted)',
      },
    },
  },
  plugins: [],
};
