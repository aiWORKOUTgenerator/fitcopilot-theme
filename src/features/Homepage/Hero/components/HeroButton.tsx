/**
 * HeroButton Component
 * A specialized button for the homepage hero section with theme support and icon handling
 */

import React from 'react';
import { Button } from '../../../../features/shared/Button';
import { ButtonProps, ButtonSize } from '../../../../features/shared/Button/types';
import './HeroButton.scss';

/**
 * HeroButton size mapping
 */
type HeroButtonSize = 'small' | 'medium' | 'large';

/**
 * HeroButton props interface
 */
export interface HeroButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  /** Visual style variant of the button */
  variant: 'primary' | 'secondary';
  /** Icon to display on the left side of the button text */
  leftIcon?: React.ReactNode;
  /** Icon to display on the right side of the button text */
  rightIcon?: React.ReactNode;
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** Size variant of the button */
  size?: HeroButtonSize;
}

/**
 * HeroButton component for the homepage hero section
 * Extends the shared Button with hero-specific styling and icon support
 * 
 * @param props - HeroButton properties
 * @returns React component
 */
export const HeroButton: React.FC<HeroButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  leftIcon,
  rightIcon,
  fullWidth = false,
  size = 'medium',
  ...restProps
}) => {
  // Map size to shared button size prop
  const sizeMap: Record<HeroButtonSize, ButtonSize> = {
    small: 'sm',
    medium: 'md',
    large: 'lg'
  };
  
  // Map HeroButton variant to shared Button variant
  const buttonVariant = variant as "primary" | "secondary";
  
  // Transform to shared Button props with proper token-aware classnames
  // Ensure both hero-button and btn classes are applied
  const heroClasses = [
    'hero-button',
    `hero-button--${variant}`,
    `hero-button--${size}`,
    fullWidth ? 'hero-button--full-width' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <Button
      variant={buttonVariant}
      className={heroClasses}
      size={sizeMap[size]}
      {...restProps}
    >
      {leftIcon && <span className="hero-button__icon hero-button__icon--left">{leftIcon}</span>}
      <span className="hero-button__text">{children}</span>
      {rightIcon && <span className="hero-button__icon hero-button__icon--right">{rightIcon}</span>}
    </Button>
  );
};

export default HeroButton; 