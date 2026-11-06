/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0c0d12',
          surface: '#12141c',
          panel: '#161824',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        cream: {
          bg: '#faf8f5',
          card: '#f4efe6',
          border: '#e6ded1',
          text: '#1c1917',
          muted: '#57534e',
        },
        dusk: {
          pink: '#f4a7b9',
          peach: '#fbc4ab',
          blue: '#1e2640',
          accent: '#e29578',
        },
        navy: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          500: '#4F6BED',
          700: '#1E3A8A',
          800: '#1e2640',
          900: '#12141c',
          950: '#0c0d12',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        prose: '72ch',
      },
      animation: {
        'cloud-drift': 'cloudDrift 45s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float-window': 'floatWindow 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        cloudDrift: {
          '0%': { transform: 'scale(1.05) translate(0px, 0px)' },
          '100%': { transform: 'scale(1.08) translate(-15px, -8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatWindow: {
          '0%': { opacity: '0', transform: 'translateY(24px) rotateX(10deg) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotateX(6deg) scale(1)' },
        },
      }
    }
  },
  plugins: [],
}
