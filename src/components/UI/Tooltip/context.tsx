/**
 * Tooltip Theme Context System
 *
 * Provides a React context and provider for managing tooltip themes
 * and allows components to consume the theme context.
 */
import React, { createContext, ReactNode, useContext } from 'react';
import { TooltipThemeContext } from './types';

// Interface for the context value
interface TooltipThemeContextValue {
    theme: TooltipThemeContext;
}

// Default context value
const defaultContextValue: TooltipThemeContextValue = {
    theme: 'default'
};

// Create the context
export const TooltipContext = createContext<TooltipThemeContextValue>(defaultContextValue);

// Props for the TooltipThemeProvider component
interface TooltipThemeProviderProps {
    theme: TooltipThemeContext;
    children: ReactNode;
}

/**
 * Provider component for tooltip theme
 * Wrap sections of your application with this to set the theme for all tooltips within
 * 
 * @example
 * <TooltipThemeProvider theme="hero">
 *   <HeroSection />
 * </TooltipThemeProvider>
 */
export const TooltipThemeProvider: React.FC<TooltipThemeProviderProps> = ({
    theme = 'default',
    children
}) => (
    <TooltipContext.Provider value={{ theme }}>
        {children}
    </TooltipContext.Provider>
);

/**
 * Custom hook for consuming the tooltip theme context
 * 
 * @returns The current tooltip theme context
 * 
 * @example
 * const { theme } = useTooltipTheme();
 * logger.debug(`Current theme: ${theme}`);
 */
export const useTooltipTheme = () => useContext(TooltipContext);

/**
 * Helper function to determine the effective theme from props and context
 * 
 * @param explicitTheme Theme explicitly passed via props
 * @returns The effective theme to use
 */
export const useEffectiveTheme = (explicitTheme?: TooltipThemeContext): TooltipThemeContext => {
    const themeContext = useTooltipTheme();

    // Explicit theme takes precedence over context
    if (explicitTheme) {
        return explicitTheme;
    }

    // Otherwise use the theme from context
    return themeContext.theme;
};

// Export available theme contexts as a constant
export const TOOLTIP_THEMES: readonly TooltipThemeContext[] = ['default', 'hero', 'pricing'];

/**
 * Validates if a provided string is a valid theme context
 * 
 * @param context The string to validate
 * @returns True if valid, false otherwise
 */
export const isValidTheme = (context: string): context is TooltipThemeContext => {
    return TOOLTIP_THEMES.includes(context as TooltipThemeContext);
};

/**
 * Gets the appropriate theme context based on input or defaults
 * 
 * @param context The provided theme context
 * @returns A valid theme context, defaulting to 'default' if invalid
 */
export const getTooltipTheme = (context?: string): TooltipThemeContext => {
    if (context && isValidTheme(context)) {
        return context as TooltipThemeContext;
    }
    return 'default';
};

/**
 * Maps section names to appropriate theme contexts
 * 
 * @param sectionName The section name to map to a theme
 * @returns The appropriate theme for the section
 */
export const getSectionTheme = (sectionName?: string): TooltipThemeContext => {
    if (!sectionName) return 'default';

    // Map section names to theme contexts
    const sectionThemeMap: Record<string, TooltipThemeContext> = {
        'hero-section': 'hero',
        'pricing-section': 'pricing',
        // Add more section mappings as needed
    };

    return sectionThemeMap[sectionName] || 'default';
}; 