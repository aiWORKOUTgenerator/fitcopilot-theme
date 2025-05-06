import React, { createContext, ReactNode, useContext, useReducer } from 'react';
import {
    JourneySubstepId,
    NAVIGATION_HIERARCHY,
    RegistrationData,
    RegistrationStepId,
    SectionId
} from '../types';

// Define the state interface
export interface NavigationState {
    currentStep: RegistrationStepId;
    currentSubstep: JourneySubstepId | null;
    completedSteps: Set<RegistrationStepId>;
    completedSubsteps: Set<JourneySubstepId>;
    completedSections: Set<SectionId>;
    registrationData: RegistrationData;
}

// Define the available actions
export type NavigationAction =
    | { type: 'SET_STEP', payload: { stepId: RegistrationStepId } }
    | { type: 'SET_SUBSTEP', payload: { substepId: JourneySubstepId } }
    | { type: 'COMPLETE_STEP', payload: { stepId: RegistrationStepId } }
    | { type: 'COMPLETE_SUBSTEP', payload: { substepId: JourneySubstepId } }
    | { type: 'COMPLETE_SECTION', payload: { sectionId: SectionId } }
    | { type: 'UPDATE_DATA', payload: Partial<RegistrationData> };

// Initial state
export const initialNavigationState: NavigationState = {
    currentStep: RegistrationStepId.SPLASH,
    currentSubstep: null,
    completedSteps: new Set(),
    completedSubsteps: new Set(),
    completedSections: new Set(),
    registrationData: {} as RegistrationData
};

// Navigation reducer
export function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
    switch (action.type) {
        case 'SET_STEP':
            return {
                ...state,
                currentStep: action.payload.stepId,
                // When changing steps, update substep if needed
                currentSubstep: action.payload.stepId === RegistrationStepId.JOURNEY
                    ? (state.currentSubstep || NAVIGATION_HIERARCHY.steps[RegistrationStepId.JOURNEY][0])
                    : null
            };

        case 'SET_SUBSTEP':
            return {
                ...state,
                currentSubstep: action.payload.substepId
            };

        case 'COMPLETE_STEP':
            return {
                ...state,
                completedSteps: new Set([...state.completedSteps, action.payload.stepId])
            };

        case 'COMPLETE_SUBSTEP':
            return {
                ...state,
                completedSubsteps: new Set([...state.completedSubsteps, action.payload.substepId])
            };

        case 'COMPLETE_SECTION':
            return {
                ...state,
                completedSections: new Set([...state.completedSections, action.payload.sectionId])
            };

        case 'UPDATE_DATA':
            return {
                ...state,
                registrationData: {
                    ...state.registrationData,
                    ...action.payload
                }
            };

        default:
            return state;
    }
}

// Define the context type
export interface NavigationContextType {
    state: NavigationState;
    dispatch: React.Dispatch<NavigationAction>;
    nextStep: () => void;
    previousStep: () => void;
    goToStep: (stepId: RegistrationStepId) => void;
    nextSubstep: () => void;
    previousSubstep: () => void;
    goToSubstep: (substepId: JourneySubstepId) => void;
    completeSection: (sectionId: SectionId) => void;
    updateRegistrationData: (data: Partial<RegistrationData>) => void;
    isStepComplete: (stepId: RegistrationStepId) => boolean;
    isSubstepComplete: (substepId: JourneySubstepId) => boolean;
    isSectionComplete: (sectionId: SectionId) => boolean;
}

// Create the context
export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Provider props
interface NavigationProviderProps {
    children: ReactNode;
    initialStep?: RegistrationStepId;
    initialData?: Partial<RegistrationData>;
}

