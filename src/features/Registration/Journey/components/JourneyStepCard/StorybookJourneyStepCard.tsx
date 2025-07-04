import { ArrowRight, ChevronRight } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useJourney } from '../JourneyContext';
import { JourneyStepData, JourneyStepFeature } from '../JourneyStepCard';
import {
    MockAnalyticsSelector,
    MockCustomizeExperience,
    MockCustomizedMedical,
    MockGoalSelector,
    MockRegistrationButton
} from './mocks/MockJourneyDependencies';

interface StorybookJourneyStepCardProps {
    step: JourneyStepData;
    index: number;
    onStepAction: (index: number) => void;
}

/**
 * Storybook-specific version of JourneyStepCard that uses mock dependencies
 * This allows the component to work in Storybook without requiring all the real dependencies
 */
const StorybookJourneyStepCard: React.FC<StorybookJourneyStepCardProps> = ({
  step,
  index,
  onStepAction,
}) => {
  const { expandedStep, toggleStep, completedSteps } = useJourney();
  const contentRef = useRef<HTMLDivElement>(null);
  const isExpanded = expandedStep === index;
  const isCompleted = completedSteps.includes(index);
  const [isStepValid, setIsStepValid] = useState(false);

  // Get gradient style classes
  const getGradientClasses = () => {
    if (step.accentColor.includes('lime')) return 'lime-glow';
    if (step.accentColor.includes('cyan')) return 'cyan-glow';
    if (step.accentColor.includes('violet')) return 'violet-glow';
    if (step.accentColor.includes('amber')) return 'amber-glow';
    return '';
  };

  // Handle step toggle
  const handleToggle = () => {
    toggleStep(index);
  };

  // Handle action button click
  const handleAction = () => {
    onStepAction(index);
  };

  // Handle validation status change
  const handleValidityChange = (isValid: boolean) => {
    setIsStepValid(isValid);
  };

  // Determine which component to render based on step index (using mocks)
  const renderStepContent = () => {
    if (!isExpanded) return null;

    // Goals Step
    if (index === 0) {
      return (
        <MockGoalSelector
          features={step.detailedFeatures}
          onValidChange={handleValidityChange}
        />
      );
    }

    // Customization Step
    else if (index === 1) {
      return (
        <MockCustomizeExperience onValidChange={handleValidityChange} />
      );
    }

    // Medical Customization Step
    else if (index === 2) {
      return (
        <MockCustomizedMedical onValidChange={handleValidityChange} />
      );
    }

    // Analytics/Progress Tracking Step
    else if (index === 3) {
      return (
        <MockAnalyticsSelector
          features={step.detailedFeatures}
          onValidChange={handleValidityChange}
        />
      );
    }

    // Default content for other steps
    else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-fade-slide-up">
          {step.detailedFeatures.map((feature: JourneyStepFeature, featureIndex: number) => (
            <div
              key={featureIndex}
              className="flex items-start gap-4 p-4 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-colors group/feature"
            >
              <div className="bg-gray-800 p-2 rounded-lg group-hover/feature:scale-110 transition-transform" aria-hidden="true">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-400 group-hover/feature:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div
      id={`journey-step-${index}`}
      className={`relative journey-step-card transition-all duration-500 ease-in-out animate-fade-in-up delay-${index + 1}`}
    >
      {/* Main Step Card */}
      <div
        className={`relative p-6 md:p-8 rounded-2xl bg-gray-800/70 backdrop-blur-lg border ${isExpanded ? 'border-lime-300/50 shadow-lg shadow-lime-300/10' :
          isCompleted ? 'border-emerald-500/30' : 'border-gray-700'
        } transition-all duration-300 cursor-pointer group ${getGradientClasses()}`}
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`step-content-${index}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Step Icon & Number */}
          <div className="relative">
            <div
              className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.accentColor} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
            >
              {step.icon}
              {/* Pulsing ring - decorative */}
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.accentColor} opacity-15 blur-[1px] group-hover:opacity-25 transition-opacity`}
                aria-hidden="true"
              ></div>
            </div>

            {/* Step number with completion indicator */}
            <div
              className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCompleted
                ? 'bg-emerald-400 text-gray-900'
                : 'bg-gradient-to-r from-lime-300 to-emerald-400 text-gray-900'
              }`}
            >
              {index + 1}
            </div>
          </div>

          {/* Step Information */}
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-white group-hover:text-lime-300 transition-colors flex items-center">
              {step.title}
              {isCompleted && (
                <span className="ml-2 text-emerald-400 text-sm font-normal">(Completed)</span>
              )}
            </h3>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors md:pr-12">
              {step.description}
            </p>
          </div>

          {/* Expand/Collapse Button */}
          <div
            className={`p-2 rounded-full border border-lime-300/30 bg-lime-300/10 transition-all duration-300 ${isExpanded ? 'rotate-90' : ''
            }`}
            aria-hidden="true"
          >
            <ChevronRight size={20} className="text-lime-300" />
          </div>
        </div>

        {/* Progress connector */}
        {index < 3 && (
          <div className="hidden md:block step-connector" aria-hidden="true"></div>
        )}
      </div>

      {/* Expanded Content */}
      <div
        ref={contentRef}
        id={`step-content-${index}`}
        className={`mt-2 rounded-2xl bg-gray-800/40 border border-gray-700 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[3000px] opacity-100 p-6' : 'max-h-0 opacity-0 p-0 border-0'
        }`}
        aria-hidden={!isExpanded}
      >
        {/* Render appropriate content based on step index */}
        {renderStepContent()}

        {/* CTA Button - Only enable when valid */}
        {isExpanded && (
          <div className="text-center mt-6">
            <MockRegistrationButton
              onClick={handleAction}
              disabled={!isStepValid}
              variant="primary"
            >
              {step.ctaText}
              <ArrowRight size={16} className="ml-2" aria-hidden="true" />
            </MockRegistrationButton>

            {/* Validation message */}
            {!isStepValid && (
              <p className="text-sm text-amber-400 mt-2">
                Please complete the requirements to continue
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorybookJourneyStepCard; 