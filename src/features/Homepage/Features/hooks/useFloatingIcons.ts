import { useMemo } from 'react';
import { REDUCED_MOTION_CONFIG } from '../constants';
import { FloatingIconData, VariantKey } from '../types';
import { getFloatingIcons, getVisibleFloatingIcons, prefersReducedMotion } from '../utils';

/**
 * Custom hook for managing floating icons configuration
 * Handles motion preferences, variant-specific icons, and visibility
 * 
 * @param variant - Theme variant for icon selection
 * @param enabled - Whether floating icons should be enabled
 * @param respectReducedMotion - Whether to respect reduced motion preferences
 * @returns Object containing icon configuration and utilities
 * 
 * @example
 * ```tsx
 * const { icons, isEnabled, motionReduced } = useFloatingIcons('gym', true);
 * 
 * {isEnabled && icons.map((icon, index) => (
 *   <FloatingIcon key={index} {...icon} />
 * ))}
 * ```
 */
export const useFloatingIcons = (
  variant: VariantKey = 'default',
  enabled: boolean = true,
  respectReducedMotion: boolean = true
) => {
  // Check for reduced motion preference
  const motionReduced = useMemo(() => {
    return respectReducedMotion && prefersReducedMotion();
  }, [respectReducedMotion]);

  // Determine if floating icons should be shown
  const isEnabled = useMemo(() => {
    if (!enabled) return false;
    
    // Disable for reduced motion if configured
    if (motionReduced && REDUCED_MOTION_CONFIG.DISABLE_FLOATING_ICONS) {
      return false;
    }
    
    return true;
  }, [enabled, motionReduced]);

  // Get appropriate icons based on variant and motion preferences
  const allIcons = useMemo(() => {
    return getFloatingIcons(variant, respectReducedMotion);
  }, [variant, respectReducedMotion]);

  // Filter to only visible icons
  const icons = useMemo(() => {
    if (!isEnabled) return [];
    return getVisibleFloatingIcons(allIcons);
  }, [allIcons, isEnabled]);

  // Get icon count by category
  const iconStats = useMemo(() => {
    return {
      total: allIcons.length,
      visible: icons.length,
      hidden: allIcons.length - icons.length
    };
  }, [allIcons.length, icons.length]);

  // Get animation configuration
  const animationConfig = useMemo(() => {
    const baseConfig = {
      enabled: isEnabled,
      respectsMotion: respectReducedMotion,
      reducedMotion: motionReduced
    };

    if (motionReduced) {
      return {
        ...baseConfig,
        duration: REDUCED_MOTION_CONFIG.REDUCED_DURATION,
        disableAutoplay: REDUCED_MOTION_CONFIG.DISABLE_AUTOPLAY
      };
    }

    return baseConfig;
  }, [isEnabled, respectReducedMotion, motionReduced]);

  /**
   * Gets icon by ID
   * @param id - Icon ID to find
   * @returns Icon data if found
   */
  const getIconById = (id: string): FloatingIconData | undefined => {
    return icons.find(icon => icon.id === id);
  };

  /**
   * Gets icons within a specific area
   * @param bounds - Area bounds {left, top, right, bottom} as percentages
   * @returns Icons within the specified area
   */
  const getIconsInArea = (bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  }): FloatingIconData[] => {
    return icons.filter(icon => 
      icon.left >= bounds.left &&
      icon.left <= bounds.right &&
      icon.top >= bounds.top &&
      icon.top <= bounds.bottom
    );
  };

  /**
   * Gets the fastest and slowest animation speeds
   * @returns Object with min and max speeds
   */
  const getSpeedRange = () => {
    if (icons.length === 0) return { min: 0, max: 0 };
    
    const speeds = icons.map(icon => icon.speed);
    return {
      min: Math.min(...speeds),
      max: Math.max(...speeds)
    };
  };

  /**
   * Checks if icons are optimized for the current variant
   * @returns True if icons are optimized for the variant
   */
  const isOptimizedForVariant = (): boolean => {
    // Minimalist variant should use minimal icons
    if (variant === 'minimalist') {
      return icons.length <= 3;
    }
    
    // Other variants should have more icons unless motion is reduced
    return motionReduced ? icons.length <= 3 : icons.length > 3;
  };

  return {
    // Icon data
    icons,
    allIcons,
    
    // State
    isEnabled,
    motionReduced,
    variant,
    
    // Statistics
    iconStats,
    animationConfig,
    
    // Utility functions
    getIconById,
    getIconsInArea,
    getSpeedRange,
    isOptimizedForVariant,
    
    // Convenience properties
    hasIcons: icons.length > 0,
    iconCount: icons.length,
    isEmpty: icons.length === 0
  };
}; 