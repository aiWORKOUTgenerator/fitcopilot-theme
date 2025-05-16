import React from 'react';
import { createVariantComponent, getComponentVariant } from '../utils/variantLoader';
import type { PersonalTrainingProps, Trainer, VariantKey } from './types';

// Import variants
import ClassicVariant from './variants/classic';
import DefaultVariant from './variants/default';
import MinimalistVariant from './variants/minimalist';
import ModernVariant from './variants/modern';
import SportsVariant from './variants/sports';
import WellnessVariant from './variants/wellness';

/**
 * Map of PersonalTraining component variants
 */
export const PersonalTrainingMap: Record<VariantKey, React.ComponentType<Omit<PersonalTrainingProps, 'variant'>>> = {
  default: DefaultVariant,
  modern: ModernVariant,
  classic: ClassicVariant,
  minimalist: MinimalistVariant,
  sports: SportsVariant,
  wellness: WellnessVariant
};

/**
 * PersonalTraining component that dynamically loads the appropriate variant
 */
const PersonalTraining = createVariantComponent<VariantKey, PersonalTrainingProps>(
  PersonalTrainingMap, 'default'
);

/**
 * Get the PersonalTraining variant from WordPress settings
 */
export const getPersonalTrainingVariant = (): VariantKey => {
  return getComponentVariant<VariantKey>('personalTraining', 'default');
};

export { PersonalTraining };
export type { PersonalTrainingProps, Trainer };

