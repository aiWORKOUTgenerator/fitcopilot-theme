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
import { Clock } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GlobalVariantKey } from '../types/shared';
import { PricingCard } from './components/PricingCard';
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
  // Access theme context safely - FIXED to prevent infinite loops
  const currentTheme: GlobalVariantKey = variant;

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
  const _handleProClick = useCallback(() => {
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
    
    logger.info('Pro plan selected');
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
      className={`pricing-section w-full py-24 px-4 relative overflow-hidden bg-gray-900 ${className}`}
      data-theme={currentTheme !== 'default' ? currentTheme : undefined}
    >
      {/* Background grid pattern now handled by ::before pseudo-element in CSS */}
      
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
            <PricingCard
              key={index}
              plan={plan}
              index={index}
              animationState={plan.name === 'Pro' ? animationState : 
                plan.name === 'Basic' ? basicAnimationState : 'normal'}
              isHovered={plan.name === 'Basic' ? tooltipStates.isBasicCardHovered :
                plan.name === 'Pro' ? tooltipStates.isProCardHovered : false}
              featuresExpanded={expandedFeatures[plan.name] || false}
              tooltipStates={tooltipStates}
              variant={currentTheme}
              onMouseEnter={() => handleCardMouseEnter(plan.name)}
              onMouseLeave={() => handleCardMouseLeave(plan.name)}
              onPlanSelect={onPlanSelect}
              onToggleFeatures={() => toggleFeatures(plan.name)}
              renderExplosionParticles={() => renderExplosionParticles}
            />
          ))}
        </div>
        
        <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="500">
          <div className="inline-flex items-center px-6 py-3 rounded-xl border border-gray-700" style={{ background: 'var(--pricing-card-bg)' }}>
            <Clock className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400 mr-3" aria-hidden="true" />
            <span className="text-gray-300">Limited time <span className="text-white font-medium">beta pricing</span> available during our launch phase.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 