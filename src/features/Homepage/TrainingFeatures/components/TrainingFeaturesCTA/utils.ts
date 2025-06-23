/**
 * TrainingFeaturesCTA Utility Functions - Phase 1 Foundation
 * 
 * Centralized logic for TrainingFeaturesCTA component functionality built on
 * proven patterns from TrainingCTA success. Adapted for TrainingFeatures context
 * with feature type mapping and lime/emerald color scheme.
 * 
 * @fileoverview TrainingFeaturesCTA utility functions
 * @version 1.0.0 - Phase 1 Foundation Architecture
 */

import { GlobalVariantKey } from '../../../types/shared';
import { TrainingFeaturesContextType, TrainingFeaturesCTASize, TrainingFeaturesVariantKey } from './types';

// ============================================================================
// CONSTANTS & MAPPINGS
// ============================================================================

/**
 * Feature types that have specific styling variants
 */
export const TRAINING_FEATURES_TYPES: readonly TrainingFeaturesVariantKey[] = [
  'virtual', 
  'tracking', 
  'support', 
  'mobile',
  'analytics'
] as const;

/**
 * Default CTA text mapping for feature types and contexts
 */
export const FEATURE_CTA_TEXT_MAP: Record<string, Record<string, string>> = {
  'explore': {
    'Virtual Training': 'Explore Virtual Training',
    'Progress Tracking': 'Explore Progress Tracking',
    'Continuous Support': 'Explore Support Features',
    'Mobile Experience': 'Explore Mobile Features',
    'Analytics Dashboard': 'Explore Analytics',
    // Additional mappings for flexibility
    'Virtual': 'Explore Virtual Features',
    'Tracking': 'Explore Tracking Features',
    'Support': 'Explore Support Features',
    'Mobile': 'Explore Mobile Features',
    'Analytics': 'Explore Analytics Features',
  },
  'learn': {
    'Virtual Training': 'Learn About Virtual Training',
    'Progress Tracking': 'Learn About Progress Tracking',
    'Continuous Support': 'Learn About Support',
    'Mobile Experience': 'Learn About Mobile Features',
    'Analytics Dashboard': 'Learn About Analytics',
  },
  'discover': {
    'Virtual Training': 'Discover Virtual Training',
    'Progress Tracking': 'Discover Progress Tracking',
    'Continuous Support': 'Discover Support Features',
    'Mobile Experience': 'Discover Mobile Features',
    'Analytics Dashboard': 'Discover Analytics',
  }
} as const;

/**
 * Size to UniversalButton size mapping - Performance optimized
 */
const SIZE_MAP: Record<TrainingFeaturesCTASize, 'medium' | 'large'> = {
  compact: 'medium',
  secondary: 'medium',
  primary: 'large',
} as const;

// ============================================================================
// PERFORMANCE OPTIMIZED UTILITIES
// ============================================================================

/**
 * Memoized cache for CSS class generation
 */
const cssClassCache = new Map<string, string>();

/**
 * Memoized cache for variant mapping
 */
const variantMappingCache = new Map<TrainingFeaturesVariantKey, GlobalVariantKey>();

/**
 * Check if a variant is a TrainingFeatures-specific feature type
 * Performance optimized with type guard
 */
export const isTrainingFeaturesType = (variant: TrainingFeaturesVariantKey): variant is 'virtual' | 'tracking' | 'support' | 'mobile' | 'analytics' => {
  return (TRAINING_FEATURES_TYPES as readonly string[]).includes(variant);
};

/**
 * Map TrainingFeaturesVariantKey to GlobalVariantKey for UniversalButton compatibility
 * Enhanced with memoization for performance
 * 
 * @param variant - TrainingFeatures variant key
 * @returns GlobalVariantKey for UniversalButton
 */
export const mapFeaturesVariantToGlobal = (variant: TrainingFeaturesVariantKey): GlobalVariantKey => {
  // Check memoized cache first
  if (variantMappingCache.has(variant)) {
    return variantMappingCache.get(variant)!;
  }

  let result: GlobalVariantKey;
  
  // TrainingFeatures-specific variants map to default to maintain current styling
  if (isTrainingFeaturesType(variant)) {
    result = 'default';
  } else {
    // Return the variant as is for global variants (it's already a GlobalVariantKey)
    result = variant as GlobalVariantKey;
  }

  // Cache the result for future calls
  variantMappingCache.set(variant, result);
  return result;
};

/**
 * Map TrainingFeaturesCTA size to UniversalButton size
 * Performance optimized with direct lookup
 * 
 * @param size - TrainingFeaturesCTA size variant
 * @returns UniversalButton size
 */
export const mapFeaturesSizeToUniversalButton = (size: TrainingFeaturesCTASize): 'medium' | 'large' => {
  return SIZE_MAP[size];
};

/**
 * Generate dynamic CTA text based on feature title and context
 * Enhanced with memoization and context-aware text generation
 * 
 * @param featureTitle - Optional feature title
 * @param contextType - Context type for text variation
 * @returns Generated CTA text
 */
