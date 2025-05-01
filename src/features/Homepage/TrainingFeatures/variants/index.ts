import React from 'react';
import { getComponentVariant } from '../../../../utils/variantLoader';

import DefaultVariant from './default';
import BoutiqueVariant from './boutique';
import ClassicVariant from './classic';
import MinimalistVariant from './minimalist';
import ModernVariant from './modern';
import SportsVariant from './sports';
import WellnessVariant from './wellness';

// Map variant keys to their React components
export const TrainingFeaturesMap: Record<string, React.ComponentType<any>> = {
  default: DefaultVariant,
  boutique: BoutiqueVariant,
  classic: ClassicVariant,
  minimalist: MinimalistVariant,
  modern: ModernVariant,
  sports: SportsVariant,
  wellness: WellnessVariant,
};

// Helper function to get the variant component based on WordPress settings
export const getTrainingFeaturesVariant = () => {
  const variant = getComponentVariant('trainingFeatures', 'default');
  return TrainingFeaturesMap[variant] || TrainingFeaturesMap.default;
};

// Export all variants
export {
  DefaultVariant,
  BoutiqueVariant,
  ClassicVariant,
  MinimalistVariant,
  ModernVariant,
  SportsVariant,
  WellnessVariant,
};

// Default export for backward compatibility
export default DefaultVariant; 