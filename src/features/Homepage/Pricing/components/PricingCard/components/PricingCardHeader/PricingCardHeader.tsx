/**
 * PricingCardHeader Component
 * 
 * Extracted from the main Pricing component to handle all header display logic
 * including popular badge, plan badge, plan name with gradient, description,
 * and hover hints.
 * 
 * @phase Phase 3 - Header Component Extraction
 */

import { Crown, Star } from 'lucide-react';
import React from 'react';
import { PricingCardData } from '../../types';

export interface PricingCardHeaderProps {
  /** The plan data containing header information */
  plan: PricingCardData;
  /** Whether this is the popular plan */
  isPopular: boolean;
  /** Theme variant for styling */
  variant?: string;
}

/**
 * PricingCardHeader component handles all header display logic
 * Extracted from main Pricing component while maintaining identical behavior
 */
export const PricingCardHeader: React.FC<PricingCardHeaderProps> = ({
  plan,
  isPopular,
  _variant = 'default'
}) => {
  // Determine plan name gradient colors based on plan type
  const getPlanNameGradient = () => {
    switch (plan.name) {
    case 'Basic':
      return plan.titleTextColors;
    case 'Elite':
      return plan.titleTextColors;
    case 'Pro':
      return 'from-purple-300 to-indigo-400';
    default:
      return plan.accentColors;
    }
  };

  // Determine plan badge styling based on plan type
  const getBadgeClasses = () => {
    if (plan.isPopular) {
      return 'text-lime-300 border border-lime-300/30 popular-badge';
    } else if (plan.name === 'Elite') {
      return 'text-purple-300 border border-purple-300/30 elite-badge';
    } else {
      return 'text-gray-300 border border-gray-600/30';
    }
  };

  // Determine whether to show hover hint
  const shouldShowHoverHint = () => {
    return plan.name === 'Pro' || plan.name === 'Basic' || plan.name === 'Elite';
  };

  return (
    <>
      {/* Popular plan badge - positioned above card */}
      {isPopular && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-lime-300 to-emerald-400 rounded-t-xl px-4 py-1 flex items-center justify-center shadow-md">
          <Star className="w-4 h-4 text-gray-900 mr-1" />
          <span className="text-xs font-bold text-gray-900">Most Popular</span>
        </div>
      )}
      
      {/* Header with gradient background */}
      <div className="pricing-header p-6 border-b border-gray-700">
        {/* Plan badge */}
        {plan.badge && (
          <div 
            className={`plan-badge px-3 py-1 rounded-full text-xs mb-4 ${getBadgeClasses()}`}
            aria-label={`${plan.badge} plan`}
          >
            {plan.isPopular && (
              <Star 
                className="w-3 h-3 mr-1 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400" 
                aria-hidden="true" 
              />
            )}
            {plan.name === 'Elite' && (
              <Crown 
                className="w-3 h-3 mr-1 text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400" 
                aria-hidden="true" 
              />
            )}
            {plan.badge}
          </div>
        )}

        {/* Plan name and icon */}
        <div className="flex items-center mb-4">
          <h3 
            className={`plan-name plan-name-gradient bg-gradient-to-r ${getPlanNameGradient()}`} 
            data-text={plan.name}
          >
            {plan.name}
          </h3>
        </div>

        {/* Plan description */}
        <p className="text-gray-100 mb-1">{plan.description}</p>

        {/* Hover hint for Pro, Basic, and Elite plans */}
        {shouldShowHoverHint() && (
          <p className="text-xs text-gray-400 mt-2 italic flex items-center">
            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-1 animate-pulse"></span>
            Hover for more details
          </p>
        )}
      </div>
    </>
  );
};

export default PricingCardHeader; 