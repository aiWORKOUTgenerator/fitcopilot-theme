/**
 * TrainingCTA Utility Functions - Phase 3 Enhanced
 * 
 * Centralized logic for Training CTA component functionality with
 * Phase 3 performance optimizations, memoization, and enhanced validation.
 * Supports architectural improvements while maintaining visual consistency.
 * 
 * @fileoverview Enhanced utility functions for TrainingCTA component
 * @version 3.0.0 - Phase 3 Performance Optimizations
 */

import { GlobalVariantKey } from '../../../types/shared';
import { TrainingCTASize, TrainingVariantKey } from './types';

// ============================================================================
// CONSTANTS & MAPPINGS
// ============================================================================

/**
 * Program types that have specific styling variants
 */
export const TRAINING_PROGRAM_TYPES: readonly TrainingVariantKey[] = [
  'strength', 
  'fatLoss', 
  'fitness', 
  'athletic'
] as const;

/**
 * Default CTA text mapping for program types - Enhanced with fallbacks
 */
export const PROGRAM_CTA_TEXT_MAP: Record<string, string> = {
  'Strength Building': 'View Strength Building Programs',
  'Fat Loss': 'View Fat Loss Programs',
  'General Fitness': 'View General Fitness Programs',
  'Athletic Performance': 'View Athletic Performance Programs',
  // Additional mappings for flexibility
  'Strength': 'View Strength Programs',
  'Cardio': 'View Cardio Programs',
  'HIIT': 'View HIIT Programs',
  'Yoga': 'View Yoga Programs',
  'Powerlifting': 'View Powerlifting Programs',
} as const;

/**
 * Size to UniversalButton size mapping - Performance optimized
 */
