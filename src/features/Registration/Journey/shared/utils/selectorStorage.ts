import logger from "../../../../../utils/logger";
import { RegistrationData } from "../../../types";
import { useJourney } from "../../components/JourneyContext";

// Create a context-specific logger
const storageLogger = logger.addContext('SelectorStorage');

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
    _registrationDataKey?: keyof RegistrationData
): SelectorStorage<T> => {
    storageLogger.debug('Creating selector storage', { storageKey });

    return {
        save: (data: T) => {
            try {
                // Store in sessionStorage
                sessionStorage.setItem(storageKey, JSON.stringify(data));
                storageLogger.debug('Data saved to storage', { storageKey, dataSize: JSON.stringify(data).length });
            } catch (error) {
                storageLogger.error(`Failed to save data for ${storageKey}`, { error });
            }
        },

        load: (): T => {
            try {
                // Try to load from sessionStorage
                const stored = sessionStorage.getItem(storageKey);
                if (stored) {
                    storageLogger.debug('Data loaded from storage', { storageKey });
                    return JSON.parse(stored);
                } else {
                    storageLogger.debug('No stored data found, using default', { storageKey });
                    return defaultValue;
                }
            } catch (error) {
                storageLogger.error(`Failed to load data for ${storageKey}`, { error });
                return defaultValue;
            }
        },

        clear: () => {
            try {
                sessionStorage.removeItem(storageKey);
                storageLogger.debug('Storage cleared', { storageKey });
            } catch (error) {
                storageLogger.error(`Failed to clear data for ${storageKey}`, { error });
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
                storageLogger.debug('Syncing with journey context', {
                    storageKey,
                    registrationDataKey: String(registrationDataKey)
                });

                updateRegistrationData({
                    [registrationDataKey]: data
                } as Partial<RegistrationData>);
            }
            storage.save(data);
        }
    };
}; 