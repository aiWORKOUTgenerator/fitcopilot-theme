import { AlertCircle } from 'lucide-react';
import React from 'react';
import './ValidationSummary.scss';

interface ValidationSummaryProps {
    isValid: boolean;
    message?: string;
    className?: string;
}

/**
 * ValidationSummary component
 * 
 * Displays validation messages in a consistent format across all sections
 */
const ValidationSummary: React.FC<ValidationSummaryProps> = ({
    isValid,
    message = "Please complete all required fields",
    className = "",
}) => {
    if (isValid) return null;

    return (
        <div
            className={`validation-summary ${className}`}
            role="alert"
            aria-live="polite"
        >
            <AlertCircle size={16} className="validation-icon" />
            <span className="validation-message">{message}</span>
        </div>
    );
};

export default ValidationSummary; 