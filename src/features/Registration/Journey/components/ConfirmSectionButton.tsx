import { Check, ChevronDown } from 'lucide-react';
import React from 'react';

interface ConfirmSectionButtonProps {
    isValid: boolean;
    onConfirm: () => void;
    sectionName: string;
    isLast?: boolean;
}

/**
 * A button component that confirms section selections and moves to the next section
 */
const ConfirmSectionButton: React.FC<ConfirmSectionButtonProps> = ({
    isValid,
    onConfirm,
    sectionName,
    isLast = false
}) => {
    const handleClick = () => {
        if (isValid) {
            onConfirm();
        }
    };

    return (
        <div className="flex justify-end mt-5 pt-3 border-t border-gray-700/50">
            <button
                onClick={handleClick}
                disabled={!isValid}
                className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
          ${isValid
                        ? 'bg-cyan-700 hover:bg-cyan-600 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
        `}
                aria-label={`Confirm ${sectionName} selection and ${isLast ? 'proceed' : 'continue to next section'}`}
            >
                <span>
                    {isValid ? 'Confirm Selection' : 'Please complete selection'}
                </span>
                {isValid && (
                    isLast
                        ? <Check size={16} className="ml-1" />
                        : <ChevronDown size={16} className="ml-1 rotate-270" />
                )}
            </button>
        </div>
    );
};

export default ConfirmSectionButton; 