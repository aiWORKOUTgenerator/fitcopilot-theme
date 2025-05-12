/**
 * Default Theme Button Component
 * 
 * Button implementation specific to the default theme
 */
import classNames from 'classnames';
import React from 'react';
import { ButtonProps, ExtendedCSSProperties } from '../../../../types/components';
import '../Button.scss';
import './Button.scss';

/**
 * Button component for the default theme
 */
export const DefaultButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    className,
    size = 'medium',
    variant = 'primary',
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    style,
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

    // Handle custom CSS properties for tokens
    const buttonStyle: ExtendedCSSProperties = {
        ...style
    };

    return (
        <button
            className={buttonClasses}
            disabled={disabled || isLoading}
            ref={ref}
            style={buttonStyle}
            {...rest}
            aria-busy={isLoading}
        >
            {isLoading && <span className="button__spinner" aria-hidden="true" />}

            {leftIcon && <span className="button__icon button__icon--left" aria-hidden="true">{leftIcon}</span>}

            <span className="button__text">{children}</span>

            {rightIcon && <span className="button__icon button__icon--right" aria-hidden="true">{rightIcon}</span>}
        </button>
    );
});

DefaultButton.displayName = 'DefaultButton';

export default DefaultButton; 