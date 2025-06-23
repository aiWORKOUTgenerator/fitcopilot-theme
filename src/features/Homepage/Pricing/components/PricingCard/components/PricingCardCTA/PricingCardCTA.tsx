/**
 * PricingCardCTA Component
 * 
 * Handles the Call-to-Action button for pricing cards including:
 * - Plan-specific button styling and gradients
 * - Hover state text changes (Basic: "Get FREE Access", Pro: "Get Beta Price - $10/mo")
 * - Sparkles icon integration
 * - Both link and button variants
 * - Click handling with plan selection callbacks
 * 
 * Extracted from the main Pricing component to maintain separation of concerns
 * while preserving all existing functionality and visual appearance.
 * 
 * @fileoverview CTA button component for pricing cards
 * @version 1.0.0 
 * @since Phase 4 - CTA & Tooltip Integration
 */

import { Sparkles } from 'lucide-react';
import React from 'react';
import { PricingCardCTAProps } from '../../types';

/**
 * PricingCardCTA Component
 * 
 * Renders the Call-to-Action button for each pricing card with plan-specific
 * styling, hover states, and interaction handling.
 */
export const PricingCardCTA: React.FC<PricingCardCTAProps> = ({
  plan,
  _isHovered,
  tooltipStates,
  onClick,
  _variant = 'default'
}) => {
  /**
   * Get plan-specific button styling classes
   * Maintains the exact gradient and hover styling from the original implementation
   */
  const getButtonClasses = (): string => {
    const baseClasses = 'w-full flex items-center justify-center rounded-lg px-4 py-3 font-medium transition-all duration-300';
    
    switch (plan.name) {
    case 'Basic':
      return `${baseClasses} bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-md hover:shadow-blue-500/20 active:from-blue-600 active:to-indigo-700`;
    case 'Pro':
      return `${baseClasses} bg-gradient-to-r from-lime-400 to-emerald-500 text-gray-900 hover:shadow-md hover:shadow-lime-500/20 active:from-lime-500 active:to-emerald-600`;
    case 'Elite':
      return `${baseClasses} bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-md hover:shadow-purple-500/20 active:from-purple-600 active:to-indigo-700`;
    default:
      return `${baseClasses} bg-gray-700 text-white hover:bg-gray-600`;
    }
  };

  /**
   * Get the appropriate button text based on plan and hover state
   * Maintains the dynamic text changing behavior from the original
   */
  const getButtonText = (): string => {
    switch (plan.name) {
    case 'Basic':
      return tooltipStates.isBasicCardHovered ? 'Get FREE Access' : plan.ctaText;
    case 'Pro':
      return tooltipStates.isProCardHovered ? 'Get Beta Price - $10/mo' : 'Get Started';
    default:
      return plan.isPopular ? 'Get Started' : (plan.ctaText || 'Get Started');
    }
  };

  /**
   * Determine if Sparkles icon should be shown
   * Maintains the original icon display logic
   */
  const shouldShowSparkles = (): boolean => {
    return plan.name === 'Basic' && tooltipStates.isBasicCardHovered ||
           plan.name === 'Pro' ||
           plan.isPopular;
  };

  /**
   * Get the appropriate Sparkles icon color based on plan
   */
  const getSparklesColor = (): string => {
    switch (plan.name) {
    case 'Basic':
      return 'text-blue-300';
    case 'Pro':
      return 'text-lime-300';
    default:
      return '';
    }
  };

  /**
   * Common button content renderer
   * Encapsulates the button text and icon logic
   */
  const renderButtonContent = () => (
    <>
      <span>{getButtonText()}</span>
      {shouldShowSparkles() && (
        <Sparkles 
          className={`w-4 h-4 ml-2 ${getSparklesColor()}`} 
          aria-hidden="true" 
        />
      )}
    </>
  );

  // If the plan has a link, render as an anchor element
  if (plan.ctaLink) {
    return (
      <a 
        href={plan.ctaLink}
        className={getButtonClasses()}
        onClick={onClick}
        role="button"
        aria-label={`Select ${plan.name} plan - ${getButtonText()}`}
      >
        {renderButtonContent()}
      </a>
    );
  }

  // Otherwise render as a button element
  return (
    <button 
      className={getButtonClasses()}
      onClick={onClick}
      type="button"
      aria-label={`Select ${plan.name} plan - ${getButtonText()}`}
    >
      {renderButtonContent()}
    </button>
  );
};

export default PricingCardCTA; 