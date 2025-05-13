import classNames from 'classnames';
import React from 'react';
import { Button } from '../../../../features/shared/Button';
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
    size = 'md',
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
        {
            'registration-button--full-width': fullWidth,
        },
        className
    );

    // Create base props
    const baseProps = {
        type,
        size,
        className: buttonClasses,
        onClick,
        disabled: disabled || isLoading,
        ...restProps,
    };

    // Extract link-specific props if needed
    const { href, openInNewTab, ...linkProps } = variant === 'link'
        ? (restProps as { href: string; openInNewTab?: boolean })
        : { href: '', openInNewTab: false };

    // Render the appropriate button variant
    switch (variant) {
        case 'primary':
            return (
                <Button
                    {...baseProps}
                    variant="primary"
                    isLoading={isLoading}
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
                </Button>
            );
        case 'secondary':
            return (
                <Button
                    {...baseProps}
                    variant="secondary"
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
                </Button>
            );
        case 'link':
            return (
                <Button
                    {...baseProps}
                    {...linkProps}
                    variant="link"
                    href={href}
                    target={openInNewTab ? '_blank' : undefined}
                    rel={openInNewTab ? 'noopener noreferrer' : undefined}
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
                </Button>
            );
        default:
            return (
                <Button
                    {...baseProps}
                    variant="primary"
                    isLoading={isLoading}
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
                </Button>
            );
    }
};

export default RegistrationButton; 