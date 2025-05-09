import { ChevronRight } from 'lucide-react';
import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import {
  DetailedFeature,
  ExpandedContentProps,
  JourneyStepProps,
  StepCTAProps,
  VariantKey,
  isVariant
} from '../types';
// Import from utils/tokenUtils instead of redefining functions
import { getConnectorColorClass, getGlowEffectClass, getStepCTAUrl, getStepGradientClass } from '../utils/tokenUtils';
import { JourneyFeatureCard } from './index';

/**
 * Get variant-specific hover text color for step title using type narrowing
 */
const getHoverTextColor = (variant: VariantKey): string => {
  if (isVariant(variant, 'gym') ||
    isVariant(variant, 'sports') ||
    isVariant(variant, 'wellness') ||
    isVariant(variant, 'modern')) {
    return 'hover-text-journey-accent';
  }

  return 'hover-text-journey-accent';
};

/**
 * Get variant-specific expand button styling with proper type narrowing
 */
const getExpandButtonStyle = (variant: VariantKey): string => {
  if (isVariant(variant, 'gym')) {
    return 'border-lime-400/30 bg-lime-400/10 text-lime-400';
  } else if (isVariant(variant, 'sports')) {
    return 'border-cyan-400/30 bg-cyan-400/10 text-cyan-400';
  } else if (isVariant(variant, 'wellness')) {
    return 'border-violet-400/30 bg-violet-400/10 text-violet-400';
  } else if (isVariant(variant, 'modern')) {
    return 'border-amber-400/30 bg-amber-400/10 text-amber-400';
  }

  // Default
  return 'border-[#CCFF00]/30 bg-[#CCFF00]/10 text-[#CCFF00]';
};

/**
 * Returns the appropriate gradient class for the variant
 */
const getGradientClass = (variant: VariantKey): string => {
  if (isVariant(variant, 'gym')) {
    return 'journey-gradient-violet';
  } else if (isVariant(variant, 'sports')) {
    return 'journey-gradient-cyan';
  } else if (isVariant(variant, 'wellness')) {
    return 'journey-gradient-teal';
  } else if (isVariant(variant, 'modern')) {
    return 'journey-gradient-amber';
  }

  return 'journey-gradient-lime';
};

/**
 * Get the appropriate timeline color class based on step accent color
 */
const getTimelineColorClass = (accentColor?: string): string => {
  if (!accentColor) return 'timeline-lime'; // Default

  if (accentColor.includes('cyan')) {
    return 'timeline-cyan';
  } else if (accentColor.includes('violet')) {
    return 'timeline-violet';
  } else if (accentColor.includes('amber')) {
    return 'timeline-amber';
  }

  // Default to lime
  return 'timeline-lime';
};

/**
 * JourneyStep - Renders a single step in the journey process
 */
const JourneyStep: React.FC<JourneyStepProps> = ({
  step,
  index,
  isExpanded,
  onToggle,
  isLast,
  variant
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Get appropriate classes from our token utility
  const stepGradientClass = getStepGradientClass(step.number);
  const glowEffectClass = getGlowEffectClass(step.number);
  const connectorClass = getConnectorColorClass(step.number);

  return (
    <>
      {/* Main Step Card */}
      <div
        className={`
          relative p-4 md:p-6 rounded-xl journey-bg-card z-10
          border ${isExpanded ? 'journey-border-active' : 'journey-border'}
          transition-medium cursor-pointer group ${glowEffectClass}
        `}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`step-content-${index}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        data-theme={variant !== 'default' ? variant : undefined}
        data-aos={prefersReducedMotion ? undefined : 'fade-up'}
        data-aos-delay={prefersReducedMotion ? undefined : step.delay?.toString()}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Step Icon & Number */}
          <div className="relative">
            <div className={`w-16 h-16 rounded-xl ${stepGradientClass} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
              {step.icon}
              <div className={`absolute inset-0 rounded-xl ${stepGradientClass} opacity-15 blur-[1px] group-hover:opacity-25 transition-opacity`} aria-hidden="true"></div>
            </div>

            {/* Step number */}
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold journey-gradient-lime text-gray-900">
              {index + 1}
            </div>
          </div>

          {/* Step Information */}
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold mb-2 journey-text-heading group-hover:journey-text-heading-hover transition-colors flex items-center">
              {step.title}
            </h3>
            <p className="journey-text-description group-hover:journey-text-description-hover transition-colors md:pr-8">
              {step.description}
            </p>
          </div>

          {/* Expand/Collapse Button */}
          <div className={`p-2 rounded-full journey-accent-border-30 journey-accent-bg-10 transition-all duration-300 ${isExpanded ? 'rotate-90' : ''}`} aria-hidden="true">
            <ChevronRight size={20} className="journey-text-accent" />
          </div>
        </div>
      </div>

      {/* Progress connector - Now outside the card to connect with the timeline */}
      {!isLast && (
        <div className={`journey-step-connector ${connectorClass}`} aria-hidden="true"></div>
      )}

      {/* Expanded Content */}
      <ExpandedContent
        step={step}
        index={index}
        isExpanded={isExpanded}
        variant={variant}
      />
    </>
  );
};

/**
 * ExpandedContent - Renders the detailed features when a step is expanded
 */
const ExpandedContent: React.FC<ExpandedContentProps> = ({
  step,
  index,
  isExpanded,
  variant
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Don't render content at all when collapsed to save memory and prevent space issues
  if (!isExpanded) {
    return null;
  }

  return (
    <div
      id={`step-content-${index}`}
      className="mt-2 rounded-xl journey-bg-card journey-border z-10 relative overflow-hidden p-4 md:p-6 animate-fade-in"
      data-theme={variant !== 'default' ? variant : undefined}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {step.detailedFeatures?.map((feature: DetailedFeature, featureIndex: number) => (
          <JourneyFeatureCard
            key={featureIndex}
            feature={feature}
            variant={variant}
          />
        ))}
      </div>

      {/* CTA Section */}
      <StepCTA
        step={step}
        isExpanded={true}
        variant={variant}
      />
    </div>
  );
};

/**
 * StepCTA - Renders the call-to-action button for expanded steps
 */
const StepCTA: React.FC<StepCTAProps> = ({
  step,
  isExpanded,
  variant
}) => {
  const ctaUrl = getStepCTAUrl(step.title);

  return (
    <div className="text-center">
      <a
        href={ctaUrl}
        className="journey-button inline-flex items-center px-6 py-2 rounded-full text-sm font-medium"
        aria-label={`${step.ctaText} for ${step.title}`}
        data-theme={variant !== 'default' ? variant : undefined}
      >
        {step.ctaText}
        <ChevronRight size={16} className="ml-2" aria-hidden="true" />
      </a>
    </div>
  );
};

export default JourneyStep; 