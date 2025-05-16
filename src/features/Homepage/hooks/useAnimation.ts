import * as React from 'react';
import logger from '../../../utils/logger';

/**
 * Animation easing options supported by the animation library
 */
type EasingOptions =
    | 'linear'
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'ease-in-back'
    | 'ease-out-back'
    | 'ease-in-out-back'
    | 'ease-in-sine'
    | 'ease-out-sine'
    | 'ease-in-out-sine'
    | 'ease-in-quad'
    | 'ease-out-quad'
    | 'ease-in-out-quad'
    | 'ease-in-cubic'
    | 'ease-out-cubic'
    | 'ease-in-out-cubic'
    | 'ease-in-quart'
    | 'ease-out-quart'
    | 'ease-in-out-quart';

/**
 * Configuration options for the Homepage animations
 */
interface HomepageAnimationOptions {
    duration?: number;
    easing?: EasingOptions;
    once?: boolean;
    offset?: number;
    delay?: number;
    disableForReducedMotion?: boolean;
}

/**
 * Homepage-specific animation hook
 * Initializes and manages scroll animations for the Homepage components
 *
 * @param options Animation configuration options
 */
export function useHomepageAnimation(options: HomepageAnimationOptions = {}) {
  React.useEffect(() => {
    const initializeAnimations = async () => {
      try {
        // Check if AOS is already defined globally
        if (typeof window.AOS !== 'undefined') {
          window.AOS.init({
            duration: options.duration || 800,
            easing: options.easing || 'ease-in-out',
            once: options.once !== undefined ? options.once : true,
            offset: options.offset || 100,
            delay: options.delay || 0,
            disable: options.disableForReducedMotion !== false &&
                            window.matchMedia('(prefers-reduced-motion: reduce)').matches
          });
        } else {
          // Dynamically import AOS (CommonJS module)
          const aosModule = await import('aos');
          // Handle both ESM and CommonJS module types
          const AOS = 'default' in aosModule ? aosModule.default : aosModule;
          AOS.init({
            duration: options.duration || 800,
            easing: options.easing || 'ease-in-out',
            once: options.once !== undefined ? options.once : true,
            offset: options.offset || 100,
            delay: options.delay || 0,
            disable: options.disableForReducedMotion !== false &&
                            window.matchMedia('(prefers-reduced-motion: reduce)').matches
          });
        }
      } catch (error) {
        logger.error('Failed to load animation library for Homepage:', error);
      }
    };

    initializeAnimations();

    // Cleanup function
    return () => {
      document.querySelectorAll('[data-aos]').forEach(el => {
        el.removeAttribute('data-aos');
      });
    };
  }, [options]);
} 