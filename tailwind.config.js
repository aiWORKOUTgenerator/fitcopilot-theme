module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    // Animation classes that might be added dynamically
    'animate-fade-in',
    'animate-fade-slide-up',
    'opacity-0',
    'opacity-100',
    'invisible',
    'visible',
    // Feature-specific classes that might be dynamically applied
    'from-lime-300',
    'to-emerald-400',
    'from-cyan-300',
    'to-blue-400',
    'from-violet-300',
    'to-purple-400',
    'from-amber-300',
    'to-orange-400',
    // Dynamic variant styles
    'lime-glow',
    'cyan-glow',
    'violet-glow',
    'amber-glow',
    // Tooltip classes
    'tooltip-top',
    'tooltip-bottom',
    'tooltip-left',
    'tooltip-right',
  ],
  theme: {
    extend: {
      colors: {
        lime: {
          300: '#a3e635',
          400: '#84cc16',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
        },
        gray: {
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
        },
        rose: {
          500: '#f43f5e',
        },
        violet: {
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        citron: '#ddff0e'
      },
      boxShadow: {
        'optimized': '0 4px 10px rgba(0, 0, 0, 0.1)',
        'optimized-hover': '0 10px 25px rgba(0, 0, 0, 0.2)',
        'lime': '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -4px rgba(132, 204, 22, 0.1)',
      },
      animation: {
        'draw-line': 'drawLine 2.5s ease-out forwards',
        'point-fade': 'pointFade 0.5s ease-out forwards',
        'heartbeat': 'heartbeat 1s ease-in-out infinite',
        'heart-pulse': 'heartPulse 1s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'progress': 'progress 5s linear forwards',
        'float': 'float 8s ease-in-out infinite',
        'pulse-citron': 'pulseCitron 3s ease-in-out infinite'
      },
      keyframes: {
        drawLine: {
          '0%': { strokeDashoffset: '240' },
          '100%': { strokeDashoffset: '0' }
        },
        pointFade: {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' }
        },
        heartPulse: {
          '0%': { filter: 'drop-shadow(0 0 2px rgba(244,63,94,0.3))' },
          '50%': { filter: 'drop-shadow(0 0 6px rgba(244,63,94,0.6))' },
          '100%': { filter: 'drop-shadow(0 0 2px rgba(244,63,94,0.3))' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        },
        float: {
          '0%': { transform: 'translateY(0) rotate(0deg) scale(1)' },
          '50%': { transform: 'translateY(-15px) rotate(3deg) scale(1.03)' },
          '100%': { transform: 'translateY(0) rotate(0deg) scale(1)' }
        },
        pulseCitron: {
          '0%, 100%': {
            opacity: '0.8',
            textShadow: '0 0 0 rgba(221, 255, 14, 0)'
          },
          '50%': {
            opacity: '1',
            textShadow: '0 0 6px rgba(221, 255, 14, 0.4)'
          }
        }
      },
      backdropBlur: {
        'xs': '2px'
      }
    },
  },
  plugins: [],
}; 