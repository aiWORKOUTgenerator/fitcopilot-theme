import React from 'react';
import { ButtonThemeContext } from './context';

type ButtonElementProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorElementProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * ButtonProps Interface
 * 
 * Defines the properties for the Button component
 */
export type ButtonProps = {
    /** Button size variant */
    size?: 'small' | 'medium' | 'large';
    /** Button color variant */
    variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'gradient' | 'violet-indigo';
    /** Sets width to 100% when true */
    fullWidth?: boolean;
    /** Shows loading spinner and disables button when true */
    isLoading?: boolean;
    /** Icon to display before button text */
    leftIcon?: React.ReactNode;
    /** Icon to display after button text */
    rightIcon?: React.ReactNode;
    /** Theme context for specific styling */
    themeContext?: ButtonThemeContext;
    /** Button content */
    children: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Whether the button is disabled */
    disabled?: boolean;
    /** Render as button or anchor element */
    as?: 'button' | 'a';
} & (
        | ({ as?: 'button' } & ButtonElementProps)
        | ({ as: 'a' } & AnchorElementProps)
    ); 