/**
 * PricingCardPrice Component
 * 
 * Extracted from the main Pricing component to handle all price display logic
 * including animations for Pro and Basic plans, explosion particles, and
 * responsive pricing states.
 * 
 * @phase Phase 2 - Price Component Extraction
 */

import React, { useMemo } from 'react';
import { PARTICLE_CONFIG } from '../../constants';
import { AnimationState, PricingCardData } from '../../types';

export interface PricingCardPriceProps {
  /** The plan data containing price information */
  plan: PricingCardData;
  /** Current animation state for this plan */
  animationState: AnimationState;
  /** Whether this card is currently being hovered */
  isHovered: boolean;
  /** Function to render explosion particles */
  renderExplosionParticles?: () => React.ReactNode;
  /** Plan type for determining animation behavior */
  planType: 'pro' | 'basic' | 'elite' | 'default';
}

/**
 * Generates explosion particles for price animation effects
 * Extracted from the main Pricing component's useMemo hook
 */
const useExplosionParticles = () => {
  return useMemo(() => {
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
};

/**
 * PricingCardPrice component handles all price display logic
 * Extracted from main Pricing component while maintaining identical behavior
 */
export const PricingCardPrice: React.FC<PricingCardPriceProps> = ({
  plan,
  animationState,
  isHovered,
  renderExplosionParticles,
  planType
}) => {
  // Generate explosion particles for this component instance
  const explosionParticles = useExplosionParticles();

  // Determine the appropriate gradient classes based on plan type
  const getPriceGradient = () => {
    switch (planType) {
      case 'pro':
        return 'from-purple-300 to-indigo-400';
      case 'basic':
        return 'from-blue-300 to-cyan-400';
      case 'elite':
        return plan.priceTextColors;
      default:
        return plan.accentColors;
    }
  };

  // Determine the appropriate beta badge styling
  const getBetaBadgeClass = () => {
    switch (planType) {
      case 'pro':
        return 'text-lime-300 border-lime-300/30';
      case 'basic':
        return 'text-blue-300 border-blue-300/30';
      default:
        return 'text-gray-300 border-gray-300/30';
    }
  };

  // Determine the beta badge text
  const getBetaBadgeText = () => {
    switch (planType) {
      case 'pro':
        return 'Beta Offer';
      case 'basic':
        return 'Beta Special';
      default:
        return 'Special Offer';
    }
  };

  // Handle animated price display for Pro and Basic plans
  if (planType === 'pro' || planType === 'basic') {
    return (
      <div className="mb-4">
        <div className="min-h-16 flex items-end" aria-live="polite">
          {/* Normal state - regular price display */}
          {animationState === 'normal' && (
            <div className="flex items-end">
              <span 
                className={`price price-gradient bg-gradient-to-r ${getPriceGradient()}`} 
                data-text={plan.price}
              >
                {plan.price}
              </span>
              <span className="text-white ml-2 mb-1 font-medium">/ month</span>
            </div>
          )}

          {/* Exploding state - price shaking with particles */}
          {animationState === 'exploding' && (
            <div className="relative flex items-end">
              <span 
                className={`price price-gradient bg-gradient-to-r ${getPriceGradient()} price-shake price-flash`} 
                data-text={plan.price}
              >
                {plan.price}
              </span>
              <span className="text-white ml-2 mb-1 font-medium">/ month</span>
              <div className="absolute inset-0 flex items-center justify-start overflow-visible" aria-hidden="true">
                {renderExplosionParticles?.() || explosionParticles}
              </div>
            </div>
          )}

          {/* Transitioning state - price fading out */}
          {animationState === 'transitioning' && (
            <div className="flex flex-col">
              <div className="flex items-center">
                <span 
                  className="text-xl text-white line-through mr-2 price-fade-out" 
                  aria-label="Regular price:"
                >
                  {plan.price}
                </span>
              </div>
              <div className="h-10"></div>
            </div>
          )}

          {/* Beta price state - showing special pricing */}
          {animationState === 'betaPrice' && (
            <div className="flex flex-col">
              <div className="flex items-center">
                <span 
                  className="text-xl text-white line-through mr-2" 
                  aria-label="Regular price:"
                >
                  {plan.price}
                </span>
                <span 
                  className={`beta-badge text-xs px-2 py-0.5 rounded-full font-semibold border ${getBetaBadgeClass()} price-fade-in`}
                >
                  {getBetaBadgeText()}
                </span>
              </div>
              <div className="flex items-end">
                <span 
                  className={`price price-gradient bg-gradient-to-r ${getPriceGradient()} price-zoom-in`} 
                  data-text={plan.betaPrice} 
                  aria-label="Special beta price:"
                >
                  {plan.betaPrice}
                </span>
                <span className="text-white ml-2 mb-1 font-medium price-fade-in">
                  {planType === 'basic' ? 'access' : '/ month'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Static price display for Elite and other plans
  return (
    <div className="mb-4">
      <div className="flex items-end">
        <span 
          className={`price price-gradient bg-gradient-to-r ${getPriceGradient()}`} 
          data-text={plan.price}
        >
          {plan.price}
        </span>
        <span className="text-white ml-2 mb-1 font-medium">/ month</span>
      </div>
    </div>
  );
};

export default PricingCardPrice; 