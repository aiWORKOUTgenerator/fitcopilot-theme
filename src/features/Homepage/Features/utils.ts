import logger from '../../../utils/logger';
import {
  DEFAULT_FLOATING_ICONS,
  MINIMAL_FLOATING_ICONS,
  REDUCED_MOTION_CONFIG
} from './constants';
import { FeatureData, FloatingIconData, ProgressDataPoint, VariantKey, WorkoutExercise } from './types';

// ============================================================================
// SCROLL UTILITIES
// ============================================================================

/**
 * Smoothly scrolls to a target element by ID
 * @param targetId - The ID of the element to scroll to
 * @param behavior - Scroll behavior ('smooth' | 'auto' | 'instant')
 * @returns Promise that resolves when scroll is complete
 */
export const scrollToElement = (
  targetId: string, 
  behavior: ScrollBehavior = 'smooth'
): Promise<void> => {
  return new Promise((resolve) => {
    const element = document.getElementById(targetId);
    
    if (!element) {
      logger.warn(`Element with ID "${targetId}" not found for scrolling`);
      resolve();
      return;
    }

    element.scrollIntoView({ behavior });
    
    // Wait for scroll to complete
    setTimeout(() => {
      resolve();
    }, behavior === 'smooth' ? 800 : 0);
  });
};

/**
 * Handles scroll to splash section with event prevention
 * @param e - Mouse event from button/link click
 * @param targetId - Optional target ID (defaults to 'splash-section')
 */
export const handleScrollToSplash = (
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  targetId: string = 'splash-section'
): void => {
  e.preventDefault();
  scrollToElement(targetId);
};

/**
 * Gets the current scroll position as a percentage
 * @returns Scroll percentage (0-100)
 */
export const getScrollPercentage = (): number => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
};

// ============================================================================
// VIDEO UTILITIES
// ============================================================================

/**
 * Safely plays a video element with error handling
 * @param videoElement - The video element to play
 * @returns Promise that resolves when video starts playing
 */
export const safeVideoPlay = async (videoElement: HTMLVideoElement): Promise<void> => {
  try {
    await videoElement.play();
    logger.debug('Video playback started successfully');
  } catch (error) {
    logger.error('Video autoplay failed:', error);
    // Don't throw - video autoplay failures are common and expected
  }
};

/**
 * Safely pauses a video element
 * @param videoElement - The video element to pause
 */
export const safeVideoPause = (videoElement: HTMLVideoElement): void => {
  try {
    videoElement.pause();
    logger.debug('Video playback paused');
  } catch (error) {
    logger.error('Video pause failed:', error);
  }
};

/**
 * Checks if video autoplay is likely to work
 * @returns Promise that resolves to true if autoplay is supported
 */
