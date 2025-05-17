/**
 * Button Component System Export
 */

// Special button variants
import { HeroButton, HeroButtonProps } from '../../Homepage/Hero/components/HeroButton';
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

// Export HeroButton
export { HeroButton };
export type { HeroButtonProps };

