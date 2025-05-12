import classNames from 'classnames';
import React, { forwardRef } from 'react';
import { ExtendedCSSProperties, HeroButtonProps } from '../../../../types/components';
import { ButtonClickHandler } from '../../../../types/events';
import '../Button.scss';
import './Button.scss';

/**
 * Hero Button component
 * 
 * Special button styling for the Hero section
 */
const Button = forwardRef<HTMLButtonElement, HeroButtonProps>(({
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
    heroStyle = 'gradient',
    animation = 'none',
    style,
    ...rest
}, ref) => {
    const buttonClasses = classNames(
        'hero-button',
        `button--${size}`,
        `button--${variant}`,
        `hero-button--${heroStyle}`,
        {
            'button--fullwidth': fullWidth,
            'button--with-left-icon': leftIcon,
            'button--with-right-icon': rightIcon,
            'button--loading': isLoading,
            'button--disabled': disabled,
            [`hero-button--animate-${animation}`]: animation !== 'none'
        },
        className
    );

    // Handle custom CSS properties for tokens
    const buttonStyle: ExtendedCSSProperties = {
        ...style
    };

    // Handle href to make it either a button or anchor
    const isAnchor = 'href' in rest && !!rest.href;

    // Replace any types with proper interfaces
    interface AnchorExtras {
        href: string;
        [key: string]: unknown;
    }

    // If it's an anchor
    if (isAnchor) {
        const { href, ...anchorRest } = rest as AnchorExtras;

        return (
            <a
                href={href}
                className={buttonClasses}
                onClick={onClick as ButtonClickHandler}
                style={buttonStyle}
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
            onClick={onClick as ButtonClickHandler}
            style={buttonStyle}
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