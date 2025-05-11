import React from 'react';
import { getComponentVariant } from '../../../../utils/variantLoader';

import BoutiqueVariant from './boutique';
import ClassicVariant from './classic';
import DefaultVariant from './default';
import MinimalistVariant from './minimalist';
import ModernVariant from './modern';
import RegistrationVariant from './registration';
import SportsVariant from './sports';
import WellnessVariant from './wellness';

// Define proper props type
type VariantKey = 'default' | 'gym' | 'boutique' | 'modern' | 'wellness' | 'classic' | 'sports' | 'minimalist' | 'registration';

export interface HeroProps {
    variant?: VariantKey;
}

// Map variant keys to their React components
export const HeroMap: Record<string, React.ComponentType<HeroProps>> = {
    default: DefaultVariant,
    boutique: BoutiqueVariant,
    classic: ClassicVariant,
    minimalist: MinimalistVariant,
    modern: ModernVariant,
    registration: RegistrationVariant,
    sports: SportsVariant,
    wellness: WellnessVariant,
};

// Helper function to get the variant component based on WordPress settings
export const getHeroVariant = () => {
    const variant = getComponentVariant('hero', 'default');
    return HeroMap[variant] || HeroMap.default;
};

// Export all variants
export {
    BoutiqueVariant,
    ClassicVariant,
    DefaultVariant,
    MinimalistVariant,
    ModernVariant,
    RegistrationVariant,
    SportsVariant,
    WellnessVariant
};

// Default export for backward compatibility
export default DefaultVariant; 