export const checkAutoplaySupport = async (): Promise<boolean> => {
  try {
    const video = document.createElement('video');
    video.muted = true;
    video.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMWF2YzEAAAAIZnJlZQAAAr1tZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE1MiByMjg1NCBlOWE1OTAzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNyAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTMgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTEwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAD2WIhAA3//728P4FNjuZQQAAAu5tb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAAZAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACGHRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAIAAAACAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAABAAAAZAAAAAEAAAAAAZhtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAAKxEAAAIAFXEAAAAAAAtaGRscgAAAAAAAAAAc291bgAAAAAAAAAAAAAAAFNvdW5kSGFuZGxlcgAAAAEObWluZgAAABBzbWhkAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAADSc3RibAAAAGpzdHNkAAAAAAAAAAEAAABac21wNAAAAAAAAAABAAAAAAAAAAAAAgAQAAAAAKxEAAAAAAAzZXNkcwAAAAADgICAIgACAASAgIAUQBUAAAAAAfQAAAH0AICAQAYggUABAgAAABhzdHRzAAAAAAAAAAEAAAABAAAIAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAgAAAAEAAAAUc3RzegAAAAAAAAAGAAAAAnN0Y28AAAAAAAAAAQAAADAAAABidWR0YQAAAFptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAAC1pbHN0AAAAJal9dG9vAAAAHWRhdGEAAAABAAAAAExhdmY1Ni40MC4xMDE=';
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      await playPromise;
      video.pause();
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

// ============================================================================
// FEATURE DATA UTILITIES
// ============================================================================

/**
 * Validates feature data structure
 * @param feature - Feature data to validate
 * @returns True if feature is valid
 */
export const isValidFeature = (feature: any): feature is FeatureData => {
  return (
    feature &&
    typeof feature.id === 'string' &&
    typeof feature.title === 'string' &&
    typeof feature.description === 'string' &&
    feature.icon &&
    typeof feature.gradient === 'string' &&
    feature.demoComponent
  );
};

/**
 * Filters and validates an array of features
 * @param features - Array of features to validate
 * @returns Array of valid features
 */
export const validateFeatures = (features: any[]): FeatureData[] => {
  return features.filter(isValidFeature);
};

/**
 * Gets feature by ID
 * @param features - Array of features
 * @param id - Feature ID to find
 * @returns Feature if found, undefined otherwise
 */
export const getFeatureById = (features: FeatureData[], id: string): FeatureData | undefined => {
  return features.find(feature => feature.id === id);
};

/**
 * Groups features by category
 * @param features - Array of features
 * @returns Object with categories as keys and feature arrays as values
 */
export const groupFeaturesByCategory = (features: FeatureData[]): Record<string, FeatureData[]> => {
  return features.reduce((groups, feature) => {
    const category = feature.category || 'default';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(feature);
    return groups;
  }, {} as Record<string, FeatureData[]>);
};

// ============================================================================
// FLOATING ICONS UTILITIES
// ============================================================================

/**
 * Checks if user prefers reduced motion
 * @returns True if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Gets appropriate floating icons based on variant and motion preferences
 * @param variant - Theme variant
 * @param respectReducedMotion - Whether to respect reduced motion preferences
 * @returns Array of floating icon configurations
 */
export const getFloatingIcons = (
  variant: VariantKey = 'default',
  respectReducedMotion: boolean = true
): FloatingIconData[] => {
  // Check for reduced motion preference
  if (respectReducedMotion && prefersReducedMotion()) {
    if (REDUCED_MOTION_CONFIG.DISABLE_FLOATING_ICONS) {
      return [];
    }
    return MINIMAL_FLOATING_ICONS;
  }

  // Return minimal icons for minimalist variant
  if (variant === 'minimalist') {
    return MINIMAL_FLOATING_ICONS;
  }

  return DEFAULT_FLOATING_ICONS;
};

/**
 * Filters floating icons by visibility
 * @param icons - Array of floating icon configurations
 * @returns Array of visible floating icons
 */
export const getVisibleFloatingIcons = (icons: FloatingIconData[]): FloatingIconData[] => {
  return icons.filter(icon => icon.visible !== false);
};

// ============================================================================
// ANIMATION UTILITIES
// ============================================================================

/**
 * Calculates staggered animation delay
 * @param index - Element index
 * @param baseDelay - Base delay in milliseconds
 * @param staggerAmount - Stagger amount in milliseconds
 * @returns Calculated delay in milliseconds
 */
export const calculateStaggerDelay = (
  index: number, 
  baseDelay: number = 0, 
  staggerAmount: number = 100
): number => {
  return baseDelay + (index * staggerAmount);
};

/**
 * Gets animation duration based on reduced motion preference
 * @param defaultDuration - Default animation duration in milliseconds
 * @param respectReducedMotion - Whether to respect reduced motion preferences
 * @returns Adjusted animation duration
 */
export const getAnimationDuration = (
  defaultDuration: number,
  respectReducedMotion: boolean = true
): number => {
  if (respectReducedMotion && prefersReducedMotion()) {
    return REDUCED_MOTION_CONFIG.REDUCED_DURATION;
  }
  return defaultDuration;
};

// ============================================================================
// THEME UTILITIES
// ============================================================================

/**
 * Gets theme-specific CSS classes
 * @param variant - Theme variant
 * @returns Object with theme-specific CSS classes
 */
export const getThemeClasses = (variant: VariantKey) => {
  const baseClasses = {
    section: 'features-section',
    header: 'features-header',
    grid: 'features-grid',
    card: 'feature-card',
    cta: 'features-cta'
  };

  const variantClasses = {
    section: `${baseClasses.section}--${variant}`,
    header: `${baseClasses.header}--${variant}`,
    grid: `${baseClasses.grid}--${variant}`,
    card: `${baseClasses.card}--${variant}`,
    cta: `${baseClasses.cta}--${variant}`
  };

  return {
    base: baseClasses,
    variant: variantClasses,
    combined: {
      section: `${baseClasses.section} ${variantClasses.section}`,
      header: `${baseClasses.header} ${variantClasses.header}`,
      grid: `${baseClasses.grid} ${variantClasses.grid}`,
      card: `${baseClasses.card} ${variantClasses.card}`,
      cta: `${baseClasses.cta} ${variantClasses.cta}`
    }
  };
};

/**
 * Validates variant key
 * @param variant - Variant to validate
 * @returns True if variant is valid
 */
export const isValidVariant = (variant: any): variant is VariantKey => {
  const validVariants: VariantKey[] = [
    'default', 'gym', 'boutique', 'modern', 'wellness', 
    'classic', 'sports', 'minimalist', 'registration'
  ];
  return validVariants.includes(variant);
};

// ============================================================================
// DEMO COMPONENT UTILITIES
// ============================================================================

/**
 * Formats workout exercise data for display
 * @param exercises - Array of workout exercises
 * @returns Formatted exercise data
 */
export const formatWorkoutExercises = (exercises: WorkoutExercise[]) => {
  return exercises.map(exercise => ({
    ...exercise,
    displayName: exercise.name,
    displaySets: exercise.sets,
    isCompleted: exercise.completed || false,
    categoryLabel: exercise.category ? exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1) : 'General'
  }));
};

/**
 * Calculates progress chart path
 * @param data - Array of progress data points
 * @param width - Chart width
 * @param height - Chart height
 * @returns SVG path string
 */
export const calculateProgressPath = (
  data: ProgressDataPoint[], 
  width: number = 200, 
  height: number = 100
): string => {
  if (data.length === 0) return '';

  const scaleX = width / Math.max(...data.map(d => d.x));
  const scaleY = height / Math.max(...data.map(d => d.y));

  const pathCommands = data.map((point, index) => {
    const x = point.x * scaleX;
    const y = height - (point.y * scaleY); // Invert Y for SVG coordinate system
    
    return index === 0 ? `M${x},${y}` : `L${x},${y}`;
  });

  return pathCommands.join(' ');
};

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Safely executes a function with error handling
 * @param fn - Function to execute
 * @param fallback - Fallback value if function throws
 * @param context - Context for error logging
 * @returns Function result or fallback value
 */
export const safeExecute = <T>(
  fn: () => T, 
  fallback: T, 
  context: string = 'Unknown'
): T => {
  try {
    return fn();
  } catch (error) {
    logger.error(`Error in ${context}:`, error);
    return fallback;
  }
};

/**
 * Debounces a function call
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttles a function call
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}; 