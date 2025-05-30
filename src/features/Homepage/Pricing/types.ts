import { PlanFeature as SharedPlanFeature, PricingPlan as SharedPricingPlan } from '../../../components/UI/PricingCard';
import { GlobalVariantKey } from '../types/shared';

// Re-export the shared types
export type PlanFeature = SharedPlanFeature;
export type PricingPlan = SharedPricingPlan;

export interface PricingProps {
  pricing?: PricingPlan[];
  /**
   * Theme variant to use for styling
   */
  variant?: GlobalVariantKey;
} 