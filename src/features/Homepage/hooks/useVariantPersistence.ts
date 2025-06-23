/**
 * Variant Persistence Hook
 * 
 * Handles persistence of variant selections across sessions using localStorage
 * and WordPress integration for the universal variant system.
 * 
 * @fileoverview Variant persistence utilities for Story 2.2
 * @version 1.0.0
 * @since Phase 2 - Week 3
 */

import { useCallback } from 'react';
import { GlobalVariantKey } from '../types/shared';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Local storage key for variant persistence
 */
const VARIANT_STORAGE_KEY = 'fitcopilot_homepage_variant';

/**
 * Session storage key for temporary variant overrides
 */
const VARIANT_SESSION_KEY = 'fitcopilot_session_variant';

/**
 * WordPress option name for variant setting
 */
const WP_VARIANT_OPTION = 'homepage_variant';

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

/**
 * Get variant from localStorage
 */
const getStoredVariant = (): GlobalVariantKey | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(VARIANT_STORAGE_KEY);
    return stored as GlobalVariantKey | null;
  } catch (error) {
    logger.warn('Error reading variant from localStorage:', error);
    return null;
  }
};

/**
 * Store variant in localStorage
 */
const storeVariant = (variant: GlobalVariantKey): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    localStorage.setItem(VARIANT_STORAGE_KEY, variant);
    return true;
  } catch (error) {
    logger.warn('Error storing variant in localStorage:', error);
    return false;
  }
};

/**
 * Get session variant override
 */
const getSessionVariant = (): GlobalVariantKey | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    const stored = sessionStorage.getItem(VARIANT_SESSION_KEY);
    return stored as GlobalVariantKey | null;
  } catch (error) {
    logger.warn('Error reading session variant:', error);
    return null;
  }
};

/**
 * Store session variant override
 */
const storeSessionVariant = (variant: GlobalVariantKey): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    sessionStorage.setItem(VARIANT_SESSION_KEY, variant);
    return true;
  } catch (error) {
    logger.warn('Error storing session variant:', error);
    return false;
  }
};

/**
 * Clear session variant override
 */
const clearSessionVariant = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    sessionStorage.removeItem(VARIANT_SESSION_KEY);
    return true;
  } catch (error) {
    logger.warn('Error clearing session variant:', error);
    return false;
  }
};

// ============================================================================
// WORDPRESS INTEGRATION
// ============================================================================

/**
 * Get variant from WordPress user meta or theme option
 */
