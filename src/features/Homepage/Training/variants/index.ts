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
export const TrainingMap: Record<string, React.ComponentType<any>> = {
    default: DefaultVariant,
    boutique: BoutiqueVariant,
    classic: ClassicVariant,
    minimalist: MinimalistVariant,
    modern: ModernVariant,
    sports: SportsVariant,
    wellness: WellnessVariant,
    // gym variant is deprecated and removed, but mapping to default for backward compatibility
};

// Helper function to get the variant component based on WordPress settings
export const getTrainingVariant = () => {
    const variant = getComponentVariant('training', 'default');
    // If gym was selected, use default instead (deprecation handling)
    if (variant === 'gym') {
        console.warn('The "gym" variant for Training component is deprecated. Using "default" instead.');
        return 'default';
    }
    return variant;
};

// Function to get the appropriate variant component
export const getTrainingComponent = () => {
    const variant = getTrainingVariant();
    return TrainingMap[variant] || TrainingMap.default;
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