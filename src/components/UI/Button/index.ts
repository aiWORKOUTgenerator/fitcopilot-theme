/**
 * Button Component Exports
 *
 * Exports the main Button component and its variants
 */

// Main component
import Button from './Button';

// Theme variants
import DefaultButton from './default/Button';
import GymButton from './gym/Button';

// Types and utilities
import { ButtonThemeContext, getButtonThemeContext, getSectionThemeContext } from './context';
import { ButtonProps } from './types';

// Primary export
export default Button;

// Export variants
export { DefaultButton, GymButton };

// Export types and utilities
export { getButtonThemeContext, getSectionThemeContext };
export type { ButtonProps, ButtonThemeContext };

