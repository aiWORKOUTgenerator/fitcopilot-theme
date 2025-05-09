/**
 * Button Context Utilities
 *
 * Provides utilities for determining button context and theme
 */

export type ButtonThemeContext = 'default' | 'gym' | 'hero' | 'sports' | 'wellness' | 'modern' | 'classic' | 'minimalist';

// Define available theme contexts
export const BUTTON_THEME_CONTEXTS = ['default', 'gym', 'hero', 'sports', 'wellness', 'modern', 'classic', 'minimalist'] as const;

/**
 * Determines if the provided theme context is valid
 * 
 * @param context The theme context to validate
 * @returns True if the context is valid, false otherwise
 */
export const isValidThemeContext = (context: string | undefined): context is ButtonThemeContext => {
    if (!context) return false;
    return BUTTON_THEME_CONTEXTS.includes(context as ButtonThemeContext);
};

/**
 * Gets the appropriate theme context based on input or defaults
 * 
 * @param context The provided theme context
 * @returns A valid theme context, defaulting to 'default' if invalid
 */
export const getButtonThemeContext = (context?: string): ButtonThemeContext => {
    if (context && isValidThemeContext(context)) {
        return context as ButtonThemeContext;
    }
    return 'default';
};

/**
 * Section context utilities for Button component
 * Maps section names to appropriate theme contexts
 */
export const getSectionThemeContext = (sectionName?: string): ButtonThemeContext => {
    if (!sectionName) return 'default';

    // Map section names to theme contexts
    const sectionThemeMap: Record<string, ButtonThemeContext> = {
        // 'personal-training': 'gym', // Removed to use default theme
        'gym-section': 'gym',
        'workout-planner': 'gym',
        'hero-section': 'hero',
        'sports-section': 'sports',
        'wellness-section': 'wellness',
        'modern-section': 'modern',
        'classic-section': 'classic',
        'minimalist-section': 'minimalist',
        // Add more section mappings as needed
    };

    return sectionThemeMap[sectionName] || 'default';
}; 