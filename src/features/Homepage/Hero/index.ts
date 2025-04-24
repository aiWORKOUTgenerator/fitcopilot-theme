import React from 'react';
import { createVariantComponent, getComponentVariant } from '../utils/variantLoader';
import DefaultHero from './default';
import GymHero from './gym';
import type { HeroProps, VariantKey } from './types';

/**
 * Map of Hero component variants
 */
export const HeroMap: Record<VariantKey, React.ComponentType<Omit<HeroProps, 'variant'>>> = {
    default: DefaultHero,
    gym: GymHero
};

/**
 * Hero component that dynamically loads the appropriate variant
 */
const Hero = createVariantComponent<VariantKey, HeroProps>(HeroMap, 'default');

/**
 * Get the Hero variant from WordPress settings
 */
export const getHeroVariant = (): VariantKey => {
    return getComponentVariant<VariantKey>('hero', 'default');
};

export { Hero };
export * from './types';

