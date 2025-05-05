import classNames from 'classnames';
import React from 'react';
import './RegistrationButton.scss';
import { RegistrationButtonProps } from './types';

/**
 * Registration button component for standardized button styling
 * throughout the registration flow
 */
const RegistrationButton: React.FC<RegistrationButtonProps> = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'medium',
    isLoading = false,
    disabled = false,
    rightIcon,
    leftIcon,
    className,
    fullWidth = false,
    ...restProps
}) => {
    // Combine class names based on props
    const buttonClasses = classNames(
        'registration-button',
        `registration-button--${variant}`,
        `registration-button--${size}`,
        {
            'registration-button--loading': isLoading,
            'registration-button--full-width': fullWidth,
        },
        className
    );

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled || isLoading}
            {...restProps}
        >
            {isLoading ? (
                <span className="registration-button__loading">
                    <span className="registration-button__loading-text">Processing</span>
                    <span className="registration-button__loading-dots"></span>
                </span>
            ) : (
                <>
                    {leftIcon && <span className="registration-button__icon registration-button__icon--left">{leftIcon}</span>}
                    <span className="registration-button__text">{children}</span>
                    {rightIcon && <span className="registration-button__icon registration-button__icon--right">{rightIcon}</span>}
                </>
            )}
        </button>
    );
};

export default RegistrationButton; 