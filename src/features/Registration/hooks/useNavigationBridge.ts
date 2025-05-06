import { useCallback, useEffect, useRef } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { JourneySubstepId, RegistrationStep, RegistrationStepId } from '../types';
import { useRegistrationEvents } from './useRegistrationEvents';
import { REGISTRATION_STEPS } from './useRegistrationProgress';

/**
 * Maps between old RegistrationStep enum and new RegistrationStepId enum
 */
const STEP_MAPPING: Record<RegistrationStep, RegistrationStepId> = {
    [RegistrationStep.SPLASH]: RegistrationStepId.SPLASH,
    [RegistrationStep.EXPERIENCE_LEVEL]: RegistrationStepId.EXPERIENCE_LEVEL,
    [RegistrationStep.GOALS]: RegistrationStepId.JOURNEY, // Maps to Journey with Goals substep
    [RegistrationStep.EQUIPMENT]: RegistrationStepId.JOURNEY, // Maps to Journey with Equipment substep
    [RegistrationStep.TIME_COMMITMENT]: RegistrationStepId.JOURNEY, // Maps to Journey with Time Commitment substep
    [RegistrationStep.PRICING]: RegistrationStepId.PRICING,
    [RegistrationStep.PAYMENT]: RegistrationStepId.PAYMENT,
    [RegistrationStep.CONFIRMATION]: RegistrationStepId.CONFIRMATION
};

/**
 * Reverse mapping from new RegistrationStepId to old RegistrationStep
 */
const REVERSE_STEP_MAPPING: Partial<Record<RegistrationStepId, RegistrationStep>> = {
    [RegistrationStepId.SPLASH]: RegistrationStep.SPLASH,
    [RegistrationStepId.EXPERIENCE_LEVEL]: RegistrationStep.EXPERIENCE_LEVEL,
    [RegistrationStepId.PRICING]: RegistrationStep.PRICING,
    [RegistrationStepId.PAYMENT]: RegistrationStep.PAYMENT,
    [RegistrationStepId.CONFIRMATION]: RegistrationStep.CONFIRMATION
    // Journey is special case handled separately
};

/**
 * Hook to bridge between the old useRegistrationProgress API and the new NavigationContext
 * 
 * Provides a backward-compatible API that uses the new navigation system underneath
 * 
 * @param initialStep - The initial registration step (old enum)
 * @returns Object with props that match the old useRegistrationProgress API
 */
