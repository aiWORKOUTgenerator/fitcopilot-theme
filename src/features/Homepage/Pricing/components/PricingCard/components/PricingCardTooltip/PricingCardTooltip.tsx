/**
 * PricingCardTooltip Component
 * 
 * Handles the tooltip displays for pricing cards including:
 * - Beta release offer tooltip for Pro plan
 * - Certified trainers tooltip for Elite plan  
 * - Proper positioning above CTA buttons
 * - Fade in/out animations
 * - Plan-specific icons and content
 * - Accessibility support with ARIA attributes
 * 
 * Extracted from the main Pricing component to maintain separation of concerns
 * while preserving all existing functionality and visual appearance.
 * 
 * @fileoverview Tooltip component for pricing cards
 * @version 1.0.0
 * @since Phase 4 - CTA & Tooltip Integration
 */

import { Shield, Users } from 'lucide-react';
import React from 'react';
import { PricingCardTooltipProps } from '../../types';

/**
 * PricingCardTooltip Component
 * 
 * Renders plan-specific tooltips with appropriate icons, content, and styling.
 * Positioned above the CTA button to provide additional plan information on hover.
 */
export const PricingCardTooltip: React.FC<PricingCardTooltipProps> = ({
  planName,
  visible,
  content,
  type,
  _variant = 'default'
}) => {
  /**
   * Get tooltip content based on plan type
   * Maintains the exact content and structure from the original implementation
   */
  const getTooltipContent = () => {
    switch (type) {
    case 'beta':
      return (
        <div className="flex items-start mb-2">
          <Shield className="w-5 h-5 text-lime-300 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h5 className="font-medium text-lime-300 text-sm">Beta Release Offer</h5>
            <p className="text-xs text-gray-300 small">
              Provide feedback directly to our development team and help shape the future of AI Workout Generator.
            </p>
          </div>
        </div>
      );
    case 'elite':
      return (
        <div className="flex items-start mb-2">
          <Users className="w-5 h-5 text-purple-300 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h5 className="font-medium text-purple-300 text-sm">Certified Trainers</h5>
            <p className="text-xs text-gray-300 small">
              Work with real certified trainers who will optimize your plan using both their fitness expertise and AI tools.
            </p>
          </div>
        </div>
      );
    case 'basic':
      // Basic plan doesn't have a tooltip in the original implementation
      return null;
    default:
      return content;
    }
  };

  /**
   * Get tooltip ID for accessibility
   */
  const getTooltipId = (): string => {
    return `${planName.toLowerCase()}-tooltip`;
  };

  // Get the tooltip content to render
  const tooltipContent = getTooltipContent() || content;

  // Don't render if no content available
  if (!tooltipContent) {
    return null;
  }

  return (
    <div 
      className={`plan-tooltip-cta ${
        visible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
      role="tooltip"
      id={getTooltipId()}
      aria-hidden={!visible}
    >
      {tooltipContent}
    </div>
  );
};

export default PricingCardTooltip; 