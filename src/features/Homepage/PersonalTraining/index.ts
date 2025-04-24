import type { VariantKey } from '../Hero/types';
import { createVariantComponent, getComponentVariant } from '../utils/variantLoader';
import DefaultPersonalTraining from './default';
import GymPersonalTraining from './gym';

interface PersonalTrainingProps {
    variant?: VariantKey;
}

/**
 * Map of PersonalTraining component variants
 */
export const PersonalTrainingMap: Record<VariantKey, React.ComponentType<Omit<PersonalTrainingProps, 'variant'>>> = {
    default: DefaultPersonalTraining,
    gym: GymPersonalTraining
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

export { PersonalTraining };
