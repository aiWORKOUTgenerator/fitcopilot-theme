/**
 * FeatureButton Component
 * A specialized button for the homepage features section with theme support and icon handling
 */

import classNames from 'classnames';
import React from 'react';
import { useTheme } from '../../../../../context/ThemeContext';
import { Button } from '../../../../../features/shared/Button';
import { ButtonSize, HeroButtonProps } from '../../../../../features/shared/Button/types/standardButtonTypes';
import './FeatureButton.scss';

/**
 * Props interface for FeatureButton extending HeroButtonProps
 */
export interface FeatureButtonProps extends HeroButtonProps {
  /** Optional gradient class for background */
  gradientClass?: string;
}

/**
 * FeatureButton component for the homepage features section
 * Extends the base Button component with Feature-specific styling
 * 
 * @param props - FeatureButton properties
 * @returns React component
 */
export const FeatureButton: React.FC<FeatureButtonProps> = ({
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
  gradientClass,
  ...restProps
}) => {
  // Access theme context (currently not used but kept for future theme-aware enhancements)
  const { theme: _theme } = useTheme();
  
  // Construct CSS classes
  const buttonClasses = classNames(
    'feature-button',
    `feature-button-${variant}`,
    `feature-button--${size}`,
    {
      'feature-button--full-width': fullWidth
    },
    gradientClass,
    className
  );
  
  return (
    <Button
      variant={variant}
      size={size as ButtonSize}
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

export default FeatureButton; 