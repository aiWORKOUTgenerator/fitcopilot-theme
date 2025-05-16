import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import logger from "../../../../../utils/logger";
import { useJourney } from '../../components/JourneyContext';
import { SECTION_IDS } from '../constants/sectionConstants';
import { AnthropometricsData, InjuriesData, LiabilityWaiverData, MedicalClearanceData, MedicalCustomizationData } from '../types';
import { getMedicalCustomizationData, saveMedicalCustomizationData } from '../utils/customizationStorage';
import { validators } from '../utils/validators';

// Context value interface with proper typing
interface MedicalCustomizationContextValue {
    // State with proper types
    state: {
        anthropometrics: AnthropometricsData | null;
        injuries: InjuriesData | null;
        medicalClearance: MedicalClearanceData | null;
        liabilityWaiver: LiabilityWaiverData | null;
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
    validSections: string[];
    completedSections: string[];

    // Actions
    updateSectionData: <T extends keyof MedicalCustomizationData>(
        sectionId: T,
        data: Partial<MedicalCustomizationData[T]>
    ) => void;
    updateSectionValidity: (sectionId: string, isValid: boolean) => void;
    markSectionComplete: (sectionId: string) => void;
    saveAllData: () => Promise<boolean>;
    validateSection: (sectionId: string) => boolean;
}

// Create the context
const MedicalCustomizationContext = createContext<MedicalCustomizationContextValue | undefined>(undefined);

// Provider component
export const MedicalCustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { registrationData, updateRegistrationData } = useJourney();

  // Initialize state with proper typing
  const [state, setState] = useState<MedicalCustomizationContextValue['state']>({
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

  // Computed properties
  const validSections = Object.entries(state.meta.validSections)
    .filter(([_, isValid]) => isValid)
    .map(([sectionId]) => sectionId);

  const completedSections = state.meta.completedSections;

  const isCustomizationValid = completedSections.length > 0 &&
        Object.values(SECTION_IDS).some(id => completedSections.includes(id));

  // Update section data with proper typing
  const updateSectionData = useCallback(<T extends keyof MedicalCustomizationData>(
    sectionId: T,
    data: Partial<MedicalCustomizationData[T]>
  ): void => {
    setState(prev => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] || {}), ...data }
    }));
  }, []);

  // Update section validity
  const updateSectionValidity = useCallback((sectionId: string, isValid: boolean): void => {
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
  const markSectionComplete = useCallback((sectionId: string): void => {
    setState(prev => {
      // Skip if already completed
      if (prev.meta.completedSections.includes(sectionId)) return prev;

      const updatedSections = [...prev.meta.completedSections, sectionId];

      // Update journey context data
      updateRegistrationData({
        completedMedicalSections: updatedSections,
        // Special flag for registration progress
        completedCustomizationSections: [
          ...(registrationData.completedCustomizationSections || []),
          'medical_information_completed'
        ]
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
  }, [registrationData.completedCustomizationSections, updateRegistrationData]);

  // Validate a section based on its data
  const validateSection = useCallback((sectionId: string): boolean => {
    const validatorFn = validators[sectionId as keyof typeof validators];
    if (!validatorFn) return false;

    return validatorFn(state[sectionId as keyof MedicalCustomizationData]);
  }, [state]);

  // Save all data to storage
  const saveAllData = useCallback(async (): Promise<boolean> => {
    try {
      const medicalData: MedicalCustomizationData = {
        anthropometrics: state.anthropometrics || undefined,
        injuries: state.injuries || undefined,
        medicalClearance: state.medicalClearance || undefined,
        liabilityWaiver: state.liabilityWaiver || undefined,
        completedSections: state.meta.completedSections
      };

      await saveMedicalCustomizationData(medicalData);
      return true;
    } catch (error) {
      logger.error('Error saving medical data:', error);
      throw error;
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
              completedMedicalSections: data.completedSections,
              // Special flag for registration progress
              completedCustomizationSections: [
                ...(registrationData.completedCustomizationSections || []),
                'medical_information_completed'
              ]
            });
          }
        }
      } catch (err) {
        logger.error('Error loading medical data:', err);
        setError('Failed to load your saved medical information');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [registrationData.completedMedicalSections, registrationData.completedCustomizationSections, updateRegistrationData]);

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

        const medicalData: MedicalCustomizationData = {
          anthropometrics: state.anthropometrics || undefined,
          injuries: state.injuries || undefined,
          medicalClearance: state.medicalClearance || undefined,
          liabilityWaiver: state.liabilityWaiver || undefined,
          completedSections: state.meta.completedSections
        };

        saveMedicalCustomizationData(medicalData).catch(err => {
          logger.error('Error saving medical data:', err);
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state, isLoading]);

  const contextValue = {
    state,
    isLoading,
    error,
    isCustomizationValid,
    validSections,
    completedSections,
    updateSectionData,
    updateSectionValidity,
    markSectionComplete,
    saveAllData,
    validateSection
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