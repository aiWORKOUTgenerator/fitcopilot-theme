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
import * as React from 'react';
import './Button.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
    /** Button content */
    children: React.ReactNode;
}

/**
 * Button component for triggering actions
 */
const Button: React.FC<ButtonProps> = ({
    children,
    className,
    size = 'medium',
    variant = 'primary',
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...rest
}) => {
    const buttonClasses = classNames(
        'button',
        `button--${size}`,
        `button--${variant}`,
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