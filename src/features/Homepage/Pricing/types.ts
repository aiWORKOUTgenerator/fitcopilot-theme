import { PlanFeature as SharedPlanFeature, PricingPlan as SharedPricingPlan } from '../../../components/UI/PricingCard';

// Re-export the shared types
export type PlanFeature = SharedPlanFeature;
export type PricingPlan = SharedPricingPlan;

export interface PricingProps {
  pricing?: PricingPlan[];
} 