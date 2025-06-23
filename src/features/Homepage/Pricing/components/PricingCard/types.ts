import { ReactNode } from 'react';
import { GlobalVariantKey } from '../../../types/shared';

// Re-export shared types for consistency
export type AnimationState = 'normal' | 'exploding' | 'transitioning' | 'betaPrice';

/**
 * Individual feature within a pricing plan
 */
export interface PlanFeature {
  text: string;
  isHighlighted?: boolean;
  tooltip?: string;
}

/**
 * Complete pricing plan data structure
 * Extracted from the current Plan interface in Pricing.tsx
 */
export interface PricingCardData {
  name: string;
  price: string;
  betaPrice?: string;
  description: string;
  features: PlanFeature[];
  isPopular: boolean;
  accentColors: string;
  titleTextColors: string;
  priceTextColors: string;
  accentTextColor: string;
  icon: ReactNode;
  badge?: string;
  ctaText: string;
  ctaLink?: string;
}

/**
 * Animation timing configuration for pricing animations
 */
export interface AnimationTimings {
  PRO_EXPLODE: number;
  PRO_TRANSITION: number;
  PRO_BETA: number;
  PRO_RESET: number;
}

/**
 * Particle configuration for explosion effects
 */
export interface ParticleConfig {
  COUNT: number;
  MAX_DISTANCE: number;
  MIN_SIZE: number;
  MAX_SIZE: number;
}

/**
 * Tooltip state management for pricing cards
 */
export interface TooltipStates {
  showBetaTooltip: boolean;
  showEliteTooltip: boolean;
  isBasicCardHovered: boolean;
  isProCardHovered: boolean;
}

/**
 * Props for the main PricingCard component
 */
export interface PricingCardProps {
  /** The plan data to display */
  plan: PricingCardData;
  /** Index of the card for key purposes and callbacks */
  index: number;
  /** Current animation state for this card */
  animationState?: AnimationState;
  /** Whether the card is currently hovered */
  isHovered?: boolean;
  /** Whether features are expanded */
  featuresExpanded?: boolean;
  /** Current tooltip states */
  tooltipStates?: TooltipStates;
  /** Theme variant for styling */
  variant?: GlobalVariantKey;
  /** Whether background particles should be shown */
  showBackgroundParticles?: boolean;
  /** Whether price animations are enabled */
  enablePriceAnimation?: boolean;
  /** Callback for mouse enter events */
  onMouseEnter?: () => void;
  /** Callback for mouse leave events */
  onMouseLeave?: () => void;
  /** Callback for plan selection */
  onPlanSelect?: (planId: number, planName: string) => void;
  /** Callback for toggling feature expansion */
  onToggleFeatures?: () => void;
  /** Function to render explosion particles */
  renderExplosionParticles?: () => ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for PricingCardHeader sub-component
 */
export interface PricingCardHeaderProps {
  plan: PricingCardData;
  isPopular: boolean;
  variant?: GlobalVariantKey;
}

/**
 * Props for PricingCardPrice sub-component
 */
export interface PricingCardPriceProps {
  plan: PricingCardData;
  animationState: AnimationState;
  isHovered: boolean;
  renderExplosionParticles: () => ReactNode;
  variant?: GlobalVariantKey;
}

/**
 * Props for PricingCardFeatures sub-component
 */
export interface PricingCardFeaturesProps {
  features: PlanFeature[];
  planName: string;
  expanded: boolean;
  onToggleExpand: () => void;
  variant?: GlobalVariantKey;
}

/**
 * Props for PricingCardCTA sub-component
 */
export interface PricingCardCTAProps {
  plan: PricingCardData;
  _isHovered: boolean;
  tooltipStates: TooltipStates;
  onClick: () => void;
  _variant?: GlobalVariantKey;
}

/**
 * Props for PricingCardTooltip sub-component
 */
export interface PricingCardTooltipProps {
  planName: string;
  visible: boolean;
  content: ReactNode;
  type: 'beta' | 'elite' | 'basic';
  variant?: GlobalVariantKey;
}

/**
 * Animation hook return type - updated to match hook implementation
 */
export interface PricingCardAnimationHook {
  animationState: AnimationState;
  isHovered: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  renderExplosionParticles: () => ReactNode;
}

/**
 * Configuration options for the animation hook
 */
export interface AnimationConfig {
  /** Whether animations are enabled */
  enableAnimation: boolean;
  /** Plan type for determining animation behavior */
  planType: 'pro' | 'basic' | 'elite' | 'default';
  /** Initial animation state */
  initialState?: AnimationState;
} 