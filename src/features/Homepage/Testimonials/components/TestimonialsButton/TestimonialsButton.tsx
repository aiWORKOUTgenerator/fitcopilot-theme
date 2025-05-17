/**
 * TestimonialsButton Component
 * A specialized button for the homepage testimonials section with theme support and icon handling
 */

import classNames from 'classnames';
import React from 'react';
import { useTheme } from '../../../../../context/ThemeContext';
import { Button } from '../../../../../features/shared/Button';
import { ButtonSize, HeroButtonProps } from '../../../../../features/shared/Button/types/standardButtonTypes';
import './TestimonialsButton.scss';

/**
 * Props interface for TestimonialsButton extending HeroButtonProps
 */
export interface TestimonialsButtonProps extends HeroButtonProps {
  /** Optional testimonial type for styling */
  testimonialType?: 'athlete' | 'professional' | 'enthusiast' | 'success';
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
 * TestimonialsButton component for the homepage testimonials section
 * Extends the base Button component with Testimonials-specific styling
 * 
 * @param props - TestimonialsButton properties
 * @returns React component
 */
export const TestimonialsButton: React.FC<TestimonialsButtonProps> = ({
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
  testimonialType = 'athlete',
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
    'testimonials-button',
    `testimonials-button-${variant}`,
    `testimonials-button--${size}`,
    {
      'testimonials-button--full-width': fullWidth,
      [`testimonials-button--${testimonialType}`]: testimonialType
    },
    className
  );

  // Create icon elements if needed
  const startIcon = leftIcon ? <span className="testimonials-button__icon--left">{leftIcon}</span> : undefined;
  const endIcon = rightIcon ? <span className="testimonials-button__icon--right">{rightIcon}</span> : undefined;
  
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

export default TestimonialsButton; 