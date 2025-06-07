/**
 * PricingButton Component
 * A specialized button for the homepage pricing section with theme support and icon handling
 * Follows the established Homepage button architecture pattern
 */

import classNames from 'classnames';
import React from 'react';
import { useTheme } from '../../../../../context/ThemeContext';
import { Button } from '../../../../../features/shared/Button';
import { ButtonSize, ButtonVariant, HeroButtonProps } from '../../../../../features/shared/Button/types/standardButtonTypes';
import { GlobalVariantKey } from '../../../types/shared';
import './PricingButton.scss';

/**
 * Props interface for PricingButton extending HeroButtonProps but with theme variant
 */
export interface PricingButtonProps extends Omit<HeroButtonProps, 'variant'> {
  /** Button style variant */
  buttonVariant?: ButtonVariant;
  /** Optional plan type for styling */
  planType?: 'basic' | 'pro' | 'elite' | 'custom';
  /** Optional gradient colors for the button */
  gradientColors?: string;
  /** Theme variant for styling */
  themeVariant?: GlobalVariantKey;
}

/**
 * Map internal size to ButtonSize
 */
const mapSizeToButtonSize = (size?: string): ButtonSize => {
  switch (size) {
    case 'small': return 'small';
    case 'large': return 'large';
    case 'medium': return 'medium';
    default: return 'medium';
  }
};

/**
 * PricingButton component for the homepage pricing section
 * Extends the base Button component with Pricing-specific styling
 * 
 * @param props - PricingButton properties
 * @returns React component
 */
export const PricingButton: React.FC<PricingButtonProps> = ({
  children,
  className = '',
  buttonVariant = 'primary',
  leftIcon,
  rightIcon,
  fullWidth = false,
  size = 'medium',
  href,
  onClick,
  disabled = false,
  planType = 'basic',
  gradientColors,
  themeVariant = 'default',
  ...restProps
}) => {
  // Access theme context safely
  let theme = themeVariant;
  try {
    const themeContext = useTheme();
    if (themeContext && themeContext.theme) {
      theme = themeContext.theme as GlobalVariantKey;
    }
  } catch (e) {
    // If ThemeContext is not available, use provided variant or default
    console.debug('ThemeContext not available, using provided variant or default theme');
  }
  
  // Construct CSS classes following the established pattern
  const buttonClasses = classNames(
    'pricing-button',
    `pricing-button-${buttonVariant}`,
    `pricing-button--${size}`,
    {
      'pricing-button--full-width': fullWidth,
      [`pricing-button--${planType}`]: planType,
      [`pricing-button--theme-${theme}`]: theme !== 'default',
      [gradientColors || '']: gradientColors
    },
    className
  );

  // Create icon elements if needed
  const startIcon = leftIcon ? <span className="pricing-button__icon pricing-button__icon--left">{leftIcon}</span> : undefined;
  const endIcon = rightIcon ? <span className="pricing-button__icon pricing-button__icon--right">{rightIcon}</span> : undefined;
  
  return (
    <Button
      variant={buttonVariant}
      size={mapSizeToButtonSize(size)}
      href={href}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      aria-label={restProps['aria-label']}
      aria-controls={restProps['aria-controls']}
      aria-expanded={restProps['aria-expanded']}
      aria-pressed={restProps['aria-pressed']}
      {...restProps}
    >
      {startIcon}
      {children}
      {endIcon}
    </Button>
  );
};

export default PricingButton; 