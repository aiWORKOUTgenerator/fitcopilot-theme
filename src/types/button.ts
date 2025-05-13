/**
 * Type definitions for button components
 */
import React from 'react';

/**
 * Base button props interface
 */
export interface BaseButtonProps {
    /**
     * Button content
     */
    children: React.ReactNode;

    /**
     * Whether the button is disabled
     */
    disabled?: boolean;

    /**
     * Additional CSS class names
     */
    className?: string;

    /**
     * Accessibility label
     */
    ariaLabel?: string;

    /**
     * ID for the button element
     */
    id?: string;

    /**
     * Data attributes
     */
    [key: `data-${string}`]: string | number | boolean;
}

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'outline' | 'danger' | 'success' | 'warning' | 'info';

/**
 * Button size types
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button event handler types
 */
export type ButtonClickHandler = React.MouseEventHandler<HTMLButtonElement>;
export type ButtonFocusHandler = React.FocusEventHandler<HTMLButtonElement>;
export type ButtonHoverHandler = React.MouseEventHandler<HTMLButtonElement>;
export type ButtonKeyboardHandler = React.KeyboardEventHandler<HTMLButtonElement>;

/**
 * Complete button props interface
 */
export interface ButtonProps extends BaseButtonProps {
    /**
     * Button appearance variant
     */
    variant?: ButtonVariant;

    /**
     * Button size
     */
    size?: ButtonSize;

    /**
     * Click event handler
     */
    onClick?: ButtonClickHandler;

    /**
     * Focus event handler
     */
    onFocus?: ButtonFocusHandler;

    /**
     * Blur event handler
     */
    onBlur?: ButtonFocusHandler;

    /**
     * Mouse enter event handler
     */
    onMouseEnter?: ButtonHoverHandler;

    /**
     * Mouse leave event handler
     */
    onMouseLeave?: ButtonHoverHandler;

    /**
     * Key down event handler
     */
    onKeyDown?: ButtonKeyboardHandler;

    /**
     * Whether the button is in loading state
     */
    isLoading?: boolean;

    /**
     * Icon to display at the start of the button
     */
    startIcon?: React.ReactNode;

    /**
     * Icon to display at the end of the button
     */
    endIcon?: React.ReactNode;

    /**
     * Full width button
     */
    fullWidth?: boolean;

    /**
     * HTML button type
     */
    type?: 'button' | 'submit' | 'reset';

    /**
     * HTML form attribute
     */
    form?: string;
}

/**
 * Theme-specific button props
 */
export interface ThemeButtonProps extends ButtonProps {
    /**
     * Theme variant
     */
    themeVariant?: 'gym' | 'wellness' | 'sports' | 'default';

    /**
     * Intensity level (for gym theme)
     */
    intensity?: 'low' | 'medium' | 'high';

    /**
     * Rounded style
     */
    rounded?: boolean | 'full' | 'sm' | 'md' | 'lg';

    /**
     * Elevation/shadow level
     */
    elevation?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Icon button props
 */
export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
    /**
     * Icon to display
     */
    icon: React.ReactNode;

    /**
     * Accessible label for screen readers
     */
    ariaLabel: string;

    /**
     * Whether to use a circular button shape
     */
    circular?: boolean;
}

/**
 * Link button props (button that looks like a link)
 */
export interface LinkButtonProps extends Omit<ButtonProps, 'variant'> {
    /**
     * Whether to display as external link
     */
    external?: boolean;

    /**
     * URL for the link
     */
    href?: string;

    /**
     * Target attribute
     */
    target?: '_blank' | '_self' | '_parent' | '_top';

    /**
     * Rel attribute
     */
    rel?: string;
}

/**
 * Button group layout options
 */
export type ButtonGroupLayout = 'horizontal' | 'vertical';

/**
 * Button group props
 */
export interface ButtonGroupProps {
    /**
     * Buttons in the group
     */
    children: React.ReactNode;

    /**
     * Group layout direction
     */
    layout?: ButtonGroupLayout;

    /**
     * Spacing between buttons
     */
    spacing?: 'none' | 'sm' | 'md' | 'lg';

    /**
     * Whether to stretch buttons to fill container
     */
    stretch?: boolean;

    /**
     * Additional CSS class names
     */
    className?: string;
} 