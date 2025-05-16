import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useJourney } from '../../components/JourneyContext';
import { SECTION_IDS } from '../constants/sectionConstants';
import {
  CustomizationData,
  EquipmentSelectionData,
  TimeCommitmentData,
  WorkoutPreferenceData
} from '../types';
import { loadCustomizationData, saveCustomizationData } from '../utils/customizationStorage';

// Interface for the CustomizationContext state
interface CustomizationContextState {
    // Section validation state
    validSections: Record<string, boolean>;
    completedSections: string[];
    isCustomizationValid: boolean;

    // Section data
    equipmentData: EquipmentSelectionData | null;
    timeCommitmentData: TimeCommitmentData | null;
    workoutPreferenceData: WorkoutPreferenceData | null;

    // Loading state
    isLoading: boolean;
    error: string | null;
}

// Interface for the CustomizationContext value
interface CustomizationContextValue extends CustomizationContextState {
    // Section state management
    updateSectionValidity: (sectionId: string, isValid: boolean) => void;
    markSectionComplete: (sectionId: string) => void;
    resetCustomizationState: () => void;

    // Section data management
    updateEquipmentData: (data: Partial<EquipmentSelectionData>) => void;
    updateTimeCommitmentData: (data: Partial<TimeCommitmentData>) => void;
    updateWorkoutPreferenceData: (data: Partial<WorkoutPreferenceData>) => void;

    // Storage operations
    saveAllData: () => Promise<boolean>;
    syncWithStoredData: () => Promise<boolean>;
}

// Create the context with undefined default value
const CustomizationContext = createContext<CustomizationContextValue | undefined>(undefined);

// Initial equipment data
const initialEquipmentData: EquipmentSelectionData = {
  selectedEquipment: [],
  hasNoEquipment: false
};

// Initial time commitment data
const initialTimeCommitmentData: TimeCommitmentData = {
  preferredTimeOfDay: [],
  preferredDuration: '',
  otherDuration: '',
  timeCommitmentPackage: '',
  preferredDays: [],
  trainingFrequency: ''
};

// Initial workout preference data
const initialWorkoutPreferenceData: WorkoutPreferenceData = {
  preferredExercises: [],
  preferredWorkoutTypes: [],
  avoidedExercises: [],
  focusAreas: []
};

