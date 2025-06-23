/**
 * PersonalTrainingButton Component
 * A specialized button for the homepage personal training section with theme support and icon handling
 */

import classNames from 'classnames';
import React from 'react';
import { useTheme } from '../../../../../context/ThemeContext';
import { Button } from '../../../../../features/shared/Button';
import { ButtonSize, HeroButtonProps } from '../../../../../features/shared/Button/types/standardButtonTypes';
import './PersonalTrainingButton.scss';

/**
 * Props interface for PersonalTrainingButton extending HeroButtonProps
 */
export interface PersonalTrainingButtonProps extends HeroButtonProps {
  /** Optional coach type for personalized styling */
  coachType?: 'strength' | 'nutrition' | 'performance' | 'recovery';
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
 * PersonalTrainingButton component for the homepage personal training section
 * Extends the base Button component with PersonalTraining-specific styling
 * 
 * @param props - PersonalTrainingButton properties
 * @returns React component
 */
export const PersonalTrainingButton: React.FC<PersonalTrainingButtonProps> = ({
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
  coachType = 'strength',
  ...restProps
}) => {
  // Access theme context
  const { theme } = useTheme();
  
  // Construct CSS classes
  const buttonClasses = classNames(
    'personal-training-button',
    `personal-training-button-${variant}`,
    `personal-training-button--${size}`,
    {
      'personal-training-button--full-width': fullWidth,
      [`personal-training-button--${coachType}`]: coachType
    },
    className
  );

  // Create icon elements if needed
  const startIcon = leftIcon ? <span className="personal-training-button__icon--left">{leftIcon}</span> : undefined;
  const endIcon = rightIcon ? <span className="personal-training-button__icon--right">{rightIcon}</span> : undefined;
  
  const _theme = theme || 'default';

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

export default PersonalTrainingButton; 