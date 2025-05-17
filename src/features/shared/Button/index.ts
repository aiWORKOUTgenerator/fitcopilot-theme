/**
 * Button Component System Export
 */

// Import base button component
import ButtonComponent from './components/Button';

// Export component implementations
export { default as Button } from './components/Button';
export { default as ButtonGroup } from './components/ButtonGroup';
export { default as LinkButton } from './components/LinkButton';
export { default as ToggleButton } from './components/ToggleButton';

// Default export for backward compatibility
export default ButtonComponent;

// Export types
export * from './types';

