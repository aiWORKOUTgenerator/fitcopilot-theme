import Registration from './Registration';
import { JourneySubstepId, RegistrationData, RegistrationStep, RegistrationStepId, SectionId } from './types';

// Export the main Registration component as the default export
export default Registration;

// Export types for external use
export {
    JourneySubstepId, RegistrationData,
    RegistrationStep,
    RegistrationStepId, SectionId
};

// Export navigation context and hook
export * from './context/NavigationContext';

// Export hooks for reuse
export * from './hooks';

// Export utility functions
export * from './utils';

// Export sections as named exports
export { default as ExperienceLevel } from './ExperienceLevel';
export { default as Journey } from './Journey';
export { default as Pricing } from './Pricing';
export { default as Splash } from './Splash';

// Export shared components
export * from './components';

// Export navigation components with unique names
export {
    AccordionSection, RegistrationButton as NavigationButton, RegistrationContainer as Registration,
    // Context
    NavigationProvider as RegistrationNavigationProvider, RegistrationProgressIndicator,
    // Hooks
    useRegistrationProgress as useNavigationProgress, useNavigation as useRegistrationNavigation
} from './navigation';

// Export type re-exports to avoid duplicate identifier errors
export type {
    SectionId as NavigationSectionId, RegistrationStepId as NavigationStepId,
    JourneySubstepId as NavigationSubstepId
} from './navigation';

