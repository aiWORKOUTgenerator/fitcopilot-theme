import { useCallback, useEffect, useState } from 'react';
import { useJourney } from '../../components/JourneyContext';
import { SECTION_IDS } from '../constants/sectionConstants';

// Local storage key for caching
const STORAGE_KEY = 'fitcopilot_medical_customization_state';

// Interface for the hook state
interface MedicalCustomizationState {
    validSections: Record<string, boolean>;
    completedSections: string[];
    updateSectionValidity: (sectionId: string, isValid: boolean) => void;
    markSectionComplete: (sectionId: string) => void;
    resetCustomizationState: () => void;
    isCustomizationValid: boolean;
    syncWithStoredCompletedSections: (sections: string[]) => void;
}

/**
 * Custom hook for managing medical customization state with persistence
 */
export const useMedicalCustomizationState = (): MedicalCustomizationState => {
    const { registrationData, updateRegistrationData } = useJourney();

    // Initialize state with fallbacks to cached data
    const [validSections, setValidSections] = useState<Record<string, boolean>>(() => {
        try {
            const cachedState = sessionStorage.getItem(STORAGE_KEY);
            if (cachedState) {
                const parsed = JSON.parse(cachedState);
                return parsed.validSections || initializeValidSections();
            }
        } catch (error) {
            console.error('Failed to parse cached medical customization state:', error);
        }
        return initializeValidSections();
    });

    const [completedSections, setCompletedSections] = useState<string[]>(() => {
        // First try to get from registration data (from JourneyContext)
        if (registrationData.completedMedicalSections?.length) {
            return registrationData.completedMedicalSections;
        }

        // Fall back to session storage
        try {
            const cachedState = sessionStorage.getItem(STORAGE_KEY);
            if (cachedState) {
                const parsed = JSON.parse(cachedState);
                return parsed.completedSections || [];
            }
        } catch (error) {
            console.error('Failed to parse cached medical customization state:', error);
        }
        return [];
    });

    // Calculate if overall customization is valid (at least one section completed)
    const isCustomizationValid = completedSections.length > 0;

    // Initialize valid sections object
    function initializeValidSections(): Record<string, boolean> {
        return Object.values(SECTION_IDS).reduce((acc, sectionId) => {
            acc[sectionId] = false;
            return acc;
        }, {} as Record<string, boolean>);
    }

    // Update section validity
    const updateSectionValidity = useCallback((sectionId: string, isValid: boolean) => {
        setValidSections(prev => {
            // Only update if the value actually changes
            if (prev[sectionId] === isValid) return prev;

            const updated = { ...prev, [sectionId]: isValid };
            persistState(updated, completedSections);
            return updated;
        });
    }, [completedSections]);

    // Mark a section as complete
    const markSectionComplete = useCallback((sectionId: string) => {
        setCompletedSections(prev => {
            if (prev.includes(sectionId)) return prev;

            const updated = [...prev, sectionId];
            persistState(validSections, updated);

            // Also update the journey context data
            updateRegistrationData({
                completedMedicalSections: updated
            });

            return updated;
        });
    }, [validSections, updateRegistrationData]);

    // Reset state
    const resetCustomizationState = useCallback(() => {
        const initialSections = initializeValidSections();
        setValidSections(initialSections);
        setCompletedSections([]);
        sessionStorage.removeItem(STORAGE_KEY);

        // Also clear from journey context
        updateRegistrationData({
            completedMedicalSections: []
        });
    }, [updateRegistrationData]);

    // Persist state to session storage with debouncing
    const persistState = useCallback((
        validSectionsData: Record<string, boolean>,
        completedSectionsData: string[]
    ) => {
        try {
            const stateToCache = {
                validSections: validSectionsData,
                completedSections: completedSectionsData,
                timestamp: new Date().toISOString()
            };

            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToCache));
        } catch (error) {
            console.error('Failed to cache medical customization state:', error);
        }
    }, []);

    // Sync with journey context data when it changes
    useEffect(() => {
        if (registrationData.completedMedicalSections?.length) {
            setCompletedSections(registrationData.completedMedicalSections);
        }
    }, [registrationData.completedMedicalSections]);

    // Sync with stored completed sections (useful for initialization)
    const syncWithStoredCompletedSections = useCallback((sections: string[]) => {
        if (sections.length > 0) {
            setCompletedSections(sections);

            // Also update registration data for consistency
            updateRegistrationData({
                completedMedicalSections: sections
            });
        }
    }, [updateRegistrationData]);

    return {
        validSections,
        completedSections,
        updateSectionValidity,
        markSectionComplete,
        resetCustomizationState,
        isCustomizationValid,
        syncWithStoredCompletedSections
    };
}; 