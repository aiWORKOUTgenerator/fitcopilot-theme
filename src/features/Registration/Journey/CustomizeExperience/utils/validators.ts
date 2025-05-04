/**
 * Standardized validation helpers for CustomizeExperience sections
 */

import { EquipmentSelectionData, TimeCommitmentData, WorkoutPreferenceData } from '../types';

/**
 * Validators for each section
 */
export const validators = {
    /**
     * Equipment is valid if at least one item is selected or custom text provided
     */
    equipment: (data: EquipmentSelectionData | null): boolean => {
        if (!data) return false;

        return data.selectedEquipment.length > 0 ||
            (data.otherEquipment?.trim()?.length > 0) ||
            data.hasNoEquipment;
    },

    /**
     * Time commitment requires at least a package or time preferences
     */
    timeCommitment: (data: TimeCommitmentData | null): boolean => {
        if (!data) return false;

        // Valid if a package is selected
        if (data.timeCommitmentPackage) return true;

        // Otherwise, needs preferred time of day and duration
        return data.preferredTimeOfDay?.length > 0 &&
            (data.preferredDuration || data.otherDuration?.trim()?.length > 0);
    },

    /**
     * At least one preferred exercise or custom preferences
     */
    workoutPreference: (data: WorkoutPreferenceData | null): boolean => {
        if (!data) return false;

        // Valid if at least one workout type or preferred exercise is selected
        return (data.preferredWorkoutTypes?.length > 0 ||
            data.preferredExercises?.length > 0 ||
            data.focusAreas?.length > 0);
    }
};

/**
 * Get validation error message for a section
 */
export const getValidationMessage = (sectionId: string): string => {
    switch (sectionId) {
        case 'equipment':
            return 'Please select at least one equipment item or specify other equipment';
        case 'time-commitment':
            return 'Please select a time commitment package or specify your preferred schedule';
        case 'workout-preference':
            return 'Please select at least one workout preference';
        default:
            return 'Please complete all required fields';
    }
};

/**
 * Helper to safely save data with basic retry functionality
 */
export const saveWithRetry = async <T>(
    saveFunction: (data: T) => Promise<boolean>,
    data: T,
    maxRetries = 1
): Promise<{ success: boolean; error?: string }> => {
    let attempts = 0;

    const attempt = async (): Promise<{ success: boolean; error?: string }> => {
        try {
            const result = await saveFunction(data);
            return { success: true };
        } catch (error) {
            console.error(`Error saving data (attempt ${attempts + 1}):`, error);

            if (++attempts <= maxRetries) {
                // Simple linear retry with small delay
                await new Promise(resolve => setTimeout(resolve, 300));
                return attempt();
            } else {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : "Failed to save your preferences"
                };
            }
        }
    };

    return attempt();
}; 