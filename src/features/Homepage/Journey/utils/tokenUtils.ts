/**
 * Journey Component Token Utilities
 * Functions to handle token-based styling for different steps and variants
 */

type VariantKey = 'default' | 'gym' | 'sports' | 'wellness' | 'modern' | 'classic' | 'minimalist';
type StepNumber = 1 | 2 | 3 | 4;
type StepColorFamily = 'lime' | 'cyan' | 'violet' | 'amber';

/**
 * Maps step numbers to their color families
 */
const stepColorMap: Record<StepNumber, StepColorFamily> = {
    1: 'lime',
    2: 'cyan',
    3: 'violet',
    4: 'amber'
};

/**
 * Get the color family for a step number
 */
export const getStepColorFamily = (stepNumber: number): StepColorFamily => {
    return stepColorMap[stepNumber as StepNumber] || 'lime';
};

/**
 * Get the gradient class name for a step
 */
export const getStepGradientClass = (stepNumber: number): string => {
    const colorFamily = getStepColorFamily(stepNumber);
    return `journey-gradient-${colorFamily}`;
};

/**
 * Get the connector color class for a step
 */
export const getConnectorColorClass = (stepNumber: number): string => {
    const colorFamily = getStepColorFamily(stepNumber);
    return `journey-connector-${colorFamily}`;
};

/**
 * Get the glow effect class for a step
 */
export const getGlowEffectClass = (stepNumber: number): string => {
    const colorFamily = getStepColorFamily(stepNumber);
    return `journey-${colorFamily}-glow`;
};

/**
 * Get the icon color class for a specific step
 */
export const getIconColorClass = (stepNumber: number): string => {
    return `journey-icon-step-${stepNumber}`;
};

/**
 * Get a CSS variable for a specific step's property
 */
export const getStepToken = (stepNumber: number, property: 'start' | 'end'): string => {
    return `var(--journey-step-${stepNumber}-${property})`;
};

/**
 * Get appropriate CTA text based on step number
 */
export const getStepCTAText = (stepNumber: number): string => {
    switch (stepNumber) {
        case 1:
            return 'Set Your Goals';
        case 2:
            return 'Personalize';
        case 3:
            return 'See Sample Plan';
        case 4:
            return 'View Analytics';
        default:
            return 'Learn More';
    }
};

/**
 * Get the CTA URL based on step title
 */
export const getStepCTAUrl = (stepTitle: string): string => {
    if (stepTitle.includes('Personalized Plan')) {
        return 'http://builder.fitcopilot.ai';
    }
    return 'https://aigymengine.com/workout-generator-registration';
};

/**
 * Utility to determine if animation should be applied based on reduced motion preference
 */
export const getAnimationClass = (className: string, prefersReducedMotion: boolean): string => {
    return prefersReducedMotion ? '' : className;
};

export default {
    getStepColorFamily,
    getStepGradientClass,
    getConnectorColorClass,
    getGlowEffectClass,
    getIconColorClass,
    getStepToken,
    getStepCTAText,
    getStepCTAUrl,
    getAnimationClass
}; 