/**
 * Button Component
 * 
 * A reusable button component that supports different variants, sizes,
 * loading states, and accessibility features.
 * 
 * @example
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   Click Me
 * </Button>
 */

import classNames from 'classnames';
import React from 'react';
import './Button.scss';

export interface ButtonProps {
    /** Button size variant */
    size?: 'small' | 'medium' | 'large';
    /** Button color variant */
    variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
    /** Sets width to 100% when true */
    fullWidth?: boolean;
    /** Shows loading spinner and disables button when true */
    isLoading?: boolean;
    /** Icon to display before button text */
    leftIcon?: React.ReactNode;
    /** Icon to display after button text */
    rightIcon?: React.ReactNode;
    /** Section context for specific styling */
    themeContext?: string;
    /** Button content */
    children: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Whether the button is disabled */
    disabled?: boolean;
    /** Button click handler */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /** Button type */
    type?: 'button' | 'submit' | 'reset';
    /** Additional HTML attributes */
    [key: string]: any;
}

/**
 * Button component for triggering actions
 */
export const Button: React.FC<ButtonProps> = ({
    children,
    className,
    size = 'medium',
    variant = 'primary',
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    themeContext,
    disabled,
    ...rest
}) => {
    const buttonClasses = classNames(
        'button',
        `button--${size}`,
        `button--${variant}`,
        themeContext && `button--${themeContext}`,
        {
            'button--fullwidth': fullWidth,
            'button--loading': isLoading,
            'button--with-left-icon': leftIcon,
            'button--with-right-icon': rightIcon,
        },
        className
    );

    return (
        <button
            className={buttonClasses}
            disabled={disabled || isLoading}
            {...rest}
        >
            {isLoading && <span className="button__spinner" aria-hidden="true" />}

            {leftIcon && <span className="button__icon button__icon--left">{leftIcon}</span>}

            <span className="button__text">{children}</span>

            {rightIcon && <span className="button__icon button__icon--right">{rightIcon}</span>}
        </button>
    );
};

export default Button; 