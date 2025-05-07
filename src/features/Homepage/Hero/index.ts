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

// Export all components from the Hero feature
export * from './components';

// Default export is the main Hero component
export default Hero;

