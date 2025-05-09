import { TrainingFeature, TrainingFeaturesProps, VariantKey } from './types';
import { getTrainingFeaturesVariant, TrainingFeaturesMap } from './variants';

// Re-export the main component that automatically selects the appropriate variant
export { default as TrainingFeatures } from './TrainingFeatures';

// Export the variant selector function and map
export { getTrainingFeaturesVariant, TrainingFeaturesMap };

// Export all variant components
export * from './variants';

// Export types
export type { TrainingFeature, TrainingFeaturesProps, VariantKey };

// Default export is the function that returns the appropriate variant
export default getTrainingFeaturesVariant();
