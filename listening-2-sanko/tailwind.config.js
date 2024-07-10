/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontface: {
        'cinema': ['Cinema', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

