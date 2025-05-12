/**
 * Button Component
 * Renders different button variants based on the variant prop
 */

import React from 'react';
import { createLoggedEventHandler } from '../../../utils/logger';
import LinkButton from './LinkButton';
import ToggleButton from './ToggleButton';
import {
    ButtonProps,
    isFloatingActionButton,
    isIconButton,
    isLinkButton,
    isPrimaryButton,
    isSecondaryButton,
    isTextButton,
    isToggleButton,
    isWorkoutButton
} from './types';

/**
 * Button component that renders different button variants based on props
 */
export const Button: React.FC<ButtonProps> = (props) => {
    // Use type guards to determine which button variant to render

    // Link Button
    if (isLinkButton(props)) {
        return <LinkButton {...props} />;
    }

    // Toggle Button
    if (isToggleButton(props)) {
        return <ToggleButton {...props} />;
    }

    // Default button with variant-specific rendering
    const {
        variant,
        children,
        onClick,
        className = '',
        ...restProps
    } = props;

    // Set up event handler with logging
    const handleClick = onClick
        ? createLoggedEventHandler('Button', `click:${variant}`, onClick)
        : undefined;

    // Base classes for all button types
    let buttonClasses = [
        className,
        'btn',
        `btn-${variant}`
    ];

    // Add variant-specific classes
    if (isPrimaryButton(props)) {
        buttonClasses.push(props.isLoading ? 'loading' : '');
        buttonClasses.push(`btn-${props.size || 'md'}`);
    }

    if (isSecondaryButton(props)) {
        buttonClasses.push(props.outline ? 'outline' : '');
        buttonClasses.push(`btn-${props.size || 'md'}`);
    }

    if (isTextButton(props)) {
        buttonClasses.push(props.underline ? 'underline' : '');
    }

    if (isFloatingActionButton(props)) {
        buttonClasses.push('btn-floating');
        buttonClasses.push(props.position || 'bottom-right');
    }

    if (isWorkoutButton(props)) {
        buttonClasses.push(`level-${props.level || 'beginner'}`);
    }

    // Filter out empty strings and join
    const classes = buttonClasses.filter(Boolean).join(' ');

    // Special case for icon buttons
    if (isIconButton(props)) {
        const { icon, text, iconPosition = 'left' } = props;

        return (
            <button
                className={`${classes} icon-${iconPosition}`}
                onClick={handleClick}
                {...restProps}
            >
                {iconPosition === 'left' && icon}
                {text && <span className="icon-button-text">{text}</span>}
                {!text && children}
                {iconPosition === 'right' && icon}
            </button>
        );
    }

    // Default button render
    return (
        <button
            className={classes}
            onClick={handleClick}
            {...restProps}
        >
            {children}
        </button>
    );
};

export default Button; 