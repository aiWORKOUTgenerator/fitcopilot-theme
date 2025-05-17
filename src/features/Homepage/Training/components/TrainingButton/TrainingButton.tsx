/**
 * TrainingButton Component
 * A specialized button for the homepage training section with theme support and icon handling
 */

import classNames from 'classnames';
import React from 'react';
import { useTheme } from '../../../../../context/ThemeContext';
import { Button } from '../../../../../features/shared/Button';
import { ButtonSize, HeroButtonProps } from '../../../../../features/shared/Button/types/standardButtonTypes';
import './TrainingButton.scss';

/**
 * Props interface for TrainingButton extending HeroButtonProps
 */
export interface TrainingButtonProps extends HeroButtonProps {
  /** Optional style variants specific to training section */
  styleVariant?: 'standard' | 'accent' | 'athletic';
}

/**
 * TrainingButton component for the homepage training section
 * Extends the base Button component with Training-specific styling
 * 
 * @param props - TrainingButton properties
 * @returns React component
 */
export const TrainingButton: React.FC<TrainingButtonProps> = ({
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
  styleVariant = 'standard',
  ...restProps
}) => {
  // Access theme context
  const { theme } = useTheme();
  
  // Construct CSS classes
  const buttonClasses = classNames(
    'training-button',
    `training-button-${variant}`,
    `training-button--${size}`,
    `training-button--${styleVariant}`,
    {
      'training-button--full-width': fullWidth
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

export default TrainingButton; 