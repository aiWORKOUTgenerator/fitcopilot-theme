import React from 'react';
import {
    ExtendedCSSProperties,
    ExerciseTooltipProps as GlobalExerciseTooltipProps,
    HelpTooltipProps as GlobalHelpTooltipProps,
    TooltipProps as GlobalTooltipProps,
    TooltipPlanType
} from '../../../types/components';

/**
 * Extended Tooltip props interface
 * 
 * Extends the global TooltipProps with component-specific properties
 */
export interface TooltipProps extends GlobalTooltipProps {
    /** Optional title for the tooltip */
    title?: string;
    /** Title color class (Tailwind color class) */
    titleColor?: string;
    /** Optional icon */
    icon?: React.ReactNode;
    /** Width of the tooltip in pixels or any valid CSS width */
    width?: string;
    /** Whether to show on hover */
    showOnHover?: boolean;
    /** Whether to show on focus */
    showOnFocus?: boolean;
    /** Delay before showing (ms) */
    delay?: number;
    /** Border accent color (in rgba format) */
    accentColor?: string;
    /** Plan type for styling plan-specific tooltips (basic, pro, elite) - primarily for pricing tooltips */
    planType?: TooltipPlanType;
}

/**
 * Extended Exercise Tooltip props
 */
export interface ExerciseTooltipProps extends GlobalExerciseTooltipProps {
    /** Exercise summary display mode */
    summaryDisplay?: 'compact' | 'detailed';
    /** Whether to show difficulty indicator */
    showDifficulty?: boolean;
    /** Whether to show muscle group tags */
    showMuscleGroups?: boolean;
    /** Custom CSS properties for token overrides */
    style?: ExtendedCSSProperties;
}

/**
 * Extended Help Tooltip props
 */
export interface HelpTooltipProps extends GlobalHelpTooltipProps {
    /** Whether to use dotted underline style for triggering element */
    useDottedUnderline?: boolean;
    /** Icon color class (Tailwind class) */
    iconColor?: string;
    /** Custom CSS properties for token overrides */
    style?: ExtendedCSSProperties;
}

/**
 * Tooltip props using discriminated union for type safety
 */
export type DiscriminatedTooltipProps =
    | (TooltipProps & { _variant?: 'default' })
    | (ExerciseTooltipProps & { _variant: 'exercise' })
    | (HelpTooltipProps & { _variant: 'help' }); 