/**
 * Gradient Token Utilities
 * 
 * Provides consistent mapping between program types and their corresponding CSS class names
 */

/**
 * Program type keys used for styling
 */
export type ProgramTypeKey = 'strength' | 'fatLoss' | 'fitness' | 'athletic';

/**
 * Maps program names to their gradient CSS class names
 */
export const programGradientMap: Record<string, string> = {
    'Strength Building': 'program-gradient-strength',
    'Fat Loss': 'program-gradient-fatLoss',
    'General Fitness': 'program-gradient-fitness',
    'Athletic Performance': 'program-gradient-athletic'
};

/**
 * Maps program names to their text color CSS class names
 */
export const programTextColorMap: Record<string, string> = {
    'Strength Building': 'program-text-strength',
    'Fat Loss': 'program-text-fatLoss',
    'General Fitness': 'program-text-fitness',
    'Athletic Performance': 'program-text-athletic'
};

/**
 * Maps program types to their gradient CSS class names
 */
export const programTypeGradientMap: Record<ProgramTypeKey, string> = {
    'strength': 'program-gradient-strength',
    'fatLoss': 'program-gradient-fatLoss',
    'fitness': 'program-gradient-fitness',
    'athletic': 'program-gradient-athletic'
};

/**
 * Maps program types to their text color CSS class names
 */
export const programTypeTextColorMap: Record<ProgramTypeKey, string> = {
    'strength': 'program-text-strength',
    'fatLoss': 'program-text-fatLoss',
    'fitness': 'program-text-fitness',
    'athletic': 'program-text-athletic'
}; 