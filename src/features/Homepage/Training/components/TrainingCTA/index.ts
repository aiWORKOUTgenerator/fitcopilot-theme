/**
 * TrainingCTA Component Exports - Phase 3 Complete
 * 
 * Enhanced exports for Phase 3 architectural improvements with complete
 * feature set including performance optimizations, theme integration,
 * and comprehensive testing utilities.
 * 
 * @version 3.0.0 - Phase 3 Complete Architecture Integration
 */

export { default as TrainingCTA, default } from './TrainingCTA';

// Export enhanced types
export type {
    TrainingCTAProps,
    TrainingCTASize,
    TrainingVariantKey
} from './types';

// Export core utility functions for advanced usage
export {
    PROGRAM_CTA_TEXT_MAP, TRAINING_PROGRAM_TYPES, generateAccessibilityLabel,
    generateCTAText,
    generateStyleClasses, isTrainingProgramType, mapSizeToUniversalButton,
    mapTrainingVariantToGlobal,
    validateTrainingCTAProps
} from './utils';

// Export Phase 3 performance and development utilities
export {
    __DEV__, clearUtilityCaches,
    getCacheStatistics,
    preloadCommonCombinations
} from './utils';

// Re-export GlobalVariantKey for convenience
export type { GlobalVariantKey } from '../../../types/shared';

