import classNames from 'classnames';
import * as React from 'react';
import './HeroButton.scss';

interface HeroButtonProps {
  href: string;
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Button component for the Hero section
 */
export const HeroButton: React.FC<HeroButtonProps> = ({
  href,
  children,
  variant = 'primary',
  leftIcon,
  rightIcon,
  className,
  fullWidth = false,
  size = 'large',
  onClick
}) => {
  const buttonClasses = classNames(
    'hero-button',
    `button--${size}`,
    `button--${variant}`,
    {
      'button--fullwidth': fullWidth,
      'button--with-left-icon': leftIcon,
      'button--with-right-icon': rightIcon,
    },
    className
  );

  // Add click handler logic
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <a
      href={href}
      className={buttonClasses}
      onClick={handleClick}
    >
      {leftIcon && <span className="button__icon button__icon--left">{leftIcon}</span>}
      <span className="button__text">{children}</span>
      {rightIcon && <span className="button__icon button__icon--right">{rightIcon}</span>}
    </a>
  );
}; 