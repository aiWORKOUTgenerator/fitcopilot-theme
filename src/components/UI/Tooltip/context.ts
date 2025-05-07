/**
 * Tooltip Context Utilities
 *
 * Provides utilities for determining tooltip context and theme
 */
import { TooltipThemeContext } from './types';

// Define available theme contexts
export const TOOLTIP_THEME_CONTEXTS = ['default', 'hero'] as const;

/**
 * Determines if the provided theme context is valid
 * 
 * @param context The theme context to validate
 * @returns True if the context is valid, false otherwise
 */
export const isValidThemeContext = (context: string | undefined): context is TooltipThemeContext => {
  if (!context) return false;
  return TOOLTIP_THEME_CONTEXTS.includes(context as TooltipThemeContext);
};

/**
 * Gets the appropriate theme context based on input or defaults
 * 
 * @param context The provided theme context
 * @returns A valid theme context, defaulting to 'default' if invalid
 */
export const getTooltipThemeContext = (context?: string): TooltipThemeContext => {
  if (context && isValidThemeContext(context)) {
    return context as TooltipThemeContext;
  }
  return 'default';
};

/**
 * Section context utilities for Tooltip component
 * Maps section names to appropriate theme contexts
 */
export const getSectionThemeContext = (sectionName?: string): TooltipThemeContext => {
  if (!sectionName) return 'default';

  // Map section names to theme contexts
  const sectionThemeMap: Record<string, TooltipThemeContext> = {
    'hero-section': 'hero',
    // Add more section mappings as needed
  };

  return sectionThemeMap[sectionName] || 'default';
}; 