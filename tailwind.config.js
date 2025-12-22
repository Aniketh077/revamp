/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"FF Nort"', 'system-ui', '-apple-system', 'sans-serif'],
        nort: ['"FF Nort"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          black: '#000000',
          white: '#FFFFFF',
          gray: '#86868b',
          light: '#f5f5f7',
          orange: '#e07742',
          green: '#057210',
          blue: '#1406b3',
          purple: '#702594',
        }
      },
      letterSpacing: {
        tightest: '-0.035em',
        tighter: '-0.02em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-orange': 'linear-gradient(135deg, #000000 0%, #e07742 100%)',
        'gradient-blue': 'linear-gradient(135deg, #000000 0%, #1406b3 100%)',
        'gradient-purple': 'linear-gradient(135deg, #000000 0%, #702594 100%)',
      },
      animation: {
        blob: 'blob 7s infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
