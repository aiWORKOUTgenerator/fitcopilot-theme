/**
 * Button Component
 * Renders different button variants based on the variant prop
 */

import React from 'react';
import logger from '../../../utils/logger';
import { ButtonProps, isLinkButton } from './types';

/**
 * Button component that can render as either a button element or a link
 * based on the props provided.
 * 
 * @param props - Button properties
 * @returns React component
 */
export const Button: React.FC<ButtonProps> = (props) => {
    // Handle null/undefined props with default empty object
    if (!props) {
        logger.warn('Button component received undefined props');
        return null; // Return null if props are undefined
    }

    const {
        variant = 'primary',
        className = '',
        children,
        'aria-label': ariaLabel,
        'data-testid': testId,
        disabled = false,
    } = props;

    // Compose class names
    const baseClasses = 'btn';
    const variantClasses = `btn-${variant}`;
    const classes = [baseClasses, variantClasses, className].filter(Boolean).join(' ');

    // If we have an href prop, render as a link
    if (isLinkButton(props)) {
        const { href, target, rel } = props;

        return (
            <a
                href={href}
                target={target}
                rel={target === '_blank' ? (rel || 'noopener noreferrer') : rel}
                className={classes}
                aria-label={ariaLabel}
                data-testid={testId}
            >
                {children}
            </a>
        );
    }

    // Otherwise, render as a button
    const { onClick, type = 'button' } = props;

    // Create a simple logged click handler with null check
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        logger.info('Button clicked', {
            component: 'Button',
            variant,
            type
        });

        // Safely call onClick if it exists
        if (onClick) {
            onClick(event);
        }
    };

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={classes}
            aria-label={ariaLabel}
            data-testid={testId}
        >
            {children}
        </button>
    );
};

export default Button; 