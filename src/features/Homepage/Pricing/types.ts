import { ReactNode } from 'react';

export interface PlanFeature {
  id: number;
  text: string;
  included: boolean;
  isHighlighted?: boolean;
  tooltip?: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  betaPrice?: string;
  period: string;
  features: PlanFeature[];
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
  accentColors?: string;
  titleTextColors?: string;
  priceTextColors?: string;
  accentTextColor?: string;
  icon?: ReactNode;
  badge?: string;
}

export interface PricingProps {
  pricing?: PricingPlan[];
} 