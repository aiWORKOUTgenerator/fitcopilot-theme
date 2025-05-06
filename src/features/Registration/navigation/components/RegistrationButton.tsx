import React from 'react';
import { useNavigation } from '../context';

interface RegistrationButtonProps {
    /**
     * Button type for navigation or custom action
     */
    type: 'next' | 'back' | 'custom';

    /**
     * Custom onClick handler for 'custom' type
     */
    onClick?: () => void;

    /**
     * Button text
     */
    label?: string;

    /**
     * Whether the button is disabled
     */
    disabled?: boolean;

    /**
     * CSS class name for custom styling
     */
    className?: string;
}

/**
 * Standard button component for registration flow navigation
 */
const RegistrationButton: React.FC<RegistrationButtonProps> = ({
    type,
    onClick,
    label,
    disabled = false,
    className = '',
}) => {
    const navigation = useNavigation();

    const handleClick = () => {
        if (disabled) {
            return;
        }

        if (type === 'next') {
            navigation.nextStep();
        } else if (type === 'back') {
            navigation.prevStep();
        } else if (onClick) {
            onClick();
        }
    };

    // Default labels based on type
    const buttonLabel = label || (type === 'next' ? 'Continue' : type === 'back' ? 'Back' : 'Submit');

    // Determine if next button should be disabled
    const isDisabled = disabled || (type === 'next' && !navigation.canGoForward());

    // Determine button class based on type
    const buttonClass = `registration-button ${type}-button ${className} ${isDisabled ? 'disabled' : ''}`;

    return (
        <button
            className={buttonClass}
            onClick={handleClick}
            disabled={isDisabled}
        >
            {buttonLabel}
        </button>
    );
};

export default RegistrationButton; 