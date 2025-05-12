import React from 'react';
import { ExtendedCSSProperties, ButtonProps as GlobalButtonProps } from '../../../types/components';
import { ButtonThemeContext } from './context';

type ButtonElementProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorElementProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * ButtonVariant Types
 * 
 * Defines the variant types for the Button component
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'gradient' | 'violet-indigo';

/**
 * ButtonSize Types
 * 
 * Defines the size types for the Button component
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Extended ButtonProps Interface
 * 
 * Extends global ButtonProps with theme specific properties
 */
export type ButtonProps = Omit<GlobalButtonProps, 'variant' | 'size'> & {
    /** Button size variant */
    size?: ButtonSize;
    /** Button color variant */
    variant?: ButtonVariant;
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
    /** Custom CSS properties for token overrides */
    style?: ExtendedCSSProperties;
    /** Render as button or anchor element */
    as?: 'button' | 'a';
} & (
        | ({ as?: 'button' } & ButtonElementProps)
        | ({ as: 'a' } & AnchorElementProps)
    );

/**
 * Extended HeroButtonProps Interface
 * 
 * Extends global HeroButtonProps with theme specific properties
 */
export type HeroButtonProps = Omit<ButtonProps, '_variant'> & {
    /** Identify as hero variant */
    _variant: 'hero';
    /** Hero-specific visual treatment */
    heroStyle?: 'gradient' | 'outlined' | 'solid';
    /** Animation variant for hero buttons */
    animation?: 'pulse' | 'bounce' | 'none';
}; 