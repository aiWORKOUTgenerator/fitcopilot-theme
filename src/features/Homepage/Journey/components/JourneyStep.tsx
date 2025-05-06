import { ChevronRight } from 'lucide-react';
import React from 'react';
import SPACING from '../constants';
import { DetailedFeature, JourneyStepProps, JourneyStep as JourneyStepType } from '../types';
// Import from index to resolve TypeScript import issue
import { JourneyFeatureCard } from './index';

const JourneyStep: React.FC<JourneyStepProps> = ({
  step,
  index,
  isExpanded,
  onToggle,
  isLast
}) => {
  // Extract the color class for the border glow effect
  const borderColor = step.accentColor?.includes('cyan') ? 'cyan-glow' :
    step.accentColor?.includes('violet') ? 'violet-glow' :
      step.accentColor?.includes('amber') ? 'amber-glow' : 'lime-glow';

  // Extract colors for the connector line
  const connectorGradient = step.accentColor?.includes('cyan') ? 'from-cyan-300/50 to-blue-400/5' :
    step.accentColor?.includes('violet') ? 'from-violet-300/50 to-purple-400/5' :
      step.accentColor?.includes('amber') ? 'from-amber-300/50 to-orange-400/5' :
        'from-lime-300/50 to-emerald-400/5';

  return (
    <>
      {/* Step header - always visible */}
      <div
        className={`relative rounded-xl bg-[#11192a] border border-[#2a365a] p-6 cursor-pointer group hover:border-opacity-80 transition-all duration-300 ${borderColor}`}
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
      >
        <div className={SPACING.LAYOUT.STEP_CONTENT}>
          {/* Step Icon & Number */}
          <div className="relative z-10">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.accentColor} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
              {step.icon}

              {/* Pulsing ring - decorative */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.accentColor} opacity-15 blur-[1px] group-hover:opacity-25 transition-opacity`} aria-hidden="true"></div>
            </div>

            {/* Step number */}
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-r from-lime-300 to-emerald-400 text-gray-900">
              {index + 1}
            </div>
          </div>

          {/* Step Information */}
          <div className="flex-1">
            <h3 className={`text-xl md:text-2xl font-bold mb-1 text-white group-hover:text-[#CCFF00] transition-colors flex items-center`}>
              {step.title}
            </h3>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors md:pr-12">
              {step.description}
            </p>
          </div>

          {/* Expand/Collapse Button */}
          <div className={`p-2 rounded-full border border-[#CCFF00]/30 bg-[#CCFF00]/10 transition-all duration-300 ${isExpanded ? 'rotate-90' : ''}`} aria-hidden="true">
            <ChevronRight size={20} className="text-[#CCFF00]" />
          </div>
        </div>

        {/* Connector line that connects to the next step */}
        {!isLast && (
          <div className={`absolute left-[31px] bottom-[-60px] w-0.5 h-[60px] bg-gradient-to-b ${connectorGradient} z-10`} aria-hidden="true"></div>
        )}
      </div>

      {/* Expanded Content */}
      <ExpandedContent
        step={step}
        index={index}
        isExpanded={isExpanded}
      />
    </>
  );
};

interface ExpandedContentProps {
  step: JourneyStepType;
  index: number;
  isExpanded: boolean;
}

const ExpandedContent: React.FC<ExpandedContentProps> = ({
  step,
  index,
  isExpanded
}) => {
  return (
    <div
      id={`step-content-${index}`}
      className={`pl-24 pr-4 transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[600px] opacity-100 pt-4 pb-6' : 'max-h-0 opacity-0 py-0'}`}
      aria-hidden={!isExpanded}
    >
      <div className={`${SPACING.LAYOUT.FEATURE_GRID} mb-6 ${isExpanded ? 'animate-fade-slide-up' : ''
        }`}>
        {step.detailedFeatures?.map((feature: DetailedFeature, featureIndex: number) => (
          <JourneyFeatureCard key={featureIndex} feature={feature} />
        ))}
      </div>

      <StepCTA step={step} isExpanded={isExpanded} />
    </div>
  );
};

interface StepCTAProps {
  step: JourneyStepType;
  isExpanded: boolean;
}

const StepCTA: React.FC<StepCTAProps> = ({ step, isExpanded }) => {
  return (
    <div className={`text-center ${isExpanded ? 'animate-fade-in' : ''}`}>
      <a
        href={
          step.title === "Receive Your Personalized Plan"
            ? "http://builder.fitcopilot.ai"
            : "https://aigymengine.com/workout-generator-registration"
        }
        className={`inline-flex items-center ${SPACING.PADDING.BUTTON} rounded-full text-sm font-medium transition-all duration-300 bg-gradient-to-r from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500 text-gray-900 shadow-md hover:shadow-lg hover:-translate-y-1 button primary`}
        aria-label={`${step.ctaText} for ${step.title}`}
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