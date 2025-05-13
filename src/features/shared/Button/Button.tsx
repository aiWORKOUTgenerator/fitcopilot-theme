/**
 * Button Component
 * Renders different button variants based on the variant prop
 */

import classNames from 'classnames';
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
    const buttonClasses = classNames(
        className,
        'btn',
        `btn-${variant}`,
        {
            'loading': isPrimaryButton(props) && props.isLoading,
            'outline': isSecondaryButton(props) && props.outline,
            'underline': isTextButton(props) && props.underline,
            'btn-floating': isFloatingActionButton(props),
            'level-beginner': isWorkoutButton(props) && props.level === 'beginner',
            'level-intermediate': isWorkoutButton(props) && props.level === 'intermediate',
            'level-advanced': isWorkoutButton(props) && props.level === 'advanced',
            'btn-md': !props.size || props.size === 'md',
            'btn-sm': props.size === 'sm',
            'btn-lg': props.size === 'lg',
            'btn-primary': isPrimaryButton(props),
            'btn-secondary': isSecondaryButton(props),
            'btn-text': isTextButton(props),
            'btn-toggle': isToggleButton(props),
            'btn-floating-bottom-right': isFloatingActionButton(props) && props.position === 'bottom-right',
            'btn-floating-top-right': isFloatingActionButton(props) && props.position === 'top-right',
            'btn-floating-bottom-left': isFloatingActionButton(props) && props.position === 'bottom-left',
            'btn-floating-top-left': isFloatingActionButton(props) && props.position === 'top-left'
        }
    );

    // Special case for icon buttons
    if (isIconButton(props)) {
        const { icon, text, iconPosition = 'left' } = props;

        return (
            <button
                className={`${buttonClasses} icon-${iconPosition}`}
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
            className={buttonClasses}
            onClick={handleClick}
            {...restProps}
        >
            {children}
        </button>
    );
};

export default Button; 