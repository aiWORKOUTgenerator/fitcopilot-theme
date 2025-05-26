/**
 * Centralized Animation System
 * Manages all animations including AOS, CSS animations, and reduced motion preferences
 */

import logger from './logger';

interface AnimationSystemConfig {
  duration?: number;
  easing?: string;
  once?: boolean;
  offset?: number;
  delay?: number;
  disable?: boolean | 'mobile' | ((window: Window) => boolean);
}

interface AnimationSystemState {
  initialized: boolean;
  aosLoaded: boolean;
  prefersReducedMotion: boolean;
  config: AnimationSystemConfig;
}

class AnimationSystem {
  private state: AnimationSystemState = {
    initialized: false,
    aosLoaded: false,
    prefersReducedMotion: false,
    config: {}
  };

  private defaultConfig: AnimationSystemConfig = {
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100,
    delay: 0,
    disable: false
  };

  /**
   * Initialize the animation system
   */
  async initialize(config: AnimationSystemConfig = {}): Promise<void> {
    if (this.state.initialized) {
      logger.debug('🎬 Animation system already initialized');
      return;
    }

    try {
      logger.debug('🎬 Initializing Animation System...');

      // Merge config with defaults
      this.state.config = { ...this.defaultConfig, ...config };

      // Check reduced motion preference
      this.state.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Check if design system is loaded
      const designSystemLoaded = this.checkDesignSystemLoaded();
      logger.debug('🎨 Design system loaded:', designSystemLoaded);

      // Initialize AOS
      await this.initializeAOS();

      // Set up mutation observer for dynamic content
      this.setupMutationObserver();

      // Mark as initialized
      this.state.initialized = true;

      logger.debug('✅ Animation system initialized successfully');

      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('animationSystemReady', {
        detail: { state: this.state }
      }));

    } catch (error) {
      logger.error('❌ Failed to initialize animation system:', error);
      throw error;
    }
  }

  /**
   * Initialize AOS (Animate On Scroll)
   */
  private async initializeAOS(): Promise<void> {
    try {
      logger.debug('📦 Loading AOS...');

      // Check if AOS is already available globally
      if (typeof window.AOS !== 'undefined') {
        logger.debug('🌍 Using existing global AOS instance');
        this.configureAOS(window.AOS);
        return;
      }

      // Dynamically import AOS
      const aosModule = await import('aos');
      const AOS = 'default' in aosModule ? aosModule.default : aosModule;

      // Store globally for other components
      window.AOS = AOS;

      logger.debug('📦 AOS module loaded successfully');
      this.configureAOS(AOS);

    } catch (error) {
      logger.error('❌ Failed to load AOS:', error);
      throw error;
    }
  }

  /**
   * Configure AOS with proper settings
   */
  private configureAOS(AOS: any): void {
    const shouldDisable = this.shouldDisableAnimations();

    const aosConfig = {
      duration: this.state.config.duration,
      easing: this.state.config.easing,
      once: this.state.config.once,
      offset: this.state.config.offset,
      delay: this.state.config.delay,
      disable: shouldDisable,
      startEvent: 'DOMContentLoaded',
      initClassName: 'aos-init',
      animatedClassName: 'aos-animate',
      useClassNames: false,
      disableMutationObserver: false,
      debounceDelay: 50,
      throttleDelay: 99
    };

    logger.debug('🔧 AOS Configuration:', aosConfig);

    AOS.init(aosConfig);
    this.state.aosLoaded = true;

    // Force refresh after initialization
    setTimeout(() => {
      this.refresh();
    }, 100);
  }

  /**
   * Check if animations should be disabled
   */
  private shouldDisableAnimations(): boolean {
    if (this.state.prefersReducedMotion) {
      logger.debug('⚠️ Reduced motion preferred - disabling animations');
      return true;
    }

    if (typeof this.state.config.disable === 'boolean') {
      return this.state.config.disable;
    }

    if (typeof this.state.config.disable === 'function') {
      return this.state.config.disable(window);
    }

    if (this.state.config.disable === 'mobile') {
      return window.innerWidth < 768;
    }

    return false;
  }

  /**
   * Check if design system CSS is loaded
   */
  private checkDesignSystemLoaded(): boolean {
    // Check for design system CSS variables
    const rootStyles = getComputedStyle(document.documentElement);
    return rootStyles.getPropertyValue('--animation-system-initialized') === 'true';
  }

  /**
   * Set up mutation observer for dynamic content
   */
  private setupMutationObserver(): void {
    if (!window.MutationObserver) return;

    const observer = new MutationObserver((mutations) => {
      let shouldRefresh = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.querySelector('[data-aos]') || element.hasAttribute('data-aos')) {
                shouldRefresh = true;
              }
            }
          });
        }
      });

      if (shouldRefresh) {
        logger.debug('🔄 New AOS elements detected, refreshing...');
        this.refresh();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Refresh animations
   */
  refresh(): void {
    if (!this.state.aosLoaded || !window.AOS) {
      logger.warn('⚠️ Cannot refresh - AOS not loaded');
      return;
    }

    logger.debug('🔄 Refreshing animations...');
    window.AOS.refresh();

    // Log current state
    setTimeout(() => {
      const stats = this.getAnimationStats();
      logger.debug('📊 Animation stats after refresh:', stats);
    }, 100);
  }

  /**
   * Get animation statistics
   */
  getAnimationStats() {
    return {
      totalElements: document.querySelectorAll('[data-aos]').length,
      initializedElements: document.querySelectorAll('.aos-init').length,
      animatedElements: document.querySelectorAll('.aos-animate').length,
      prefersReducedMotion: this.state.prefersReducedMotion,
      aosLoaded: this.state.aosLoaded,
      systemInitialized: this.state.initialized
    };
  }

  /**
   * Manually trigger animation for an element
   */
  triggerAnimation(element: Element): void {
    if (!this.state.aosLoaded) return;

    element.classList.add('aos-animate');
  }

  /**
   * Reset animation for an element
   */
  resetAnimation(element: Element): void {
    element.classList.remove('aos-animate');
  }

  /**
   * Check if system is ready
   */
  isReady(): boolean {
    return this.state.initialized && this.state.aosLoaded;
  }

  /**
   * Get current configuration
   */
  getConfig(): AnimationSystemConfig {
    return { ...this.state.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<AnimationSystemConfig>): void {
    this.state.config = { ...this.state.config, ...newConfig };
    
    if (this.state.aosLoaded && window.AOS) {
      // Reinitialize with new config
      this.configureAOS(window.AOS);
    }
  }
}

// Create singleton instance
const animationSystem = new AnimationSystem();

// Export both the instance and the class
export default animationSystem;
export { AnimationSystem };
export type { AnimationSystemConfig, AnimationSystemState };
