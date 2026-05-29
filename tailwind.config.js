/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#131313',
        surface: '#1c1b1b',
        primary: '#adc6ff',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#c2c6d6',
        outline: '#424754',
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        heading: ['"Geist"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      spacing: {
        section: '120px',
      },
      fontSize: {
        'headline-xl': ['56px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'body-lg': ['18px', { lineHeight: '1.65' }],
      },
      borderRadius: {
        sm: '4px',
      },
    },
  },
  plugins: [],
};
