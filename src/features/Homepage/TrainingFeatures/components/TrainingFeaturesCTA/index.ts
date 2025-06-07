/**
 * TrainingFeaturesCTA Component Exports - Phase 1 Foundation
 * 
 * Standardized exports for TrainingFeaturesCTA component built on
 * proven architectural patterns from TrainingCTA success.
 * 
 * @version 1.0.0 - Phase 1 Foundation Architecture
 */

export { default as TrainingFeaturesCTA, default } from './TrainingFeaturesCTA';
export type {
    TrainingFeaturesCTAProps,
    TrainingFeaturesCTASize, TrainingFeaturesContextType, TrainingFeaturesVariantKey
} from './types';
export {
    generateFeaturesCTAText,
    generateFeaturesStyleClasses, mapFeaturesSizeToUniversalButton, mapFeaturesVariantToGlobal, validateTrainingFeaturesCTAProps
} from './utils';
