import type { VariantKey } from '../Hero/types';
import { createVariantComponent, getComponentVariant } from '../utils/variantLoader';
import DefaultTraining from './default';
import GymTraining from './gym';

interface TrainingProps {
    variant?: VariantKey;
}

/**
 * Map of Training component variants
 */
export const TrainingMap: Record<VariantKey, React.ComponentType<Omit<TrainingProps, 'variant'>>> = {
    default: DefaultTraining,
    gym: GymTraining
};

/**
 * Training component that dynamically loads the appropriate variant
 */
const Training = createVariantComponent<VariantKey, TrainingProps>(TrainingMap, 'default');

/**
 * Get the Training variant from WordPress settings
 */
export const getTrainingVariant = (): VariantKey => {
    return getComponentVariant<VariantKey>('training', 'default');
};

export { Training };
