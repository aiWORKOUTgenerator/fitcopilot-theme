/**
 * Tailwind CSS configuration
 * 
 * This configuration integrates our design system tokens with Tailwind,
 * allowing seamless usage of our color tokens in Tailwind classes.
 */

module.exports = {
  content: [
    './src/**/*.{ts,tsx,js,jsx}',
    './public/**/*.html',
  ],
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
        // Map Tailwind colors to CSS custom properties
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        accent: {
          50: 'var(--color-accent-50)',
          100: 'var(--color-accent-100)',
          200: 'var(--color-accent-200)',
          300: 'var(--color-accent-300)',
          400: 'var(--color-accent-400)',
          500: 'var(--color-accent-500)',
          600: 'var(--color-accent-600)',
          700: 'var(--color-accent-700)',
          800: 'var(--color-accent-800)',
          900: 'var(--color-accent-900)',
        },
        gray: {
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
        },
        // Semantic colors for direct usage
        brand: {
          primary: 'var(--color-brand-primary)',
          accent: 'var(--color-brand-accent)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          accent: 'var(--color-text-accent)',
          muted: 'var(--color-text-muted)',
        },
        ui: {
          background: 'var(--color-ui-background)',
          surface: 'var(--color-ui-surface)',
          border: 'var(--color-ui-border)',
        },
        lime: {
          300: '#a3e635',
          400: '#84cc16',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
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
  plugins: [
    // Plugin to generate utility classes for alpha variants
    function ({ addUtilities, theme, e }) {
      const alphaUtilities = {};
      const alphaVariants = [10, 30, 50, 70, 90];
      const colors = ['accent-400', 'primary-500', 'gray-900'];

      // Generate color alpha utilities
      colors.forEach(color => {
        alphaVariants.forEach(alpha => {
          const className = `.bg-${e(color)}-alpha-${alpha}`;
          alphaUtilities[className] = {
            backgroundColor: `var(--color-${color}-alpha-${alpha})`,
          };

          const textClassName = `.text-${e(color)}-alpha-${alpha}`;
          alphaUtilities[textClassName] = {
            color: `var(--color-${color}-alpha-${alpha})`,
          };

          const borderClassName = `.border-${e(color)}-alpha-${alpha}`;
          alphaUtilities[borderClassName] = {
            borderColor: `var(--color-${color}-alpha-${alpha})`,
          };
        });
      });

      addUtilities(alphaUtilities, {
        variants: ['responsive', 'hover', 'focus', 'active'],
      });
    },

    // Plugin to generate utility classes for theme-specific styles
    function ({ addBase, addUtilities }) {
      // Add utilities for theme switching support
      const themeUtilities = {
        '.theme-default': { 'data-theme': 'default' },
        '.theme-gym': { 'data-theme': 'gym' },
        '.theme-sports': { 'data-theme': 'sports' },
        '.theme-wellness': { 'data-theme': 'wellness' },
      };

      addUtilities(themeUtilities);
    }
  ],
  // Enable JIT mode for faster development
  mode: 'jit',
}; 