const getWordPressVariant = async (): Promise<GlobalVariantKey | null> => {
  try {
    // Check if WordPress REST API is available
    if (typeof window !== 'undefined' && (window as any).wpApiSettings) {
      const apiSettings = (window as any).wpApiSettings;
      const response = await fetch(`${apiSettings.root}wp/v2/users/me`, {
        headers: {
          'X-WP-Nonce': apiSettings.nonce,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        const variant = userData.meta?.[WP_VARIANT_OPTION];
        return variant as GlobalVariantKey | null;
      }
    }
    
    return null;
  } catch (error) {
    logger.warn('Error getting WordPress variant:', error);
    return null;
  }
};

/**
 * Update variant in WordPress user meta
 */
const updateWordPressVariant = async (variant: GlobalVariantKey): Promise<boolean> => {
  try {
    // Check if WordPress REST API is available
    if (typeof window !== 'undefined' && (window as any).wpApiSettings) {
      const apiSettings = (window as any).wpApiSettings;
      const response = await fetch(`${apiSettings.root}wp/v2/users/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': apiSettings.nonce,
        },
        body: JSON.stringify({
          meta: {
            [WP_VARIANT_OPTION]: variant,
          },
        }),
      });
      
      return response.ok;
    }
    
    return false;
  } catch (error) {
    logger.warn('Error updating WordPress variant:', error);
    return false;
  }
};

// ============================================================================
// PERSISTENCE HOOK
// ============================================================================

/**
 * Variant persistence configuration
 */
export interface VariantPersistenceConfig {
  /** Whether to enable localStorage persistence */
  enableLocalStorage?: boolean;
  /** Whether to enable WordPress integration */
  enableWordPress?: boolean;
  /** Whether to enable session overrides */
  enableSessionOverrides?: boolean;
  /** Callback when variant is loaded from storage */
  onVariantLoaded?: (variant: GlobalVariantKey, source: 'localStorage' | 'sessionStorage' | 'wordpress') => void;
  /** Callback when variant persistence fails */
  onPersistenceError?: (error: string, operation: 'load' | 'save') => void;
}

/**
 * Variant persistence hook return type
 */
export interface VariantPersistenceReturn {
  /** Load variant from all available sources */
  loadVariant: () => Promise<GlobalVariantKey | null>;
  /** Save variant to all enabled storage methods */
  saveVariant: (variant: GlobalVariantKey) => Promise<boolean>;
  /** Set temporary session override */
  setSessionOverride: (variant: GlobalVariantKey) => boolean;
  /** Clear session override */
  clearSessionOverride: () => boolean;
  /** Check if WordPress integration is available */
  isWordPressAvailable: boolean;
  /** Check if localStorage is available */
  isLocalStorageAvailable: boolean;
}

/**
 * Hook for variant persistence across sessions and WordPress integration
 */
export const useVariantPersistence = (
  config: VariantPersistenceConfig = {}
): VariantPersistenceReturn => {
  const {
    enableLocalStorage = true,
    enableWordPress = true,
    enableSessionOverrides = true,
    onVariantLoaded,
    onPersistenceError,
  } = config;

  // Check availability of storage methods
  const isLocalStorageAvailable = typeof window !== 'undefined' && 
    Boolean(window.localStorage);
  
  const isWordPressAvailable = typeof window !== 'undefined' && 
    Boolean((window as any).wpApiSettings);

  /**
   * Load variant from all available sources
   * Priority: sessionStorage > localStorage > WordPress
   */
  const loadVariant = useCallback(async (): Promise<GlobalVariantKey | null> => {
    try {
      // 1. Check session override first (highest priority)
      if (enableSessionOverrides) {
        const sessionVariant = getSessionVariant();
        if (sessionVariant) {
          onVariantLoaded?.(sessionVariant, 'sessionStorage');
          return sessionVariant;
        }
      }

      // 2. Check localStorage
      if (enableLocalStorage && isLocalStorageAvailable) {
        const storedVariant = getStoredVariant();
        if (storedVariant) {
          onVariantLoaded?.(storedVariant, 'localStorage');
          return storedVariant;
        }
      }

      // 3. Check WordPress (lowest priority, but persistent across devices)
      if (enableWordPress && isWordPressAvailable) {
        const wpVariant = await getWordPressVariant();
        if (wpVariant) {
          onVariantLoaded?.(wpVariant, 'wordpress');
          return wpVariant;
        }
      }

      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load variant';
      onPersistenceError?.(errorMessage, 'load');
      return null;
    }
  }, [
    enableSessionOverrides,
    enableLocalStorage,
    enableWordPress,
    isLocalStorageAvailable,
    isWordPressAvailable,
    onVariantLoaded,
    onPersistenceError,
  ]);

  /**
   * Save variant to all enabled storage methods
   */
  const saveVariant = useCallback(async (variant: GlobalVariantKey): Promise<boolean> => {
    let success = false;

    try {
      // Save to localStorage
      if (enableLocalStorage && isLocalStorageAvailable) {
        const localSuccess = storeVariant(variant);
        success = success || localSuccess;
      }

      // Save to WordPress
      if (enableWordPress && isWordPressAvailable) {
        const wpSuccess = await updateWordPressVariant(variant);
        success = success || wpSuccess;
      }

      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save variant';
      onPersistenceError?.(errorMessage, 'save');
      return false;
    }
  }, [
    enableLocalStorage,
    enableWordPress,
    isLocalStorageAvailable,
    isWordPressAvailable,
    onPersistenceError,
  ]);

  /**
   * Set temporary session override
   */
  const setSessionOverride = useCallback((variant: GlobalVariantKey): boolean => {
    if (!enableSessionOverrides) return false;
    return storeSessionVariant(variant);
  }, [enableSessionOverrides]);

  /**
   * Clear session override
   */
  const clearSessionOverride = useCallback((): boolean => {
    if (!enableSessionOverrides) return false;
    return clearSessionVariant();
  }, [enableSessionOverrides]);

  return {
    loadVariant,
    saveVariant,
    setSessionOverride,
    clearSessionOverride,
    isWordPressAvailable,
    isLocalStorageAvailable,
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the best available variant from all sources
 */
export const getBestAvailableVariant = async (
  fallback: GlobalVariantKey = 'default'
): Promise<GlobalVariantKey> => {
  // Try session override first
  const sessionVariant = getSessionVariant();
  if (sessionVariant) return sessionVariant;

  // Try localStorage
  const storedVariant = getStoredVariant();
  if (storedVariant) return storedVariant;

  // Try WordPress
  const wpVariant = await getWordPressVariant();
  if (wpVariant) return wpVariant;

  // Return fallback
  return fallback;
};

/**
 * Clear all variant storage
 */
export const clearAllVariantStorage = (): boolean => {
  let success = true;

  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(VARIANT_STORAGE_KEY);
      sessionStorage.removeItem(VARIANT_SESSION_KEY);
    }
  } catch (error) {
    logger.warn('Error clearing variant storage:', error);
    success = false;
  }

  return success;
};

/**
 * Check if variant persistence is available
 */
export const isVariantPersistenceAvailable = (): {
  localStorage: boolean;
  sessionStorage: boolean;
  wordpress: boolean;
} => {
  return {
    localStorage: typeof window !== 'undefined' && Boolean(window.localStorage),
    sessionStorage: typeof window !== 'undefined' && Boolean(window.sessionStorage),
    wordpress: typeof window !== 'undefined' && Boolean((window as any).wpApiSettings),
  };
}; 