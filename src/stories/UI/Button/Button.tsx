import React from 'react';
import './button.css';

/**
 * Button props interface aligned with main application
 */
export interface ButtonProps {
    /**
     * Button size variant
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Button style variant
     */
    variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'gradient' | 'violet-indigo';
    /**
     * Sets width to 100% when true
     */
    fullWidth?: boolean;
    /**
     * Shows loading spinner and disables button when true
     */
    isLoading?: boolean;
    /**
     * Button content
     */
    children: React.ReactNode;
    /**
     * Icon to display before button text
     */
    leftIcon?: React.ReactNode;
    /**
     * Icon to display after button text
     */
    rightIcon?: React.ReactNode;
    /**
     * Theme context for specific styling
     */
    themeContext?: 'default' | 'gym' | 'sports' | 'wellness' | 'modern' | 'classic' | 'minimalist';
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Whether the button is disabled
     */
    disabled?: boolean;
    /**
     * Render as button or anchor element
     */
    as?: 'button' | 'a';
    /**
     * Optional click handler
     */
    onClick?: () => void;
    /**
     * Href attribute when rendered as an anchor
     */
    href?: string;
    /**
     * Target attribute when rendered as an anchor
     */
    target?: string;
}

/**
 * Primary UI component for user interaction
 * Aligned with the main application's button component structure
 */
export const Button = ({
    size = 'medium',
    variant = 'primary',
    fullWidth = false,
    isLoading = false,
    children,
    leftIcon,
    rightIcon,
    themeContext = 'default',
    className = '',
    disabled = false,
    as = 'button',
    onClick,
    href,
    target,
    ...props
}: ButtonProps) => {
    const baseClass = 'storybook-button';
    const sizeClass = `${baseClass}--${size}`;
    const variantClass = `${baseClass}--${variant}`;
    const themeClass = `${baseClass}--theme-${themeContext}`;
    const widthClass = fullWidth ? `${baseClass}--full-width` : '';
    const loadingClass = isLoading ? `${baseClass}--loading` : '';

    const classes = [
        baseClass,
        sizeClass,
        variantClass,
        themeClass,
        widthClass,
        loadingClass,
        className
    ].filter(Boolean).join(' ');

    const content = (
        <>
            {isLoading && <span className={`${baseClass}__spinner`} aria-hidden="true" />}
            {leftIcon && <span className={`${baseClass}__left-icon`}>{leftIcon}</span>}
            <span className={`${baseClass}__text`}>{children}</span>
            {rightIcon && <span className={`${baseClass}__right-icon`}>{rightIcon}</span>}
        </>
    );

    if (as === 'a') {
        return (
            <a
                className={classes}
                href={href}
                target={target}
                {...props}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            type="button"
            className={classes}
            disabled={disabled || isLoading}
            onClick={onClick}
            {...props}
        >
            {content}
        </button>
    );
};

export default Button; 