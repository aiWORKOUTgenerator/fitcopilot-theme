import * as React from 'react';
import animationSystem from '../../../utils/animationSystem';
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
 * Uses the centralized animation system for consistency
 *
 * @param options Animation configuration options
 */
export function useHomepageAnimation(options: HomepageAnimationOptions = {}) {
  const [isReady, setIsReady] = React.useState(false);
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    const initializeAnimations = async () => {
      try {
        logger.debug('🎬 Homepage Animation Hook: Starting initialization...');

        // Initialize the centralized animation system
        await animationSystem.initialize({
          duration: options.duration || 800,
          easing: options.easing || 'ease-in-out',
          once: options.once !== undefined ? options.once : true,
          offset: options.offset || 100,
          delay: options.delay || 0,
          disable: options.disableForReducedMotion ? 'mobile' : false
        });

        // Wait for system to be ready
        if (animationSystem.isReady()) {
          setIsReady(true);
          
          // Get initial stats
          const initialStats = animationSystem.getAnimationStats();
          setStats(initialStats);
          
          logger.debug('✅ Homepage animations initialized successfully');
          logger.debug('📊 Initial animation stats:', initialStats);

          // Set up periodic stats updates for debugging
          const statsInterval = setInterval(() => {
            const currentStats = animationSystem.getAnimationStats();
            setStats(currentStats);
            
            if (currentStats.totalElements > 0) {
              logger.debug('📊 Animation stats update:', currentStats);
            }
          }, 2000);

          // Cleanup interval after 30 seconds
          setTimeout(() => clearInterval(statsInterval), 30000);

        } else {
          logger.warn('⚠️ Animation system not ready after initialization');
        }

      } catch (error) {
        logger.error('❌ Failed to initialize homepage animations:', error);
        if (error instanceof Error) {
          logger.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          });
        }
      }
    };

    // Check if already initialized
    if (animationSystem.isReady()) {
      logger.debug('🎬 Animation system already ready');
      setIsReady(true);
      setStats(animationSystem.getAnimationStats());
    } else {
      // Initialize if not ready
      initializeAnimations();
    }

    // Listen for animation system ready event
    const handleAnimationSystemReady = (event: CustomEvent) => {
      logger.debug('🎬 Animation system ready event received:', event.detail);
      setIsReady(true);
      setStats(animationSystem.getAnimationStats());
    };

    window.addEventListener('animationSystemReady', handleAnimationSystemReady as EventListener);

    // Cleanup function
    return () => {
      window.removeEventListener('animationSystemReady', handleAnimationSystemReady as EventListener);
    };
  }, [options]);

  // Provide utility functions for components
  const refresh = React.useCallback(() => {
    if (animationSystem.isReady()) {
      animationSystem.refresh();
      setStats(animationSystem.getAnimationStats());
    }
  }, []);

  const triggerAnimation = React.useCallback((element: Element) => {
    animationSystem.triggerAnimation(element);
  }, []);

  const resetAnimation = React.useCallback((element: Element) => {
    animationSystem.resetAnimation(element);
  }, []);

  return {
    isReady,
    stats,
    refresh,
    triggerAnimation,
    resetAnimation,
    getConfig: () => animationSystem.getConfig()
  };
} 