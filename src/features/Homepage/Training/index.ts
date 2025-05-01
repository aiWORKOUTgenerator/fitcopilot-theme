import { getTrainingComponent, getTrainingVariant, TrainingMap } from './variants';

// Export the variant selector function and map
export { getTrainingVariant, TrainingMap };

// Export all variant components
export * from './variants';

// Default export is the function that returns the appropriate variant
export default getTrainingComponent();