// Provider component
export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { registrationData, updateRegistrationData } = useJourney();

  // Initialize validation state
  const [validSections, setValidSections] = useState<Record<string, boolean>>(() =>
    Object.values(SECTION_IDS).reduce((acc, id) => ({ ...acc, [id]: false }), {})
  );

  // Initialize completed sections
  const [completedSections, setCompletedSections] = useState<string[]>(
    registrationData.completedCustomizationSections || []
  );

  // Initialize section data
  const [equipmentData, setEquipmentData] = useState<EquipmentSelectionData | null>(null);
  const [timeCommitmentData, setTimeCommitmentData] = useState<TimeCommitmentData | null>(null);
  const [workoutPreferenceData, setWorkoutPreferenceData] = useState<WorkoutPreferenceData | null>(null);

  // Initialize loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate if customization is valid
  const isCustomizationValid = completedSections.length > 0;

  // Load data on first render
  useEffect(() => {
    syncWithStoredData();
  }, [syncWithStoredData]);

  // Sync with registration data when it changes
  useEffect(() => {
    if (registrationData.completedCustomizationSections?.length) {
      setCompletedSections(registrationData.completedCustomizationSections);
    }
  }, [registrationData.completedCustomizationSections]);

  // Update section validity
  const updateSectionValidity = useCallback((sectionId: string, isValid: boolean) => {
    setValidSections(prev => {
      if (prev[sectionId] === isValid) return prev;
      return { ...prev, [sectionId]: isValid };
    });
  }, []);

  // Mark a section as complete
  const markSectionComplete = useCallback((sectionId: string) => {
    setCompletedSections(prev => {
      if (prev.includes(sectionId)) return prev;

      const updated = [...prev, sectionId];

      // Update journey context
      updateRegistrationData({
        completedCustomizationSections: updated
      });

      // Save to storage after state updates
      saveAllData();

      return updated;
    });
  }, [updateRegistrationData, saveAllData]);

  // Reset customization state
  const resetCustomizationState = useCallback(() => {
    setValidSections(Object.values(SECTION_IDS).reduce((acc, id) => ({ ...acc, [id]: false }), {}));
    setCompletedSections([]);
    setEquipmentData(initialEquipmentData);
    setTimeCommitmentData(initialTimeCommitmentData);
    setWorkoutPreferenceData(initialWorkoutPreferenceData);

    // Clear from journey context
    updateRegistrationData({
      completedCustomizationSections: []
    });

    // Clear storage
    saveCustomizationData({
      equipment: initialEquipmentData,
      timeCommitment: initialTimeCommitmentData,
      workoutPreference: initialWorkoutPreferenceData,
      completedSections: []
    });
  }, [updateRegistrationData]);

  // Update equipment data
  const updateEquipmentData = useCallback((data: Partial<EquipmentSelectionData>) => {
    setEquipmentData(prev => {
      const updated = { ...prev, ...data } as EquipmentSelectionData;

      // Update registration data
      updateRegistrationData({
        equipment: updated.selectedEquipment,
        hasNoEquipment: updated.hasNoEquipment
      });

      return updated;
    });
  }, [updateRegistrationData]);

  // Update time commitment data
  const updateTimeCommitmentData = useCallback((data: Partial<TimeCommitmentData>) => {
    setTimeCommitmentData(prev => {
      const updated = { ...prev, ...data } as TimeCommitmentData;

      // Update registration data
      updateRegistrationData({
        preferredTimeOfDay: updated.preferredTimeOfDay,
        preferredDuration: updated.preferredDuration,
        otherDuration: updated.otherDuration,
        timeCommitmentPackage: updated.timeCommitmentPackage,
        preferredDays: updated.preferredDays,
        trainingFrequency: updated.trainingFrequency
      });

      return updated;
    });
  }, [updateRegistrationData]);

  // Update workout preference data
  const updateWorkoutPreferenceData = useCallback((data: Partial<WorkoutPreferenceData>) => {
    setWorkoutPreferenceData(prev => {
      const updated = { ...prev, ...data } as WorkoutPreferenceData;

      // Update registration data
      updateRegistrationData({
        preferredExercises: updated.preferredExercises,
        preferredWorkoutTypes: updated.preferredWorkoutTypes,
        avoidedExercises: updated.avoidedExercises,
        focusAreas: updated.focusAreas
      });

      return updated;
    });
  }, [updateRegistrationData]);

  // Save all data to storage
  const saveAllData = useCallback(async (): Promise<boolean> => {
    try {
      const dataToSave: CustomizationData = {
        equipment: equipmentData || initialEquipmentData,
        timeCommitment: timeCommitmentData || initialTimeCommitmentData,
        workoutPreference: workoutPreferenceData || initialWorkoutPreferenceData,
        completedSections
      };

      const success = saveCustomizationData(dataToSave);
      if (!success) {
        setError('Failed to save customization data');
        return false;
      }

      setError(null);
      return true;
    } catch (err) {
      setError(`Error saving data: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  }, [completedSections, equipmentData, timeCommitmentData, workoutPreferenceData]);

  // Sync with stored data
  const syncWithStoredData = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const storedData = loadCustomizationData();

      if (storedData) {
        // Update section data from storage
        if (storedData.equipment) {
          setEquipmentData(storedData.equipment);
        }

        if (storedData.timeCommitment) {
          setTimeCommitmentData(storedData.timeCommitment);
        }

        if (storedData.workoutPreference) {
          setWorkoutPreferenceData(storedData.workoutPreference);
        }

        // Update completed sections from storage
        if (storedData.completedSections?.length) {
          setCompletedSections(storedData.completedSections);

          // Also update journey context for consistency
          updateRegistrationData({
            completedCustomizationSections: storedData.completedSections
          });
        }

        setError(null);
        setIsLoading(false);
        return true;
      }

      // Initialize with default data if nothing stored
      setEquipmentData(initialEquipmentData);
      setTimeCommitmentData(initialTimeCommitmentData);
      setWorkoutPreferenceData(initialWorkoutPreferenceData);

      setIsLoading(false);
      return false;
    } catch (err) {
      setError(`Error loading data: ${err instanceof Error ? err.message : String(err)}`);
      setIsLoading(false);
      return false;
    }
  }, [updateRegistrationData]);

  // Context value
  const contextValue: CustomizationContextValue = {
    // State
    validSections,
    completedSections,
    isCustomizationValid,
    equipmentData,
    timeCommitmentData,
    workoutPreferenceData,
    isLoading,
    error,

    // Actions
    updateSectionValidity,
    markSectionComplete,
    resetCustomizationState,
    updateEquipmentData,
    updateTimeCommitmentData,
    updateWorkoutPreferenceData,
    saveAllData,
    syncWithStoredData
  };

  return (
    <CustomizationContext.Provider value={contextValue}>
      {children}
    </CustomizationContext.Provider>
  );
};

// Custom hook for accessing the context
export const useCustomization = (): CustomizationContextValue => {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};

export default CustomizationContext; 