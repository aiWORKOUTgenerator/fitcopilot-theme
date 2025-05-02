import React, { useMemo } from 'react';
import { useJourney } from './JourneyContext';

interface StepValidationProps {
    stepIndex: number;
    children: React.ReactNode;
    onValidityChange?: (isValid: boolean) => void;
}

/**
 * StepValidator component checks if a step has valid data
 * and conditionally renders its children
 */
const StepValidator: React.FC<StepValidationProps> = ({
    stepIndex,
    children,
    onValidityChange,
}) => {
    const { registrationData } = useJourney();

    // Validate step based on index
    const isStepValid = useMemo(() => {
        switch (stepIndex) {
            // Goal Setting (Step 0)
            case 0:
                return Boolean(registrationData.goals && registrationData.goals.length > 0);

            // Experience Level (Step 1) 
            case 1:
                return Boolean(registrationData.experienceLevel);

            // Equipment Selection (Substep of Step 1)
            case 2:
                return Boolean(registrationData.equipment);

            // Time Commitment (Substep of Step 1)
            case 3:
                return Boolean(registrationData.timeCommitment);

            // Plan Preview (Step 2)
            case 4:
                // Plan preview doesn't require validation, always valid
                return true;

            // Progress Tracking (Step 3)
            case 5:
                // Progress tracking doesn't require validation, always valid
                return true;

            default:
                return true;
        }
    }, [stepIndex, registrationData]);

    // Notify parent about validity changes
    React.useEffect(() => {
        if (onValidityChange) {
            onValidityChange(isStepValid);
        }
    }, [isStepValid, onValidityChange]);

    return <>{children}</>;
};

export default StepValidator; 