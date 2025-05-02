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
        <div className={`navigation-buttons flex gap-4 items-center justify-between mt-8 ${className}`}>
            {onBack && (
                <button
                    type="button"
                    className="px-6 py-3 rounded-full border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 transition-all flex items-center gap-2"
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
                    className={`px-8 py-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 text-white font-bold text-lg flex items-center justify-center transition-all hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 ${!onBack ? 'w-full' : ''}`}
                    onClick={onNext}
                    disabled={nextDisabled}
                    aria-label={nextLabel}
                >
                    <span>{nextLabel}</span>
                    <ChevronRight size={20} className="ml-2" />
                </button>
            )}
        </div>
    );
};

export default NavigationButtons; 