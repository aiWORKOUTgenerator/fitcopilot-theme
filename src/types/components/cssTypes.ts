/**
 * CSS Types
 * 
 * TypeScript types for CSS properties and variables.
 * These types help maintain type safety when using CSS-in-JS or custom CSS properties.
 */

import React from 'react';

/**
 * Type for CSS custom properties (CSS variables)
 * This enables using CSS variables with type safety in style objects
 */
export interface CSSCustomProperties {
    [key: `--${string}`]: string | number | undefined;
}

/**
 * Extended CSS Properties that support CSS custom variables
 * This allows for both standard React CSSProperties and custom CSS variables
 */
export type ExtendedCSSProperties = React.CSSProperties & CSSCustomProperties;

/**
 * CSS Variables for specific component groups
 * These interfaces can be extended for component-specific CSS variables
 */

/**
 * CSS variables for theme colors
 */
export interface ThemeColorVariables extends CSSCustomProperties {
    '--color-primary'?: string;
    '--color-secondary'?: string;
    '--color-accent'?: string;
    '--color-background'?: string;
    '--color-text'?: string;
    '--color-border'?: string;
    '--color-focus'?: string;
}

/**
 * CSS variables for typography
 */
export interface TypographyVariables extends CSSCustomProperties {
    '--font-family'?: string;
    '--font-size-base'?: string;
    '--font-size-small'?: string;
    '--font-size-large'?: string;
    '--font-weight-normal'?: string | number;
    '--font-weight-bold'?: string | number;
    '--line-height'?: string | number;
}

/**
 * CSS variables for spacing
 */
export interface SpacingVariables extends CSSCustomProperties {
    '--spacing-xs'?: string;
    '--spacing-sm'?: string;
    '--spacing-md'?: string;
    '--spacing-lg'?: string;
    '--spacing-xl'?: string;
}

/**
 * CSS variables for layout
 */
export interface LayoutVariables extends CSSCustomProperties {
    '--border-radius'?: string;
    '--container-width'?: string;
    '--column-gap'?: string;
    '--row-gap'?: string;
}

/**
 * CSS variables for animation
 */
export interface AnimationVariables extends CSSCustomProperties {
    '--transition-duration'?: string;
    '--transition-timing'?: string;
    '--animation-speed'?: string;
}

/**
 * Combined CSS variables for all component types
 */
export interface AllCSSVariables extends
    ThemeColorVariables,
    TypographyVariables,
    SpacingVariables,
    LayoutVariables,
    AnimationVariables { }

/**
 * Comprehensive CSS Properties type that includes both standard properties
 * and all custom variables
 */
export type ComprehensiveCSSProperties = React.CSSProperties & AllCSSVariables; 