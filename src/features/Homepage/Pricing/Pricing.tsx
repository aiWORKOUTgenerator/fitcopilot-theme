/**
 * @fileoverview Optimized Pricing Component for AI Workout Generator
 * 
 * This component displays pricing plans with advanced animations, tooltips, and interactive features.
 * Optimized for performance with React hooks (useCallback, useMemo) and efficient state management.
 * 
 * Key Features:
 * - Animated pricing transitions for Basic and Pro plans
 * - Interactive hover tooltips with beta pricing information
 * - Responsive design with mobile-first approach
 * - Accessibility features (ARIA labels, screen reader support)
 * - Performance optimizations (memoization, efficient re-renders)
 * - Direct anchor link support (#pricing)
 * 
 * Performance Optimizations:
 * - Consolidated state management to reduce re-renders
 * - useCallback for event handlers and animation functions
 * - useMemo for expensive computations (plans data, particles)
 * - Optimized particle system with reduced count and efficient rendering
 * - Constants for animation timings to improve maintainability
 * 
 * @version 2.0.0
 * @author AI Workout Generator Team
 * @since 2024
 */

// Import React hooks with performance optimizations
import { Check, ChevronDown, ChevronUp, Clock, Crown, Shield, Sparkles, Star, Users } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { GlobalVariantKey } from '../types/shared';
import './Pricing.scss';
import { PricingProps } from './types';
import { mapPlanToGradient } from './utils/themeUtils';

// Type definitions for better TypeScript support
interface PlanFeature {
  text: string;
  isHighlighted?: boolean;
  tooltip?: string;
}

interface Plan {
  name: string;
  price: string;
  betaPrice?: string;
  description: string;
  features: PlanFeature[];
  isPopular: boolean;
  accentColors: string;
  titleTextColors: string;
  priceTextColors: string;
  accentTextColor: string;
  icon: React.ReactNode;
  badge?: string;
  ctaText: string;
  ctaLink?: string;
}

// Animation state type for better type safety
type AnimationState = 'normal' | 'exploding' | 'transitioning' | 'betaPrice';

// Constants for better maintainability
const ANIMATION_TIMINGS = {
  PRO_EXPLODE: 2000,
  PRO_TRANSITION: 3000,
  PRO_BETA: 3500,
  PRO_RESET: 8500,
  BASIC_EXPLODE: 3000,
  BASIC_TRANSITION: 4000,
  BASIC_BETA: 4500,
  BASIC_RESET: 9500,
  HOVER_RESUME_DELAY: 300,
  ANIMATION_RESTART_DELAY: 200,
} as const;

const PARTICLE_CONFIG = {
  COUNT: 10,
  MAX_DISTANCE: 80,
  MIN_SIZE: 2,
  MAX_SIZE: 6,
} as const;

/**
 * Optimized Pricing component with improved performance and maintainability
 */
