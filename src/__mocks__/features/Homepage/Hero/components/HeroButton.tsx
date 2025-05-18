import React from 'react';

// Define a simplified version of the needed props
interface HeroButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'data-testid'?: string;
  href?: string;
  fullWidth?: boolean;
  [key: string]: any; // Allow any other props
}

/**
 * Mock HeroButton component for testing
 * This implementation doesn't depend on ThemeContext
 */
export const HeroButton: React.FC<HeroButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  className = '',
  children,
  ...restProps
}) => {
  // Construct class names for testing
  const buttonClasses = `btn hero-button hero-button-${variant} hero-button--${size} ${className}`.trim();
  
  // Handle href prop separately to render as link
  if (restProps.href) {
    const { href, ...otherProps } = restProps;
    return (
      <a 
        href={href} 
        className={buttonClasses} 
        {...otherProps}
      >
        {children}
      </a>
    );
  }
  
  return (
    <button 
      className={buttonClasses} 
      type={restProps.type || 'button'}
      {...restProps}
    >
      {children}
    </button>
  );
};

// Export the component itself as the default export
export default HeroButton; 