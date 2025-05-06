import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import {
    JourneySubstepId,
    NAVIGATION_HIERARCHY,
    NavigationState,
    RegistrationStepId,
    SectionId,
    STEP_TRANSITION_MAP,
    StepProgress
} from './types';

// Define actions for the reducer
type NavigationAction =
    | { type: 'GOTO_STEP'; payload: { stepId: RegistrationStepId } }
    | { type: 'GOTO_SUBSTEP'; payload: { substepId: JourneySubstepId } }
    | { type: 'GOTO_SECTION'; payload: { sectionId: SectionId } }
    | { type: 'NEXT_STEP' }
    | { type: 'PREV_STEP' }
    | { type: 'NEXT_SUBSTEP' }
    | { type: 'PREV_SUBSTEP' }
    | { type: 'NEXT_SECTION' }
    | { type: 'PREV_SECTION' }
    | { type: 'MARK_STEP_COMPLETED'; payload: { stepId: RegistrationStepId; completed: boolean } }
    | { type: 'MARK_STEP_VALID'; payload: { stepId: RegistrationStepId; valid: boolean } }
    | { type: 'MARK_SUBSTEP_COMPLETED'; payload: { substepId: JourneySubstepId; completed: boolean } }
    | { type: 'MARK_SUBSTEP_VALID'; payload: { substepId: JourneySubstepId; valid: boolean } }
    | { type: 'MARK_SECTION_COMPLETED'; payload: { sectionId: SectionId; completed: boolean } }
    | { type: 'MARK_SECTION_VALID'; payload: { sectionId: SectionId; valid: boolean } };

// Initial state
const initialStepProgress: StepProgress = { completed: false, valid: false };

const createInitialState = (): NavigationState => {
    // Initialize progress tracking for all steps, substeps, and sections
    const stepProgress: Record<RegistrationStepId, StepProgress> = Object.values(RegistrationStepId).reduce(
        (acc, step) => ({ ...acc, [step]: { ...initialStepProgress } }),
        {} as Record<RegistrationStepId, StepProgress>
    );

    const substepProgress: Record<JourneySubstepId, StepProgress> = Object.values(JourneySubstepId).reduce(
        (acc, substep) => ({ ...acc, [substep]: { ...initialStepProgress } }),
        {} as Record<JourneySubstepId, StepProgress>
    );

    const sectionProgress: Record<SectionId, StepProgress> = Object.values(SectionId).reduce(
        (acc, section) => ({ ...acc, [section]: { ...initialStepProgress } }),
        {} as Record<SectionId, StepProgress>
    );

    return {
        currentStep: RegistrationStepId.SPLASH,
        stepProgress,
        substepProgress,
        sectionProgress,
    };
};

