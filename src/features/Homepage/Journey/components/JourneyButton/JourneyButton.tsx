/**
 * JourneyButton Component
 * A specialized button for the homepage journey section with theme support and icon handling
 */

import classNames from 'classnames';
import React from 'react';
import { useTheme } from '../../../../../context/ThemeContext';
import { Button } from '../../../../../features/shared/Button';
import { ButtonSize, HeroButtonProps } from '../../../../../features/shared/Button/types/standardButtonTypes';
import './JourneyButton.scss';

/**
 * Props interface for JourneyButton extending HeroButtonProps
 */
export interface JourneyButtonProps extends HeroButtonProps {
  /** Optional gradient color */
  gradientColor?: 'lime' | 'cyan' | 'violet' | 'amber';
}

/**
 * JourneyButton component for the homepage journey section
 * Extends the base Button component with Journey-specific styling
 * 
 * @param props - JourneyButton properties
 * @returns React component
 */
export const JourneyButton: React.FC<JourneyButtonProps> = ({
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
  gradientColor = 'lime',
  ...restProps
}) => {
  // Access theme context
  const { theme } = useTheme();
  
  // Construct CSS classes
  const buttonClasses = classNames(
    'journey-button',
    `journey-button-${variant}`,
    `journey-button--${size}`,
    {
      'journey-button--full-width': fullWidth,
      [`journey-gradient-${gradientColor}`]: variant === 'primary'
    },
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

export default JourneyButton; 