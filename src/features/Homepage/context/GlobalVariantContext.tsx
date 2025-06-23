/**
 * Global Variant Context
 * 
 * Provides centralized variant management across all Homepage sections.
 * Supports all GlobalVariantKey variants and integrates with WordPress theme settings.
 * 
 * @fileoverview Universal variant context for Story 2.2
 * @version 1.0.0
 * @since Phase 2 - Week 3
 */

import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { GlobalVariantKey } from '../types/shared';

// ============================================================================
// GLOBAL TYPE DECLARATIONS
// ============================================================================

/**
 * WordPress global object type declarations
 */
declare global {
  interface Window {
    wp?: {
      customize?: {
        value: (setting: string, value?: any) => any;
      };
    };
    fitcopilotThemeData?: WordPressVariantData;
  }
}

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Global variant context state and methods
 */
export interface GlobalVariantContextType {
  /** Current active variant */
  currentVariant: GlobalVariantKey;
  /** Method to change the current variant */
  setVariant: (variant: GlobalVariantKey) => void;
  /** Available variants for the current context */
  availableVariants: GlobalVariantKey[];
  /** Check if a variant is supported by a specific section */
  isVariantSupported: (variant: GlobalVariantKey, section?: string) => boolean;
  /** Whether the variant is being loaded/changed */
  isLoading: boolean;
  /** Any error that occurred during variant switching */
  error: string | null;
  /** WordPress integration status */
  wpIntegration: {
    isConnected: boolean;
    canUpdate: boolean;
    lastSync: Date | null;
  };
}

/**
 * Global variant provider props
 */
export interface GlobalVariantProviderProps {
  /** Initial variant to use */
  initialVariant?: GlobalVariantKey;
  /** Child components */
  children: ReactNode;
  /** Whether to enable WordPress integration */
  enableWpIntegration?: boolean;
  /** Custom CSS class for the provider container */
  className?: string;
  /** Test ID for testing */
  testId?: string;
  /** Callback when variant changes */
  onVariantChange?: (variant: GlobalVariantKey) => void;
}

/**
 * WordPress variant data structure
 */
interface WordPressVariantData {
  homepage_variant?: GlobalVariantKey;
  theme_customizer?: {
    variant: GlobalVariantKey;
    lastUpdated: string;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * All available global variants
 */
export const ALL_GLOBAL_VARIANTS: GlobalVariantKey[] = [
  'default',
  'gym',
  'sports',
  'wellness',
  'modern',
  'classic',
  'minimalist',
  'boutique',
  'registration',
  'mobile'
];

/**
 * Section-specific variant support mapping
 * Some sections may not support all variants
 */
const SECTION_VARIANT_SUPPORT: Record<string, GlobalVariantKey[]> = {
  hero: ALL_GLOBAL_VARIANTS,
  features: ALL_GLOBAL_VARIANTS,
  training: ['default', 'boutique', 'classic', 'minimalist', 'modern', 'sports', 'wellness'],
  personalTraining: ['default', 'modern', 'classic', 'minimalist', 'sports', 'wellness'],
  journey: ['default', 'gym', 'sports', 'wellness', 'modern', 'classic', 'minimalist'],
  trainingFeatures: ['default', 'boutique', 'classic', 'minimalist', 'modern', 'sports', 'wellness'],
  testimonials: ALL_GLOBAL_VARIANTS,
  pricing: ALL_GLOBAL_VARIANTS,
  footer: ALL_GLOBAL_VARIANTS,
};

// ============================================================================
// CONTEXT CREATION
// ============================================================================

/**
 * Global variant context
 */
const GlobalVariantContext = createContext<GlobalVariantContextType | undefined>(undefined);

// ============================================================================
// WORDPRESS INTEGRATION UTILITIES
// ============================================================================

/**
 * Get variant from WordPress customizer
 */
const getWordPressVariant = (): GlobalVariantKey | null => {
  try {
    // Check for WordPress customizer API
    if (typeof window !== 'undefined' && window.wp?.customize) {
      const variant = window.wp.customize.value('homepage_variant');
      if (variant && ALL_GLOBAL_VARIANTS.includes(variant as GlobalVariantKey)) {
        return variant as GlobalVariantKey;
      }
    }

    // Check for WordPress localized data
    if (typeof window !== 'undefined' && (window as any).fitcopilotThemeData) {
      const wpData = (window as any).fitcopilotThemeData as WordPressVariantData;
      if (wpData.homepage_variant && ALL_GLOBAL_VARIANTS.includes(wpData.homepage_variant)) {
        return wpData.homepage_variant;
      }
    }

    // Check data-theme attribute on body
    if (typeof window !== 'undefined') {
      const bodyTheme = document.body.getAttribute('data-theme');
      if (bodyTheme && ALL_GLOBAL_VARIANTS.includes(bodyTheme as GlobalVariantKey)) {
        return bodyTheme as GlobalVariantKey;
      }
    }

    return null;
  } catch (error) {
    logger.warn('Error getting WordPress variant:', error);
    return null;
  }
};

/**
 * Update WordPress variant setting
 */
const updateWordPressVariant = (variant: GlobalVariantKey): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Update WordPress customizer if available
      if (typeof window !== 'undefined' && window.wp?.customize) {
        window.wp.customize.value('homepage_variant', variant);
        resolve(true);
        return;
      }

      // Update body data-theme attribute as fallback
      if (typeof window !== 'undefined') {
        document.body.setAttribute('data-theme', variant);
        document.documentElement.setAttribute('data-theme', variant);
        resolve(true);
        return;
      }

      resolve(false);
    } catch (error) {
      logger.warn('Error updating WordPress variant:', error);
      resolve(false);
    }
  });
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

