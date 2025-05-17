/**
 * PricingButton Component
 * A specialized button for the homepage pricing section with theme support and icon handling
 */

import classNames from 'classnames';
import React from 'react';
import { useTheme } from '../../../../../context/ThemeContext';
import { Button } from '../../../../../features/shared/Button';
import { ButtonSize, HeroButtonProps } from '../../../../../features/shared/Button/types/standardButtonTypes';
import './PricingButton.scss';

/**
 * Props interface for PricingButton extending HeroButtonProps
 */
export interface PricingButtonProps extends HeroButtonProps {
  /** Optional plan type for styling */
  planType?: 'basic' | 'pro' | 'elite' | 'custom';
  /** Optional gradient color for the button */
  gradientColors?: string;
}

/**
 * Maps standardized size values to base Button size values
 */
const mapSizeToButtonSize = (size: ButtonSize): 'sm' | 'md' | 'lg' => {
  switch (size) {
    case 'small': return 'sm';
    case 'medium': return 'md';
    case 'large': return 'lg';
    default: return 'md';
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
  variant = 'primary',
  leftIcon,
  rightIcon,
  fullWidth = false,
  size = 'medium',
  href,
  onClick,
  disabled = false,
  planType = 'basic',
  gradientColors,
  ...restProps
}) => {
  // Access theme context safely
  let theme = 'default';
  try {
    const themeContext = useTheme();
    if (themeContext) {
      theme = themeContext.theme;
    }
  } catch (e) {
    // If ThemeContext is not available, use default theme
    console.debug('ThemeContext not available, using default theme');
  }
  
  // Construct CSS classes
  const buttonClasses = classNames(
    'pricing-button',
    `pricing-button-${variant}`,
    `pricing-button--${size}`,
    {
      'pricing-button--full-width': fullWidth,
      [`pricing-button--${planType}`]: planType,
      [gradientColors || '']: gradientColors
    },
    className
  );

  // Create icon elements if needed
  const startIcon = leftIcon ? <span className="pricing-button__icon--left">{leftIcon}</span> : undefined;
  const endIcon = rightIcon ? <span className="pricing-button__icon--right">{rightIcon}</span> : undefined;
  
  return (
    <Button
      variant={variant}
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