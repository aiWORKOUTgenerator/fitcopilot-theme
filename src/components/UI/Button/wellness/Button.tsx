/**
 * Wellness Theme Button Component
 * 
 * Button implementation specific to the wellness theme
 */
import classNames from 'classnames';
import React from 'react';
import { ButtonProps } from '../types';
import './Button.scss';

/**
 * Button component for the wellness theme
 */
export const WellnessButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(({
    children,
    className,
    size = 'medium',
    variant = 'primary',
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    as = 'button',
    ...rest
}, ref) => {
    // Generate class names with proper order for specificity
    const buttonClasses = classNames(
        'button',
        `button--${size}`,
        `button--${variant}`,
        {
            'button--fullwidth': fullWidth,
            'button--loading': isLoading,
            'button--with-left-icon': !!leftIcon,
            'button--with-right-icon': !!rightIcon,
        },
        className
    );

    const commonProps = {
        className: buttonClasses,
        'aria-busy': isLoading,
        ...rest
    };

    if (as === 'a') {
        return (
            <a
                ref={ref as React.Ref<HTMLAnchorElement>}
                {...commonProps as React.AnchorHTMLAttributes<HTMLAnchorElement>}
            >
                {isLoading && <span className="button__spinner" aria-hidden="true" />}
                {leftIcon && <span className="button__icon button__icon--left" aria-hidden="true">{leftIcon}</span>}
                <span className="button__text">{children}</span>
                {rightIcon && <span className="button__icon button__icon--right" aria-hidden="true">{rightIcon}</span>}
            </a>
        );
    }

    return (
        <button
            disabled={disabled || isLoading}
            ref={ref as React.Ref<HTMLButtonElement>}
            {...commonProps as React.ButtonHTMLAttributes<HTMLButtonElement>}
        >
            {isLoading && <span className="button__spinner" aria-hidden="true" />}
            {leftIcon && <span className="button__icon button__icon--left" aria-hidden="true">{leftIcon}</span>}
            <span className="button__text">{children}</span>
            {rightIcon && <span className="button__icon button__icon--right" aria-hidden="true">{rightIcon}</span>}
        </button>
    );
});

WellnessButton.displayName = 'WellnessButton';

export default WellnessButton; 