import { useCallback, useMemo, useState } from 'react';
import { JourneySubstepId, RegistrationStep, RegistrationStepId } from '../types';
import useNavigationOverrides from './useNavigationOverrides';
import { useRegistrationEvents } from './useRegistrationEvents';

// Keep the original REGISTRATION_STEPS for backward compatibility
export const REGISTRATION_STEPS: RegistrationStep[] = [
    RegistrationStep.SPLASH,
    RegistrationStep.EXPERIENCE_LEVEL,
    RegistrationStep.GOALS,
    RegistrationStep.EQUIPMENT,
    RegistrationStep.TIME_COMMITMENT,
    RegistrationStep.PRICING,
    RegistrationStep.PAYMENT,
    RegistrationStep.CONFIRMATION
];

// Define explicit non-standard transitions between steps
export const STEP_TRANSITION_MAP: Partial<Record<RegistrationStep, RegistrationStep>> = {
    [RegistrationStep.TIME_COMMITMENT]: RegistrationStep.PRICING,
};

// Define the initial substep for the Journey
export const INITIAL_JOURNEY_SUBSTEP = JourneySubstepId.GOALS;

// The new registration steps structure
export const NEW_REGISTRATION_STEPS: RegistrationStepId[] = [
    RegistrationStepId.SPLASH,
    RegistrationStepId.EXPERIENCE_LEVEL,
    RegistrationStepId.JOURNEY,
    RegistrationStepId.PRICING,
    RegistrationStepId.PAYMENT,
    RegistrationStepId.CONFIRMATION
];

/**
 * WARNING: This hook is being migrated to the new NavigationContext.
 * Please use useNavigationBridge for new components, which provides the same API
 * but uses the NavigationContext internally.
 * 
 * @deprecated Use useNavigationBridge instead which leverages the NavigationContext
 * 
 * Hook for managing registration progress
 * @param initialStep - The initial registration step
 * @returns Object containing progress tracking and navigation methods
 */
