/**
 * HeroStyleButton Component
 * 
 * A utility component that uses the standard Button component
 * but with pre-configured props to match the HeroButton styling.
 */

import React from 'react';
import { ButtonBaseProps } from '../types/standardButtonTypes';
import { Button } from './Button';

/**
 * HeroStyleButton properties (extends ButtonBaseProps without variant)
 */
export type HeroStyleButtonProps = Omit<ButtonBaseProps, 'variant'> & {
  variant?: 'primary' | 'secondary';
  blurBackdrop?: boolean;
};

/**
 * HeroStyleButton component - Uses the standard Button component with
 * pre-configured props to match the HeroButton styling.
 * 
 * @param props - HeroStyleButton properties
 * @returns React component
 */
export const HeroStyleButton: React.FC<HeroStyleButtonProps> = (props) => {
  const {
    variant = 'primary',
    className = '',
    size = 'large',
    blurBackdrop = false,
    ...rest
  } = props;
  
  // Construct class name for backdrop blur if needed
  const additionalClasses = `${blurBackdrop && variant === 'secondary' ? 'backdrop-blur' : ''} ${className}`.trim();
  
  // Configure primary variant
  if (variant === 'primary') {
    return (
      <Button
        variant="primary"
        size={size}
        gradient
        shadow
        shadowSize="md"
        hoverEffect="lift"
        className={additionalClasses}
        {...rest}
      />
    );
  }
  
  // Configure secondary variant
  if (variant === 'secondary') {
    return (
      <Button
        variant="secondary"
        size={size}
        shadow={false}
        hoverEffect="float"
        className={`hero-style-secondary ${additionalClasses}`}
        {...rest}
      />
    );
  }
  
  // Fallback to primary (should never reach here due to default prop)
  return (
    <Button
      variant="primary"
      size={size}
      gradient
      shadow
      shadowSize="md"
      hoverEffect="lift"
      className={additionalClasses}
      {...rest}
    />
  );
};

export default HeroStyleButton; 