/**
 * Button Component Exports
 *
 * Exports the main Button component and its variants
 */

// Main component
import Button from './Button';

// Theme variants
import ClassicButton from './classic/Button';
import DefaultButton from './default/Button';
import GymButton from './gym/Button';
import HeroButton from './hero/Button';
import MinimalistButton from './minimalist/Button';
import ModernButton from './modern/Button';
import SportsButton from './sports/Button';
import WellnessButton from './wellness/Button';

// Types and utilities
import { ButtonThemeContext, getButtonThemeContext, getSectionThemeContext } from './context';
import { ButtonProps } from './types';

// Primary export
export default Button;

// Export variants
export {
    ClassicButton, DefaultButton,
    GymButton,
    HeroButton, MinimalistButton, ModernButton, SportsButton,
    WellnessButton
};

// Export types and utilities
export { getButtonThemeContext, getSectionThemeContext };
export type { ButtonProps, ButtonThemeContext };

