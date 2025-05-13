/**
 * Toggle Button Component
 * A button that toggles between two states
 */

import React, { forwardRef } from 'react';
import { ButtonClickHandler } from '../../../types/events';
import { createLoggedEventHandler, warn } from '../../../utils/logger';
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
const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>((props, ref) => {
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
    const handleToggle: ButtonClickHandler = (event) => {
        // Call user's onClick handler if provided
        if (onClick) {
            onClick(event);
        }

        // Call onToggle with the new state if provided
        if (onToggle) {
            onToggle(!isActive, event);
        }
    };

    // Create logged event handler
    const loggedHandleToggle = createLoggedEventHandler<HTMLButtonElement, React.MouseEvent<HTMLButtonElement>>(
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
            ref={ref}
            className={buttonClasses}
            onClick={loggedHandleToggle}
            aria-pressed={isActive}
            {...restProps}
        >
            {buttonText}
        </button>
    );
});

ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;

/**
 * Type guard to ensure a component is a Toggle Button
 */
export const withToggleButton = <P extends ToggleButtonProps>(
    Component: React.ComponentType<P>
): React.FC<P> => {
    return (props: P) => {
        if (!isToggleButton(props)) {
            warn('Component expected ToggleButtonProps but received incompatible props');
            return null;
        }

        return <Component {...props} />;
    };
}; 