/**
 * Button component type definitions
 */

import React from 'react';
import { ButtonClickHandler } from '../../../types/events';

/**
 * Icon type definition for button icons
 */
export type IconType = React.ComponentType<{
    className?: string;
    size?: number;
    color?: string;
}>;

/**
 * Base button props used across all button variants
 */
export interface BaseButtonProps {
    /** Button text content */
    children: React.ReactNode;
    /** Additional CSS class names */
    className?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Unique identifier */
    id?: string;
    /** Button click handler */
    onClick?: ButtonClickHandler;
    /** Button type attribute */
    type?: 'button' | 'submit' | 'reset';
    /** ARIA attributes */
    'aria-label'?: string;
    'aria-controls'?: string;
    'aria-expanded'?: boolean;
    'aria-pressed'?: boolean;
    'aria-describedby'?: string;
    /** Data attributes */
    'data-testid'?: string;
    'data-track'?: string;
}

/**
 * Primary button variant props
 */
export interface PrimaryButtonProps extends BaseButtonProps {
    /** The button variant */
    variant: 'primary';
    /** Button size */
    size?: 'sm' | 'md' | 'lg';
    /** Loading state */
    isLoading?: boolean;
}

/**
 * Secondary button variant props
 */
export interface SecondaryButtonProps extends BaseButtonProps {
    /** The button variant */
    variant: 'secondary';
    /** Button size */
    size?: 'sm' | 'md' | 'lg';
    /** Outline style */
    outline?: boolean;
}

/**
 * Text button variant props
 */
export interface TextButtonProps extends BaseButtonProps {
    /** The button variant */
    variant: 'text';
    /** Underline styling */
    underline?: boolean;
}

/**
 * Icon button variant props
 */
export interface IconButtonProps extends BaseButtonProps {
    /** The button variant */
    variant: 'icon';
    /** Icon component */
    icon: IconType;
    /** Icon position */
    iconPosition?: 'left' | 'right';
    /** Additional text */
    text?: string;
}

/**
 * Toggle button variant props
 */
export interface ToggleButtonProps extends BaseButtonProps {
    /** The button variant */
    variant: 'toggle';
    /** Active state */
    isActive: boolean;
    /** Label to show when active */
    activeLabel?: string;
    /** Label to show when inactive */
    inactiveLabel?: string;
    /** Toggle callback with new state */
    onToggle?: (isActive: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Link button variant props
 */
export interface LinkButtonProps extends BaseButtonProps {
    /** The button variant */
    variant: 'link';
    /** URL to navigate to */
    href: string;
    /** Open in new tab */
    openInNewTab?: boolean;
    /** Link relation */
    rel?: string;
    /** Link target */
    target?: string;
}

/**
 * Floating action button props
 */
export interface FloatingActionButtonProps extends BaseButtonProps {
    /** The button variant */
    variant: 'floating';
    /** Icon component */
    icon: IconType;
    /** Button position */
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    /** Show label on hover */
    tooltip?: {
        text: string;
        position?: 'top' | 'bottom' | 'left' | 'right';
    };
}

/**
 * Workout action button props - specific to fitness domain
 */
export interface WorkoutButtonProps extends BaseButtonProps {
    /** The button variant */
    variant: 'workout';
    /** Workout difficulty level */
    level?: 'beginner' | 'intermediate' | 'advanced';
    /** Duration in minutes */
    duration?: number;
    /** Calories burned estimate */
    calories?: number;
}

/**
 * Discriminated union type for all button variants
 */
export type ButtonProps =
    | PrimaryButtonProps
    | SecondaryButtonProps
    | TextButtonProps
    | IconButtonProps
    | ToggleButtonProps
    | LinkButtonProps
    | FloatingActionButtonProps
    | WorkoutButtonProps;

/**
 * Type guards for button variants
 */
export const isPrimaryButton = (props: ButtonProps): props is PrimaryButtonProps =>
    props.variant === 'primary';

export const isSecondaryButton = (props: ButtonProps): props is SecondaryButtonProps =>
    props.variant === 'secondary';

export const isTextButton = (props: ButtonProps): props is TextButtonProps =>
    props.variant === 'text';

export const isIconButton = (props: ButtonProps): props is IconButtonProps =>
    props.variant === 'icon';

export const isToggleButton = (props: ButtonProps): props is ToggleButtonProps =>
    props.variant === 'toggle';

export const isLinkButton = (props: ButtonProps): props is LinkButtonProps =>
    props.variant === 'link';

export const isFloatingActionButton = (props: ButtonProps): props is FloatingActionButtonProps =>
    props.variant === 'floating';

export const isWorkoutButton = (props: ButtonProps): props is WorkoutButtonProps =>
    props.variant === 'workout'; 