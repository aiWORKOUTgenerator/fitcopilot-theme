import { getTrainingFeaturesVariant, TrainingFeaturesMap } from './variants';

// Export the variant selector function and map
export { getTrainingFeaturesVariant, TrainingFeaturesMap };

// Export all variant components
export * from './variants';

// Default export is the function that returns the appropriate variant
export default getTrainingFeaturesVariant();
