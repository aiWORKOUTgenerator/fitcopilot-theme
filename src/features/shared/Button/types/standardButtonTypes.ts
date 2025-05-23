/**
 * Standardized Button Types
 * 
 * This file defines the standardized button props interfaces
 * to be used across all button components in the application.
 */

import React from 'react';

/**
 * Standard button click handler type
 */
export type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;

/**
 * Standard button size options
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Standard button variant options
 */
export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'icon' | 'link';

/**
 * Button shadow size options
 */
export type ButtonShadowSize = 'sm' | 'md' | 'lg' | 'default';

/**
 * Button hover effect options
 */
export type ButtonHoverEffect = 'none' | 'lift' | 'scale' | 'glow' | 'float';

/**
 * Base button properties shared by all button components
 */
export interface ButtonBaseProps {
  /** Button content (text or elements) */
  children: React.ReactNode;
  
  /** Visual style variant */
  variant?: ButtonVariant;
  
  /** Size variant */
  size?: ButtonSize;
  
  /** Whether the button is disabled */
  disabled?: boolean;
  
  /** Additional CSS class names */
  className?: string;
  
  /** Click handler */
  onClick?: ButtonClickHandler;
  
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  
  /** Left icon */
  leftIcon?: React.ReactNode;
  
  /** Right icon */
  rightIcon?: React.ReactNode;
  
  /** Whether the button should take full width */
  fullWidth?: boolean;
  
  /** URL (renders as anchor) */
  href?: string;
  
  /** Target for href */
  target?: string;
  
  /** Rel attribute for href */
  rel?: string;
  
  /** Inline styles */
  style?: React.CSSProperties;
  
  /** Whether to use gradient background (for primary variant) */
  gradient?: boolean;
  
  /** Whether to apply shadow to the button */
  shadow?: boolean;
  
  /** Size of the shadow if shadow is enabled */
  shadowSize?: ButtonShadowSize;
  
  /** Hover effect to apply */
  hoverEffect?: ButtonHoverEffect;
  
  /** Custom color for glow effect (CSS color value) */
  glowColor?: string;
  
  /** ARIA attributes */
  'aria-label'?: string;
  'aria-controls'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  
  /** Testing attribute */
  'data-testid'?: string;
}

/**
 * Standard button props interface with required variant
 */
export interface StandardButtonProps extends ButtonBaseProps {
  /** Visual style variant (required) */
  variant: ButtonVariant;
}

/**
 * Hero button props interface that extends the standard button props
 */
export interface HeroButtonProps extends ButtonBaseProps {
  /** Visual style variant (limited to primary/secondary for Hero) */
  variant: 'primary' | 'secondary';
}

/**
 * Type guard to check if props are for a link button
 */
export const isLinkButton = (props: ButtonBaseProps): boolean => 
  typeof props.href === 'string' && props.href.length > 0;

/**
 * Type guard to check if props include an icon
 */
export const hasIcon = (props: ButtonBaseProps): boolean =>
  Boolean(props.leftIcon || props.rightIcon); 