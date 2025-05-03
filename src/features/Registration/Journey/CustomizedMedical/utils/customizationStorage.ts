import {
    AnthropometricsData,
    InjuriesData,
    LiabilityWaiverData,
    MedicalClearanceData,
    MedicalCustomizationData
} from "../types";

// Storage key for medical customization data
const STORAGE_KEY = 'fitcopilot_medical_customization_data';

/**
 * Type for section key names
 */
type SectionKey = 'anthropometrics' | 'injuries' | 'medicalClearance' | 'liabilityWaiver';

/**
 * Updates a specific section of medical customization data
 */
export const updateCustomizationSection = (
    section: SectionKey,
    data: AnthropometricsData | InjuriesData | MedicalClearanceData | LiabilityWaiverData
): void => {
    try {
        // Get existing data
        const existingData = getMedicalCustomizationData();

        // Update the specified section
        const updatedData = {
            ...existingData,
            [section]: data
        };

        // Add this section to completedSections if it's not already there
        // This is important for restoring state properly
        if (!updatedData.completedSections) {
            updatedData.completedSections = [];
        }

        // Save to storage
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
        console.error(`Failed to update ${section} customization data:`, error);
    }
};

/**
 * Retrieves all medical customization data
 */
export const getMedicalCustomizationData = (): MedicalCustomizationData => {
    try {
        const storedData = sessionStorage.getItem(STORAGE_KEY);
        if (storedData) {
            const parsedData = JSON.parse(storedData);

            // If we have completed sections in the stored data, use them
            if (!parsedData.completedSections) {
                parsedData.completedSections = [];
            }

            return parsedData;
        }
    } catch (error) {
        console.error('Failed to retrieve medical customization data:', error);
    }

    // Return empty data structure if nothing is found
    return {
        completedSections: []
    };
};

/**
 * Clears all stored medical customization data
 */
export const clearMedicalCustomizationData = (): void => {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear medical customization data:', error);
    }
}; 