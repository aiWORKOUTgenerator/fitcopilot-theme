import { ReactNode } from 'react';
import { GlobalVariantKey } from '../types/shared';

/**
 * Journey component types using discriminated unions for variant support
 */

// Available theme variants
// @deprecated Use GlobalVariantKey from '../types/shared' instead
export type VariantKey = GlobalVariantKey;

// Step feature interface
export interface DetailedFeature {
  title: string;
  description: string;
  icon: ReactNode;
}

// Journey step interface
export interface JourneyStep {
  id: number;
  title: string;
  description: string;
  number: number;
  icon?: ReactNode;
  delay?: number;
  accentColor?: string;
  ctaText?: string;
  detailedFeatures?: DetailedFeature[];
}

// Base props for any variant
export interface BaseVariantProps {
  variant: VariantKey;
}

// Default variant
export interface DefaultVariantProps extends BaseVariantProps {
  variant: 'default';
}

// Gym variant
export interface GymVariantProps extends BaseVariantProps {
  variant: 'gym';
}

// Sports variant
export interface SportsVariantProps extends BaseVariantProps {
  variant: 'sports';
}

// Wellness variant
export interface WellnessVariantProps extends BaseVariantProps {
  variant: 'wellness';
}

// Modern variant
export interface ModernVariantProps extends BaseVariantProps {
  variant: 'modern';
}

// Classic variant
export interface ClassicVariantProps extends BaseVariantProps {
  variant: 'classic';
}

// Minimalist variant
export interface MinimalistVariantProps extends BaseVariantProps {
  variant: 'minimalist';
}

// Union type of all variant props
export type VariantProps =
  | DefaultVariantProps
  | GymVariantProps
  | SportsVariantProps
  | WellnessVariantProps
  | ModernVariantProps
  | ClassicVariantProps
  | MinimalistVariantProps;

// Type guard for variant discrimination
export function isVariant<T extends VariantProps['variant']>(
  variant: VariantKey,
  specificVariant: T
): variant is T {
  return variant === specificVariant;
}

// Main Journey component props
export interface JourneyProps {
  journey?: JourneyStep[];
  variant?: VariantKey;
}

// Journey step component props
export interface JourneyStepProps {
  step: JourneyStep;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
  variant: VariantKey;
}

// Feature card component props
export interface JourneyFeatureCardProps {
  feature: DetailedFeature;
  variant: VariantKey;
}

// Call to action component props
export interface JourneyCTAProps {
  text?: string;
  href?: string;
  className?: string;
  buttonSize?: 'small' | 'medium' | 'large';
  buttonVariant?: 'primary' | 'secondary' | 'gradient';
  showIcon?: boolean;
  icon?: ReactNode;
  gradientColor?: 'lime' | 'cyan' | 'violet' | 'amber';
  variant: VariantKey;
}

// Section header component props
export interface SectionHeaderProps {
  title?: ReactNode | string;
  description?: string;
  variant: VariantKey;
}

// Expanded content props
export interface ExpandedContentProps {
  step: JourneyStep;
  index: number;
  isExpanded: boolean;
  variant: VariantKey;
}

/**
 * Additional props that can be passed to StepCTA
 */
export interface StepCTAAdditionalProps {
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  target?: '_blank' | '_self';
  rel?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

// Step CTA props
export interface StepCTAProps {
  step: JourneyStep;
  isExpanded?: boolean;
  variant?: VariantKey;
  className?: string;
  [key: string]: StepCTAAdditionalProps[keyof StepCTAAdditionalProps] | JourneyStep | boolean | string | undefined;
} 