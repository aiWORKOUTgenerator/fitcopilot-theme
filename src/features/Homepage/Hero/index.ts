import Hero from './Hero';
import { getHeroVariant, HeroMap } from './variants';

// Export the base Hero component
export { Hero };

// Export the variant selector function and map
export { getHeroVariant, HeroMap };

// Export all variant components
export * from './variants';

// Export types
export * from './types';

// Default export is the function that returns the appropriate variant
export default getHeroVariant();

