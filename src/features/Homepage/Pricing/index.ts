import { Pricing } from './Pricing';
import { getPricingVariant, PricingMap } from './variants';

// Export the base Pricing component
export { Pricing };
export default Pricing;

// Export the variant selector function and map
export { getPricingVariant, PricingMap };

// Export components with correct imports
export { PricingButton, PricingCard } from './components';
export { default as PricingCTA } from './components/PricingCTA';

// Export types directly to avoid conflicts
export type { PricingProps } from './types';

// Export utilities
export * from './utils/themeUtils';
