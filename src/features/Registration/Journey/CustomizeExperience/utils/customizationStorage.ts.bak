import logger from "../../../../../utils/logger";
import { CustomizationData } from "../types";

// Storage keys
const STORAGE_KEY = 'fitcopilot_customization_data';
const LAST_ACTIVE_SECTION_KEY = 'fitcopilot_last_active_section';

/**
 * Save customization data to session storage with enhanced error handling
 * 
 * @param data Customization data to save
 * @returns True if successfully saved
 */
export const saveCustomizationData = (data: CustomizationData): boolean => {
    try {
        if (!data) {
            logger.error('Cannot save empty customization data');
            return false;
        }

        const dataToStore = {
            ...data,
            timestamp: new Date().toISOString()
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
        return true;
    } catch (error) {
        logger.error('Failed to save customization data:', error);

        // Check for storage quota exceeded
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            logger.warn('Storage quota exceeded. Attempting to clear old data...');
            try {
                // Try to remove non-essential data
                clearOldStorageData();

                // Try saving again
                const dataToStore = {
                    ...data,
                    timestamp: new Date().toISOString()
                };
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
                return true;
            } catch (retryError) {
                logger.error('Failed to save after clearing storage:', retryError);
                return false;
            }
        }

        return false;
    }
};

/**
 * Update a specific section of customization data without overwriting others
 * 
 * @param sectionKey The section key to update ('equipment', 'timeCommitment', etc.)
 * @param sectionData The data for that section
 * @returns True if successful
 */
export const updateCustomizationSection = <T>(sectionKey: string, sectionData: T): boolean => {
    try {
        const existingData = loadCustomizationData() || {
            completedSections: []
        };

        // Type safety check
        if (typeof existingData !== 'object') {
            logger.error('Invalid customization data format in storage');
            return false;
        }

        // Update specific section
        const updatedData = {
            ...existingData,
            [sectionKey]: sectionData,
            timestamp: new Date().toISOString()
        };

        return saveCustomizationData(updatedData);
    } catch (error) {
        logger.error(`Failed to update section ${sectionKey}:`, error);
        return false;
    }
};

/**
 * Load customization data from session storage with enhanced error handling
 * 
 * @returns Stored customization data or null if not found/invalid
 */
export const loadCustomizationData = (): CustomizationData | null => {
    try {
        const storedData = sessionStorage.getItem(STORAGE_KEY);
        if (!storedData) return null;

        const parsedData = JSON.parse(storedData) as CustomizationData;

        // Validate data has required structure
        if (!parsedData || typeof parsedData !== 'object') {
            logger.warn('Invalid customization data format');
            return null;
        }

        // Ensure completedSections always exists
        if (!Array.isArray(parsedData.completedSections)) {
            parsedData.completedSections = [];
        }

        return parsedData;
    } catch (error) {
        logger.error('Failed to load customization data:', error);

        // Attempt to recover corrupt data by clearing it
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch (clearError) {
            logger.error('Failed to clear corrupted storage:', clearError);
        }

        return null;
    }
};

/**
 * Save the last active section ID
 * 
 * @param sectionId Section ID to save
 * @returns True if successful
 */
export const saveLastActiveSection = (sectionId: string): boolean => {
    try {
        sessionStorage.setItem(LAST_ACTIVE_SECTION_KEY, sectionId);
        return true;
    } catch (error) {
        logger.error('Failed to save last active section:', error);
        return false;
    }
};

/**
 * Get the last active section ID
 * 
 * @returns Last active section ID or null
 */
export const getLastActiveSection = (): string | null => {
    try {
        return sessionStorage.getItem(LAST_ACTIVE_SECTION_KEY);
    } catch (error) {
        logger.error('Failed to get last active section:', error);
        return null;
    }
};

/**
 * Clear all customization data from storage
 * 
 * @returns True if successfully cleared
 */
export const clearCustomizationData = (): boolean => {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(LAST_ACTIVE_SECTION_KEY);
        return true;
    } catch (error) {
        logger.error('Failed to clear customization data:', error);
        return false;
    }
};

/**
 * Check if customization data exists in storage
 * 
 * @returns True if data exists and is valid
 */
export const hasCustomizationData = (): boolean => {
    try {
        const data = loadCustomizationData();
        return !!data;
    } catch (error) {
        logger.error('Error checking customization data:', error);
        return false;
    }
};

/**
 * Clear old or non-essential storage data to free up space
 */
const clearOldStorageData = (): void => {
    try {
        // List of keys that might be safely cleared if needed
        const nonEssentialKeys = [
            'fitcopilot_session_analytics',
            'fitcopilot_ui_preferences',
            'fitcopilot_recent_views'
        ];

        for (const key of nonEssentialKeys) {
            sessionStorage.removeItem(key);
        }
    } catch (error) {
        logger.error('Failed to clear old storage data:', error);
    }
}; 