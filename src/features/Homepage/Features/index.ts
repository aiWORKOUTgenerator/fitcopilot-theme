import Features from './Features';
import { FeaturesMap, getFeaturesVariant } from './variants';

// Export the base Features component
export { Features };

// Export the variant selector function and map
export { FeaturesMap, getFeaturesVariant };

// Export all variant components
export * from './variants';

// Export types
export * from './types';

// Default export is the function that returns the appropriate variant
export default Features;

