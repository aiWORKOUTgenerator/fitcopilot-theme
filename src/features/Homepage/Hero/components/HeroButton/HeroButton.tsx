/**
 * HeroButton Component
 * A specialized button for the homepage hero section with theme support and icon handling
 */

import classNames from 'classnames';
import React from 'react';
import { useTheme } from '../../../../../context/ThemeContext';
import { Button } from '../../../../../features/shared/Button';
import { ButtonSize, HeroButtonProps } from '../../../../../features/shared/Button/types/standardButtonTypes';
import './HeroButton.scss';

/**
 * HeroButton size mapping
 */
type HeroButtonSize = 'small' | 'medium' | 'large';

/**
 * HeroButton component for the homepage hero section
 * Extends the base Button component with Hero-specific styling
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
  href,
  onClick,
  disabled = false,
  ...restProps
}) => {
  // Access theme context
  const { theme } = useTheme();
  
  // Construct CSS classes
  const buttonClasses = classNames(
    'hero-button',
    `hero-button-${variant}`,
    `hero-button--${size}`,
    {
      'hero-button--full-width': fullWidth
    },
    className
  );
  
  // Removed inline styles to allow CSS to take precedence
  
  return (
    <Button
      variant={variant}
      size={size}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      fullWidth={fullWidth}
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
      {children}
    </Button>
  );
};

export default HeroButton; 