export const useNavigationBridge = (initialStep = RegistrationStep.SPLASH) => {
    const navigation = useNavigation();
    const {
        trackStandardTransition,
        trackMapTransition,
        trackDirectNavigation,
        trackBackNavigation
    } = useRegistrationEvents();

    // Use a ref to track initialization and prevent double initialization
    const initializedRef = useRef(false);

    // Initialize with the mapped step from old to new format
    useEffect(() => {
        if (initializedRef.current) return;

        const mappedStepId = STEP_MAPPING[initialStep];
        if (mappedStepId) {
            navigation.goToStep(mappedStepId);
            initializedRef.current = true;
        }
    }, [initialStep, navigation]);

    // Maps from the new navigation state to the old format step
    const determineCurrentLegacyStep = useCallback((): RegistrationStep => {
        const { currentStep, currentSubstep } = navigation.state;

        // Handle special case for Journey substeps
        if (currentStep === RegistrationStepId.JOURNEY && currentSubstep) {
            switch (currentSubstep) {
                case JourneySubstepId.GOALS:
                    return RegistrationStep.GOALS;
                case JourneySubstepId.EQUIPMENT:
                    return RegistrationStep.EQUIPMENT;
                case JourneySubstepId.TIME_COMMITMENT:
                    return RegistrationStep.TIME_COMMITMENT;
                default:
                    // Default to GOALS if in Journey but substep not recognized
                    return RegistrationStep.GOALS;
            }
        }

        // For non-Journey steps, use the reverse mapping
        return REVERSE_STEP_MAPPING[currentStep] || RegistrationStep.SPLASH;
    }, [navigation.state]);

    // Get the current legacy step
    const currentStep = determineCurrentLegacyStep();

    // Calculate current step index in the old registration steps array
    const currentStepIndex = REGISTRATION_STEPS.indexOf(currentStep);

    // Move to the next step
    const nextStep = useCallback(() => {
        const oldCurrentStep = determineCurrentLegacyStep();
        const nextLegacyStepIndex = REGISTRATION_STEPS.indexOf(oldCurrentStep) + 1;

        if (nextLegacyStepIndex < REGISTRATION_STEPS.length) {
            const nextLegacyStep = REGISTRATION_STEPS[nextLegacyStepIndex];
            const nextStepId = STEP_MAPPING[nextLegacyStep];

            // Track transition
            trackStandardTransition(oldCurrentStep, nextLegacyStep, {
                transitionSource: 'nextStep',
                stepIndex: nextLegacyStepIndex
            });

            // DEBUG: Log the navigation attempt
            console.log(`Navigating from ${oldCurrentStep} to ${nextLegacyStep} (${nextStepId})`);

            // Mark the current step as completed
            navigation.dispatch({ type: 'COMPLETE_STEP', payload: { stepId: navigation.state.currentStep } });

            if (nextStepId === RegistrationStepId.JOURNEY) {
                // Use setTimeout to prevent nested state updates
                setTimeout(() => {
                    // Navigate to the Journey step
                    navigation.goToStep(nextStepId);

                    // After the render cycle, set the correct substep
                    setTimeout(() => {
                        // Determine which substep to navigate to based on the legacy step
                        switch (nextLegacyStep) {
                            case RegistrationStep.GOALS:
                                navigation.goToSubstep(JourneySubstepId.GOALS);
                                break;
                            case RegistrationStep.EQUIPMENT:
                                navigation.goToSubstep(JourneySubstepId.EQUIPMENT);
                                break;
                            case RegistrationStep.TIME_COMMITMENT:
                                navigation.goToSubstep(JourneySubstepId.TIME_COMMITMENT);
                                break;
                            default:
                                navigation.goToSubstep(JourneySubstepId.GOALS);
                        }
                    }, 0);
                }, 0);
            } else {
                // Direct navigation to the next step
                navigation.goToStep(nextStepId);
            }
        }
    }, [navigation, determineCurrentLegacyStep, trackStandardTransition]);

    // Move to the previous step
    const previousStep = useCallback(() => {
        const oldCurrentStep = determineCurrentLegacyStep();
        const prevLegacyStepIndex = REGISTRATION_STEPS.indexOf(oldCurrentStep) - 1;

        if (prevLegacyStepIndex >= 0) {
            const prevLegacyStep = REGISTRATION_STEPS[prevLegacyStepIndex];
            const prevStepId = STEP_MAPPING[prevLegacyStep];

            // Track back navigation
            trackBackNavigation(oldCurrentStep, prevLegacyStep, {
                standard: true,
                stepIndex: prevLegacyStepIndex
            });

            if (prevStepId === RegistrationStepId.JOURNEY) {
                // Use setTimeout to prevent nested state updates
                setTimeout(() => {
                    // Navigate to the Journey step
                    navigation.goToStep(prevStepId);

                    // After the render cycle, set the correct substep
                    setTimeout(() => {
                        // Determine which substep to navigate to based on the legacy step
                        switch (prevLegacyStep) {
                            case RegistrationStep.GOALS:
                                navigation.goToSubstep(JourneySubstepId.GOALS);
                                break;
                            case RegistrationStep.EQUIPMENT:
                                navigation.goToSubstep(JourneySubstepId.EQUIPMENT);
                                break;
                            case RegistrationStep.TIME_COMMITMENT:
                                navigation.goToSubstep(JourneySubstepId.TIME_COMMITMENT);
                                break;
                            default:
                                navigation.goToSubstep(JourneySubstepId.GOALS);
                        }
                    }, 0);
                }, 0);
            } else {
                navigation.goToStep(prevStepId);
            }
        }
    }, [navigation, determineCurrentLegacyStep, trackBackNavigation]);

    // Go to a specific step
    const goToStep = useCallback((step: RegistrationStep) => {
        const oldCurrentStep = determineCurrentLegacyStep();
        const stepId = STEP_MAPPING[step];

        // Track direct navigation
        trackDirectNavigation(oldCurrentStep, step, {
            method: 'goToStep',
            validDestination: true
        });

        if (stepId === RegistrationStepId.JOURNEY) {
            // Use setTimeout to prevent nested state updates
            setTimeout(() => {
                // Navigate to the Journey step
                navigation.goToStep(stepId);

                // After the render cycle, set the correct substep
                setTimeout(() => {
                    // Determine which substep to navigate to based on the legacy step
                    switch (step) {
                        case RegistrationStep.GOALS:
                            navigation.goToSubstep(JourneySubstepId.GOALS);
                            break;
                        case RegistrationStep.EQUIPMENT:
                            navigation.goToSubstep(JourneySubstepId.EQUIPMENT);
                            break;
                        case RegistrationStep.TIME_COMMITMENT:
                            navigation.goToSubstep(JourneySubstepId.TIME_COMMITMENT);
                            break;
                        default:
                            navigation.goToSubstep(JourneySubstepId.GOALS);
                    }
                }, 0);
            }, 0);
        } else {
            navigation.goToStep(stepId);
        }
    }, [navigation, determineCurrentLegacyStep, trackDirectNavigation]);

    // Calculate progress percentage (mimicking the old implementation)
    const progress = (() => {
        if (!REGISTRATION_STEPS.includes(currentStep)) {
            return 0; // Fallback for unknown steps
        }

        const totalSteps = REGISTRATION_STEPS.length - 1; // Exclude confirmation
        const currentIndex = REGISTRATION_STEPS.indexOf(currentStep);

        if (currentIndex === -1) return 0;
        if (currentIndex >= totalSteps) return 100;

        return Math.round((currentIndex / totalSteps) * 100);
    })();

    // Check if there's a next step
    const hasNextStep = currentStepIndex < REGISTRATION_STEPS.length - 1;

    // Check if there's a previous step
    const hasPreviousStep = currentStepIndex > 0;

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

export default useNavigationBridge; 