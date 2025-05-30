/**
 * FeatureButton Component
 * A specialized button for the homepage features section with theme support and icon handling
 * 
 * @deprecated Consider using FeatureCTA as the primary call-to-action button for Features section.
 * This component is maintained as an alternative option for specific use cases that require
 * different styling or behavior than the standard FeatureCTA component.
 */

import classNames from 'classnames';
import React from 'react';
import { useTheme } from '../../../../../context/ThemeContext';
import { HeroButtonProps } from '../../../../../features/shared/Button/types/standardButtonTypes';
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
 * Renders directly without shared Button component to avoid CSS conflicts
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
  type = 'button',
  target,
  rel,
  style,
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

  // Create button content
  const content = (
    <>
      {leftIcon && <span className="feature-button__icon feature-button__icon--left">{leftIcon}</span>}
      <span className="feature-button__text">{children}</span>
      {rightIcon && <span className="feature-button__icon feature-button__icon--right">{rightIcon}</span>}
    </>
  );

  // Render as link if href is provided
  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        target={target}
        rel={rel}
        style={style}
        aria-label={restProps['aria-label']}
        aria-controls={restProps['aria-controls']}
        aria-expanded={restProps['aria-expanded']}
        aria-pressed={restProps['aria-pressed']}
        {...restProps}
      >
        {content}
      </a>
    );
  }

  // Render as button if no href is provided
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      style={style}
      aria-label={restProps['aria-label']}
      aria-controls={restProps['aria-controls']}
      aria-expanded={restProps['aria-expanded']}
      aria-pressed={restProps['aria-pressed']}
      {...restProps}
    >
      {content}
    </button>
  );
};

export default FeatureButton; 