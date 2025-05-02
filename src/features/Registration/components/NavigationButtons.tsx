import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface NavigationButtonsProps {
    onNext?: () => void;
    onBack?: () => void;
    nextLabel?: string;
    backLabel?: string;
    nextDisabled?: boolean;
    backDisabled?: boolean;
    className?: string;
    isFinalStep?: boolean;
}

/**
 * Navigation buttons for moving between registration steps
 */
const NavigationButtons: React.FC<NavigationButtonsProps> = ({
    onNext,
    onBack,
    nextLabel = 'Next',
    backLabel = 'Back',
    nextDisabled = false,
    backDisabled = false,
    className = '',
    isFinalStep = false,
}) => {
    return (
        <div className={`navigation-buttons ${className}`}>
            {onBack && (
                <button
                    type="button"
                    className="registration-button registration-button--secondary"
                    onClick={onBack}
                    disabled={backDisabled}
                    aria-label={backLabel}
                >
                    <ChevronLeft size={20} />
                    <span>{backLabel}</span>
                </button>
            )}

            {onNext && (
                <button
                    type="button"
                    className={`registration-button ${isFinalStep ? 'registration-button--final' : ''}`}
                    onClick={onNext}
                    disabled={nextDisabled}
                    aria-label={nextLabel}
                >
                    <span>{nextLabel}</span>
                    <ChevronRight size={20} />
                </button>
            )}
        </div>
    );
};

export default NavigationButtons; 