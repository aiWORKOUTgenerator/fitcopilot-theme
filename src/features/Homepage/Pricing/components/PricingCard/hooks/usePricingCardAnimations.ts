/**
 * usePricingCardAnimations hook
 * 
 * Extracted animation logic from the main Pricing component to handle
 * pricing card animation sequences for Pro and Basic plans.
 * 
 * @phase Phase 2 - Animation Hook Extraction
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ANIMATION_TIMINGS, BASIC_ANIMATION_TIMINGS, INTERACTION_TIMINGS, PARTICLE_CONFIG } from '../constants';
import { AnimationState } from '../types';

/**
 * Return type for the pricing card animations hook
 */
export interface PricingCardAnimationHook {
  /** Current animation state */
  animationState: AnimationState;
  /** Whether the card is currently hovered */
  isHovered: boolean;
  /** Function to handle mouse enter events */
  handleMouseEnter: () => void;
  /** Function to handle mouse leave events */
  handleMouseLeave: () => void;
  /** Function to render explosion particles */
  renderExplosionParticles: () => React.ReactNode;
}

/**
 * Configuration options for the animation hook
 */
interface AnimationConfig {
  /** Whether animations are enabled */
  enableAnimation: boolean;
  /** Plan type for determining animation behavior */
  planType: 'pro' | 'basic' | 'elite' | 'default';
  /** Initial animation state */
  initialState?: AnimationState;
}

/**
 * Custom hook for managing pricing card animations
 * 
 * @param planName - Name of the plan (for identification)
 * @param config - Animation configuration options
 * @returns Animation state and control functions
 */
export const usePricingCardAnimations = (
  planName: string,
  config: AnimationConfig
): PricingCardAnimationHook => {
  const { enableAnimation, planType, initialState = 'normal' } = config;

  // Animation state management
  const [animationState, setAnimationState] = useState<AnimationState>(initialState);
  const [isHovered, setIsHovered] = useState(false);

  // Animation timeline references for cleanup
  const timeoutsRef = useRef<number[]>([]);

  // Optimized timeout management with useCallback
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  }, []);

  // Animation sequence creator - extracted from main Pricing component
  const createAnimationSequence = useCallback((
    setState: (state: AnimationState) => void,
    timeoutsArray: React.MutableRefObject<number[]>,
    timings: typeof ANIMATION_TIMINGS
  ) => {
    const startAnimation = () => {
      setState('normal');
      
      const explodeTimer = window.setTimeout(() => setState('exploding'), timings.PRO_EXPLODE);
      const prepTransitionTimer = window.setTimeout(() => setState('transitioning'), timings.PRO_TRANSITION);
      const betaPriceTimer = window.setTimeout(() => setState('betaPrice'), timings.PRO_BETA);
      const resetTimer = window.setTimeout(() => startAnimation(), timings.PRO_RESET);
      
      timeoutsArray.current.push(explodeTimer, prepTransitionTimer, betaPriceTimer, resetTimer);
      
      return () => {
        clearTimeout(explodeTimer);
        clearTimeout(prepTransitionTimer);
        clearTimeout(betaPriceTimer);
        clearTimeout(resetTimer);
      };
    };
    
    return startAnimation();
  }, []);

  // Start animation loop for Pro and Basic plans
  useEffect(() => {
    if (!enableAnimation || (planType !== 'pro' && planType !== 'basic')) {
      return;
    }
    
    // Select appropriate timing based on plan type
    const timings = planType === 'basic' ? BASIC_ANIMATION_TIMINGS : ANIMATION_TIMINGS;
    
    const cleanup = createAnimationSequence(setAnimationState, timeoutsRef, timings);
    
    return () => {
      cleanup();
      clearAllTimeouts();
    };
  }, [enableAnimation, planType, createAnimationSequence, clearAllTimeouts]);

  // Mouse enter handler - extracted and simplified from main component
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    // For Basic plan, pause animation and show beta price immediately
    if (planType === 'basic') {
      clearAllTimeouts();
      setAnimationState('betaPrice');
    }
    
    // For other plans, just set hover state (tooltip logic handled by parent)
  }, [planType, clearAllTimeouts]);

  // Mouse leave handler - extracted and simplified from main component  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    
    // For Basic plan, resume animations after hover ends
    if (planType === 'basic') {
      setTimeout(() => {
        setAnimationState('normal');
        setTimeout(() => {
          createAnimationSequence(setAnimationState, timeoutsRef, BASIC_ANIMATION_TIMINGS);
        }, INTERACTION_TIMINGS.ANIMATION_RESTART_DELAY);
      }, INTERACTION_TIMINGS.HOVER_RESUME_DELAY);
    }
  }, [planType, createAnimationSequence]);

  // Explosion particles renderer - extracted from main component
  const renderExplosionParticles = useMemo(() => {
    return () => {
      const particles = [];
      
      for (let i = 0; i < PARTICLE_CONFIG.COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * PARTICLE_CONFIG.MAX_DISTANCE;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const size = Math.random() * (PARTICLE_CONFIG.MAX_SIZE - PARTICLE_CONFIG.MIN_SIZE) + PARTICLE_CONFIG.MIN_SIZE;
        
        particles.push(
          React.createElement('div', {
            key: i,
            className: 'price-particle',
            style: {
              width: `${size}px`,
              height: `${size}px`,
              left: '50%',
              top: '50%',
              opacity: 0,
              transform: 'translate(-50%, -50%)',
              '--tx': `${x}px`,
              '--ty': `${y}px`
            } as React.CSSProperties
          })
        );
      }
      
      return particles;
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  return {
    animationState,
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
    renderExplosionParticles,
  };
}; 