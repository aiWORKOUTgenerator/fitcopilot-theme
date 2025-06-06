/**
 * Journey Components Export Index
 * 
 * Standardized exports with deprecation notices for button components.
 * Prefer UniversalButton from '../components/UniversalButton' for new implementations.
 */

// Recommended components (actively maintained)
import JourneyFeatureCard from './JourneyFeatureCard';
import JourneyStep from './JourneyStep';
import SectionHeader from './SectionHeader';
import StepCTA from './StepCTA';

// Legacy button components (deprecated)
import { JourneyButton } from './JourneyButton';
import JourneyCTA from './JourneyCTA';

// Re-export UniversalButton for convenience
export { UniversalButton } from '../../components/UniversalButton';

// Recommended exports (actively maintained)
export {
    JourneyFeatureCard,
    JourneyStep,
    SectionHeader,
    StepCTA
};

// Legacy exports (deprecated - use UniversalButton instead)
    export {
        /**
         * @deprecated Use UniversalButton with sectionContext="journey" instead
         * Will be removed in v2.0.0
         */
        JourneyButton,

        /**
         * @deprecated Use UniversalButton with sectionContext="journey" instead
         * Will be removed in v2.0.0
         */
        JourneyCTA
    };

