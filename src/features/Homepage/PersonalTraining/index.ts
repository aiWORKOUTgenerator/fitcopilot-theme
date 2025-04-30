import type { VariantKey } from '../Hero/types';
import { createVariantComponent, getComponentVariant } from '../utils/variantLoader';
import DefaultPersonalTraining from './default';
import GymPersonalTraining from './gym';
import type { Trainer } from './types';

/**
 * Props for PersonalTraining component
 */
interface PersonalTrainingProps {
    variant?: VariantKey;
    trainers?: Trainer[];
}

/**
 * Map of PersonalTraining component variants
 */
export const PersonalTrainingMap: Record<VariantKey, React.ComponentType<Omit<PersonalTrainingProps, 'variant'>>> = {
    default: DefaultPersonalTraining,
    gym: GymPersonalTraining,
    mobile: DefaultPersonalTraining // Fallback to default for mobile as per Hero component
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

