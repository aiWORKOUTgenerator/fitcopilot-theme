import { VariantKey } from '../types';

// Import variants - DefaultTrainingFeatures comes from the main component file, not the default directory
import DefaultTrainingFeatures from '../TrainingFeatures';
import BoutiqueTrainingFeatures from './boutique';
import ModernTrainingFeatures from './modern';

/**
 * Map of all variants
 * The 'default' variant uses the main TrainingFeatures component directly
 */
export const TrainingFeaturesMap = {
  default: DefaultTrainingFeatures,
  modern: ModernTrainingFeatures,
  boutique: BoutiqueTrainingFeatures,
  // Add other variants as they are implemented
  classic: DefaultTrainingFeatures,
  minimalist: DefaultTrainingFeatures,
  sports: DefaultTrainingFeatures,
  wellness: DefaultTrainingFeatures
};

/**
 * Returns the appropriate TrainingFeatures variant component based on the theme
 * Falls back to default if no matching variant is found
 */
export const getTrainingFeaturesVariant = (variant?: VariantKey) => {
  if (variant && TrainingFeaturesMap[variant]) {
    return TrainingFeaturesMap[variant];
  }

  // Default fallback
  return DefaultTrainingFeatures;
};

// Export all variants
export {
    BoutiqueTrainingFeatures,
    DefaultTrainingFeatures,
    ModernTrainingFeatures
};

// Export sports and wellness variants (re-export default for now)
export const SportsVariant = DefaultTrainingFeatures;
export const WellnessVariant = DefaultTrainingFeatures;

// Default export for backward compatibility
export default DefaultTrainingFeatures; 