/**
 * TrainingFeaturesButton Component
 * A specialized button for the homepage training features section with theme support and icon handling
 */

import classNames from 'classnames';
import React from 'react';
import { useTheme } from '../../../../../context/ThemeContext';
import { Button } from '../../../../../features/shared/Button';
import { ButtonSize, HeroButtonProps } from '../../../../../features/shared/Button/types/standardButtonTypes';
import './TrainingFeaturesButton.scss';

/**
 * Props interface for TrainingFeaturesButton extending HeroButtonProps
 */
export interface TrainingFeaturesButtonProps extends HeroButtonProps {
  /** Optional feature type for styling */
  featureType?: 'virtual' | 'tracking' | 'scheduling' | 'support' | 'mobile';
  /** Optional gradient class name */
  gradientClass?: string;
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
 * TrainingFeaturesButton component for the homepage training features section
 * Extends the base Button component with TrainingFeatures-specific styling
 * 
 * @param props - TrainingFeaturesButton properties
 * @returns React component
 */
export const TrainingFeaturesButton: React.FC<TrainingFeaturesButtonProps> = ({
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
  featureType = 'virtual',
  gradientClass,
  ...restProps
}) => {
  // Access theme context
  const { theme } = useTheme();
  
  // Construct CSS classes
  const buttonClasses = classNames(
    'training-features-button',
    `training-features-button-${variant}`,
    `training-features-button--${size}`,
    {
      'training-features-button--full-width': fullWidth,
      [`training-features-button--${featureType}`]: featureType,
      [gradientClass || '']: gradientClass
    },
    className
  );

  // Create icon elements if needed
  const startIcon = leftIcon ? <span className="training-features-button__icon--left">{leftIcon}</span> : undefined;
  const endIcon = rightIcon ? <span className="training-features-button__icon--right">{rightIcon}</span> : undefined;
  
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

export default TrainingFeaturesButton; 