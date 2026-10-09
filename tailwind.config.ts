import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f1012',
          surface: '#17191d',
          card: '#1e2126',
          border: '#2c313a',
          muted: '#8e96a4',
          accent: '#c89d66', // warm brass/honey wood
          accentHover: '#b58952',
          walnut: '#4a3424',
          sheesham: '#6c3b20',
          resin: '#0e7490', // ocean cyan-blue
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