export const Pricing: React.FC<PricingProps> = ({ 
  pricing = [], 
  variant = 'default',
  showBackgroundParticles = true,
  enablePriceAnimation = true,
  onPlanSelect,
  className = '',
  headingText = 'Exclusive Pricing',
  descriptionText = 'Get early access to our AI-powered fitness platform and help shape its future with your valuable feedback.'
}) => {
  // Access theme context safely
  let currentTheme: GlobalVariantKey = variant;
  try {
    const themeContext = useTheme();
    if (themeContext && themeContext.theme) {
      // Map theme context values to GlobalVariantKey, filtering out unsupported values
      const supportedThemes: GlobalVariantKey[] = ['default', 'gym', 'sports', 'wellness', 'modern', 'classic', 'minimalist', 'boutique', 'registration', 'mobile'];
      if (supportedThemes.includes(themeContext.theme as GlobalVariantKey)) {
        currentTheme = themeContext.theme as GlobalVariantKey;
      }
    }
  } catch (e) {
    console.debug('ThemeContext not available, using provided variant or default theme');
  }

  // Consolidated state management
  const [animationState, setAnimationState] = useState<AnimationState>('normal');
  const [basicAnimationState, setBasicAnimationState] = useState<AnimationState>('normal');
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});
  const [tooltipStates, setTooltipStates] = useState({
    showBetaTooltip: false,
    showEliteTooltip: false,
    isBasicCardHovered: false,
    isProCardHovered: false,
  });

  // Animation timeline references
  const timeoutsRef = useRef<number[]>([]);
  const basicTimeoutsRef = useRef<number[]>([]);

  // Optimized timeout management with useCallback
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  }, []);

  const clearAllBasicTimeouts = useCallback(() => {
    basicTimeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    basicTimeoutsRef.current = [];
  }, []);

  // Optimized animation functions with useCallback
  const createAnimationSequence = useCallback((
    setState: (state: AnimationState) => void,
    timeoutsArray: React.MutableRefObject<number[]>,
    timings: {
      PRO_EXPLODE: number;
      PRO_TRANSITION: number;
      PRO_BETA: number;
      PRO_RESET: number;
    }
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

  // Animation loop effect for price change - only if enablePriceAnimation is true
  useEffect(() => {
    if (!enablePriceAnimation) return;
    
    const cleanup = createAnimationSequence(setAnimationState, timeoutsRef, {
      PRO_EXPLODE: ANIMATION_TIMINGS.PRO_EXPLODE,
      PRO_TRANSITION: ANIMATION_TIMINGS.PRO_TRANSITION,
      PRO_BETA: ANIMATION_TIMINGS.PRO_BETA,
      PRO_RESET: ANIMATION_TIMINGS.PRO_RESET,
    });
    
    return () => {
      cleanup();
      clearAllTimeouts();
    };
  }, [createAnimationSequence, clearAllTimeouts, enablePriceAnimation]);

  // Basic card animation loop effect - runs independently with different timing
  useEffect(() => {
    if (!enablePriceAnimation) return;
    
    const cleanup = createAnimationSequence(setBasicAnimationState, basicTimeoutsRef, {
      PRO_EXPLODE: ANIMATION_TIMINGS.BASIC_EXPLODE,
      PRO_TRANSITION: ANIMATION_TIMINGS.BASIC_TRANSITION,
      PRO_BETA: ANIMATION_TIMINGS.BASIC_BETA,
      PRO_RESET: ANIMATION_TIMINGS.BASIC_RESET,
    });
    
    return () => {
      cleanup();
      clearAllBasicTimeouts();
    };
  }, [createAnimationSequence, clearAllBasicTimeouts, enablePriceAnimation]);
  
  // Optimized hover handlers with useCallback
  const handleCardMouseEnter = useCallback((planName: string) => {
    setTooltipStates(prev => {
      if (planName === 'Pro') {
        return { ...prev, showBetaTooltip: true, isProCardHovered: true };
      } else if (planName === 'Basic') {
        clearAllBasicTimeouts();
        setBasicAnimationState('betaPrice');
        return { ...prev, isBasicCardHovered: true };
      } else if (planName === 'Elite') {
        return { ...prev, showEliteTooltip: true };
      }
      return prev;
    });
  }, [clearAllBasicTimeouts]);
  
  const handleCardMouseLeave = useCallback((planName: string) => {
    setTooltipStates(prev => {
      if (planName === 'Pro') {
        return { ...prev, showBetaTooltip: false, isProCardHovered: false };
      } else if (planName === 'Basic') {
        // Resume Basic card animations after hover ends
        setTimeout(() => {
          if (!prev.isBasicCardHovered) {
            setBasicAnimationState('normal');
            setTimeout(() => {
              createAnimationSequence(
                setBasicAnimationState, 
                basicTimeoutsRef, 
                {
                  PRO_EXPLODE: ANIMATION_TIMINGS.BASIC_EXPLODE,
                  PRO_TRANSITION: ANIMATION_TIMINGS.BASIC_TRANSITION,
                  PRO_BETA: ANIMATION_TIMINGS.BASIC_BETA,
                  PRO_RESET: ANIMATION_TIMINGS.BASIC_RESET,
                }
              );
            }, ANIMATION_TIMINGS.ANIMATION_RESTART_DELAY);
          }
        }, ANIMATION_TIMINGS.HOVER_RESUME_DELAY);
        return { ...prev, isBasicCardHovered: false };
      } else if (planName === 'Elite') {
        return { ...prev, showEliteTooltip: false };
      }
      return prev;
    });
  }, [createAnimationSequence]);
  
  // Handle Pro Plan click with animation sequence
  const handleProClick = useCallback(() => {
    if (animationState === 'normal') {
      setAnimationState('exploding');
      window.setTimeout(() => {
        setAnimationState('transitioning');
        window.setTimeout(() => {
          setAnimationState('betaPrice');
      }, 500);
      }, ANIMATION_TIMINGS.ANIMATION_RESTART_DELAY);
    } else {
      setAnimationState('normal');
    }
    
    if (onPlanSelect) {
      onPlanSelect(2, 'Pro');
    }
    
    console.log('Pro plan selected');
  }, [animationState, onPlanSelect]);

  const toggleFeatures = useCallback((planName: string) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [planName]: !prev[planName]
    }));
  }, []);

  // Memoized plans data for better performance
  const plans: Plan[] = useMemo(() => {
    if (pricing.length > 0) {
      // Use WordPress data if available, adapted to our interface
      return pricing.map(plan => ({
        name: plan.name,
        price: plan.price,
        betaPrice: plan.betaPrice,
        description: plan.description,
        features: plan.features.map(feature => ({
          text: feature.text,
          isHighlighted: feature.isHighlighted,
          tooltip: feature.tooltip
        })),
        isPopular: plan.popular || false,
        accentColors: plan.accentColors || mapPlanToGradient(plan.name),
        titleTextColors: plan.titleTextColors || mapPlanToGradient(plan.name),
        priceTextColors: plan.priceTextColors || mapPlanToGradient(plan.name),
        accentTextColor: plan.accentTextColor || 'lime-300',
        icon: null,
        badge: plan.badge,
        ctaText: plan.ctaText,
        ctaLink: plan.ctaLink
      }));
    }
    
    // Default plans data
    return [
      {
      name: 'Basic',
        price: '$9.99',
        betaPrice: 'FREE',
        description: 'Perfect for beginners starting their fitness journey',
        icon: null,
        accentColors: 'from-blue-300 to-cyan-400',
        titleTextColors: 'from-lime-300 to-emerald-400',
        priceTextColors: 'from-lime-300 to-emerald-400',
        accentTextColor: 'blue-300',
        badge: 'Starter',
        ctaText: 'Get Started',
        ctaLink: 'https://buy.stripe.com/aEU005dBndUQ2D68wI',
      features: [
          { text: 'AI-generated workouts', isHighlighted: true },
          { text: 'Enhanced Fitness Profile' },
          { text: 'Multiple Output Formats' },
          { text: 'Email support' },
          { text: '5 saved workout plans/mo' },
        ],
        isPopular: false
      },
      {
      name: 'Pro',
        price: '$19.99',
        betaPrice: '$10',
        description: 'Our most popular plan for serious fitness enthusiasts',
        icon: null,
        accentColors: 'from-lime-300 to-emerald-400',
        titleTextColors: 'from-purple-300 to-indigo-400',
        priceTextColors: 'from-purple-300 to-indigo-400',
        accentTextColor: 'lime-300',
        badge: 'Most Popular',
        ctaText: 'Try Pro Plan',
        ctaLink: 'https://buy.stripe.com/aEU005dBndUQ2D68wI',
      features: [
          { text: 'Everything in Basic', isHighlighted: true },
          { text: 'Advanced workout tracking', isHighlighted: true },
          { text: 'Full equipment customization' },
          { text: '(Coming Soon) Progress analytics dashboard' },
          { text: 'Unlimited saved workout plans' },
          { text: '(Coming Soon) Edit your saved workout plans' },
          { text: '(Coming Soon) AI Adaptive Plan Progression' },
          { text: 'Multiple Output Formats' },
          { text: 'Priority support' },
          { text: '100 saved workout plans/mo' },
          { text: 'Earlybird beta feature access' },
          { text: 'Provide direct feedback to our development team', tooltip: 'Help shape the future of AI Workout Generator' }
        ],
        isPopular: true
      },
      {
      name: 'Elite',
        price: '$99.99',
        description: 'Maximize Your Potential with Expert Coaches & AI Mastery',
        icon: null,
      accentColors: 'from-purple-300 to-indigo-400',
      titleTextColors: 'from-lime-300 to-emerald-400',
      priceTextColors: 'from-lime-300 to-emerald-400',
      accentTextColor: 'purple-300',
        badge: 'Premium',
        ctaText: 'Go Elite',
        ctaLink: 'https://buy.stripe.com/aEU28d0OB04091u3cs',
        features: [
          { text: 'Everything in Pro', isHighlighted: true },
          { text: 'Live coaching sessions', isHighlighted: true },
          { text: 'Advanced AI programming' },
          { text: 'Personalized nutrition guidance' },
          { text: '(Coming Soon) Advanced analytics and reports' },
          { text: 'Video form checks & feedback' },
          { text: 'Dedicated trainer support' },
          { text: 'Customized workout plan design' },
          { text: 'Direct email: trainers@aiworkoutgenerator.com' }
        ],
        isPopular: false
      }
    ];
  }, [pricing, currentTheme]);

  // Optimized particle rendering with useMemo
  const renderExplosionParticles = useMemo(() => {
    const particles = [];
    
    for (let i = 0; i < PARTICLE_CONFIG.COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * PARTICLE_CONFIG.MAX_DISTANCE;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = Math.random() * (PARTICLE_CONFIG.MAX_SIZE - PARTICLE_CONFIG.MIN_SIZE) + PARTICLE_CONFIG.MIN_SIZE;
      
      particles.push(
        <div 
          key={i}
          className="price-particle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: '50%',
            top: '50%',
            opacity: 0,
            transform: 'translate(-50%, -50%)',
            '--tx': `${x}px`,
            '--ty': `${y}px`
          } as React.CSSProperties}
        />
      );
    }
    
    return particles;
  }, []);

  return (
    <section 
      id="pricing" 
      className={`pricing-section w-full py-24 px-4 bg-gray-900 relative overflow-hidden ${className}`}
      data-theme={currentTheme !== 'default' ? currentTheme : undefined}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern" aria-hidden="true" />
      
      {/* Floating particles in background - OPTIMIZED */}
      {showBackgroundParticles && (
        <div className="price-particles pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="price-particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${Math.random() * 8 + 10}s`
        }}
      />
          ))}
      </div>
      )}
      
      <div className="max-w-6xl mx-auto relative z-10 text-sharp">
        <div className="text-center mb-12 md:mb-16 pricing-header" data-aos="fade-up">
          <span className="text-xs font-bold tracking-widest uppercase text-lime-300 mb-2 block">Pricing Options</span>
          <h2 id="pricing-heading" className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-white">
            <span className="bg-gradient-to-r from-lime-300 to-emerald-400 text-transparent bg-clip-text text-gradient" data-text={headingText}>
              {headingText}
            </span> for Beta Users
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto lead">
            {descriptionText}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-y-16 gap-x-4 md:gap-x-8" data-aos="fade-up" data-aos-delay="200" role="list">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`pricing-card relative rounded-2xl backdrop-blur-lg border transition-all duration-500 flex flex-col h-full overflow-visible ${
                plan.name === 'Basic' 
                  ? 'pricing-card--basic border-blue-300/40 shadow-optimized-blue transform md:-translate-y-4 md:scale-105 z-10'
                : plan.name === 'Pro'
                  ? 'pricing-card--pro border-lime-300/40 shadow-optimized-lime transform md:-translate-y-4 md:scale-105 z-10 cursor-pointer'
                : plan.name === 'Elite'
                  ? 'pricing-card--elite border-purple-300/40 shadow-optimized-purple transform md:-translate-y-4 md:scale-105 z-10 cursor-pointer'
                : 'pricing-card--default border-gray-700 hover:border-gray-600'
              }`}
              data-aos="fade-up" 
              data-aos-delay={index * 100 + 300}
              data-plan={plan.name.toLowerCase()}
              role="listitem"
              aria-label={`${plan.name} plan`}
              onMouseEnter={() => handleCardMouseEnter(plan.name)}
              onMouseLeave={() => handleCardMouseLeave(plan.name)}
            >
              {/* Popular plan badge */}
              {plan.isPopular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-lime-300 to-emerald-400 rounded-t-xl px-4 py-1 flex items-center justify-center shadow-md">
                  <Star className="w-4 h-4 text-gray-900 mr-1" />
                  <span className="text-xs font-bold text-gray-900">Most Popular</span>
                </div>
              )}
              
              {/* Header with gradient background */}
              <div className={`pricing-header p-6 border-b border-gray-700`}>
                {/* Plan badge */}
                {plan.badge && (
                  <div 
                    className={`plan-badge px-3 py-1 rounded-full text-xs mb-4 ${
                      plan.isPopular 
                        ? 'bg-gray-700/50 text-lime-300 border border-lime-300/30 popular-badge' 
                        : plan.name === 'Elite' 
                          ? 'bg-gray-700/50 text-purple-300 border border-purple-300/30 elite-badge'
                          : 'bg-gray-700/50 text-gray-300 border border-gray-600/30'
                    }`}
                    aria-label={`${plan.badge} plan`}
                  >
                    {plan.isPopular && <Star className="w-3 h-3 mr-1 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400" aria-hidden="true" />}
                    {plan.name === 'Elite' && <Crown className="w-3 h-3 mr-1 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400" aria-hidden="true" />}
                    {plan.badge}
                  </div>
                )}

                {/* Plan name and icon */}
                <div className="flex items-center mb-4">
                  <h3 className={`plan-name plan-name-gradient bg-gradient-to-r ${
                    plan.name === 'Basic' ? plan.titleTextColors : 
                    plan.name === 'Elite' ? plan.titleTextColors : 
                    plan.name === 'Pro' ? 'from-purple-300 to-indigo-400' : 
                    plan.accentColors
                  }`} data-text={plan.name}>{plan.name}</h3>
                </div>

                {/* Plan price */}
                <div className="mb-4">
                  {plan.isPopular ? (
                    // Animated price for Pro plan
                    <div className="min-h-16 flex items-end" aria-live="polite">
                      {animationState === 'normal' && (
                        <div className="flex items-end">
                          <span className={`price price-gradient bg-gradient-to-r from-purple-300 to-indigo-400`} data-text={plan.price}>
                            {plan.price}
                          </span>
                          <span className="text-white ml-2 mb-1 font-medium">/ month</span>
                        </div>
                      )}

                      {animationState === 'exploding' && (
                        <div className="relative flex items-end">
                          <span className="price price-gradient bg-gradient-to-r from-purple-300 to-indigo-400 price-shake price-flash" data-text={plan.price}>
                            {plan.price}
                          </span>
                          <span className="text-white ml-2 mb-1 font-medium">/ month</span>
                          <div className="absolute inset-0 flex items-center justify-start overflow-visible" aria-hidden="true">
                            {renderExplosionParticles}
                          </div>
                        </div>
                      )}

                      {animationState === 'transitioning' && (
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="text-xl text-white line-through mr-2 price-fade-out" aria-label="Regular price:">{plan.price}</span>
                          </div>
                          <div className="h-10"></div>
                        </div>
                      )}

                      {animationState === 'betaPrice' && (
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="text-xl text-white line-through mr-2" aria-label="Regular price:">{plan.price}</span>
                            <span className="beta-badge bg-gray-700/50 text-lime-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-lime-300/30 price-fade-in">Beta Offer</span>
                          </div>
                          <div className="flex items-end">
                            <span className={`price price-gradient bg-gradient-to-r from-purple-300 to-indigo-400 price-zoom-in`} data-text={plan.betaPrice} aria-label="Special beta price:">
                              {plan.betaPrice}
                            </span>
                            <span className="text-white ml-2 mb-1 font-medium price-fade-in">/ month</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : plan.name === 'Basic' ? (
                    // Animated price for Basic plan with auto-looping animation
                    <div className="min-h-16 flex items-end" aria-live="polite">
                      {basicAnimationState === 'normal' && (
                        <div className="flex items-end">
                          <span className={`price price-gradient bg-gradient-to-r from-blue-300 to-cyan-400`} data-text={plan.price}>
                            {plan.price}
                          </span>
                          <span className="text-white ml-2 mb-1 font-medium">/ month</span>
                        </div>
                      )}
                      
                      {basicAnimationState === 'exploding' && (
                        <div className="relative flex items-end">
                          <span className="price price-gradient bg-gradient-to-r from-blue-300 to-cyan-400 price-shake price-flash" data-text={plan.price}>
                            {plan.price}
                          </span>
                          <span className="text-white ml-2 mb-1 font-medium">/ month</span>
                          <div className="absolute inset-0 flex items-center justify-start overflow-visible" aria-hidden="true">
                            {renderExplosionParticles}
                          </div>
                        </div>
                      )}
                      
                      {basicAnimationState === 'transitioning' && (
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="text-xl text-white line-through mr-2 price-fade-out" aria-label="Regular price:">{plan.price}</span>
                          </div>
                          <div className="h-10"></div>
                        </div>
                      )}
                      
                      {basicAnimationState === 'betaPrice' && (
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="text-xl text-white line-through mr-2" aria-label="Regular price:">{plan.price}</span>
                            <span className="beta-badge bg-gray-700/50 text-blue-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-blue-300/30 price-fade-in">Beta Special</span>
                          </div>
                          <div className="flex items-end">
                            <span className={`price price-gradient bg-gradient-to-r from-blue-300 to-cyan-400 price-zoom-in`} data-text={plan.betaPrice} aria-label="Special beta price:">
                              {plan.betaPrice}
                            </span>
                            <span className="text-white ml-2 mb-1 font-medium price-fade-in">access</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular price for Elite plan
                    <div className="flex items-end">
                      <span className={`price price-gradient bg-gradient-to-r ${
                        plan.name === 'Elite' ? plan.priceTextColors : 
                        plan.accentColors
                      }`} data-text={plan.price}>
                        {plan.price}
                      </span>
                      <span className="text-white ml-2 mb-1 font-medium">/ month</span>
                    </div>
                  )}
                </div>

                {/* Plan description */}
                <p className="text-gray-100 mb-1">{plan.description}</p>

                {/* Hover hint for Pro, Basic, and Elite plans */}
                {(plan.name === 'Pro' || plan.name === 'Basic' || plan.name === 'Elite') && (
                  <p className="text-xs text-gray-400 mt-2 italic flex items-center">
                    <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-1 animate-pulse"></span>
                    Hover for more details
                  </p>
                )}
              </div>

              {/* Plan features */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold text-white">Features</h4>
                    <button
                      className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                      onClick={() => toggleFeatures(plan.name)}
                      aria-label={expandedFeatures[plan.name] ? "Show fewer features" : "Show all features"}
                      aria-expanded={expandedFeatures[plan.name]}
                    >
                      {expandedFeatures[plan.name] ?
                        <ChevronUp size={20} aria-hidden="true" /> :
                        <ChevronDown size={20} aria-hidden="true" />
                      }
                    </button>
                </div>

                <ul className="space-y-3 mb-6 flex-grow" role="list" aria-label="Plan features">
                  {plan.features.slice(0, expandedFeatures[plan.name] ? plan.features.length : Math.min(5, plan.features.length)).map((feature, i) => (
                    <li 
                      key={i} 
                      className={`flex items-start transition-all duration-300 ${
                        i >= 5 ? 'animate-fade-in' : ''
                      }`}
                    >
                      <Check className={`feature-icon w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400`} 
                      aria-hidden="true" 
                      />
                      <span className={`${feature.isHighlighted ? 'text-white font-medium feature-text highlighted' : 'text-gray-400 feature-text'} group relative`}>
                        {feature.text}
                        
                        {feature.tooltip && (
                          <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-800 rounded-md shadow-optimized text-xs text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                            role="tooltip"
                          >
                            {feature.tooltip}
                            <div className="absolute top-full left-4 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                          </div>
                        )}
                          </span>
                      </li>
                    ))}
                  
                  {!expandedFeatures[plan.name] && plan.features.length > 5 && (
                    <li className="text-xs text-gray-500 pl-8 italic small">
                      + {plan.features.length - 5} more features
                    </li>
                  )}
                </ul>

                {/* CTA button - updated for better touch targets */}
                <div className="pt-4 mt-auto relative">
                  {/* Pro Plan Tooltip - Moved here to position above CTA */}
                  {plan.name === 'Pro' && (
                    <div 
                      className={`plan-tooltip-cta ${
                        tooltipStates.showBetaTooltip ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                      }`}
                      role="tooltip"
                      id="pro-tooltip"
                      aria-hidden={!tooltipStates.showBetaTooltip}
                    >
                      <div className="flex items-start mb-2">
                        <Shield className="w-5 h-5 text-lime-300 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <h5 className="font-medium text-lime-300 text-sm">Beta Release Offer</h5>
                          <p className="text-xs text-gray-300 small">
                            Provide feedback directly to our development team and help shape the future of AI Workout Generator.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Elite Plan Tooltip - Moved here to position above CTA */}
                  {plan.name === 'Elite' && (
                    <div 
                      className={`plan-tooltip-cta ${
                        tooltipStates.showEliteTooltip ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                      }`}
                      role="tooltip"
                      id="elite-tooltip"
                      aria-hidden={!tooltipStates.showEliteTooltip}
                    >
                      <div className="flex items-start mb-2">
                        <Users className="w-5 h-5 text-purple-300 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <h5 className="font-medium text-purple-300 text-sm">Certified Trainers</h5>
                          <p className="text-xs text-gray-300 small">
                            Work with real certified trainers who will optimize your plan using both their fitness expertise and AI tools.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {plan.ctaLink ? (
                    <a 
                    href={plan.ctaLink}
                      className={`w-full flex items-center justify-center rounded-lg px-4 py-3 font-medium transition-all duration-300 ${
                        plan.name === 'Basic' 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md hover:shadow-blue-500/20 active:from-blue-600 active:to-indigo-700' 
                        : plan.name === 'Pro'
                          ? 'bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 hover:shadow-md hover:shadow-lime-500/20 active:from-lime-500 active:to-emerald-600' 
                        : plan.name === 'Elite'
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-md hover:shadow-purple-500/20 active:from-purple-600 active:to-indigo-700' 
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                      onClick={() => {
                        if (onPlanSelect) {
                          onPlanSelect(index + 1, plan.name);
                        }
                      }}
                    >
                      {plan.name === 'Basic' ? (
                        <>
                          <span>{tooltipStates.isBasicCardHovered ? 'Get FREE Access' : plan.ctaText}</span>
                          {tooltipStates.isBasicCardHovered && <Sparkles className="w-4 h-4 ml-2 text-blue-300" aria-hidden="true" />}
                        </>
                      ) : plan.name === 'Pro' ? (
                        <>
                          <span>{tooltipStates.isProCardHovered ? 'Get Beta Price - $10/mo' : 'Get Started'}</span>
                          <Sparkles className="w-4 h-4 ml-2 text-lime-300" aria-hidden="true" />
                        </>
                      ) : plan.isPopular ? (
                        <>
                          <span>Get Started</span>
                          <Sparkles className="w-4 h-4 ml-2" aria-hidden="true" />
                        </>
                      ) : (
                        <span>Get Started</span>
                      )}
                    </a>
                  ) : (
                  <button 
                    className={`w-full flex items-center justify-center rounded-lg px-4 py-3 font-medium transition-all duration-300 ${
                      plan.name === 'Basic' 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md hover:shadow-blue-500/20 active:from-blue-600 active:to-indigo-700' 
                        : plan.name === 'Pro'
                          ? 'bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 hover:shadow-md hover:shadow-lime-500/20 active:from-lime-500 active:to-emerald-600' 
                        : plan.name === 'Elite'
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-md hover:shadow-purple-500/20 active:from-purple-600 active:to-indigo-700' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                    onClick={plan.isPopular ? handleProClick : () => {
                      if (onPlanSelect) {
                        onPlanSelect(index + 1, plan.name);
                      }
                    }}
                  >
                      {plan.name === 'Basic' ? (
                        <>
                          <span>{tooltipStates.isBasicCardHovered ? 'Get FREE Access' : plan.ctaText}</span>
                          {tooltipStates.isBasicCardHovered && <Sparkles className="w-4 h-4 ml-2 text-blue-300" aria-hidden="true" />}
                        </>
                      ) : plan.name === 'Pro' ? (
                        <>
                          <span>{tooltipStates.isProCardHovered ? 'Get Beta Price - $10/mo' : 'Get Started'}</span>
                          <Sparkles className="w-4 h-4 ml-2 text-lime-300" aria-hidden="true" />
                        </>
                      ) : plan.isPopular ? (
                      <>
                        <span>Get Started</span>
                        <Sparkles className="w-4 h-4 ml-2" aria-hidden="true" />
                      </>
                    ) : (
                      <span>Get Started</span>
                    )}
                  </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="500">
          <div className="inline-flex items-center px-6 py-3 rounded-xl bg-gray-800/70 border border-gray-700">
            <Clock className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400 mr-3" aria-hidden="true" />
            <span className="text-gray-300">Limited time <span className="text-white font-medium">beta pricing</span> available during our launch phase.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 