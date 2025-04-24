import type { VariantKey } from '../Hero/types';
import { createVariantComponent, getComponentVariant } from '../utils/variantLoader';
import DefaultFeatures from './default';
import GymFeatures from './gym';

interface FeaturesProps {
    variant?: VariantKey;
}

/**
 * Map of Features component variants
 */
export const FeaturesMap: Record<VariantKey, React.ComponentType<Omit<FeaturesProps, 'variant'>>> = {
    default: DefaultFeatures,
    gym: GymFeatures
};

/**
 * Features component that dynamically loads the appropriate variant
 */
const Features = createVariantComponent<VariantKey, FeaturesProps>(FeaturesMap, 'default');

/**
 * Get the Features variant from WordPress settings
 */
export const getFeaturesVariant = (): VariantKey => {
    return getComponentVariant<VariantKey>('features', 'default');
};

export { Features };