// Reducer function
const navigationReducer = (state: NavigationState, action: NavigationAction): NavigationState => {
    switch (action.type) {
        case 'GOTO_STEP':
            return {
                ...state,
                currentStep: action.payload.stepId,
                currentSubstep: action.payload.stepId === RegistrationStepId.JOURNEY
                    ? state.currentSubstep || NAVIGATION_HIERARCHY[RegistrationStepId.JOURNEY].substeps[0]
                    : undefined,
                currentSection: undefined,
            };

        case 'GOTO_SUBSTEP':
            if (state.currentStep !== RegistrationStepId.JOURNEY) {
                return state;
            }
            return {
                ...state,
                currentSubstep: action.payload.substepId,
                currentSection: undefined,
            };

        case 'GOTO_SECTION':
            if (!state.currentSubstep) {
                return state;
            }
            return {
                ...state,
                currentSection: action.payload.sectionId,
            };

        case 'NEXT_STEP': {
            const nextStep = STEP_TRANSITION_MAP[state.currentStep]?.next;
            if (!nextStep) {
                return state;
            }
            return {
                ...state,
                currentStep: nextStep,
                currentSubstep: nextStep === RegistrationStepId.JOURNEY
                    ? NAVIGATION_HIERARCHY[RegistrationStepId.JOURNEY].substeps[0]
                    : undefined,
                currentSection: undefined,
            };
        }

        case 'PREV_STEP': {
            const prevStep = STEP_TRANSITION_MAP[state.currentStep]?.prev;
            if (!prevStep) {
                return state;
            }
            return {
                ...state,
                currentStep: prevStep,
                currentSubstep: prevStep === RegistrationStepId.JOURNEY ? state.currentSubstep : undefined,
                currentSection: undefined,
            };
        }

        case 'NEXT_SUBSTEP': {
            if (state.currentStep !== RegistrationStepId.JOURNEY || !state.currentSubstep) {
                return state;
            }

            const substeps = NAVIGATION_HIERARCHY[RegistrationStepId.JOURNEY].substeps;
            const currentIndex = substeps.indexOf(state.currentSubstep);

            if (currentIndex === -1 || currentIndex === substeps.length - 1) {
                return state;
            }

            return {
                ...state,
                currentSubstep: substeps[currentIndex + 1],
                currentSection: undefined,
            };
        }

        case 'PREV_SUBSTEP': {
            if (state.currentStep !== RegistrationStepId.JOURNEY || !state.currentSubstep) {
                return state;
            }

            const substeps = NAVIGATION_HIERARCHY[RegistrationStepId.JOURNEY].substeps;
            const currentIndex = substeps.indexOf(state.currentSubstep);

            if (currentIndex <= 0) {
                return state;
            }

            return {
                ...state,
                currentSubstep: substeps[currentIndex - 1],
                currentSection: undefined,
            };
        }

        case 'NEXT_SECTION': {
            if (!state.currentSubstep || !state.currentSection) {
                return state;
            }

            const sections = NAVIGATION_HIERARCHY[RegistrationStepId.JOURNEY].sections[state.currentSubstep];
            if (!sections) {
                return state;
            }

            const currentIndex = sections.indexOf(state.currentSection);

            if (currentIndex === -1 || currentIndex === sections.length - 1) {
                return state;
            }

            return {
                ...state,
                currentSection: sections[currentIndex + 1],
            };
        }

        case 'PREV_SECTION': {
            if (!state.currentSubstep || !state.currentSection) {
                return state;
            }

            const sections = NAVIGATION_HIERARCHY[RegistrationStepId.JOURNEY].sections[state.currentSubstep];
            if (!sections) {
                return state;
            }

            const currentIndex = sections.indexOf(state.currentSection);

            if (currentIndex <= 0) {
                return state;
            }

            return {
                ...state,
                currentSection: sections[currentIndex - 1],
            };
        }

        case 'MARK_STEP_COMPLETED':
            return {
                ...state,
                stepProgress: {
                    ...state.stepProgress,
                    [action.payload.stepId]: {
                        ...state.stepProgress[action.payload.stepId],
                        completed: action.payload.completed,
                    },
                },
            };

        case 'MARK_STEP_VALID':
            return {
                ...state,
                stepProgress: {
                    ...state.stepProgress,
                    [action.payload.stepId]: {
                        ...state.stepProgress[action.payload.stepId],
                        valid: action.payload.valid,
                    },
                },
            };

        case 'MARK_SUBSTEP_COMPLETED':
            return {
                ...state,
                substepProgress: {
                    ...state.substepProgress,
                    [action.payload.substepId]: {
                        ...state.substepProgress[action.payload.substepId],
                        completed: action.payload.completed,
                    },
                },
            };

        case 'MARK_SUBSTEP_VALID':
            return {
                ...state,
                substepProgress: {
                    ...state.substepProgress,
                    [action.payload.substepId]: {
                        ...state.substepProgress[action.payload.substepId],
                        valid: action.payload.valid,
                    },
                },
            };

        case 'MARK_SECTION_COMPLETED':
            return {
                ...state,
                sectionProgress: {
                    ...state.sectionProgress,
                    [action.payload.sectionId]: {
                        ...state.sectionProgress[action.payload.sectionId],
                        completed: action.payload.completed,
                    },
                },
            };

        case 'MARK_SECTION_VALID':
            return {
                ...state,
                sectionProgress: {
                    ...state.sectionProgress,
                    [action.payload.sectionId]: {
                        ...state.sectionProgress[action.payload.sectionId],
                        valid: action.payload.valid,
                    },
                },
            };

        default:
            return state;
    }
};

// Context interface
interface NavigationContextType {
    state: NavigationState;
    goToStep: (stepId: RegistrationStepId) => void;
    goToSubstep: (substepId: JourneySubstepId) => void;
    goToSection: (sectionId: SectionId) => void;
    nextStep: () => void;
    prevStep: () => void;
    nextSubstep: () => void;
    prevSubstep: () => void;
    nextSection: () => void;
    prevSection: () => void;
    markStepCompleted: (stepId: RegistrationStepId, completed: boolean) => void;
    markStepValid: (stepId: RegistrationStepId, valid: boolean) => void;
    markSubstepCompleted: (substepId: JourneySubstepId, completed: boolean) => void;
    markSubstepValid: (substepId: JourneySubstepId, valid: boolean) => void;
    markSectionCompleted: (sectionId: SectionId, completed: boolean) => void;
    markSectionValid: (sectionId: SectionId, valid: boolean) => void;
    isCurrentStep: (stepId: RegistrationStepId) => boolean;
    isCurrentSubstep: (substepId: JourneySubstepId) => boolean;
    isCurrentSection: (sectionId: SectionId) => boolean;
    canGoForward: () => boolean;
    canGoBack: () => boolean;
}

