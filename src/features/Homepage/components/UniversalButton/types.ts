/**
 * UniversalButton Types
 * 
 * Unified type definitions for the Universal Button component that consolidates
 * all Homepage section button implementations while preserving section-specific features.
 */

import React from 'react';
import { GlobalVariantKey } from '../../types/shared';

/**
 * Section context for styling differentiation
 */
export type SectionContext = 
  | 'hero' 
  | 'features' 
  | 'training' 
  | 'journey' 
  | 'personal-training' 
  | 'training-features' 
  | 'pricing' 
  | 'testimonials';

/**
 * Button variant types (expanded from original)
 */
export type UniversalButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'tertiary' 
  | 'ghost' 
  | 'link';

/**
 * Button size options (expanded)
 */
export type UniversalButtonSize = 
  | 'small' 
  | 'medium' 
  | 'large' 
  | 'xl';

/**
 * Predefined gradient colors for Journey section
 */
export type GradientColor = 
  | 'lime' 
  | 'cyan' 
  | 'violet' 
  | 'amber';

/**
 * Training style variants
 */
export type TrainingStyleVariant = 
  | 'standard' 
  | 'accent' 
  | 'athletic';

/**
 * Coach specialization types for PersonalTraining
 */
export type CoachType = 
  | 'strength' 
  | 'nutrition' 
  | 'performance' 
  | 'recovery';

/**
 * Training feature types for TrainingFeatures
 */
export type FeatureType = 
  | 'virtual' 
  | 'tracking' 
  | 'scheduling' 
  | 'support' 
  | 'mobile';

/**
 * Pricing plan types
 */
export type PlanType = 
  | 'basic' 
  | 'pro' 
  | 'elite' 
  | 'custom';

/**
 * Testimonial category types
 */
export type TestimonialType = 
  | 'athlete' 
  | 'professional' 
  | 'enthusiast' 
  | 'success';

/**
 * Base button props interface
 */
export interface BaseUniversalButtonProps {
  /** Button content */
  children: React.ReactNode;
  
  /** Additional CSS class names */
  className?: string;
  
  /** Inline styles */
  style?: React.CSSProperties;
  
  /** Unique identifier */
  id?: string;
  
  /** Data attributes for testing */
  'data-testid'?: string;
}

/**
 * Comprehensive UniversalButton props interface
 */
export interface UniversalButtonProps extends BaseUniversalButtonProps {
  // Core button properties
  /** Visual style variant */
  variant?: UniversalButtonVariant;
  
  /** Size variant */
  size?: UniversalButtonSize;
  
  /** Whether the button is disabled */
  disabled?: boolean;
  
  /** Whether the button is in loading state */
  loading?: boolean;
  
  /** Whether the button should take full width */
  fullWidth?: boolean;
  
  // Theme integration
  /** Theme variant for styling (overrides global context) */
  theme?: GlobalVariantKey;
  
  // Section context for styling
  /** Section context for applying section-specific styling */
  sectionContext?: SectionContext;
  
  // Flexible section-specific styling
  /** Style variant for Training section */
  styleVariant?: TrainingStyleVariant | string;
  
  /** Context type for specialized styling */
  contextType?: CoachType | FeatureType | PlanType | TestimonialType | string;
  
  // Unified gradient system
  /** Predefined gradient color (Journey section) */
  gradientColor?: GradientColor | string;
  
  /** CSS class for gradient styling (Features/TrainingFeatures) */
  gradientClass?: string;
  
  /** Full CSS gradient string (Pricing section) */
  gradientColors?: string;
  
  // Icon support
  /** Icon to display on the left side */
  leftIcon?: React.ReactNode;
  
  /** Icon to display on the right side */
  rightIcon?: React.ReactNode;
  
  // Link support
  /** URL to navigate to (renders as anchor tag) */
  href?: string;
  
  /** Target for link navigation */
  target?: '_blank' | '_self' | '_parent' | '_top';
  
  /** Rel attribute for links */
  rel?: string;
  
  // Form support
  /** Button type for form submission */
  type?: 'button' | 'submit' | 'reset';
  
  /** Form attribute */
  form?: string;
  
  // Event handling
  /** Click event handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  
  /** Focus event handler */
  onFocus?: (event: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  
  /** Blur event handler */
  onBlur?: (event: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  
  /** Mouse enter event handler */
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  
  /** Mouse leave event handler */
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  
  // Accessibility
  /** ARIA label for accessibility */
  'aria-label'?: string;
  
  /** ARIA controls attribute */
  'aria-controls'?: string;
  
  /** ARIA expanded state */
  'aria-expanded'?: boolean;
  
  /** ARIA pressed state */
  'aria-pressed'?: boolean;
  
  /** ARIA described by attribute */
  'aria-describedby'?: string;
  
  /** ARIA live region */
  'aria-live'?: 'off' | 'polite' | 'assertive';
}

/**
 * Props for backward compatibility wrappers
 */
export interface HeroButtonCompatProps extends Omit<UniversalButtonProps, 'sectionContext'> {
  variant?: 'primary' | 'secondary';
}

export interface FeatureButtonCompatProps extends Omit<UniversalButtonProps, 'sectionContext'> {
  gradientClass?: string;
}

export interface TrainingButtonCompatProps extends Omit<UniversalButtonProps, 'sectionContext'> {
  styleVariant?: TrainingStyleVariant;
}

export interface JourneyButtonCompatProps extends Omit<UniversalButtonProps, 'sectionContext'> {
  gradientColor?: GradientColor;
}

export interface PersonalTrainingButtonCompatProps extends Omit<UniversalButtonProps, 'sectionContext'> {
  coachType?: CoachType;
}

export interface TrainingFeaturesButtonCompatProps extends Omit<UniversalButtonProps, 'sectionContext'> {
  featureType?: FeatureType;
  gradientClass?: string;
}

export interface PricingButtonCompatProps extends Omit<UniversalButtonProps, 'sectionContext'> {
  planType?: PlanType;
  gradientColors?: string;
}

export interface TestimonialsButtonCompatProps extends Omit<UniversalButtonProps, 'sectionContext'> {
  testimonialType?: TestimonialType;
}

/**
 * Internal utility types
 */
export interface GradientConfig {
  background: string;
  hoverBackground?: string;
  textColor?: string;
}

export interface SectionStyleConfig {
  baseClass: string;
  variantClass: string;
  styleClass?: string;
  contextClass?: string;
}

export interface ThemeStyleConfig {
  themeClasses: string;
  gradientConfig?: GradientConfig;
  customProperties?: Record<string, string>;
} 