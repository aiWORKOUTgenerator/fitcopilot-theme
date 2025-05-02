import { useCallback, useMemo, useState } from 'react';
import { RegistrationStep } from '../types';

// Define the order of steps
const REGISTRATION_STEPS: RegistrationStep[] = [
    RegistrationStep.SPLASH,
    RegistrationStep.EXPERIENCE_LEVEL,
    RegistrationStep.GOALS,
    RegistrationStep.EQUIPMENT,
    RegistrationStep.TIME_COMMITMENT,
    RegistrationStep.ACCOUNT_DETAILS,
    RegistrationStep.PRICING,
    RegistrationStep.PAYMENT,
    RegistrationStep.CONFIRMATION
];

/**
 * Hook for managing registration progress
 * 
 * @param initialStep - The initial registration step
 * @returns Object containing progress tracking and navigation methods
 */
export const useRegistrationProgress = (initialStep: RegistrationStep = RegistrationStep.SPLASH) => {
    // Keep track of current step
    const [currentStep, setCurrentStep] = useState<RegistrationStep>(initialStep);

    // Get the current step index
    const currentStepIndex = useMemo(() => {
        return REGISTRATION_STEPS.indexOf(currentStep);
    }, [currentStep]);

    // Calculate progress percentage
    const progress = useMemo(() => {
        const totalSteps = REGISTRATION_STEPS.length - 1; // Exclude confirmation
        const currentIndex = currentStepIndex;

        if (currentIndex === -1) return 0;
        if (currentIndex >= totalSteps) return 100;

        return Math.round((currentIndex / totalSteps) * 100);
    }, [currentStepIndex]);

    // Move to the next step
    const nextStep = useCallback(() => {
        setCurrentStep((prevStep) => {
            const currentIndex = REGISTRATION_STEPS.indexOf(prevStep);
            if (currentIndex < 0 || currentIndex >= REGISTRATION_STEPS.length - 1) {
                return prevStep;
            }
            return REGISTRATION_STEPS[currentIndex + 1];
        });
    }, []);

    // Move to the previous step
    const previousStep = useCallback(() => {
        setCurrentStep((prevStep) => {
            const currentIndex = REGISTRATION_STEPS.indexOf(prevStep);
            if (currentIndex <= 0) {
                return prevStep;
            }
            return REGISTRATION_STEPS[currentIndex - 1];
        });
    }, []);

    // Go to a specific step
    const goToStep = useCallback((step: RegistrationStep) => {
        if (REGISTRATION_STEPS.includes(step)) {
            setCurrentStep(step);
        }
    }, []);

    // Check if there's a next step
    const hasNextStep = useMemo(() => {
        return currentStepIndex < REGISTRATION_STEPS.length - 1;
    }, [currentStepIndex]);

    // Check if there's a previous step
    const hasPreviousStep = useMemo(() => {
        return currentStepIndex > 0;
    }, [currentStepIndex]);

    return {
        currentStep,
        nextStep,
        previousStep,
        goToStep,
        progress,
        hasNextStep,
        hasPreviousStep,
        steps: REGISTRATION_STEPS,
        currentStepIndex,
    };
};

export default useRegistrationProgress; 