import React from 'react';
import { createVariantComponent, getComponentVariant } from '../utils/variantLoader';
import DefaultPersonalTraining from './default';
import GymPersonalTraining from './gym';
import { PersonalTrainingProps, VariantKey } from './types';

/**
 * Map of PersonalTraining component variants
 */
export const PersonalTrainingMap: Record<VariantKey, React.ComponentType<Omit<PersonalTrainingProps, 'variant'>>> = {
    default: DefaultPersonalTraining,
    gym: GymPersonalTraining,
    mobile: DefaultPersonalTraining // Using default for mobile as fallback
};

/**
 * PersonalTraining component that dynamically loads the appropriate variant
 */
const PersonalTraining = createVariantComponent<VariantKey, PersonalTrainingProps>(PersonalTrainingMap, 'default');

/**
 * Get the PersonalTraining variant from WordPress settings
 */
export const getPersonalTrainingVariant = (): VariantKey => {
    return getComponentVariant<VariantKey>('personalTraining', 'default');
};

export * from './types';
export { PersonalTraining };

