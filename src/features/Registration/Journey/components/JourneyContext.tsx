import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import logger from "../../../../utils/logger";
import { RegistrationData } from '../../types';

// Create a context-specific logger
const journeyLogger = logger.addContext('JourneyContext');

// Define the context state interface
interface JourneyContextState {
    expandedStep: number | null;
    activeSubstep: string | null;
    completedSteps: number[];
    registrationData: RegistrationData;
    isDirty: boolean;
    isSaving: boolean;
}

// Define the context interface with state and actions
interface JourneyContextValue extends JourneyContextState {
    toggleStep: (index: number) => void;
    setActiveSubstep: (substep: string | null) => void;
    markStepComplete: (stepIndex: number) => void;
    updateRegistrationData: (newData: Partial<RegistrationData>) => void;
    resetJourney: () => void;
}

// Create the context with a default undefined value
const JourneyContext = createContext<JourneyContextValue | undefined>(undefined);

// Initial state
const initialState: JourneyContextState = {
    expandedStep: null,
    activeSubstep: null,
    completedSteps: [],
    registrationData: {},
    isDirty: false,
    isSaving: false,
};

// Storage key for session storage
const STORAGE_KEY = 'fitcopilot_journey_state';

// Provider component
export const JourneyProvider: React.FC<{
    children: React.ReactNode;
    initialData?: RegistrationData;
}> = ({ children, initialData = {} }) => {
    journeyLogger.debug('JourneyProvider initializing', { hasInitialData: Object.keys(initialData).length > 0 });

    // Initialize state from session storage or props
    const [state, setState] = useState<JourneyContextState>(() => {
        // Try to load from session storage
        const storedState = sessionStorage.getItem(STORAGE_KEY);
        if (storedState) {
            try {
                const parsedState = JSON.parse(storedState);
                journeyLogger.debug('Restored journey state from session storage');
                return { ...parsedState, isSaving: false };
            } catch (error) {
                journeyLogger.error('Failed to parse stored journey state', { error });
            }
        }
        // Fall back to initial state with any provided data
        journeyLogger.debug('Using initial journey state', { dataFields: Object.keys(initialData) });
        return { ...initialState, registrationData: initialData };
    });

    // Save state to session storage whenever it changes
    useEffect(() => {
        if (state.isDirty) {
            setState(prev => ({ ...prev, isSaving: true }));

            // Debounce saving to avoid excessive writes
            const saveTimeout = setTimeout(() => {
                try {
                    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
                    setState(prev => ({ ...prev, isDirty: false, isSaving: false }));
                    journeyLogger.debug('Journey state saved to session storage');
                } catch (error) {
                    journeyLogger.error('Failed to save journey state', { error });
                    setState(prev => ({ ...prev, isSaving: false }));
                }
            }, 300);

            return () => clearTimeout(saveTimeout);
        }
    }, [state]);

    // Toggle expanded step
    const toggleStep = useCallback((index: number) => {
        setState(prev => {
            const newExpandedStep = prev.expandedStep === index ? null : index;
            journeyLogger.debug('Toggling step', {
                previousStep: prev.expandedStep,
                newStep: newExpandedStep
            });
            return {
                ...prev,
                expandedStep: newExpandedStep,
                isDirty: true
            };
        });
    }, []);

    // Set active substep
    const setActiveSubstep = useCallback((substep: string | null) => {
        setState(prev => {
            journeyLogger.debug('Setting active substep', {
                previousSubstep: prev.activeSubstep,
                newSubstep: substep
            });
            return {
                ...prev,
                activeSubstep: substep,
                isDirty: true
            };
        });
    }, []);

    // Mark a step as complete
    const markStepComplete = useCallback((stepIndex: number) => {
        setState(prev => {
            if (prev.completedSteps.includes(stepIndex)) {
                journeyLogger.debug('Step already marked complete', { stepIndex });
                return prev;
            }
            journeyLogger.debug('Marking step complete', {
                stepIndex,
                completedSteps: [...prev.completedSteps, stepIndex]
            });
            return {
                ...prev,
                completedSteps: [...prev.completedSteps, stepIndex],
                isDirty: true
            };
        });
    }, []);

    // Update registration data
    const updateRegistrationData = useCallback((newData: Partial<RegistrationData>) => {
        setState(prev => {
            journeyLogger.debug('Updating registration data', {
                updatedFields: Object.keys(newData)
            });
            return {
                ...prev,
                registrationData: { ...prev.registrationData, ...newData },
                isDirty: true
            };
        });
    }, []);

    // Reset journey state
    const resetJourney = useCallback(() => {
        journeyLogger.info('Resetting journey state');
        setState({ ...initialState });
        sessionStorage.removeItem(STORAGE_KEY);
    }, []);

    // Context value
    const value: JourneyContextValue = {
        ...state,
        toggleStep,
        setActiveSubstep,
        markStepComplete,
        updateRegistrationData,
        resetJourney
    };

    return (
        <JourneyContext.Provider value={value}>
            {children}
        </JourneyContext.Provider>
    );
};

// Custom hook to use the context
export const useJourney = (): JourneyContextValue => {
    const context = useContext(JourneyContext);
    if (context === undefined) {
        journeyLogger.error('useJourney called outside of JourneyProvider');
        throw new Error('useJourney must be used within a JourneyProvider');
    }
    return context;
};

export default JourneyContext; 