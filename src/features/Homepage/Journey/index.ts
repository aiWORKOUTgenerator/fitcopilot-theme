import Journey from './Journey';
import { getJourneyVariant, JourneyMap } from './variants';

// Export main component and subcomponents
export { Journey };

// Export the variant selector function and map
export { getJourneyVariant, JourneyMap };

// Export all variant components
export * from './variants';

// Export types
export * from './types';

// Export utility functions
export * from './utils/variantHelpers';

// Default export for convenience 
export default Journey; 