// Create context
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Provider component
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(navigationReducer, createInitialState());

    // Navigation actions
    const goToStep = useCallback((stepId: RegistrationStepId) => {
        dispatch({ type: 'GOTO_STEP', payload: { stepId } });
    }, []);

    const goToSubstep = useCallback((substepId: JourneySubstepId) => {
        dispatch({ type: 'GOTO_SUBSTEP', payload: { substepId } });
    }, []);

    const goToSection = useCallback((sectionId: SectionId) => {
        dispatch({ type: 'GOTO_SECTION', payload: { sectionId } });
    }, []);

    const nextStep = useCallback(() => {
        dispatch({ type: 'NEXT_STEP' });
    }, []);

    const prevStep = useCallback(() => {
        dispatch({ type: 'PREV_STEP' });
    }, []);

    const nextSubstep = useCallback(() => {
        dispatch({ type: 'NEXT_SUBSTEP' });
    }, []);

    const prevSubstep = useCallback(() => {
        dispatch({ type: 'PREV_SUBSTEP' });
    }, []);

    const nextSection = useCallback(() => {
        dispatch({ type: 'NEXT_SECTION' });
    }, []);

    const prevSection = useCallback(() => {
        dispatch({ type: 'PREV_SECTION' });
    }, []);

    // Progress tracking actions
    const markStepCompleted = useCallback((stepId: RegistrationStepId, completed: boolean) => {
        dispatch({ type: 'MARK_STEP_COMPLETED', payload: { stepId, completed } });
    }, []);

    const markStepValid = useCallback((stepId: RegistrationStepId, valid: boolean) => {
        dispatch({ type: 'MARK_STEP_VALID', payload: { stepId, valid } });
    }, []);

    const markSubstepCompleted = useCallback((substepId: JourneySubstepId, completed: boolean) => {
        dispatch({ type: 'MARK_SUBSTEP_COMPLETED', payload: { substepId, completed } });
    }, []);

    const markSubstepValid = useCallback((substepId: JourneySubstepId, valid: boolean) => {
        dispatch({ type: 'MARK_SUBSTEP_VALID', payload: { substepId, valid } });
    }, []);

    const markSectionCompleted = useCallback((sectionId: SectionId, completed: boolean) => {
        dispatch({ type: 'MARK_SECTION_COMPLETED', payload: { sectionId, completed } });
    }, []);

    const markSectionValid = useCallback((sectionId: SectionId, valid: boolean) => {
        dispatch({ type: 'MARK_SECTION_VALID', payload: { sectionId, valid } });
    }, []);

    // Helper functions
    const isCurrentStep = useCallback((stepId: RegistrationStepId) => {
        return state.currentStep === stepId;
    }, [state.currentStep]);

    const isCurrentSubstep = useCallback((substepId: JourneySubstepId) => {
        return state.currentSubstep === substepId;
    }, [state.currentSubstep]);

    const isCurrentSection = useCallback((sectionId: SectionId) => {
        return state.currentSection === sectionId;
    }, [state.currentSection]);

    const canGoForward = useCallback(() => {
        // Check if current step has a next step and is valid
        const currentStepValid = state.stepProgress[state.currentStep].valid;
        const hasNextStep = !!STEP_TRANSITION_MAP[state.currentStep]?.next;

        return currentStepValid && hasNextStep;
    }, [state]);

    const canGoBack = useCallback(() => {
        // Check if current step has a previous step
        return !!STEP_TRANSITION_MAP[state.currentStep]?.prev;
    }, [state]);

    // Create context value
    const value = useMemo(() => ({
        state,
        goToStep,
        goToSubstep,
        goToSection,
        nextStep,
        prevStep,
        nextSubstep,
        prevSubstep,
        nextSection,
        prevSection,
        markStepCompleted,
        markStepValid,
        markSubstepCompleted,
        markSubstepValid,
        markSectionCompleted,
        markSectionValid,
        isCurrentStep,
        isCurrentSubstep,
        isCurrentSection,
        canGoForward,
        canGoBack,
    }), [
        state,
        goToStep,
        goToSubstep,
        goToSection,
        nextStep,
        prevStep,
        nextSubstep,
        prevSubstep,
        nextSection,
        prevSection,
        markStepCompleted,
        markStepValid,
        markSubstepCompleted,
        markSubstepValid,
        markSectionCompleted,
        markSectionValid,
        isCurrentStep,
        isCurrentSubstep,
        isCurrentSection,
        canGoForward,
        canGoBack,
    ]);

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};

// Hook for consuming the context
export const useNavigation = (): NavigationContextType => {
    const context = useContext(NavigationContext);

    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }

    return context;
}; 