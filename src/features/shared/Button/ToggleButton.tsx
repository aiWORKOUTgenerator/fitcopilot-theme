/**
 * Toggle Button Component
 * A button that toggles between two states
 */

import React, { forwardRef } from 'react';
import { createLoggedEventHandler } from '../../../utils/logger';
import { ToggleButtonProps, isToggleButton } from './types';

/**
 * ToggleButton Component
 * 
 * @example
 * <ToggleButton 
 *   isActive={isPlaying} 
 *   activeLabel="Pause" 
 *   inactiveLabel="Play"
 *   onToggle={(active) => setIsPlaying(active)}
 * />
 */
function ToggleButton(props: ToggleButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) {
    const {
        isActive,
        activeLabel,
        inactiveLabel,
        onToggle,
        children,
        onClick,
        className = '',
        ...restProps
    } = props;

    // Internal handler for toggle state
    const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        // Call user's onClick handler if provided
        if (onClick) {
            onClick(event);
        }

        // Call onToggle with the new state if provided
        if (onToggle) {
            onToggle(!isActive);
        }
    };

    // Create logged event handler
    const loggedHandleToggle = createLoggedEventHandler(
        'ToggleButton',
        'toggle',
        handleToggle
    );

    // Determine the button text to display
    const buttonText = isActive
        ? activeLabel || children
        : inactiveLabel || children;

    // Determine classes based on state
    const buttonClasses = [
        className,
        'toggle-button',
        isActive ? 'toggle-button--active' : 'toggle-button--inactive'
    ].filter(Boolean).join(' ');

    return (
        <button
            className={buttonClasses}
            onClick={loggedHandleToggle}
            aria-pressed={isActive}
            {...restProps}
        >
            {buttonText}
        </button>
    );
}

const ForwardedToggleButton = forwardRef(ToggleButton);
ForwardedToggleButton.displayName = 'ToggleButton';
export default ForwardedToggleButton;

/**
 * Type guard to ensure a component is a Toggle Button
 */
export const withToggleButton = <P extends ToggleButtonProps>(
    Component: React.ComponentType<P>
): React.FC<P> => {
    return (props: P) => {
        if (!isToggleButton(props)) {
            console.warn('Component expected ToggleButtonProps but received incompatible props');
            return null;
        }

        return <Component {...props} />;
    };
}; 