import { ChevronRight } from 'lucide-react';
import React, { KeyboardEvent } from 'react';
import {
    ExtendedCSSProperties
} from '../../../../types/components';
import { useReducedMotion } from '../hooks/useReducedMotion';
import {
    DetailedFeature,
    ExpandedContentProps,
    JourneyStepProps as LocalJourneyStepProps,
    VariantKey,
    isVariant
} from '../types';
// Import from utils/tokenUtils instead of redefining functions
import { getConnectorColorClass, getGlowEffectClass, getStepGradientClass } from '../utils/tokenUtils';
import { JourneyFeatureCard } from './index';
import StepCTA from './StepCTA';

/**
 * Get variant-specific hover text color for step title using type narrowing
 * @deprecated Will be used in future theming customizations
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
 * @deprecated Will be used in upcoming UI enhancements
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
 * @deprecated Will be used in future theme controls
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
 * @deprecated Will be used in custom timeline styling
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTimelineColorClass = (accentColor?: string): string => {
  if (!accentColor) return 'timeline-lime'; // Default

  try {
    if (accentColor.includes('cyan')) {
      return 'timeline-cyan';
    } else if (accentColor.includes('violet')) {
      return 'timeline-violet';
    } else if (accentColor.includes('amber')) {
      return 'timeline-amber';
    }
  } catch (_e) {
    // If includes method fails, return default
    return 'timeline-lime';
  }

  // Default to lime
  return 'timeline-lime';
};

/**
 * JourneyStep - Renders a single step in the journey process
 */
const JourneyStep: React.FC<LocalJourneyStepProps> = ({
  step,
  index,
  isExpanded,
  onToggle,
  isLast,
  variant = 'default'
}) => {
  const _prefersReducedMotion = useReducedMotion();

  // Get appropriate classes from our token utility
  const stepGradientClass = getStepGradientClass(step.number);
  const glowEffectClass = getGlowEffectClass(step.number);
  const connectorClass = getConnectorColorClass(step.number);

  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  // Custom CSS properties with proper typing
  const customStyle: ExtendedCSSProperties = {
    '--journey-step-highlight': step.accentColor || 'var(--color-journey-accent)',
  };

  return (
    <>
      {/* Main Step Card */}
      <div
        className={`
          relative p-6 md:p-8 rounded-2xl journey-bg-card z-10
          border ${isExpanded ? 'journey-border-active' : 'journey-border'}
          transition-medium cursor-pointer group ${glowEffectClass}
        `}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`step-content-${index}`}
        onKeyDown={handleKeyDown}
        data-theme={variant !== 'default' ? variant : undefined}
        data-aos={_prefersReducedMotion ? undefined : 'fade-up'}
        data-aos-delay={_prefersReducedMotion ? undefined : step.delay?.toString()}
        style={customStyle}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
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
            <p className="journey-text-description group-hover:journey-text-description-hover transition-colors md:pr-12">
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
  variant = 'default'
}) => {
  const _prefersReducedMotion = useReducedMotion();

  // Don't render content at all when collapsed to save memory and prevent space issues
  if (!isExpanded) {
    return null;
  }

  // Custom CSS properties with proper typing
  const customStyle: ExtendedCSSProperties = {
    '--journey-content-highlight': step.accentColor || 'var(--color-journey-accent)',
  };

  return (
    <div
      id={`step-content-${index}`}
      className="mt-2 rounded-2xl journey-bg-card journey-border z-10 relative overflow-hidden p-6 animate-fade-in"
      data-theme={variant !== 'default' ? variant : undefined}
      style={customStyle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

export default JourneyStep; 