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
}) => {
    return (
        <div className={`navigation-buttons-container ${className}`}>
            {onBack && (
                <button
                    className="navigation-button navigation-button--back"
                    onClick={onBack}
                    disabled={backDisabled}
                    aria-label={backLabel}
                >
                    <ChevronLeft size={18} className="button-icon" />
                    <span>{backLabel}</span>
                </button>
            )}

            {onNext && (
                <button
                    className="navigation-button navigation-button--next"
                    onClick={onNext}
                    disabled={nextDisabled}
                    aria-label={nextLabel}
                >
                    <span>{nextLabel}</span>
                    <ChevronRight size={18} className="button-icon" />
                </button>
            )}
        </div>
    );
};

export default NavigationButtons;