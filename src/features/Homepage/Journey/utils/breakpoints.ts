/**
 * Journey Component Breakpoint System
 * Standardized breakpoints and responsive utilities
 */

// Breakpoint values in pixels - aligned with Tailwind defaults
export const BREAKPOINTS = {
  xs: 0,      // extra small screens - mobile
  sm: 640,    // small screens - large mobile / small tablet
  md: 768,    // medium screens - tablets
  lg: 1024,   // large screens - small desktops / large tablets
  xl: 1280,   // extra large screens - desktops
  xxl: 1536   // extra extra large screens - large desktops
};

// Media query strings for use with JS media queries
export const MEDIA_QUERIES = {
  xs: `(min-width: ${BREAKPOINTS.xs}px)`,
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  xxl: `(min-width: ${BREAKPOINTS.xxl}px)`,

  // Special case media queries
  mobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.lg}px)`,
  touch: `(max-width: ${BREAKPOINTS.lg - 1}px)`,
  landscape: `(orientation: landscape)`,
  portrait: `(orientation: portrait)`,
  dark: `(prefers-color-scheme: dark)`,
  light: `(prefers-color-scheme: light)`,
  reducedMotion: `(prefers-reduced-motion: reduce)`
};

// Responsive typography scales mapped to breakpoints
export const TYPOGRAPHY_SCALES = {
  // Section titles
  sectionTitle: {
    xs: {
      fontSize: '2rem',    // 32px
      lineHeight: 1.2,     // 38px
      letterSpacing: '-0.01em'
    },
    md: {
      fontSize: '2.5rem',  // 40px
      lineHeight: 1.2,     // 48px
      letterSpacing: '-0.015em'
    },
    lg: {
      fontSize: '3rem',    // 48px
      lineHeight: 1.1,     // 53px
      letterSpacing: '-0.02em'
    }
  },

  // Step titles
  stepTitle: {
    xs: {
      fontSize: '1.25rem',  // 20px
      lineHeight: 1.3,      // 26px
      letterSpacing: '-0.01em'
    },
    md: {
      fontSize: '1.5rem',   // 24px
      lineHeight: 1.3,      // 31px
      letterSpacing: '-0.01em'
    },
    lg: {
      fontSize: '1.5rem',   // 24px
      lineHeight: 1.3,      // 31px
      letterSpacing: '-0.01em'
    }
  },

  // Body text
  body: {
    xs: {
      fontSize: '1rem',     // 16px
      lineHeight: 1.5,      // 24px
      letterSpacing: '0'
    },
    md: {
      fontSize: '1rem',     // 16px
      lineHeight: 1.5,      // 24px
      letterSpacing: '0'
    },
    lg: {
      fontSize: '1rem',     // 16px
      lineHeight: 1.5,      // 24px
      letterSpacing: '0'
    }
  },

  // Feature card title
  featureTitle: {
    xs: {
      fontSize: '1rem',     // 16px
      lineHeight: 1.4,      // 22px
      letterSpacing: '0'
    },
    md: {
      fontSize: '1.125rem', // 18px
      lineHeight: 1.4,      // 25px
      letterSpacing: '-0.01em'
    }
  },

  // Feature card description
  featureDescription: {
    xs: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.5,      // 21px
      letterSpacing: '0'
    },
    md: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.5,      // 21px
      letterSpacing: '0'
    }
  },

  // Button text
  button: {
    xs: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.5,      // 21px
      letterSpacing: '0.01em'
    },
    md: {
      fontSize: '1rem',     // 16px
      lineHeight: 1.5,      // 24px
      letterSpacing: '0.01em'
    }
  }
};

// Responsive spacing scales mapped to breakpoints
export const SPACING_SCALES = {
  // Section padding
  section: {
    xs: {
      paddingTop: '3rem',     // 48px
      paddingBottom: '3rem',  // 48px
      paddingLeft: '1rem',    // 16px
      paddingRight: '1rem'    // 16px
    },
    md: {
      paddingTop: '4rem',     // 64px
      paddingBottom: '4rem',  // 64px
      paddingLeft: '1.5rem',  // 24px
      paddingRight: '1.5rem'  // 24px
    },
    lg: {
      paddingTop: '5rem',     // 80px
      paddingBottom: '5rem',  // 80px
      paddingLeft: '2rem',    // 32px
      paddingRight: '2rem'    // 32px
    }
  },

  // Step card padding
  stepCard: {
    xs: {
      padding: '1rem',        // 16px
    },
    md: {
      padding: '1.5rem',      // 24px
    },
    lg: {
      padding: '1.5rem',      // 24px
    }
  },

  // Feature card padding
  featureCard: {
    xs: {
      padding: '0.75rem',     // 12px
    },
    md: {
      padding: '1rem',        // 16px
    }
  },

  // Gaps between elements
  gap: {
    xs: {
      small: '0.5rem',        // 8px
      medium: '1rem',         // 16px
      large: '1.5rem'         // 24px
    },
    md: {
      small: '0.75rem',       // 12px
      medium: '1.5rem',       // 24px
      large: '2rem'           // 32px
    },
    lg: {
      small: '1rem',          // 16px
      medium: '1.5rem',       // 24px
      large: '2rem'           // 32px
    }
  }
};

// Helper to generate mobile-first responsive utility classes
export const getResponsiveUtilityClass = (
  baseClass: string,
  breakpoints: { [key: string]: string }
): string => {
  return Object.entries(breakpoints)
    .map(([breakpoint, value]) => {
      if (breakpoint === 'xs') return value;
      return `${breakpoint}:${value}`;
    })
    .join(' ');
};

export default {
  BREAKPOINTS,
  MEDIA_QUERIES,
  TYPOGRAPHY_SCALES,
  SPACING_SCALES,
  getResponsiveUtilityClass
}; 