/**
 * Global Variant Provider
 * 
 * Provides centralized variant management for all Homepage sections
 */
export const GlobalVariantProvider: React.FC<GlobalVariantProviderProps> = ({
  initialVariant = 'default',
  children,
  enableWpIntegration = true,
  className = '',
  testId = 'global-variant-provider',
  onVariantChange,
}) => {
  // State management
  const [currentVariant, setCurrentVariant] = useState<GlobalVariantKey>(initialVariant);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wpIntegration, setWpIntegration] = useState({
    isConnected: false,
    canUpdate: false,
    lastSync: null as Date | null,
  });

  // Initialize variant from WordPress on mount
  useEffect(() => {
    if (enableWpIntegration) {
      const wpVariant = getWordPressVariant();
      if (wpVariant && wpVariant !== currentVariant) {
        setCurrentVariant(wpVariant);
        setWpIntegration(prev => ({
          ...prev,
          isConnected: true,
          lastSync: new Date(),
        }));
      }

      // Check if we can update WordPress
      const canUpdate = typeof window !== 'undefined' && 
        Boolean(window.wp?.customize || document.body);
      
      setWpIntegration(prev => ({
        ...prev,
        canUpdate,
      }));
    }
  }, [enableWpIntegration, currentVariant]);

  // Apply variant to DOM
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Update data-theme attributes
      document.body.setAttribute('data-theme', currentVariant);
      document.documentElement.setAttribute('data-theme', currentVariant);
      
      // Update CSS custom property for variant-specific styling
      document.documentElement.style.setProperty('--current-variant', currentVariant);
    }
  }, [currentVariant]);

  // Variant change handler
  const setVariant = useCallback(async (variant: GlobalVariantKey) => {
    if (variant === currentVariant) return;

    setIsLoading(true);
    setError(null);

    try {
      // Update WordPress if integration is enabled
      if (enableWpIntegration && wpIntegration.canUpdate) {
        const success = await updateWordPressVariant(variant);
        if (success) {
          setWpIntegration(prev => ({
            ...prev,
            lastSync: new Date(),
          }));
        }
      }

      // Update local state
      setCurrentVariant(variant);
      
      // Call callback if provided
      onVariantChange?.(variant);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update variant';
      setError(errorMessage);
      logger.error('Error setting variant:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentVariant, enableWpIntegration, wpIntegration.canUpdate, onVariantChange]);

  // Check if variant is supported by a section
  const isVariantSupported = useCallback((variant: GlobalVariantKey, section?: string): boolean => {
    if (!section) {
      return ALL_GLOBAL_VARIANTS.includes(variant);
    }

    const supportedVariants = SECTION_VARIANT_SUPPORT[section.toLowerCase()];
    return supportedVariants ? supportedVariants.includes(variant) : false;
  }, []);

  // Context value
  const contextValue: GlobalVariantContextType = {
    currentVariant,
    setVariant,
    availableVariants: ALL_GLOBAL_VARIANTS,
    isVariantSupported,
    isLoading,
    error,
    wpIntegration,
  };

  return (
    <GlobalVariantContext.Provider value={contextValue}>
      <div
        className={`global-variant-provider ${className}`}
        data-variant={currentVariant}
        data-testid={testId}
        data-wp-connected={wpIntegration.isConnected}
      >
        {children}
      </div>
    </GlobalVariantContext.Provider>
  );
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to access global variant context
 * 
 * @throws Error if used outside of GlobalVariantProvider
 */
export const useGlobalVariant = (): GlobalVariantContextType => {
  const context = useContext(GlobalVariantContext);
  
  if (context === undefined) {
    throw new Error('useGlobalVariant must be used within a GlobalVariantProvider');
  }
  
  return context;
};

/**
 * Hook for WordPress-specific variant operations
 */
export const useWordPressVariant = () => {
  const { currentVariant, setVariant, wpIntegration, isLoading, error } = useGlobalVariant();
  
  const updateWpVariant = useCallback(async (variant: GlobalVariantKey) => {
    if (!wpIntegration.canUpdate) {
      throw new Error('WordPress variant updates are not available');
    }
    
    await setVariant(variant);
  }, [setVariant, wpIntegration.canUpdate]);

  const syncWithWordPress = useCallback(async () => {
    const wpVariant = getWordPressVariant();
    if (wpVariant && wpVariant !== currentVariant) {
      await setVariant(wpVariant);
    }
  }, [currentVariant, setVariant]);

  return {
    wpVariant: currentVariant,
    updateWpVariant,
    syncWithWordPress,
    wpIntegration,
    isLoading,
    error,
  };
};

/**
 * Hook for section-specific variant management
 */
export const useSectionVariant = (sectionName: string) => {
  const { currentVariant, setVariant, isVariantSupported, availableVariants } = useGlobalVariant();
  
  const supportedVariants = availableVariants.filter(variant => 
    isVariantSupported(variant, sectionName)
  );

  const isSectionVariantSupported = useCallback((variant: GlobalVariantKey) => 
    isVariantSupported(variant, sectionName), [isVariantSupported, sectionName]);

  return {
    currentVariant,
    setVariant,
    supportedVariants,
    isVariantSupported: isSectionVariantSupported,
    sectionName,
  };
};

// ============================================================================
// HIGHER-ORDER COMPONENT
// ============================================================================

/**
 * HOC that provides global variant context to a component
 */
export function withGlobalVariant<P extends Record<string, unknown>>(
  Component: React.ComponentType<P & { variant: GlobalVariantKey; setVariant: (variant: GlobalVariantKey) => void }>
): React.FC<P> {
  const WithGlobalVariant: React.FC<P> = (props) => {
    const { currentVariant, setVariant } = useGlobalVariant();
    return <Component {...props} variant={currentVariant} setVariant={setVariant} />;
  };
  
  WithGlobalVariant.displayName = `WithGlobalVariant(${Component.displayName || Component.name || 'Component'})`;
  
  return WithGlobalVariant;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Get variant-specific CSS class
 */
export const getVariantClass = (variant: GlobalVariantKey, prefix = 'variant'): string => {
  return variant === 'default' ? '' : `${prefix}-${variant}`;
};

/**
 * Get variant-specific data attribute
 */
export const getVariantAttribute = (variant: GlobalVariantKey): string | undefined => {
  return variant === 'default' ? undefined : variant;
};

/**
 * Check if current environment supports WordPress integration
 */
export const isWordPressEnvironment = (): boolean => {
  return typeof window !== 'undefined' && 
    (Boolean(window.wp) || Boolean((window as any).fitcopilotThemeData));
};

// ============================================================================
// EXPORTS
// ============================================================================

export default GlobalVariantContext; 