/**
 * Backward Compatibility Wrappers
 * 
 * These wrapper components maintain backward compatibility during the migration
 * from individual section button components to the unified UniversalButton.
 */

import React from 'react';
import { UniversalButton } from '../UniversalButton';
import type {
    FeatureButtonCompatProps,
    HeroButtonCompatProps,
    JourneyButtonCompatProps,
    PersonalTrainingButtonCompatProps,
    PricingButtonCompatProps,
    TestimonialsButtonCompatProps,
    TrainingButtonCompatProps,
    TrainingFeaturesButtonCompatProps
} from '../types';

/**
 * HeroButton compatibility wrapper
 */
export const HeroButton: React.FC<HeroButtonCompatProps> = (props) => {
  return React.createElement(UniversalButton, { sectionContext: "hero", ...props });
};

/**
 * FeatureButton compatibility wrapper
 */
export const FeatureButton: React.FC<FeatureButtonCompatProps> = (props) => {
  return React.createElement(UniversalButton, { sectionContext: "features", ...props });
};

/**
 * TrainingButton compatibility wrapper
 */
export const TrainingButton: React.FC<TrainingButtonCompatProps> = (props) => {
  return React.createElement(UniversalButton, { sectionContext: "training", ...props });
};

/**
 * JourneyButton compatibility wrapper
 */
export const JourneyButton: React.FC<JourneyButtonCompatProps> = (props) => {
  return React.createElement(UniversalButton, { sectionContext: "journey", ...props });
};

/**
 * PersonalTrainingButton compatibility wrapper
 */
export const PersonalTrainingButton: React.FC<PersonalTrainingButtonCompatProps> = ({
  coachType,
  ...props
}) => {
  return React.createElement(UniversalButton, { 
    sectionContext: "personal-training", 
    contextType: coachType,
    ...props 
  });
};

/**
 * TrainingFeaturesButton compatibility wrapper
 */
export const TrainingFeaturesButton: React.FC<TrainingFeaturesButtonCompatProps> = ({
  featureType,
  ...props
}) => {
  return React.createElement(UniversalButton, { 
    sectionContext: "training-features", 
    contextType: featureType,
    ...props 
  });
};

/**
 * PricingButton compatibility wrapper
 */
export const PricingButton: React.FC<PricingButtonCompatProps> = ({
  planType,
  ...props
}) => {
  return React.createElement(UniversalButton, { 
    sectionContext: "pricing", 
    contextType: planType,
    ...props 
  });
};

/**
 * TestimonialsButton compatibility wrapper
 */
export const TestimonialsButton: React.FC<TestimonialsButtonCompatProps> = ({
  testimonialType,
  ...props
}) => {
  return React.createElement(UniversalButton, { 
    sectionContext: "testimonials", 
    contextType: testimonialType,
    ...props 
  });
};

// Set display names for debugging
HeroButton.displayName = 'HeroButton';
FeatureButton.displayName = 'FeatureButton';
TrainingButton.displayName = 'TrainingButton';
JourneyButton.displayName = 'JourneyButton';
PersonalTrainingButton.displayName = 'PersonalTrainingButton';
TrainingFeaturesButton.displayName = 'TrainingFeaturesButton';
PricingButton.displayName = 'PricingButton';
TestimonialsButton.displayName = 'TestimonialsButton'; 