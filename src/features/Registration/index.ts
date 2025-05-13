import Registration from './Registration';
import type { RegistrationData, RegistrationStep } from './types';

// Export the main Registration component as the default export
export default Registration;

// Export types
export type { RegistrationData, RegistrationStep };

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
