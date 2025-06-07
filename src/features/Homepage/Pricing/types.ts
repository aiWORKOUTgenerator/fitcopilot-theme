import { PlanFeature as SharedPlanFeature, PricingPlan as SharedPricingPlan } from '../../../components/UI/PricingCard/types';
import { AnimationConfig, GlobalVariantKey } from '../types/shared';

// Re-export shared types for backward compatibility
export type PlanFeature = SharedPlanFeature;
export type PricingPlan = SharedPricingPlan;

/**
 * Props interface for the Pricing component
 * Now includes comprehensive theme variant support
 */
export interface PricingProps {
  /** Optional pricing plans data array */
  pricing?: PricingPlan[];
  
  /**
   * Theme variant to use for styling
   * Supports all established Homepage theme variants
   */
  variant?: GlobalVariantKey;
  
  /**
   * Whether to show the yearly toggle
   * @default true
   */
  showYearlyToggle?: boolean;
  
  /**
   * Default pricing period
   * @default true (yearly)
   */
  defaultYearly?: boolean;
  
  /**
   * Whether to show background particles animation
   * @default true
   */
  showBackgroundParticles?: boolean;
  
  /**
   * Whether to enable Pro plan price animation
   * @default true
   */
  enablePriceAnimation?: boolean;
  
  /**
   * Custom CSS class name
   */
  className?: string;
  
  /**
   * Custom heading text
   * @default 'Exclusive Pricing'
   */
  headingText?: string;
  
  /**
   * Custom description text
   * @default 'Get early access to our AI-powered fitness platform and help shape its future with your valuable feedback.'
   */
  descriptionText?: string;
  
  /**
   * Callback when a plan is selected
   */
  onPlanSelect?: (planId: number, planName: string) => void;

  /**
   * Animation configuration
   */
  animationConfig?: AnimationConfig;
} 