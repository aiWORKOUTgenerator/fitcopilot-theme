import { useMemo } from 'react';
import { ANIMATION_EASINGS, ANIMATION_TIMINGS, REDUCED_MOTION_CONFIG } from '../constants';
import { AnimationConfig, AnimationEasing } from '../types';
import {
  calculateStaggerDelay,
  getAnimationDuration,
  prefersReducedMotion
} from '../utils';

/**
 * Custom hook for managing animations and motion preferences
 * Provides animation configurations that respect user motion preferences
 * 
 * @param respectReducedMotion - Whether to respect reduced motion preferences
 * @returns Object containing animation configurations and utilities
 * 
 * @example
 * ```tsx
 * const { config, stagger, isMotionReduced } = useAnimations();
 * 
 * <div 
 *   style={{ 
 *     animationDuration: `${config.duration}ms`,
 *     animationDelay: `${stagger.getDelay(index)}ms`
 *   }}
 * />
 * ```
 */
export const useAnimations = (respectReducedMotion: boolean = true) => {
  // Check for reduced motion preference
  const isMotionReduced = useMemo(() => {
    return respectReducedMotion && prefersReducedMotion();
  }, [respectReducedMotion]);

  // Base animation configuration
  const config = useMemo((): AnimationConfig => {
    const baseDuration = ANIMATION_TIMINGS.DEFAULT_DURATION;
    const duration = getAnimationDuration(baseDuration, respectReducedMotion);
    
    return {
      duration,
      easing: isMotionReduced ? 'ease' : 'ease-in-out',
      delay: 0,
      repeat: false,
      respectReducedMotion
    };
  }, [isMotionReduced, respectReducedMotion]);

  // Stagger animation utilities
  const stagger = useMemo(() => {
    const baseDelay = isMotionReduced ? 50 : ANIMATION_TIMINGS.STAGGER_DELAY;
    
    return {
      /**
       * Gets staggered delay for an element
       * @param index - Element index
       * @param customDelay - Custom base delay
       * @returns Calculated delay in milliseconds
       */
      getDelay: (index: number, customDelay?: number) => {
        return calculateStaggerDelay(index, customDelay || 0, baseDelay);
      },
      
      /**
       * Gets stagger configuration for multiple elements
       * @param count - Number of elements
       * @param baseDelay - Base delay before stagger starts
       * @returns Array of delays
       */
      getDelays: (count: number, baseDelay: number = 0) => {
        return Array.from({ length: count }, (_, index) => 
          calculateStaggerDelay(index, baseDelay, baseDelay)
        );
      },
      
      baseDelay
    };
  }, [isMotionReduced]);

  // Hover animation configuration
  const hover = useMemo(() => {
    const duration = isMotionReduced ? 
      REDUCED_MOTION_CONFIG.REDUCED_DURATION : 
      ANIMATION_TIMINGS.HOVER_DURATION;
    
    return {
      duration,
      easing: 'ease-out' as AnimationEasing,
      scale: isMotionReduced ? 1.02 : 1.05,
      enabled: !isMotionReduced
    };
  }, [isMotionReduced]);

  // Floating icons animation configuration
  const floatingIcons = useMemo(() => {
    if (isMotionReduced && REDUCED_MOTION_CONFIG.DISABLE_FLOATING_ICONS) {
      return {
        enabled: false,
        duration: 0,
        baseSpeed: 0
      };
    }
    
    return {
      enabled: true,
      duration: isMotionReduced ? 
        REDUCED_MOTION_CONFIG.REDUCED_DURATION : 
        ANIMATION_TIMINGS.FLOATING_ICON_BASE_SPEED * 1000,
      baseSpeed: ANIMATION_TIMINGS.FLOATING_ICON_BASE_SPEED
    };
  }, [isMotionReduced]);

  // Video animation configuration
  const video = useMemo(() => {
    return {
      autoplayDelay: ANIMATION_TIMINGS.VIDEO_AUTOPLAY_DELAY,
      enabled: !isMotionReduced || !REDUCED_MOTION_CONFIG.DISABLE_AUTOPLAY,
      fadeInDuration: isMotionReduced ? 
        REDUCED_MOTION_CONFIG.REDUCED_DURATION : 
        ANIMATION_TIMINGS.DEFAULT_DURATION
    };
  }, [isMotionReduced]);

  // Progress chart animation configuration
  const progressChart = useMemo(() => {
    const duration = isMotionReduced ? 
      REDUCED_MOTION_CONFIG.REDUCED_DURATION / 1000 : 
      ANIMATION_TIMINGS.PROGRESS_CHART_DURATION;
    
    return {
      duration,
      enabled: !isMotionReduced,
      easing: isMotionReduced ? 'linear' : ANIMATION_EASINGS.SMOOTH,
      staggerDelay: isMotionReduced ? 0.1 : 0.4
    };
  }, [isMotionReduced]);

  /**
   * Creates a CSS animation style object
   * @param animationType - Type of animation
   * @param customConfig - Custom animation configuration
   * @returns CSS style object
   */
  const createAnimationStyle = (
    animationType: 'fadeIn' | 'slideUp' | 'scale' | 'custom',
    customConfig?: Partial<AnimationConfig>
  ) => {
    const finalConfig = { ...config, ...customConfig };
    
    if (isMotionReduced) {
      return {
        transition: `all ${finalConfig.duration}ms ease`,
        animationDuration: `${finalConfig.duration}ms`
      };
    }
    
    const animations = {
      fadeIn: 'fadeIn',
      slideUp: 'slideUp',
      scale: 'scaleIn',
      custom: 'custom'
    };
    
    return {
      animation: `${animations[animationType]} ${finalConfig.duration}ms ${finalConfig.easing}`,
      animationDelay: `${finalConfig.delay}ms`,
      animationFillMode: 'both'
    };
  };

  /**
   * Gets transition style for hover effects
   * @param property - CSS property to transition
   * @returns CSS transition style
   */
  const getTransitionStyle = (property: string = 'all') => {
    return {
      transition: `${property} ${hover.duration}ms ${hover.easing}`
    };
  };

  /**
   * Checks if animations should be enabled for a specific type
   * @param animationType - Type of animation to check
   * @returns True if animation should be enabled
   */
  const shouldAnimate = (animationType: 'hover' | 'floating' | 'video' | 'chart' | 'general') => {
    switch (animationType) {
    case 'hover':
      return hover.enabled;
    case 'floating':
      return floatingIcons.enabled;
    case 'video':
      return video.enabled;
    case 'chart':
      return progressChart.enabled;
    case 'general':
      return !isMotionReduced;
    default:
      return !isMotionReduced;
    }
  };

  /**
   * Gets animation class names based on motion preferences
   * @param baseClass - Base CSS class
   * @param animatedClass - Animated CSS class
   * @returns Appropriate class name
   */
  const getAnimationClass = (baseClass: string, animatedClass: string) => {
    return isMotionReduced ? baseClass : `${baseClass} ${animatedClass}`;
  };

  return {
    // Configuration objects
    config,
    hover,
    floatingIcons,
    video,
    progressChart,
    
    // Utility objects
    stagger,
    
    // State
    isMotionReduced,
    respectReducedMotion,
    
    // Utility functions
    createAnimationStyle,
    getTransitionStyle,
    shouldAnimate,
    getAnimationClass,
    
    // Convenience properties
    isAnimationEnabled: !isMotionReduced,
    defaultDuration: config.duration,
    defaultEasing: config.easing
  };
}; 