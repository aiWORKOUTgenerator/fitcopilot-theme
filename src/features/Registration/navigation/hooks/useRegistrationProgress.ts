import { useCallback, useMemo } from 'react';
import { useNavigation } from '../context';
import {
    JourneySubstepId,
    NAVIGATION_HIERARCHY,
    RegistrationStepId,
    SectionId
} from '../types';

/**
 * Hook for tracking progress through the registration flow
 */
export const useRegistrationProgress = () => {
    const { state } = useNavigation();

    /**
     * Calculate the overall progress percentage through the registration flow
     */
    const progressPercentage = useMemo(() => {
        // Define weights for each step
        const stepWeights: Record<RegistrationStepId, number> = {
            [RegistrationStepId.SPLASH]: 0,
            [RegistrationStepId.EXPERIENCE_LEVEL]: 0.1,
            [RegistrationStepId.JOURNEY]: 0.7, // Journey is the largest section
            [RegistrationStepId.PRICING]: 0.1,
            [RegistrationStepId.PAYMENT]: 0.05,
            [RegistrationStepId.CONFIRMATION]: 0.05,
        };

        // Calculate completed step weight
        let completedWeight = 0;
        let totalWeight = 0;

        // Add weights for completed steps
        Object.values(RegistrationStepId).forEach((step) => {
            const stepWeight = stepWeights[step];
            totalWeight += stepWeight;

            if (state.stepProgress[step].completed) {
                completedWeight += stepWeight;
            } else if (step === state.currentStep) {
                // Add partial weight for current step
                if (step === RegistrationStepId.JOURNEY && state.currentSubstep) {
                    // For Journey, calculate substep progress
                    const substeps = NAVIGATION_HIERARCHY[RegistrationStepId.JOURNEY].substeps;
                    const substepWeight = stepWeight / substeps.length;
                    const currentSubstepIndex = substeps.indexOf(state.currentSubstep);

                    // Add weight for completed substeps
                    substeps.forEach((substep, index) => {
                        if (state.substepProgress[substep].completed) {
                            completedWeight += substepWeight;
                        } else if (index === currentSubstepIndex) {
                            // Add partial weight for current substep
                            const sections = NAVIGATION_HIERARCHY[RegistrationStepId.JOURNEY].sections[substep];
                            if (sections && state.currentSection) {
                                const sectionWeight = substepWeight / sections.length;
                                const currentSectionIndex = sections.indexOf(state.currentSection);

                                // Add weight for completed sections
                                sections.forEach((section, idx) => {
                                    if (state.sectionProgress[section].completed) {
                                        completedWeight += sectionWeight;
                                    } else if (idx === currentSectionIndex) {
                                        // Add half weight for current section
                                        completedWeight += sectionWeight / 2;
                                    }
                                });
                            } else {
                                // Add half weight for current substep without sections
                                completedWeight += substepWeight / 2;
                            }
                        }
                    });
                } else {
                    // For other steps, add half weight for current step
                    completedWeight += stepWeight / 2;
                }
            }
        });

        return Math.min(Math.floor((completedWeight / totalWeight) * 100), 100);
    }, [state]);

    /**
     * Get progress for a specific step
     */
    const getStepProgress = useCallback((stepId: RegistrationStepId) => {
        return state.stepProgress[stepId];
    }, [state.stepProgress]);

    /**
     * Get progress for a specific substep
     */
    const getSubstepProgress = useCallback((substepId: JourneySubstepId) => {
        return state.substepProgress[substepId];
    }, [state.substepProgress]);

    /**
     * Get progress for a specific section
     */
    const getSectionProgress = useCallback((sectionId: SectionId) => {
        return state.sectionProgress[sectionId];
    }, [state.sectionProgress]);

    /**
     * Check if all required steps are completed
     */
    const isRegistrationComplete = useMemo(() => {
        // Check if all required steps are completed
        const requiredSteps = [
            RegistrationStepId.EXPERIENCE_LEVEL,
            RegistrationStepId.JOURNEY,
            RegistrationStepId.PRICING,
            RegistrationStepId.PAYMENT,
        ];

        return requiredSteps.every(step => state.stepProgress[step].completed);
    }, [state.stepProgress]);

    return {
        progressPercentage,
        getStepProgress,
        getSubstepProgress,
        getSectionProgress,
        isRegistrationComplete,
    };
}; 