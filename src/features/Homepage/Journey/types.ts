import { ReactNode } from 'react';

// Base variant type with discriminant
export type VariantKey = 'default' | 'gym' | 'sports' | 'wellness' | 'modern' | 'classic' | 'minimalist';

// RGB color values by variant for consistent styling
export interface VariantColors {
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
}

// Base interface for any variant-specific props
export interface BaseVariantProps {
  variant: VariantKey;
}

// Default variant
export interface DefaultVariantProps extends BaseVariantProps {
  variant: 'default';
  colors?: {
    accentPrimary: '#CCFF00';
    accentSecondary: '#22d3ee';
    accentTertiary: '#a78bfa';
  };
}

// Gym variant
export interface GymVariantProps extends BaseVariantProps {
  variant: 'gym';
  colors?: {
    accentPrimary: '#8b5cf6';
    accentSecondary: '#a78bfa';
    accentTertiary: '#c4b5fd';
  };
}

// Sports variant
export interface SportsVariantProps extends BaseVariantProps {
  variant: 'sports';
  colors?: {
    accentPrimary: '#38bdf8';
    accentSecondary: '#60a5fa';
    accentTertiary: '#67e8f9';
  };
}

// Wellness variant
export interface WellnessVariantProps extends BaseVariantProps {
  variant: 'wellness';
  colors?: {
    accentPrimary: '#2dd4bf';
    accentSecondary: '#5eead4';
    accentTertiary: '#34d399';
  };
}

// Modern variant
export interface ModernVariantProps extends BaseVariantProps {
  variant: 'modern';
  colors?: {
    accentPrimary: '#fbbd24';
    accentSecondary: '#fcd34d';
    accentTertiary: '#fb923c';
  };
}

// Classic variant
export interface ClassicVariantProps extends BaseVariantProps {
  variant: 'classic';
  colors?: {
    accentPrimary: '#f87171';
    accentSecondary: '#fca5a5';
    accentTertiary: '#fdba74';
  };
}

// Minimalist variant
export interface MinimalistVariantProps extends BaseVariantProps {
  variant: 'minimalist';
  colors?: {
    accentPrimary: '#e5e7eb';
    accentSecondary: '#f3f4f6';
    accentTertiary: '#d1d5db';
  };
}

// Union type of all possible variant props
export type VariantProps =
  | DefaultVariantProps
  | GymVariantProps
  | SportsVariantProps
  | WellnessVariantProps
  | ModernVariantProps
  | ClassicVariantProps
  | MinimalistVariantProps;

// Type guard to check if a variant is of a specific type
export function isVariant<T extends VariantProps['variant']>(
  variant: VariantKey,
  specificVariant: T
): variant is T {
  return variant === specificVariant;
}

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

// Main component props using discriminated union
export type JourneyProps = {
  journey?: JourneyStep[];
} & VariantProps;

// Simplified union type for components that only need the variant
export type JourneyComponentProps<T> = T & VariantProps;

export type JourneyStepProps = {
  step: JourneyStep;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
} & VariantProps;

export type JourneyFeatureCardProps = {
  feature: DetailedFeature;
} & VariantProps;

export type JourneyCTAProps = {
  text?: string;
  href?: string;
  className?: string;
  buttonSize?: 'small' | 'medium' | 'large';
  buttonVariant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'gradient' | 'violet-indigo';
  showIcon?: boolean;
  icon?: React.ReactNode;
  dataAos?: string;
  dataAosDelay?: string;
  gradientColor?: 'lime' | 'violet' | 'cyan' | 'teal' | 'amber' | 'green';
} & VariantProps;

export type SectionHeaderProps = {
  title?: ReactNode;
  description?: string;
} & VariantProps; 