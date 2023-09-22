import { fontFamily as defaultFontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Rubik',
          ...defaultFontFamily.sans,
        ]
      }
    }
  },
  plugins: [],
  darkMode: ['class', '[data-theme="dark"],[data-theme="night"]'],
}

