import * as React from 'react';
import { getComponentVariant } from '../../../../utils/variantLoader';
import { JourneyProps, VariantKey } from '../types';

import BoutiqueVariant from './boutique';
import ClassicVariant from './classic';
import DefaultVariant from './default';
import MinimalistVariant from './minimalist';
import ModernVariant from './modern';
import SportsVariant from './sports';
import WellnessVariant from './wellness';

// Map variant keys to their React components
export const JourneyMap: Record<string, React.ComponentType<JourneyProps>> = {
  default: DefaultVariant,
  boutique: BoutiqueVariant,
  classic: ClassicVariant,
  minimalist: MinimalistVariant,
  modern: ModernVariant,
  sports: SportsVariant,
  wellness: WellnessVariant,
  gym: DefaultVariant, // Fallback to default
};

// Helper function to get the variant component based on WordPress settings
export const getJourneyVariant = () => {
  return getComponentVariant(JourneyMap, DefaultVariant);
};

// Export all variants
export {
  BoutiqueVariant,
  ClassicVariant,
  DefaultVariant,
  MinimalistVariant,
  ModernVariant,
  SportsVariant,
  WellnessVariant
};

// Re-export JourneyProps
export type { JourneyProps, VariantKey };

// Default export for backward compatibility
export default DefaultVariant;