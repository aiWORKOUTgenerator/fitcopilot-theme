/**
 * Tooltip component export file
 * 
 * Central export point for the Tooltip component, types, and context utilities
 */
import {
    TooltipThemeProvider,
    useEffectiveTheme,
    useTooltipTheme
} from './context';
import Tooltip from './Tooltip';
import { TooltipPlanType, TooltipPosition, TooltipProps, TooltipThemeContext } from './types';

// Export the main component
export { Tooltip };

// Export the theme provider and utilities
export {
    TooltipThemeProvider, useEffectiveTheme, useTooltipTheme
};

// Export types
export type {
    TooltipPlanType, TooltipPosition, TooltipProps,
    TooltipThemeContext
};

// Default export
export default Tooltip;

