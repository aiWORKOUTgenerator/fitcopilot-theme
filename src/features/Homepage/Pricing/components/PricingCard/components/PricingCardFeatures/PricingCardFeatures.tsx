/**
 * PricingCardFeatures Component
 * 
 * Extracted from the main Pricing component to handle all features display logic
 * including feature list with expansion/collapse, individual feature tooltips,
 * and fade-in animations for newly revealed features.
 * 
 * Updated with professional styled check mark icons that match plan themes.
 * 
 * @phase Phase 3 - Features Component Extraction
 * @updated Pricing Card Check Marks Integration Sprint - Professional Styling
 */

import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';
import { getPlanCheckIconColor, getPlanPrimaryColor } from '../../../../utils/planColors';
import { PlanFeature } from '../../types';

export interface PricingCardFeaturesProps {
  /** List of features for this plan */
  features: PlanFeature[];
  /** Plan name for identification and color theming */
  planName: string;
  /** Whether features are currently expanded */
  expanded: boolean;
  /** Callback to toggle feature expansion */
  onToggleExpand: () => void;
  /** Theme variant for styling */
  variant?: string;
}

/**
 * PricingCardFeatures component handles all features display logic
 * Extracted from main Pricing component while maintaining identical behavior.
 * Now includes professional themed check mark icons with enhanced styling.
 */
export const PricingCardFeatures: React.FC<PricingCardFeaturesProps> = ({
  features,
  planName,
  expanded,
  onToggleExpand,
  _variant = 'default'
}) => {
  // Determine how many features to show based on expansion state
  const visibleFeatures = expanded ? features : features.slice(0, Math.min(5, features.length));
  
  // Calculate remaining features count
  const remainingFeaturesCount = features.length > 5 ? features.length - 5 : 0;

  // Get plan-specific styling
  const checkIconColor = getPlanCheckIconColor(planName);
  const primaryColor = getPlanPrimaryColor(planName);

  // Create professional styled check mark with background
  const renderStyledCheckMark = () => (
    <div className="feature-check-container relative flex-shrink-0 mr-3 mt-1">
      {/* Background circle with plan color */}
      <div 
        className={`feature-check-bg w-5 h-5 rounded-full ${
          planName === 'Basic' ? 'bg-blue-500/20 border border-blue-500/30' :
            planName === 'Pro' ? 'bg-gradient-to-br from-lime-300/20 to-emerald-400/20 border border-lime-400/30' :
              planName === 'Elite' ? 'bg-purple-500/20 border border-purple-500/30' :
                'bg-gray-500/20 border border-gray-500/30'
        } backdrop-blur-sm transition-all duration-200 group-hover:scale-110`}
        style={{
          boxShadow: `0 0 0 1px ${primaryColor}15, 0 1px 3px rgba(0,0,0,0.1)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Check 
          className={`feature-icon ${checkIconColor} transition-all duration-200`}
          size={12}
          strokeWidth={2.5}
          aria-hidden="true"
          style={{
            display: 'block',
            margin: 'auto'
          }}
        />
      </div>
      
      {/* Subtle glow effect */}
      <div 
        className={`absolute inset-0 w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          planName === 'Basic' ? 'bg-blue-500/10' :
            planName === 'Pro' ? 'bg-lime-400/10' :
              planName === 'Elite' ? 'bg-purple-500/10' :
                'bg-gray-500/10'
        }`}
        style={{
          filter: `blur(2px)`,
          background: `radial-gradient(circle, ${primaryColor}20, transparent)`
        }}
      />
    </div>
  );

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-semibold text-white">Features</h4>
        <button
          className="pricing-expand-button p-1 rounded-md text-gray-400 hover:text-white transition-colors"
          onClick={onToggleExpand}
          aria-label={expanded ? "Show fewer features" : "Show all features"}
          aria-expanded={expanded}
        >
          {expanded ? (
            <ChevronUp size={20} aria-hidden="true" />
          ) : (
            <ChevronDown size={20} aria-hidden="true" />
          )}
        </button>
      </div>

      <ul className="pricing-feature-list mb-4 flex-grow" role="list" aria-label="Plan features">
        {visibleFeatures.map((feature, i) => (
          <li 
            key={i} 
            className={`group flex items-start transition-all duration-300 ${
              i >= 5 ? 'animate-fade-in' : ''
            } ${
              i < visibleFeatures.length - 1 ? 'mb-2' : ''
            }`}
          >
            {/* Professional styled check mark */}
            {renderStyledCheckMark()}
            
            {/* Feature text content */}
            <span 
              className={`${
                feature.isHighlighted 
                  ? 'text-white font-medium feature-text highlighted' 
                  : 'text-white feature-text'
              } relative block flex-1 leading-relaxed ${
                feature.text === 'Everything in Basic' || feature.text === 'Everything in Pro'
                  ? 'gradient-text bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400' 
                  : ''
              }`}
            >
              {feature.text}
              
              {/* Individual feature tooltip */}
              {feature.tooltip && (
                <div 
                  className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-800 rounded-md shadow-optimized text-xs text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10"
                  role="tooltip"
                >
                  {feature.tooltip}
                  <div className="absolute top-full left-4 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                </div>
              )}
            </span>
          </li>
        ))}
        
        {/* Show remaining features count when collapsed */}
        {!expanded && remainingFeaturesCount > 0 && (
          <li className="text-xs text-gray-500 italic small flex items-start">
            <div className="w-5 h-5 mr-3 flex-shrink-0 mt-1" /> {/* Spacer to align with styled icons */}
            <span>+ {remainingFeaturesCount} more features</span>
          </li>
        )}
      </ul>
    </>
  );
};

export default PricingCardFeatures; 