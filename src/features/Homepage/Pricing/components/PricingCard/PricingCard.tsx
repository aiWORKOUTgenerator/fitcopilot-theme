/**
 * @fileoverview Main PricingCard Component
 * 
 * Consolidated pricing card component that assembles all sub-components into a unified card.
 * This component maintains the exact same structure and behavior as the original inline implementation
 * while providing better modularity and reusability.
 * 
 * @version 5.0.0 - Phase 5: Main Component Assembly
 * @since Phase 5 - Main Component Assembly
 */

import { Crown, Star } from 'lucide-react';
import React from 'react';
import {
  PricingCardCTA,
  PricingCardFeatures,
  PricingCardPrice,
  PricingCardTooltip
} from './components';
import { PricingCardProps } from './types';

/**
 * Main PricingCard component that assembles all sub-components
 * 
 * This component maintains the exact same JSX structure and CSS classes
 * as the original inline implementation to ensure zero visual regression.
 * 
 * @param props - PricingCard component props
 * @returns JSX.Element - Rendered pricing card
 */
export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  index,
  animationState = 'normal',
  isHovered = false,
  featuresExpanded = false,
  tooltipStates = {
    showBetaTooltip: false,
    showEliteTooltip: false,
    isBasicCardHovered: false,
    isProCardHovered: false,
  },
  variant = 'default',
  onMouseEnter,
  onMouseLeave,
  onPlanSelect,
  onToggleFeatures,
  renderExplosionParticles = () => null,
  className = ''
}) => {
  /**
   * Handle card click for plan selection
   */
  const handleCardClick = () => {
    if (onPlanSelect) {
      onPlanSelect(index + 1, plan.name);
    }
  };

  /**
   * Get card CSS classes based on plan type
   * Maintains exact same classes as original implementation
   */
  const getCardClasses = () => {
    const baseClasses = 'pricing-card relative rounded-2xl border transition-all duration-500 flex flex-col h-full overflow-visible backdrop-blur-lg';
    
    if (plan.name === 'Basic') {
      return `${baseClasses} pricing-card--basic border-blue-300/40 shadow-optimized-blue transform md:-translate-y-4 md:scale-105 z-10`;
    } else if (plan.name === 'Pro') {
      return `${baseClasses} pricing-card--pro border-lime-300/40 shadow-optimized-lime transform md:-translate-y-4 md:scale-105 z-10 cursor-pointer`;
    } else if (plan.name === 'Elite') {
      return `${baseClasses} pricing-card--elite border-purple-300/40 shadow-optimized-purple transform md:-translate-y-4 md:scale-105 z-10 cursor-pointer`;
    } else {
      return `${baseClasses} pricing-card--default border-gray-700 hover:border-gray-600`;
    }
  };

  /**
   * Get plan type for components that need it
   */
  const getPlanType = (): 'pro' | 'basic' | 'elite' | 'default' => {
    return plan.name.toLowerCase() as 'pro' | 'basic' | 'elite' | 'default';
  };

  return (
    <div 
      className={`${getCardClasses()} ${className}`}
      data-aos="fade-up" 
      data-aos-delay={index * 100 + 300}
      data-plan={plan.name.toLowerCase()}
      role="listitem"
      aria-label={`${plan.name} plan`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Popular plan badge */}
      {plan.isPopular && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-lime-300 to-emerald-400 rounded-t-xl px-4 py-1 flex items-center justify-center shadow-md">
          <Star className="w-4 h-4 text-gray-900 mr-1" />
          <span className="text-xs font-bold text-gray-900">Most Popular</span>
        </div>
      )}
      
      {/* Header with complete content */}
      <div className="pricing-header p-6 border-b border-gray-700">
        {/* Plan badge */}
        {plan.badge && (
          <div 
            className={`plan-badge px-3 py-1 rounded-full text-xs mb-4 ${
              plan.isPopular 
                ? 'text-lime-300 border border-lime-300/30 popular-badge' 
                : plan.name === 'Elite' 
                  ? 'text-purple-300 border border-purple-300/30 elite-badge'
                  : 'text-gray-300 border border-gray-600/30'
            }`}
            aria-label={`${plan.badge} plan`}
          >
            {plan.isPopular && <Star className="w-3 h-3 mr-1 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400" aria-hidden="true" />}
            {plan.name === 'Elite' && <Crown className="w-3 h-3 mr-1 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400" aria-hidden="true" />}
            {plan.badge}
          </div>
        )}

        {/* Plan name */}
        <div className="flex items-center mb-4">
          <h3 className={`plan-name plan-name-gradient bg-gradient-to-r ${
            plan.name === 'Basic' ? plan.titleTextColors : 
              plan.name === 'Elite' ? plan.titleTextColors : 
                plan.name === 'Pro' ? 'from-purple-300 to-indigo-400' : 
                  plan.accentColors
          }`} data-text={plan.name}>{plan.name}</h3>
        </div>

        {/* Price section */}
        <PricingCardPrice 
          plan={plan} 
          animationState={animationState}
          isHovered={isHovered}
          renderExplosionParticles={renderExplosionParticles}
          planType={getPlanType()}
        />

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
        <PricingCardFeatures 
          features={plan.features}
          planName={plan.name}
          expanded={featuresExpanded}
          onToggleExpand={onToggleFeatures || (() => {})}
          variant={variant}
        />

        {/* CTA button and tooltips */}
        <div className="pt-4 mt-auto relative">
          {/* Pro Plan Tooltip */}
          {plan.name === 'Pro' && (
            <PricingCardTooltip
              planName={plan.name}
              visible={tooltipStates.showBetaTooltip}
              content={null} // Will use default Pro content
              type="beta"
              variant={variant}
            />
          )}
          
          {/* Elite Plan Tooltip */}
          {plan.name === 'Elite' && (
            <PricingCardTooltip
              planName={plan.name}
              visible={tooltipStates.showEliteTooltip}
              content={null} // Will use default Elite content
              type="elite"
              variant={variant}
            />
          )}

          <PricingCardCTA 
            plan={plan}
            isHovered={isHovered}
            tooltipStates={tooltipStates}
            onClick={handleCardClick}
            variant={variant}
          />
        </div>
      </div>
    </div>
  );
};

export default PricingCard; 