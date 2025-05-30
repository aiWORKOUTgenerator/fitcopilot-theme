/**
 * JourneyButton Component
 * A specialized button for the homepage journey section with theme support and icon handling
 */

import classNames from 'classnames';
import React from 'react';
import { useTheme } from '../../../../../context/ThemeContext';
import { HeroButtonProps } from '../../../../../features/shared/Button/types/standardButtonTypes';
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
 * Renders directly without shared Button component to avoid CSS conflicts
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
  type = 'button',
  target,
  rel,
  style,
  ...restProps
}) => {
  // Access theme context
  const { theme: _theme } = useTheme();
  
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

  // Create button content
  const content = (
    <>
      {leftIcon && <span className="journey-button__icon journey-button__icon--left">{leftIcon}</span>}
      <span className="journey-button__text">{children}</span>
      {rightIcon && <span className="journey-button__icon journey-button__icon--right">{rightIcon}</span>}
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

export default JourneyButton; 