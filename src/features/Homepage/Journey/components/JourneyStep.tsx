import { ChevronRight } from 'lucide-react';
import React from 'react';
import {
  DetailedFeature,
  JourneyStepProps,
  JourneyStep as JourneyStepType,
  VariantKey,
  VariantProps,
  isVariant
} from '../types';
// Import from index to resolve TypeScript import issue
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
 * Get the appropriate connector color class based on step accent color
 */
const getConnectorColorClass = (accentColor?: string): string => {
  if (!accentColor) return 'connector-lime'; // Default

  if (accentColor.includes('cyan')) {
    return 'connector-cyan';
  } else if (accentColor.includes('violet')) {
    return 'connector-violet';
  } else if (accentColor.includes('amber')) {
    return 'connector-amber';
  }

  // Default to lime
  return 'connector-lime';
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

const JourneyStep: React.FC<JourneyStepProps> = (props) => {
  const {
    step,
    index,
    isExpanded,
    onToggle,
    isLast,
    variant
  } = props;

  // Extract the color class for the border glow effect
  const borderColor = step.accentColor?.includes('cyan') ? 'cyan-glow' :
    step.accentColor?.includes('violet') ? 'violet-glow' :
      step.accentColor?.includes('amber') ? 'amber-glow' : 'lime-glow';

  // Get the connector color class based on step accent color
  const connectorColorClass = getConnectorColorClass(step.accentColor);

  // Get variant-specific styles
  const hoverTextColor = getHoverTextColor(variant);
  const expandButtonStyle = getExpandButtonStyle(variant);

  return (
    <>
      {/* Step header - always visible */}
      <div
        className={`journey-step-card relative rounded-xl bg-journey-card border border-journey-card cursor-pointer group hover:border-opacity-80 transition-all duration-300 ${borderColor}`}
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
        data-aos="fade-up"
        data-aos-delay={step.delay}
        data-theme={variant !== 'default' ? variant : undefined}
      >
        <div className={`flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6`}>
          {/* Step Icon & Number */}
          <div className="relative z-10">
            <div className={`journey-step-icon rounded-xl bg-gradient-to-br ${step.accentColor} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
              {step.icon}

              {/* Pulsing ring - decorative */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.accentColor} opacity-15 blur-[1px] group-hover:opacity-25 transition-opacity`} aria-hidden="true"></div>
            </div>

            {/* Step number */}
            <div className="journey-step-number absolute -top-3 -left-3 rounded-full flex items-center justify-center text-sm font-bold journey-gradient-lime text-gray-900">
              {index + 1}
            </div>
          </div>

          {/* Step Information */}
          <div className="flex-1">
            <h3 className={`mb-1 text-white group-${hoverTextColor} transition-colors flex items-center`}>
              {step.title}
            </h3>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors md:pr-12">
              {step.description}
            </p>
          </div>

          {/* Expand/Collapse Button */}
          <div className={`hidden md:flex p-2 rounded-full border border-journey-accent-30 bg-journey-accent-10 text-journey-accent transition-all duration-300 ${isExpanded ? 'rotate-90' : ''}`} aria-hidden="true">
            <ChevronRight size={20} />
          </div>

          {/* Mobile-only Expand Button */}
          <div className={`md:hidden absolute top-4 right-4 p-2 rounded-full border border-journey-accent-30 bg-journey-accent-10 text-journey-accent transition-all duration-300 ${isExpanded ? 'rotate-90' : ''}`} aria-hidden="true">
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Connector line that connects to the next step */}
        {!isLast && (
          <div className={`step-connector ${connectorColorClass} absolute left-[31px] bottom-[-60px] h-[60px] z-10`} aria-hidden="true"></div>
        )}
      </div>

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

// Updated to use discriminated union
type ExpandedContentProps = {
  step: JourneyStepType;
  index: number;
  isExpanded: boolean;
} & VariantProps;

const ExpandedContent: React.FC<ExpandedContentProps> = (props) => {
  const {
    step,
    index,
    isExpanded,
    variant
  } = props;

  return (
    <div
      id={`step-content-${index}`}
      className={`journey-expanded-content transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100 pt-4 pb-6' : 'max-h-0 opacity-0 py-0'}`}
      aria-hidden={!isExpanded}
      data-theme={variant !== 'default' ? variant : undefined}
    >
      <div className={`journey-feature-grid mb-6 ${isExpanded ? 'animate-fade-slide-up' : ''}`}>
        {step.detailedFeatures?.map((feature: DetailedFeature, featureIndex: number) => (
          <JourneyFeatureCard
            key={featureIndex}
            feature={feature}
            variant={variant}
          />
        ))}
      </div>

      <StepCTA
        step={step}
        isExpanded={isExpanded}
        variant={variant}
      />
    </div>
  );
};

// Updated to use discriminated union
type StepCTAProps = {
  step: JourneyStepType;
  isExpanded: boolean;
} & VariantProps;

const StepCTA: React.FC<StepCTAProps> = (props) => {
  const { step, isExpanded, variant } = props;

  const gradientClass = getGradientClass(variant);

  return (
    <div className={`text-center ${isExpanded ? 'animate-fade-in' : ''}`} data-theme={variant !== 'default' ? variant : undefined}>
      <a
        href={
          step.title === "Receive Your Personalized Plan"
            ? "http://builder.fitcopilot.ai"
            : "https://aigymengine.com/workout-generator-registration"
        }
        className={`journey-cta-button inline-flex items-center rounded-full text-sm font-medium transition-all duration-300 ${gradientClass} text-gray-900 shadow-md hover:shadow-lg hover:-translate-y-1 px-6 py-2 md:px-8 md:py-3 button primary`}
        aria-label={`${step.ctaText} for ${step.title}`}
        data-theme={variant !== 'default' ? variant : undefined}
      >
        {step.ctaText}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </a>
    </div>
  );
};

export default JourneyStep; 