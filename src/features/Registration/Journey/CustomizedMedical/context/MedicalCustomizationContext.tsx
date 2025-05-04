import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useJourney } from '../../components/JourneyContext';
import { SECTION_IDS } from '../constants/sectionConstants';
import { getMedicalCustomizationData, saveMedicalCustomizationData } from '../utils/customizationStorage';

// Context value interface - deliberately simple
interface MedicalCustomizationContextValue {
    // State
    state: {
        anthropometrics: any;
        injuries: any;
        medicalClearance: any;
        liabilityWaiver: any;
        meta: {
            completedSections: string[];
            validSections: Record<string, boolean>;
        }
    };

    // Loading and error states
    isLoading: boolean;
    error: string | null;

    // Computed properties
    isCustomizationValid: boolean;

    // Actions
    updateSectionData: (sectionId: string, data: any) => void;
    updateSectionValidity: (sectionId: string, isValid: boolean) => void;
    markSectionComplete: (sectionId: string) => void;
    saveAllData: () => Promise<{ success: boolean; error?: string }>;
}

// Create the context
const MedicalCustomizationContext = createContext<MedicalCustomizationContextValue | undefined>(undefined);

// Provider component
export const MedicalCustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { registrationData, updateRegistrationData } = useJourney();

    // Initialize state
    const [state, setState] = useState({
        anthropometrics: null,
        injuries: null,
        medicalClearance: null,
        liabilityWaiver: null,
        meta: {
            completedSections: registrationData.completedMedicalSections || [],
            validSections: Object.values(SECTION_IDS).reduce((acc, id) => ({ ...acc, [id]: false }), {})
        }
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Computed property
    const isCustomizationValid = state.meta.completedSections.length > 0;

    // Update section data
    const updateSectionData = useCallback((sectionId: string, data: any) => {
        setState(prev => ({
            ...prev,
            [sectionId]: { ...prev[sectionId], ...data }
        }));
    }, []);

    // Update section validity
    const updateSectionValidity = useCallback((sectionId: string, isValid: boolean) => {
        setState(prev => ({
            ...prev,
            meta: {
                ...prev.meta,
                validSections: {
                    ...prev.meta.validSections,
                    [sectionId]: isValid
                }
            }
        }));
    }, []);

    // Mark section as complete
    const markSectionComplete = useCallback((sectionId: string) => {
        setState(prev => {
            // Skip if already completed
            if (prev.meta.completedSections.includes(sectionId)) return prev;

            const updatedSections = [...prev.meta.completedSections, sectionId];

            // Update journey context data
            updateRegistrationData({
                completedMedicalSections: updatedSections
            });

            // Update state
            return {
                ...prev,
                meta: {
                    ...prev.meta,
                    completedSections: updatedSections
                }
            };
        });
    }, [updateRegistrationData]);

    // Save all data
    const saveAllData = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
        try {
            const result = await saveMedicalCustomizationData({
                anthropometrics: state.anthropometrics,
                injuries: state.injuries,
                medicalClearance: state.medicalClearance,
                liabilityWaiver: state.liabilityWaiver,
                completedSections: state.meta.completedSections
            });

            return result;
        } catch (error) {
            console.error('Error saving medical data:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error saving data'
            };
        }
    }, [state]);

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = getMedicalCustomizationData();
                if (data) {
                    setState(prev => ({
                        anthropometrics: data.anthropometrics || null,
                        injuries: data.injuries || null,
                        medicalClearance: data.medicalClearance || null,
                        liabilityWaiver: data.liabilityWaiver || null,
                        meta: {
                            ...prev.meta,
                            // Use completedSections from storage or keep current
                            completedSections: data.completedSections?.length
                                ? data.completedSections
                                : prev.meta.completedSections
                        }
                    }));

                    // Update registration data if needed
                    if (data.completedSections?.length && !registrationData.completedMedicalSections?.length) {
                        updateRegistrationData({
                            completedMedicalSections: data.completedSections
                        });
                    }
                }
            } catch (err) {
                console.error('Error loading medical data:', err);
                setError('Failed to load your saved medical information');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [registrationData.completedMedicalSections, updateRegistrationData]);

    // Persist state changes
    useEffect(() => {
        // Skip initial render and loading state
        if (isLoading) return;

        // Debounced save
        const timeoutId = setTimeout(() => {
            // Only save if we have some data
            if (state.anthropometrics || state.injuries ||
                state.medicalClearance || state.liabilityWaiver ||
                state.meta.completedSections.length > 0) {

                saveAllData().catch(err => {
                    console.error('Error automatically saving medical data:', err);
                });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [state, isLoading, saveAllData]);

    const contextValue = {
        state,
        isLoading,
        error,
        isCustomizationValid,
        updateSectionData,
        updateSectionValidity,
        markSectionComplete,
        saveAllData
    };

    return (
        <MedicalCustomizationContext.Provider value={contextValue}>
            {children}
        </MedicalCustomizationContext.Provider>
    );
};

// Custom hook to use the context
export const useMedicalCustomization = (): MedicalCustomizationContextValue => {
    const context = useContext(MedicalCustomizationContext);
    if (context === undefined) {
        throw new Error('useMedicalCustomization must be used within a MedicalCustomizationProvider');
    }
    return context;
};

export default MedicalCustomizationContext; 