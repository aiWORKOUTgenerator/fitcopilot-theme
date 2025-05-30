/**
 * UniversalButton Component Exports
 * 
 * Standard export pattern for the unified button component that consolidates
 * all Homepage section button implementations.
 * 
 * @fileoverview UniversalButton component exports
 * @version 1.0.0
 * @since Week 4 - Button Consolidation
 */

// Main component exports
export { UniversalButton, default } from './UniversalButton';

// Export types
export type {
    ContextType, GradientColor, SectionContext,
    StyleVariant, UniversalButtonProps
} from './UniversalButton';

// Types
export type {
    BaseUniversalButtonProps, CoachType, FeatureButtonCompatProps, FeatureType, GradientConfig,
    // Backward compatibility types
    HeroButtonCompatProps, JourneyButtonCompatProps,
    PersonalTrainingButtonCompatProps, PlanType, PricingButtonCompatProps, SectionStyleConfig, TestimonialType, TestimonialsButtonCompatProps, ThemeStyleConfig, TrainingButtonCompatProps, TrainingFeaturesButtonCompatProps, TrainingStyleVariant, UniversalButtonSize, UniversalButtonVariant
} from './types';

// Gradient utilities
export {
    getGradientForColor, getGradientStyles,
    getHoverGradientStyles, getSectionDefaultGradient, isValidGradientColor, shouldApplyGradient
} from './utils/gradientUtils';

// Style utilities
export {
    customPropertiesToStyles, generateCustomProperties, getCombinedClasses, getDefaultVariantForSection, getSectionClasses, getSectionStyleConfig, getSizeClasses,
    getStateClasses, getSupportedVariantsForSection, getThemeClasses, getThemeStyleConfig, isValidSectionContext, isVariantSupportedForSection, mapSectionPropsToContextType, mapSectionPropsToGradientClass,
    mapSectionPropsToGradientColor,
    mapSectionPropsToGradientColors, mapSectionPropsToStyleVariant
} from './utils/styleUtils';

