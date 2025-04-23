export interface PlanFeature {
  id: number;
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  period: string;
  features: PlanFeature[];
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
}

export interface PricingProps {
  pricing?: PricingPlan[];
} 