/**
 * Theme Utilities
 * 
 * Provides standardized helpers for theme implementation
 */

/**
 * Available theme options in the application
 */
export const themeOptions = ['default', 'gym', 'sports', 'wellness', 'nutrition'] as const;

/**
 * Theme option type
 */
export type ThemeOption = typeof themeOptions[number];

/**
 * Type guard to check if a string is a valid theme option
 * 
 * @param theme - String to check
 * @returns Whether the string is a valid theme
 */
export const isValidTheme = (theme: string): theme is ThemeOption => {
  return themeOptions.includes(theme as ThemeOption);
};

/**
 * Get CSS theme class for a theme
 * 
 * @param theme - Theme option
 * @returns CSS class for the theme
 */
export const getThemeClass = (theme: ThemeOption): string => {
  return theme === 'default' ? '' : `theme-${theme}`;
};

/**
 * Get data-theme attribute value for a theme
 * 
 * @param theme - Theme option
 * @returns Data attribute value, or undefined for default theme
 */
export const getThemeAttribute = (theme: ThemeOption): string | undefined => {
  return theme === 'default' ? undefined : theme;
};

/**
 * Apply theme attribute to an element
 * 
 * @param element - HTML element to apply theme to
 * @param theme - Theme to apply
 */
export const applyThemeToElement = (element: HTMLElement, theme: ThemeOption): void => {
  if (theme === 'default') {
    element.removeAttribute('data-theme');
  } else {
    element.setAttribute('data-theme', theme);
  }
};

/**
 * Map of theme colors for each theme variant
 */
export const themeColorMap: Record<ThemeOption, Record<string, string>> = {
  default: {
    primary: '#a3e635', // lime-400
    secondary: '#22c55e', // green-500
    accent: '#84cc16', // lime-500
  },
  gym: {
    primary: '#a855f7', // violet-500
    secondary: '#8b5cf6', // purple-500
    accent: '#c084fc', // purple-400
  },
  sports: {
    primary: '#06b6d4', // cyan-500
    secondary: '#0ea5e9', // sky-500
    accent: '#22d3ee', // cyan-400
  },
  wellness: {
    primary: '#14b8a6', // teal-500
    secondary: '#10b981', // emerald-500
    accent: '#2dd4bf', // teal-400
  },
  nutrition: {
    primary: '#f59e0b', // amber-500
    secondary: '#d97706', // amber-600
    accent: '#fbbf24', // amber-400
  }
}; 