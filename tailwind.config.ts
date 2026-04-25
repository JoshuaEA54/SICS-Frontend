import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1d4ed8',
          hover: '#1e40af',
          light: '#eff4ff',
          muted: '#dbeafe',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f0ede7',
          bg: '#faf8f4',
        },
        border: {
          DEFAULT: '#ddd8ce',
          light: '#eae8e2',
        },
        text: {
          primary: '#1a1a2e',
          secondary: '#6b6b80',
          muted: '#9a9aaa',
          subtle: '#5a5a70',
          dim: '#44445a',
        },
        teal: {
          DEFAULT: '#0d9488',
          light: '#f0fdf9',
          border: '#99f0d8',
          muted: '#ccfbf1',
          dark: '#0f766e',
        },
        amber: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
          border: '#fcd34d',
          dark: '#b45309',
          brown: '#78350f',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      boxShadow: {
        card: '0px 2px 16px 0px rgba(26,26,46,0.05)',
        'card-md': '0px 4px 12px rgba(26,26,46,0.07)',
        'card-lg': '0px 4px 20px rgba(26,26,46,0.08)',
        button: '0px 2px 6px rgba(29,78,216,0.22)',
        'button-sm': '0px 2px 4px rgba(29,78,216,0.2)',
      },
    },
  },
  plugins: [],
}

export default config
