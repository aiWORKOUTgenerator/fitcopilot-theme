import Journey from './Journey';
import { getJourneyVariant, JourneyMap } from './variants';

// Export the base Journey component
export { Journey };

// Export the variant selector function and map
export { getJourneyVariant, JourneyMap };

// Export all variant components
export * from './variants';

// Export types
export * from './types';

// Default export is the function that returns the appropriate variant
export default getJourneyVariant(); 