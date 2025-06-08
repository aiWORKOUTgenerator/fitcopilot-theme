/**
 * PricingCard Component Exports
 * 
 * Main export file for the consolidated PricingCard component.
 * 
 * @version 5.0.0 - Phase 5: Main Component Assembly
 * @since Phase 5 - Main Component Assembly
 */

// Export main component
export { PricingCard, default } from './PricingCard';

// Export types for convenience
export * from './types';

// Export sub-components for advanced usage
export * from './components';

// Animation hook (will be implemented in Phase 2)
export { usePricingCardAnimations } from './hooks/usePricingCardAnimations';

// Constants
export {
    ANIMATION_TIMINGS, BACKGROUND_PARTICLE_CONFIG, BASIC_ANIMATION_TIMINGS,
    INTERACTION_TIMINGS,
    PARTICLE_CONFIG
} from './constants';

// Export all types
export type {
    AnimationConfig,
    AnimationState,
    AnimationTimings,
    ParticleConfig,
    PlanFeature,
    PricingCardAnimationHook,
    PricingCardCTAProps,
    PricingCardData,
    PricingCardFeaturesProps,
    PricingCardHeaderProps,
    PricingCardPriceProps,
    PricingCardProps,
    PricingCardTooltipProps,
    TooltipStates
} from './types';



