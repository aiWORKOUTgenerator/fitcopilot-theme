/**
 * Button Component
 * Renders different button variants based on the variant prop
 */

import React from 'react';
import logger from '../../../../utils/logger';
import '../styles/Button.scss';
import { ButtonBaseProps } from '../types/standardButtonTypes';

/**
 * Button component that can render as either a button element or a link
 * based on the props provided.
 * 
 * @param props - Button properties
 * @returns React component
 */
export const Button: React.FC<ButtonBaseProps> = (props) => {
  // Handle null/undefined props with default empty object
  if (!props) {
    logger.warn('Button component received undefined props');
    return null; // Return null if props are undefined
  }

  const {
    variant = 'primary',
    className = '',
    size,
    children,
    leftIcon,
    rightIcon,
    disabled = false,
    onClick,
    type = 'button',
    fullWidth = false,
    href,
    target,
    rel,
    style,
    gradient = false,
    shadow = false,
    shadowSize = 'default',
    hoverEffect = 'none',
    glowColor,
    ...rest
  } = props;

  // Combine all class names
  let buttonClassName = `btn btn-${variant} ${size ? `btn-${size}` : ''} ${
    fullWidth ? 'btn-full-width' : ''
  }`;
  
  // Add gradient class if needed
  if (gradient) {
    buttonClassName += ' btn-gradient';
  }
  
  // Add shadow classes if needed
  if (shadow) {
    buttonClassName += ' btn-shadow';
    
    // Add shadow size class if it's not the default
    if (shadowSize !== 'default') {
      buttonClassName += ` btn-shadow-${shadowSize}`;
    }
  }
  
  // Add hover effect class if specified
  if (hoverEffect !== 'none') {
    buttonClassName += ` hover-effect-${hoverEffect}`;
  }
  
  // Add user's custom class
  buttonClassName += ` ${className}`.trim();
  
  // Generate custom styles with type-safe CSS variables
  const customStyles: React.CSSProperties = {
    ...(style || {}),
  };
  
  // Add custom glow color if specified and using glow effect
  if (glowColor && hoverEffect === 'glow') {
    // Use a type assertion to assign the CSS custom property
    (customStyles as React.CSSProperties & { '--button-hover-glow-color': string })['--button-hover-glow-color'] = glowColor;
  }

  // Create button content
  const content = (
    <>
      {leftIcon && <span className="btn__icon btn__icon--left">{leftIcon}</span>}
      <span className="btn__text">{children}</span>
      {rightIcon && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
    </>
  );

  // Render as link if href is provided
  if (href) {
    return (
      <a
        href={href}
        className={buttonClassName}
        target={target}
        rel={rel}
        style={customStyles}
        {...rest}
      >
        {content}
      </a>
    );
  }

  // Render as button if no href is provided
  return (
    <button
      type={type}
      className={buttonClassName}
      disabled={disabled}
      onClick={onClick}
      style={customStyles}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button; 