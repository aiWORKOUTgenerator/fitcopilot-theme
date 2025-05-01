import Pricing from './Pricing';
import { getPricingVariant, PricingMap } from './variants';

// Export the base Pricing component
export { Pricing };

// Export the variant selector function and map
export { getPricingVariant, PricingMap };

// Export all variant components
export * from './variants';

// Export types
export * from './types';

// Default export is the function that returns the appropriate variant
export default getPricingVariant(); 