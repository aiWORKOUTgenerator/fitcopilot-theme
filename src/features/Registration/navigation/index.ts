/**
 * Navigation module for the registration flow
 */

// Export types
export * from './types';

// Export context and hook
export { NavigationProvider, useNavigation } from './context';

// Export custom hooks
export { useRegistrationProgress } from './hooks/useRegistrationProgress';

// Export components
export { default as AccordionSection } from './components/AccordionSection';
export { default as RegistrationButton } from './components/RegistrationButton';
export { default as RegistrationContainer } from './components/RegistrationContainer';
export { default as RegistrationProgressIndicator } from './components/RegistrationProgressIndicator';

// Export stub components (these will be replaced with real components later)
export { default as Confirmation } from './components/stubs/Confirmation';
export { default as ExperienceLevel } from './components/stubs/ExperienceLevel';
export { default as Journey } from './components/stubs/Journey';
export { default as Payment } from './components/stubs/Payment';
export { default as Pricing } from './components/stubs/Pricing';
export { default as Splash } from './components/stubs/Splash';
