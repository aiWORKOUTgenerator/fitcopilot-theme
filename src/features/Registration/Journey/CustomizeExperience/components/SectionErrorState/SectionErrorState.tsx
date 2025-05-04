import { AlertTriangle } from 'lucide-react';
import React from 'react';
import './SectionErrorState.scss';

interface SectionErrorStateProps {
    message?: string;
    onRetry?: () => void;
    className?: string;
}

/**
 * SectionErrorState component
 * 
 * Displays error messages with an optional retry button
 */
const SectionErrorState: React.FC<SectionErrorStateProps> = ({
    message = "Something went wrong while saving your preferences",
    onRetry,
    className = "",
}) => {
    return (
        <div className={`section-error-state ${className}`} role="alert">
            <div className="error-content">
                <AlertTriangle size={20} className="error-icon" />
                <div className="error-details">
                    <p className="error-message">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="retry-button"
                            aria-label="Try again"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SectionErrorState; 