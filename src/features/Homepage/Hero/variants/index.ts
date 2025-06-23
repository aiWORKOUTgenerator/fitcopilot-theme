import React from 'react';
import { HeroProps, HeroVariantKey } from '../types';

import BoutiqueVariant from './boutique';
import ClassicVariant from './classic';
import DefaultVariant from './default';
import MinimalistVariant from './minimalist';
import ModernVariant from './modern';
import RegistrationVariant from './registration';
import SportsVariant from './sports';
import WellnessVariant from './wellness';

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
  gym: DefaultVariant // Fallback for gym variant to default
};

// Helper function to get the variant component based on WordPress settings
export const getHeroVariant = (): React.ComponentType<HeroProps> => {
  // Get the current theme from body data-theme attribute
  const bodyTheme = document.body.getAttribute('data-theme');
  const validTheme = bodyTheme as HeroVariantKey | undefined;
  
  // Return the appropriate variant or default
  if (validTheme && HeroMap[validTheme]) {
    return HeroMap[validTheme];
  }
  
  return HeroMap.default;
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

// Re-export HeroProps type for variant components
export type { HeroProps };

// Default export for backward compatibility
export default DefaultVariant; 