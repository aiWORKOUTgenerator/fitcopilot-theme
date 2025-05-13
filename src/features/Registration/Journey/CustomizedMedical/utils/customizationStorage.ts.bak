import logger from "../../../../../utils/logger";
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
        logger.error(`Failed to update ${section} customization data:`, error);
    }
};

/**
 * Save medical customization data with basic error handling
 */
export const saveMedicalCustomizationData = async (
    data: MedicalCustomizationData
): Promise<{ success: boolean; error?: string }> => {
    try {
        const dataToStore = {
            ...data,
            timestamp: new Date().toISOString()
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
        return { success: true };
    } catch (error) {
        logger.error('Failed to save medical customization data:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to save your medical information'
        };
    }
};

/**
 * Load medical customization data with error handling
 */
export const getMedicalCustomizationData = (): MedicalCustomizationData | null => {
    try {
        const storedData = sessionStorage.getItem(STORAGE_KEY);
        if (!storedData) return null;

        const parsedData = JSON.parse(storedData);

        // Ensure completedSections exists for backward compatibility
        if (!parsedData.completedSections) {
            parsedData.completedSections = [];
        }

        return parsedData;
    } catch (error) {
        logger.error('Failed to load medical customization data:', error);
        // Return minimal valid data structure for graceful degradation
        return { completedSections: [] };
    }
};

/**
 * Clears all stored medical customization data
 */
export const clearMedicalCustomizationData = (): void => {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        logger.error('Failed to clear medical customization data:', error);
    }
};

/**
 * Simple retry utility for operations that might fail
 */
export const withRetry = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 2
): Promise<{ success: boolean; result?: T; error?: string }> => {
    let attempts = 0;

    const attempt = async (): Promise<{ success: boolean; result?: T; error?: string }> => {
        try {
            const result = await operation();
            return { success: true, result };
        } catch (error) {
            attempts++;
            logger.error(`Operation failed (attempt ${attempts}/${maxRetries + 1}):`, error);

            if (attempts <= maxRetries) {
                // Simple linear backoff
                await new Promise(resolve => setTimeout(resolve, 300 * attempts));
                return attempt();
            }

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Operation failed after multiple attempts'
            };
        }
    };

    return attempt();
}; 