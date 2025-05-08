/**
 * Training Variants
 * 
 * This file exports all theme variants for the Training component
 */
import React from 'react';
import { getComponentVariant } from '../../../../utils/variantLoader';
import { TrainingProps, VariantKey } from '../types';

// Import all variant components
import DefaultVariant from '../Training';
import BoutiqueVariant from './boutique';
import ClassicVariant from './classic';
import MinimalistVariant from './minimalist';
import ModernVariant from './modern';
import SportsVariant from './sports';
import WellnessVariant from './wellness';

/**
 * Map of variant keys to their component implementations
 */
export const TrainingMap: Record<VariantKey, React.ComponentType<Omit<TrainingProps, 'variant'>>> = {
    default: DefaultVariant,
    boutique: BoutiqueVariant,
    classic: ClassicVariant,
    minimalist: MinimalistVariant,
    modern: ModernVariant,
    sports: SportsVariant,
    wellness: WellnessVariant
};

/**
 * Helper function to get the current variant based on WordPress settings
 * @returns The variant key to use
 */
export const getTrainingVariant = (): VariantKey => {
    const variant = getComponentVariant('training', 'default') as VariantKey;

    // Return the variant, falling back to default if not found in our map
    return Object.keys(TrainingMap).includes(variant) ? variant : 'default';
};

/**
 * Get the component for a specific variant
 * 
 * @param variant The variant key to get a component for
 * @returns The component for the specified variant
 */
export const getVariantComponent = (variant: VariantKey): React.ComponentType<Omit<TrainingProps, 'variant'>> => {
    return TrainingMap[variant] || TrainingMap.default;
};

// Export all variants for direct import
export {
    BoutiqueVariant,
    ClassicVariant, DefaultVariant, MinimalistVariant,
    ModernVariant,
    SportsVariant,
    WellnessVariant
};
