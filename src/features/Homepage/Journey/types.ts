import { ReactNode } from 'react';

export interface DetailedFeature {
  title: string;
  description: string;
  icon: ReactNode;
}

export interface JourneyStep {
  id: number;
  title: string;
  description: string;
  number: number;
  // Optional new properties to support expanded journey
  icon?: ReactNode;
  delay?: number;
  accentColor?: string;
  ctaText?: string;
  detailedFeatures?: DetailedFeature[];
}

export interface JourneyProps {
  journey?: JourneyStep[];
}

export interface JourneyStepProps {
  step: JourneyStep;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}

export interface JourneyFeatureCardProps {
  feature: DetailedFeature;
}

export interface JourneyCTAProps {
  text?: string;
  href?: string;
}

export interface SectionHeaderProps {
  title?: ReactNode;
  description?: string;
} 