export const useRegistrationProgress = (initialStep = RegistrationStep.SPLASH) => {
    // Get event tracking methods
    const {
        trackStandardTransition,
        trackMapTransition,
        trackDirectNavigation,
        trackBackNavigation,
        trackOverrideNavigation
    } = useRegistrationEvents();

    // Apply any navigation overrides
    const effectiveInitialStep = useNavigationOverrides(initialStep);

    // If there was an override, track it
    if (effectiveInitialStep !== initialStep) {
        trackOverrideNavigation(initialStep, effectiveInitialStep, {
            reason: 'Initial step override'
        });
    }

    // Keep track of current step
    const [currentStep, setCurrentStep] = useState<RegistrationStep>(effectiveInitialStep);

    // Get the current step index
    const currentStepIndex = useMemo(() => {
        return REGISTRATION_STEPS.indexOf(currentStep);
    }, [currentStep]);

    // Calculate progress percentage
    const progress = useMemo(() => {
        // For standard steps
        if (!REGISTRATION_STEPS.includes(currentStep)) {
            return 0; // Fallback for unknown steps
        }

        const totalSteps = REGISTRATION_STEPS.length - 1; // Exclude confirmation
        const currentIndex = REGISTRATION_STEPS.indexOf(currentStep);

        if (currentIndex === -1) return 0;
        if (currentIndex >= totalSteps) return 100;

        return Math.round((currentIndex / totalSteps) * 100);
    }, [currentStep]);

    // Move to the next step
    const nextStep = useCallback(() => {
        setCurrentStep((prevStep) => {
            // Check for custom transitions first
            if (STEP_TRANSITION_MAP[prevStep]) {
                const nextStep = STEP_TRANSITION_MAP[prevStep];
                console.log(`[Registration] Transition: ${prevStep} -> ${nextStep} (via transition map)`);
                trackMapTransition(prevStep, nextStep, {
                    transitionSource: 'nextStep',
                    via: 'map'
                });
                return nextStep;
            }

            const currentIndex = REGISTRATION_STEPS.indexOf(prevStep);

            // Handle invalid states
            if (currentIndex < 0) {
                console.error(`Invalid registration step: ${prevStep}`);
                const fallbackStep = RegistrationStep.SPLASH;
                trackDirectNavigation(prevStep, fallbackStep, {
                    error: 'Invalid registration step',
                    recovery: 'Fallback to splash'
                });
                return fallbackStep; // Fallback to start
            }

            // Check for last step
            if (currentIndex >= REGISTRATION_STEPS.length - 1) {
                console.log(`[Registration] Staying on last step: ${prevStep}`);
                return prevStep; // Stay on last step
            }

            // Standard transition to next step
            const nextStep = REGISTRATION_STEPS[currentIndex + 1];
            console.log(`[Registration] Transition: ${prevStep} -> ${nextStep} (standard)`);
            trackStandardTransition(prevStep, nextStep, {
                transitionSource: 'nextStep',
                stepIndex: currentIndex + 1
            });
            return nextStep;
        });
    }, [trackMapTransition, trackStandardTransition, trackDirectNavigation]);

    // Move to the previous step
    const previousStep = useCallback(() => {
        setCurrentStep((prevStep) => {
            let destinationStep: RegistrationStep;

            if (prevStep === RegistrationStep.PRICING) {
                destinationStep = RegistrationStep.TIME_COMMITMENT;
                trackBackNavigation(prevStep, destinationStep, {
                    defaultBackNavigation: true
                });
                return destinationStep;
            }

            // Use the session storage fallback for direct navigation if available
            if (typeof window !== 'undefined') {
                const storedPrevStep = window.sessionStorage.getItem('PREVIOUS_STEP');
                if (storedPrevStep && REGISTRATION_STEPS.includes(storedPrevStep as RegistrationStep)) {
                    destinationStep = storedPrevStep as RegistrationStep;
                    console.log(`[Registration] Back navigation: ${prevStep} -> ${destinationStep} (via session storage)`);
                    trackBackNavigation(prevStep, destinationStep, {
                        via: 'sessionStorage'
                    });
                    return destinationStep;
                }
            }

            // Standard backward navigation
            const currentIndex = REGISTRATION_STEPS.indexOf(prevStep);
            if (currentIndex <= 0) {
                console.log(`[Registration] Already at first step: ${prevStep}`);
                return prevStep; // Stay on first step
            }

            destinationStep = REGISTRATION_STEPS[currentIndex - 1];
            console.log(`[Registration] Back navigation: ${prevStep} -> ${destinationStep} (standard)`);
            trackBackNavigation(prevStep, destinationStep, {
                standard: true,
                stepIndex: currentIndex - 1
            });
            return destinationStep;
        });
    }, [trackBackNavigation]);

    // Go to a specific step
    const goToStep = useCallback((step: RegistrationStep) => {
        // Allow transitions to any valid step
        if (REGISTRATION_STEPS.includes(step)) {
            // Store previous step for back navigation
            if (typeof window !== 'undefined') {
                window.sessionStorage.setItem('PREVIOUS_STEP', currentStep);
            }
            console.log(`[Registration] Direct navigation: ${currentStep} -> ${step}`);
            trackDirectNavigation(currentStep, step, {
                method: 'goToStep',
                validDestination: true
            });
            setCurrentStep(step);
        } else {
            console.error(`[Registration] Invalid step navigation attempted: ${step}`);
            trackDirectNavigation(currentStep, currentStep, {
                method: 'goToStep',
                validDestination: false,
                attemptedDestination: step,
                error: 'Invalid destination step'
            });
        }
    }, [currentStep, trackDirectNavigation]);

    // Check if there's a next step
    const hasNextStep = useMemo(() => {
        return currentStepIndex < REGISTRATION_STEPS.length - 1;
    }, [currentStepIndex]);

    // Check if there's a previous step
    const hasPreviousStep = useMemo(() => {
        return currentStepIndex > 0;
    }, [currentStepIndex]);

    // Add a console warning about deprecation
    console.warn('useRegistrationProgress is deprecated. Please use useNavigationBridge instead which leverages the NavigationContext.');

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