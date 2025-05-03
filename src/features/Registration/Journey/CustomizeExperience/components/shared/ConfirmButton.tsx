import { ArrowRight, Check } from 'lucide-react';
import React from 'react';
import './ConfirmButton.scss';

interface ConfirmButtonProps {
    isValid: boolean;
    onConfirm: () => void;
    validationMessage?: string;
    buttonText?: string;
}

/**
 * Reusable confirmation button component with validation feedback
 */
const ConfirmButton: React.FC<ConfirmButtonProps> = ({
    isValid,
    onConfirm,
    validationMessage = "Please complete this section before continuing",
    buttonText = "Confirm Selection"
}) => {
    return (
        <div className="confirm-button-container">
            <button
                type="button"
                onClick={onConfirm}
                disabled={!isValid}
                className={`confirm-button ${isValid ? 'valid' : 'invalid'}`}
                aria-disabled={!isValid}
            >
                <span className="button-text">{buttonText}</span>
                {isValid ? <Check size={16} className="button-icon" /> : <ArrowRight size={16} className="button-icon" />}
            </button>

            {!isValid && (
                <p className="validation-message">
                    {validationMessage}
                </p>
            )}
        </div>
    );
};

export default ConfirmButton; 