export const generateFeaturesCTAText = (() => {
  const textCache = new Map<string, string>();
  
  return (featureTitle?: string, contextType: TrainingFeaturesContextType = 'explore'): string => {
    const cacheKey = `${featureTitle || 'default'}|${contextType}`;
    
    // Check cache first
    if (textCache.has(cacheKey)) {
      return textCache.get(cacheKey)!;
    }

    let result: string;

    if (!featureTitle) {
      // Default text based on context
      const contextDefaults = {
        explore: 'Explore All Features',
        learn: 'Learn About Features',
        discover: 'Discover Features'
      };
      result = contextDefaults[contextType];
    } else {
      // Check predefined mapping first
      const contextMap = FEATURE_CTA_TEXT_MAP[contextType];
      if (contextMap && contextMap[featureTitle]) {
        result = contextMap[featureTitle];
      } else {
        // Generate based on context
        const contextPrefixes = {
          explore: 'Explore',
          learn: 'Learn About',
          discover: 'Discover'
        };
        result = `${contextPrefixes[contextType]} ${featureTitle}`;
      }
    }

    // Cache the result
    textCache.set(cacheKey, result);
    return result;
  };
})();

/**
 * Generate CSS classes for styling variants
 * Heavily optimized with memoization and efficient string building
 * 
 * @param variant - TrainingFeatures variant key
 * @param size - TrainingFeaturesCTA size variant
 * @param className - Additional CSS classes
 * @param useSplashContext - Whether to include splash context classes
 * @returns Combined CSS class string
 */
export const generateFeaturesStyleClasses = (() => {
  // Create a unique cache key from parameters
  const createCacheKey = (
    variant: TrainingFeaturesVariantKey,
    size: TrainingFeaturesCTASize,
    className: string,
    useSplashContext: boolean
  ): string => {
    return `${variant}|${size}|${className}|${useSplashContext}`;
  };

  return (
    variant: TrainingFeaturesVariantKey,
    size: TrainingFeaturesCTASize,
    className: string = '',
    useSplashContext: boolean = false
  ): string => {
    const cacheKey = createCacheKey(variant, size, className, useSplashContext);
    
    // Check cache first
    if (cssClassCache.has(cacheKey)) {
      return cssClassCache.get(cacheKey)!;
    }

    const baseClass = 'training-features-cta';
    const variantClass = `${baseClass}--${variant}`;
    const sizeClass = `${baseClass}--${size}`;
    
    // Generate feature type specific styling (optimized)
    const featureVariantClass = isTrainingFeaturesType(variant) 
      ? `${baseClass}--${variant}` 
      : '';

    // Efficient array building and filtering
    const classes = [
      baseClass,
      variantClass,
      sizeClass,
      featureVariantClass,
      className
    ].filter(Boolean);

    const result = classes.join(' ').trim();
    
    // Cache the result
    cssClassCache.set(cacheKey, result);
    return result;
  };
})();

/**
 * Generate accessibility label for TrainingFeaturesCTA
 * 
 * @param ctaText - Generated CTA text
 * @param ariaLabel - Optional override aria label
 * @returns Accessibility label
 */
export const generateFeaturesAccessibilityLabel = (ctaText: string, ariaLabel?: string): string => {
  return ariaLabel || `${ctaText} - TrainingFeatures call to action`;
};

/**
 * Development-time prop validation for TrainingFeaturesCTA
 * Helps identify configuration issues during development
 * 
 * @param props - Validation props object
 */
export const validateTrainingFeaturesCTAProps = (props: {
  onNavigate?: (featureType: string) => void;
  href?: string;
  featureTitle?: string;
}): void => {
  if (process.env.NODE_ENV === 'development') {
    const { onNavigate, href, featureTitle } = props;
    
    // Validate required navigation method
    if (!onNavigate && !href) {
      logger.warn('TrainingFeaturesCTA: Either onNavigate or href must be provided for navigation to work properly.');
    }
    
    // Validate onNavigate function
    if (onNavigate && typeof onNavigate !== 'function') {
      logger.warn('TrainingFeaturesCTA: onNavigate must be a function.');
    }
    
    // Validate featureTitle format
    if (featureTitle && typeof featureTitle !== 'string') {
      logger.warn('TrainingFeaturesCTA: featureTitle must be a string.');
    }
    
    // Validate href format
    if (href && typeof href !== 'string') {
      logger.warn('TrainingFeaturesCTA: href must be a string.');
    }
  }
};

/**
 * Clear all utility caches (useful for testing)
 */
export const clearFeaturesUtilityCaches = (): void => {
  cssClassCache.clear();
  variantMappingCache.clear();
};

/**
 * Get cache statistics for performance monitoring
 */
export const getFeaturesCacheStatistics = (): Record<string, number> => {
  return {
    cssClassCacheSize: cssClassCache.size,
    variantMappingCacheSize: variantMappingCache.size,
  };
};

/**
 * Preload common feature type combinations for performance
 */
export const preloadCommonFeaturesCombinations = (): void => {
  const commonVariants: TrainingFeaturesVariantKey[] = ['default', 'virtual', 'tracking', 'support'];
  const commonSizes: TrainingFeaturesCTASize[] = ['primary', 'secondary'];
  
  // Preload variant mappings
  commonVariants.forEach(variant => {
    mapFeaturesVariantToGlobal(variant);
  });
  
  // Preload common CSS class combinations
  commonVariants.forEach(variant => {
    commonSizes.forEach(size => {
      generateFeaturesStyleClasses(variant, size, '', false);
      generateFeaturesStyleClasses(variant, size, '', true);
    });
  });
}; 