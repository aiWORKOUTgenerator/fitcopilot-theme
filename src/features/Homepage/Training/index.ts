import type { ProgramType, TrainingProps, VariantKey } from './types';
import { getTrainingComponent, getTrainingVariant, TrainingMap } from './variants';

// Export the core component (default implementation)
import Training from './Training';
export { Training };

// Export type definitions
export type { ProgramType, TrainingProps, VariantKey };

// Export the variant selector function and map
export { getTrainingVariant, TrainingMap };

// Export all variant components
export * from './variants';

// Default export is the function that returns the appropriate variant
export default getTrainingComponent();
