import logger from "../../../../../utils/logger";
import { RegistrationData } from "../../../types";
import { useJourney } from "../../components/JourneyContext";

/**
 * Interface for selector storage operations
 */
export interface SelectorStorage<T> {
    save: (data: T) => void;
    load: () => T;
    clear: () => void;
}

/**
 * Creates a storage utility for selectors that integrates with both sessionStorage
 * and the JourneyContext
 * 
 * @param storageKey - Key used for sessionStorage
 * @param defaultValue - Default value when no stored data exists
 * @param registrationDataKey - Key in RegistrationData to also update
 * @returns Storage utility object
 */
export const createSelectorStorage = <T>(
    storageKey: string,
    defaultValue: T,
    registrationDataKey?: keyof RegistrationData
): SelectorStorage<T> => {
    return {
        save: (data: T) => {
            try {
                // Store in sessionStorage
                sessionStorage.setItem(storageKey, JSON.stringify(data));
            } catch (error) {
                logger.error(`Failed to save data for ${storageKey}:`, error);
            }
        },

        load: (): T => {
            try {
                // Try to load from sessionStorage
                const stored = sessionStorage.getItem(storageKey);
                return stored ? JSON.parse(stored) : defaultValue;
            } catch (error) {
                logger.error(`Failed to load data for ${storageKey}:`, error);
                return defaultValue;
            }
        },

        clear: () => {
            try {
                sessionStorage.removeItem(storageKey);
            } catch (error) {
                logger.error(`Failed to clear data for ${storageKey}:`, error);
            }
        }
    };
};

/**
 * Hook for using selector storage with JourneyContext integration
 */
export const useSelectorStorage = <T>(
    storageKey: string,
    defaultValue: T,
    registrationDataKey?: keyof RegistrationData
): SelectorStorage<T> & {
    syncWithContext: (data: T) => void
} => {
    const { updateRegistrationData } = useJourney();
    const storage = createSelectorStorage(storageKey, defaultValue);

    return {
        ...storage,
        syncWithContext: (data: T) => {
            if (registrationDataKey) {
                updateRegistrationData({
                    [registrationDataKey]: data
                } as Partial<RegistrationData>);
            }
            storage.save(data);
        }
    };
}; 