// Provider component
export function NavigationProvider({
    children,
    initialStep = RegistrationStepId.SPLASH,
    initialData = {}
}: NavigationProviderProps) {
    // Initialize with custom initial state if provided
    const customInitialState: NavigationState = {
        ...initialNavigationState,
        currentStep: initialStep,
        currentSubstep: initialStep === RegistrationStepId.JOURNEY
            ? NAVIGATION_HIERARCHY.steps[RegistrationStepId.JOURNEY][0]
            : null,
        registrationData: initialData as RegistrationData
    };

    const [state, dispatch] = useReducer(navigationReducer, customInitialState);

    // Define navigation handlers
    const nextStep = () => {
        const currentIndex = Object.values(RegistrationStepId).indexOf(state.currentStep);
        const nextStepId = Object.values(RegistrationStepId)[currentIndex + 1];

        if (nextStepId) {
            // Mark current step as completed first
            dispatch({ type: 'COMPLETE_STEP', payload: { stepId: state.currentStep } });

            // Then use setTimeout to ensure state updates are properly sequenced
            setTimeout(() => {
                dispatch({ type: 'SET_STEP', payload: { stepId: nextStepId } });
            }, 0);
        }
    };

    const previousStep = () => {
        const currentIndex = Object.values(RegistrationStepId).indexOf(state.currentStep);
        const prevStepId = Object.values(RegistrationStepId)[currentIndex - 1];

        if (prevStepId) {
            dispatch({ type: 'SET_STEP', payload: { stepId: prevStepId } });
        }
    };

    const goToStep = (stepId: RegistrationStepId) => {
        dispatch({ type: 'SET_STEP', payload: { stepId } });
    };

    const nextSubstep = () => {
        if (!state.currentSubstep) return;

        const substeps = NAVIGATION_HIERARCHY.steps[RegistrationStepId.JOURNEY] as JourneySubstepId[];
        const currentIndex = substeps.indexOf(state.currentSubstep);
        const nextSubstepId = substeps[currentIndex + 1];

        if (nextSubstepId) {
            // Mark current substep as completed first
            dispatch({ type: 'COMPLETE_SUBSTEP', payload: { substepId: state.currentSubstep } });

            // Then update the current substep in the next render cycle
            setTimeout(() => {
                dispatch({ type: 'SET_SUBSTEP', payload: { substepId: nextSubstepId } });
            }, 0);
        } else {
            // If no next substep, mark the current substep as completed
            dispatch({ type: 'COMPLETE_SUBSTEP', payload: { substepId: state.currentSubstep } });

            // Then move to the next main step in the next render cycle
            setTimeout(() => {
                nextStep();
            }, 0);
        }
    };

    const previousSubstep = () => {
        if (!state.currentSubstep) return;

        const substeps = NAVIGATION_HIERARCHY.steps[RegistrationStepId.JOURNEY] as JourneySubstepId[];
        const currentIndex = substeps.indexOf(state.currentSubstep);
        const prevSubstepId = substeps[currentIndex - 1];

        if (prevSubstepId) {
            dispatch({ type: 'SET_SUBSTEP', payload: { substepId: prevSubstepId } });
        } else {
            // If no previous substep, move to previous main step
            previousStep();
        }
    };

    const goToSubstep = (substepId: JourneySubstepId) => {
        if (state.currentStep !== RegistrationStepId.JOURNEY) {
            dispatch({ type: 'SET_STEP', payload: { stepId: RegistrationStepId.JOURNEY } });
        }
        dispatch({ type: 'SET_SUBSTEP', payload: { substepId } });
    };

    const completeSection = (sectionId: SectionId) => {
        dispatch({ type: 'COMPLETE_SECTION', payload: { sectionId } });
    };

    const updateRegistrationData = (data: Partial<RegistrationData>) => {
        dispatch({ type: 'UPDATE_DATA', payload: data });
    };

    // Completion checkers
    const isStepComplete = (stepId: RegistrationStepId): boolean => {
        return state.completedSteps.has(stepId);
    };

    const isSubstepComplete = (substepId: JourneySubstepId): boolean => {
        return state.completedSubsteps.has(substepId);
    };

    const isSectionComplete = (sectionId: SectionId): boolean => {
        return state.completedSections.has(sectionId);
    };

    const value = {
        state,
        dispatch,
        nextStep,
        previousStep,
        goToStep,
        nextSubstep,
        previousSubstep,
        goToSubstep,
        completeSection,
        updateRegistrationData,
        isStepComplete,
        isSubstepComplete,
        isSectionComplete
    };

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
}

// Custom hook for using navigation
export function useNavigation() {
    const context = useContext(NavigationContext);

    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }

    return context;
} 