const SIZE_MAP: Record<TrainingCTASize, 'medium' | 'large'> = {
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
const variantMappingCache = new Map<TrainingVariantKey, GlobalVariantKey>();

/**
 * Check if a variant is a training-specific program type
 * Performance optimized with type guard
 */
export const isTrainingProgramType = (variant: TrainingVariantKey): variant is 'strength' | 'fatLoss' | 'fitness' | 'athletic' => {
  return (TRAINING_PROGRAM_TYPES as readonly string[]).includes(variant);
};

/**
 * Map TrainingVariantKey to GlobalVariantKey for UniversalButton compatibility
 * Enhanced with memoization for performance
 * 
 * @param variant - Training variant key
 * @returns GlobalVariantKey for UniversalButton
 */
export const mapTrainingVariantToGlobal = (variant: TrainingVariantKey): GlobalVariantKey => {
  // Check memoized cache first
  if (variantMappingCache.has(variant)) {
    return variantMappingCache.get(variant)!;
  }

  let result: GlobalVariantKey;
  
  // Training-specific variants map to default to maintain current styling
  if (isTrainingProgramType(variant)) {
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
 * Map TrainingCTA size to UniversalButton size
 * Performance optimized with direct lookup
 * 
 * @param size - TrainingCTA size variant
 * @returns UniversalButton size
 */
export const mapSizeToUniversalButton = (size: TrainingCTASize): 'medium' | 'large' => {
  return SIZE_MAP[size];
};

/**
 * Generate dynamic CTA text based on program title
 * Enhanced with memoization and better fallback logic
 * 
 * @param programTitle - Optional program title
 * @returns Generated CTA text
 */
export const generateCTAText = (() => {
  const textCache = new Map<string | undefined, string>();
  
  return (programTitle?: string): string => {
    // Check cache first
    if (textCache.has(programTitle)) {
      return textCache.get(programTitle)!;
    }

    let result: string;

    if (!programTitle) {
      result = 'View All Programs';
    } else {
      // Check predefined mapping first
      result = PROGRAM_CTA_TEXT_MAP[programTitle] || `View ${programTitle} Programs`;
    }

    // Cache the result
    textCache.set(programTitle, result);
    return result;
  };
})();

/**
 * Generate CSS classes for styling variants
 * Heavily optimized with memoization and efficient string building
 * 
 * @param variant - Training variant key
 * @param size - TrainingCTA size variant
 * @param className - Additional CSS classes
 * @param useSplashContext - Whether to include splash context classes
 * @returns Combined CSS class string
 */
export const generateStyleClasses = (() => {
  // Create a unique cache key from parameters
  const createCacheKey = (
    variant: TrainingVariantKey,
    size: TrainingCTASize,
    className: string,
    useSplashContext: boolean
  ): string => {
    return `${variant}|${size}|${className}|${useSplashContext}`;
  };

  return (
    variant: TrainingVariantKey,
    size: TrainingCTASize,
    className: string = '',
    useSplashContext: boolean = true
  ): string => {
    const cacheKey = createCacheKey(variant, size, className, useSplashContext);
    
    // Check cache first
    if (cssClassCache.has(cacheKey)) {
      return cssClassCache.get(cacheKey)!;
    }

    const baseClass = 'training-cta';
    const variantClass = `${baseClass}--${variant}`;
    const sizeClass = `${baseClass}--${size}`;
    
    // Generate program type specific styling (optimized)
    const programVariantClass = isTrainingProgramType(variant) 
      ? `${baseClass}--${variant}` 
      : '';

    // Efficient array building and filtering
    const classes = [
      baseClass,
      variantClass,
      sizeClass,
      programVariantClass,
      className
    ].filter(Boolean);

    const result = classes.join(' ').trim();
    
    // Cache the result
    cssClassCache.set(cacheKey, result);
    return result;
  };
})();

/**
 * Generate accessibility label for the CTA button
 * Optimized with memoization
 * 
 * @param ctaText - The button text
 * @param customLabel - Custom aria-label override
 * @returns Accessibility label string
 */
export const generateAccessibilityLabel = (() => {
  const labelCache = new Map<string, string>();
  
  return (ctaText: string, customLabel?: string): string => {
    if (customLabel) return customLabel;
    
    if (labelCache.has(ctaText)) {
      return labelCache.get(ctaText)!;
    }
    
    const result = `${ctaText} - Training section call to action`;
    labelCache.set(ctaText, result);
    return result;
  };
})();

// ============================================================================
// ENHANCED VALIDATION & DEVELOPMENT TOOLS
// ============================================================================

/**
 * Enhanced validation for TrainingCTA props with performance considerations
 * 
 * @param props - TrainingCTA props object
 */
export const validateTrainingCTAProps = (props: {
  onNavigate?: (title: string) => void;
  href?: string;
  programTitle?: string;
}): void => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const { onNavigate, href, programTitle } = props;
  
  // Enhanced validation with actionable warnings
  if (!onNavigate && !href) {
    console.warn(
      '🚨 TrainingCTA: Either onNavigate or href should be provided for navigation functionality.\n' +
      '💡 Suggestion: Add onNavigate prop or href prop for button functionality.'
    );
  }
  
  if (programTitle && !PROGRAM_CTA_TEXT_MAP[programTitle] && programTitle.trim()) {
    console.info(
      `ℹ️  TrainingCTA: programTitle "${programTitle}" is not in predefined mapping.\n` +
      `💡 Consider adding to PROGRAM_CTA_TEXT_MAP for consistent text formatting.\n` +
      `📝 Current available titles: ${Object.keys(PROGRAM_CTA_TEXT_MAP).join(', ')}`
    );
  }

  // Performance warning for excessive re-renders
  if (typeof window !== 'undefined' && (window as any).__TRAINING_CTA_RENDER_COUNT) {
    (window as any).__TRAINING_CTA_RENDER_COUNT++;
    if ((window as any).__TRAINING_CTA_RENDER_COUNT > 10) {
      console.warn(
        '⚠️  TrainingCTA: High render count detected. Consider memoizing props or checking for unnecessary re-renders.'
      );
    }
  } else if (typeof window !== 'undefined') {
    (window as any).__TRAINING_CTA_RENDER_COUNT = 1;
  }
};

// ============================================================================
// PERFORMANCE MONITORING & CACHE MANAGEMENT
// ============================================================================

/**
 * Clear all utility caches - useful for testing or memory management
 */
export const clearUtilityCaches = (): void => {
  cssClassCache.clear();
  variantMappingCache.clear();
  console.info('🧹 TrainingCTA utility caches cleared');
};

/**
 * Get cache statistics for performance monitoring
 */
export const getCacheStatistics = (): Record<string, number> => {
  return {
    cssClassCacheSize: cssClassCache.size,
    variantMappingCacheSize: variantMappingCache.size,
  };
};

/**
 * Preload common combinations to improve initial performance
 */
export const preloadCommonCombinations = (): void => {
  const commonVariants: TrainingVariantKey[] = ['default', 'strength', 'fatLoss'];
  const commonSizes: TrainingCTASize[] = ['primary', 'secondary'];
  
  // Preload variant mappings
  commonVariants.forEach(variant => {
    mapTrainingVariantToGlobal(variant);
  });
  
  // Preload CSS classes for common combinations
  commonVariants.forEach(variant => {
    commonSizes.forEach(size => {
      generateStyleClasses(variant, size, '', true);
      generateStyleClasses(variant, size, '', false);
    });
  });
  
  // Preload common CTA texts
  Object.keys(PROGRAM_CTA_TEXT_MAP).forEach(title => {
    generateCTAText(title);
  });
  
  console.info('🚀 TrainingCTA common combinations preloaded for optimal performance');
};

// ============================================================================
// DEVELOPMENT EXPORTS
// ============================================================================

// Export for development/testing purposes
export const __DEV__ = {
  cssClassCache,
  variantMappingCache,
  clearUtilityCaches,
  getCacheStatistics,
  preloadCommonCombinations,
} as const; 