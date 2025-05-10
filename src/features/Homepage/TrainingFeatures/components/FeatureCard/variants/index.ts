import DefaultFeatureCard from './DefaultFeatureCard';
import GymFeatureCard from './GymFeatureCard';

export {
    DefaultFeatureCard,
    GymFeatureCard
};

/**
 * Creates a variant-aware FeatureCard based on the current theme
 */
export const createVariantFeatureCard = (theme: string) => {
    switch (theme) {
        case 'gym':
            return GymFeatureCard;
        default:
            return DefaultFeatureCard;
    }
}; 