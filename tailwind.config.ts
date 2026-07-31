import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F1EDE4',
        ink: '#232220',
        ochre: '#B8842E',
        'ochre-dark': '#8F6620',
        teal: '#2F4F4B',
        line: '#DDD5C7',
        danger: '#A83B32',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
