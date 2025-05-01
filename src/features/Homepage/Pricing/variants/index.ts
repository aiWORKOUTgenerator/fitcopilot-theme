import React from 'react';
import { getComponentVariant } from '../../../../utils/variantLoader';

import BoutiqueVariant from './boutique';
import ClassicVariant from './classic';
import DefaultVariant from './default';
import MinimalistVariant from './minimalist';
import ModernVariant from './modern';
import SportsVariant from './sports';
import WellnessVariant from './wellness';

// Map variant keys to their React components
export const PricingMap: Record<string, React.ComponentType<any>> = {
    default: DefaultVariant,
    boutique: BoutiqueVariant,
    classic: ClassicVariant,
    minimalist: MinimalistVariant,
    modern: ModernVariant,
    sports: SportsVariant,
    wellness: WellnessVariant,
};

// Helper function to get the variant component based on WordPress settings
export const getPricingVariant = () => {
    const variant = getComponentVariant('pricing', 'default');
    return PricingMap[variant] || PricingMap.default;
};

// Export all variants
export {
    BoutiqueVariant,
    ClassicVariant, DefaultVariant, MinimalistVariant,
    ModernVariant,
    SportsVariant,
    WellnessVariant
};

// Default export for backward compatibility
export default DefaultVariant; 