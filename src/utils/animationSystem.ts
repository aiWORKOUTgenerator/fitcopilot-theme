/**
 * Centralized Animation System
 * Manages all animations including AOS, CSS animations, and reduced motion preferences
 * Enhanced to support unified animation attributes for consistent usage
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

      // Set up unified animation system
      this.setupUnifiedAnimations();

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
   * Set up unified animation system for data-animation attributes
   */
  private setupUnifiedAnimations(): void {
    logger.debug('🎭 Setting up unified animation system...');

    // Process existing elements with data-animation attributes
    this.processUnifiedAnimations();

    // Set up intersection observer for scroll-triggered animations
    this.setupIntersectionObserver();
  }

  /**
   * Process elements with data-animation attributes
   */
  private processUnifiedAnimations(): void {
    const elements = document.querySelectorAll('[data-animation]');
    
    elements.forEach((element) => {
      const animation = element.getAttribute('data-animation');
      const delay = element.getAttribute('data-delay') || '0';
      
      if (!animation) return;

      // Convert to AOS attributes for compatibility
      element.setAttribute('data-aos', animation);
      element.setAttribute('data-aos-delay', delay);

      // Add unified animation class for CSS targeting
      element.classList.add('animate-on-scroll');
    });

    logger.debug(`🎬 Processed ${elements.length} unified animation elements`);
  }

  /**
   * Set up intersection observer for manual animation triggering
   */
  private setupIntersectionObserver(): void {
    if (!window.IntersectionObserver || this.shouldDisableAnimations()) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animation = element.getAttribute('data-animation');
          
          if (animation && element.classList.contains('animate-on-scroll')) {
            this.triggerUnifiedAnimation(element as HTMLElement);
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: `${this.state.config.offset || 100}px`
    });

    // Observe all unified animation elements
    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
      observer.observe(element);
    });
  }

  /**
   * Trigger unified animation for an element
   */
  private triggerUnifiedAnimation(element: HTMLElement): void {
    const animation = element.getAttribute('data-animation');
    const delay = parseInt(element.getAttribute('data-delay') || '0', 10);

    if (!animation || this.shouldDisableAnimations()) return;

    setTimeout(() => {
      // Add AOS animation classes
      element.classList.add('aos-init', 'aos-animate');
      
      // Add custom animation class if needed
      const animationClass = `animate-${animation}`;
      if (this.hasAnimationClass(animationClass)) {
        element.classList.add(animationClass);
      }

      logger.debug(`🎬 Triggered unified animation: ${animation} for element`, element);
    }, delay);
  }

  /**
   * Check if a custom animation class exists in the stylesheets
   */
  private hasAnimationClass(className: string): boolean {
    const stylesheets = Array.from(document.styleSheets);
    
    try {
      for (const stylesheet of stylesheets) {
        try {
          const rules = Array.from(stylesheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule && rule.selectorText?.includes(`.${className}`)) {
              return true;
            }
          }
        } catch (e) {
          // Skip stylesheets that can't be accessed (CORS)
          continue;
        }
      }
    } catch (e) {
      logger.debug('Could not check for animation class:', className);
    }
    
    return false;
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
      let hasUnifiedAnimations = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // Check for AOS elements (legacy support)
              if (element.querySelector('[data-aos]') || element.hasAttribute('data-aos')) {
                shouldRefresh = true;
              }
              
              // Check for unified animation elements
              if (element.querySelector('[data-animation]') || element.hasAttribute('data-animation')) {
                hasUnifiedAnimations = true;
              }
            }
          });
        }
      });

      if (shouldRefresh) {
        logger.debug('🔄 New AOS elements detected, refreshing...');
        this.refresh();
      }

      if (hasUnifiedAnimations) {
        logger.debug('🎭 New unified animation elements detected, processing...');
        this.processUnifiedAnimations();
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
    
    // Refresh AOS
    window.AOS.refresh();
    
    // Process new unified animations
    this.processUnifiedAnimations();

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
      unifiedElements: document.querySelectorAll('[data-animation]').length,
      initializedElements: document.querySelectorAll('.aos-init').length,
      animatedElements: document.querySelectorAll('.aos-animate').length,
      onScrollElements: document.querySelectorAll('.animate-on-scroll').length,
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

    // Handle unified animations
    if (element.hasAttribute('data-animation')) {
      this.triggerUnifiedAnimation(element as HTMLElement);
      return;
    }

    // Handle legacy AOS animations
    element.classList.add('aos-animate');
  }

  /**
   * Reset animation for an element
   */
  resetAnimation(element: Element): void {
    element.classList.remove('aos-animate', 'aos-init');
    
    // Remove unified animation classes
    const animation = element.getAttribute('data-animation');
    if (animation) {
      element.classList.remove(`animate-${animation}`);
    }
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

