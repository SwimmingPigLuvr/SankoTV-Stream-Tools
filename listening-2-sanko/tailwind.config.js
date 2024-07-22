/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'amsterdam': ['Amsterdam', 'sans-serif'],
        'amsterdam-display': ['Amsterdam-Display', 'sans-serif'],
        'anthem': ['Anthem', 'sans-serif'],
        'cinema': ['Cinema', 'sans-serif'],
        'coolfont': ['Coolfont', 'sans-serif'],
        'coolfont-ball': ['Coolfont-Ball', 'sans-serif'],
        'coolfont-pixel': ['Coolfont-Pixel', 'sans-serif'],
        'coolfont-pix-outlined': ['Coolfont-Pix-Outlined', 'sans-serif'],
        'coolfont-trippy': ['Coolfont-Trippy', 'sans-serif'],
        'sunny': ['Sunny', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

