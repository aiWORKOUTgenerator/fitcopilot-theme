import { VariantKey, createVariantComponent, getComponentVariant } from '../utils/variantLoader';
import DefaultTrainingFeatures from './default';
import GymTrainingFeatures from './gym';

export interface TrainingFeaturesProps {
    className?: string;
    variant?: VariantKey;
}

const TrainingFeaturesMap = {
    default: DefaultTrainingFeatures,
    gym: GymTrainingFeatures
};

export const getTrainingFeaturesVariant = () => {
    return getComponentVariant<VariantKey>('trainingFeatures', 'default');
};

// Create component with variant support
const TrainingFeatures = createVariantComponent<TrainingFeaturesProps>(TrainingFeaturesMap, getTrainingFeaturesVariant);

// Export the component
export { TrainingFeatures };
