// Main component
export { default } from './CustomizeExperience';

// Reusable components
export { default as SectionErrorState } from './components/SectionErrorState';
export { default as SelectableOption } from './components/SelectableOption';
export { default as ValidationSummary } from './components/ValidationSummary';

// Utilities
export { announceToScreenReader, focusFirstTabbableElement } from './utils/a11y';
export { getValidationMessage, saveWithRetry, validators } from './utils/validators';

// Types
export * from './types';

// Export hooks
export * from './hooks/useCustomizationState';

// Export constants
export * from './constants/equipmentOptions';
export * from './constants/sectionConstants';
export * from './constants/timeCommitmentOptions';

