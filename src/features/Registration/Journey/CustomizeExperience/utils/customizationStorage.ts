import { CustomizationData } from "../types";

// Storage keys
const STORAGE_KEY = 'fitcopilot_customization_data';
const LAST_ACTIVE_SECTION_KEY = 'fitcopilot_last_active_section';

/**
 * Save customization data to session storage
 * 
 * @param data Customization data to save
 * @returns True if successfully saved
 */
export const saveCustomizationData = (data: CustomizationData): boolean => {
    try {
        const dataToStore = {
            ...data,
            timestamp: new Date().toISOString()
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
        return true;
    } catch (error) {
        console.error('Failed to save customization data:', error);
        return false;
    }
};

/**
 * Load customization data from session storage
 * 
 * @returns Stored customization data or null if not found
 */
export const loadCustomizationData = (): CustomizationData | null => {
    try {
        const storedData = sessionStorage.getItem(STORAGE_KEY);
        if (!storedData) return null;

        return JSON.parse(storedData) as CustomizationData;
    } catch (error) {
        console.error('Failed to load customization data:', error);
        return null;
    }
};

/**
 * Save the last active section to restore on page refresh
 * 
 * @param sectionId ID of the last active section
 * @returns True if successfully saved
 */
export const saveLastActiveSection = (sectionId: string): boolean => {
    try {
        sessionStorage.setItem(LAST_ACTIVE_SECTION_KEY, sectionId);
        return true;
    } catch (error) {
        console.error('Failed to save last active section:', error);
        return false;
    }
};

/**
 * Get the last active section from storage
 * 
 * @returns Last active section ID or null if not found
 */
export const getLastActiveSection = (): string | null => {
    try {
        return sessionStorage.getItem(LAST_ACTIVE_SECTION_KEY);
    } catch (error) {
        console.error('Failed to get last active section:', error);
        return null;
    }
};

/**
 * Clear all customization data from storage
 */
export const clearCustomizationData = (): void => {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(LAST_ACTIVE_SECTION_KEY);
    } catch (error) {
        console.error('Failed to clear customization data:', error);
    }
};

/**
 * Check if customization data exists in storage
 * 
 * @returns True if data exists
 */
export const hasCustomizationData = (): boolean => {
    return !!sessionStorage.getItem(STORAGE_KEY);
};

/**
 * Update a specific section of the customization data
 * 
 * @param sectionKey Key of the section to update
 * @param sectionData Data for the section
 * @returns True if successfully updated
 */
export const updateCustomizationSection = <T>(sectionKey: keyof CustomizationData, sectionData: T): boolean => {
    try {
        const currentData = loadCustomizationData() || { completedSections: [] };

        // Make sure completedSections is preserved
        if (!currentData.completedSections) {
            currentData.completedSections = [];
        }

        const updatedData = {
            ...currentData,
            [sectionKey]: sectionData,
            timestamp: new Date().toISOString()
        };

        return saveCustomizationData(updatedData);
    } catch (error) {
        console.error(`Failed to update ${sectionKey} section:`, error);
        return false;
    }
}; 