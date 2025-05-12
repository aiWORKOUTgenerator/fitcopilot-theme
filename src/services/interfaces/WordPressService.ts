/**
 * WordPress Data Service Interface
 * 
 * This interface defines the contract for accessing WordPress data
 * across the application. Any concrete implementation must adhere
 * to this contract.
 */

import {
    WordPressServiceData,
    WordPressServiceEventHandlers
} from '../../types/wordpress';

export interface WordPressService {
    /**
     * Get the current WordPress data
     */
    getData(): WordPressServiceData;

    /**
     * Subscribe to data changes
     * @param handlers Event handlers for data changes
     * @returns Unsubscribe function
     */
    subscribe(handlers: WordPressServiceEventHandlers): () => void;

    /**
     * Get a specific theme variant
     * @param key The variant key
     * @param defaultVariant Default value if variant doesn't exist
     */
    getThemeVariant<T extends string>(key: string, defaultVariant: T): T;
} 