import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { ButtonProps } from '../types';
import './Button.scss';

/**
 * Hero Button component
 * 
 * Special button styling for the Hero section
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = 'primary',
    size = 'large',
    fullWidth = false,
    leftIcon,
    rightIcon,
    className,
    children,
    disabled = false,
    isLoading = false,
    onClick,
    type = 'button',
    ...rest
}, ref) => {
    const buttonClasses = classNames(
        'hero-button',
        `button--${size}`,
        `button--${variant}`,
        {
            'button--fullwidth': fullWidth,
            'button--with-left-icon': leftIcon,
            'button--with-right-icon': rightIcon,
            'button--loading': isLoading,
            'button--disabled': disabled,
        },
        className
    );

    // Handle href to make it either a button or anchor
    const isAnchor = 'href' in rest && !!rest.href;

    // If it's an anchor
    if (isAnchor) {
        const { href, ...anchorRest } = rest as { href: string, [key: string]: any };

        return (
            <a
                href={href}
                className={buttonClasses}
                onClick={onClick as any}
                {...anchorRest}
            >
                {leftIcon && <span className="button__icon button__icon--left">{leftIcon}</span>}
                <span className="button__text">{children}</span>
                {rightIcon && <span className="button__icon button__icon--right">{rightIcon}</span>}
                {isLoading && <span className="button__spinner" />}
            </a>
        );
    }

    // Regular button
    return (
        <button
            ref={ref}
            type={type}
            className={buttonClasses}
            disabled={disabled || isLoading}
            onClick={onClick as any}
            {...rest}
        >
            {leftIcon && <span className="button__icon button__icon--left">{leftIcon}</span>}
            <span className="button__text">{children}</span>
            {rightIcon && <span className="button__icon button__icon--right">{rightIcon}</span>}
            {isLoading && <span className="button__spinner" />}
        </button>
    );
});

Button.displayName = 'HeroButton';

export default Button; 