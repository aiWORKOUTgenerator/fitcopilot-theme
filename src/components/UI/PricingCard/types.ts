import { ReactNode } from 'react';

/**
 * Interface for individual feature in a pricing plan
 */
export interface PlanFeature {
    id: number;
    text: string;
    included: boolean;
    isHighlighted?: boolean;
    tooltip?: string;
    renderFeature?: () => ReactNode;
}

/**
 * Interface for a complete pricing plan
 */
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
    onClick?: () => void; // Added to support both link and onClick functionality
}

/**
 * Props for the PricingCard component
 */
export interface PricingCardProps {
    name: string;
    description: string;
    price: string;
    period: string;
    features: PlanFeature[];
    ctaText: string;
    ctaLink?: string;
    onClick?: () => void;
    popular?: boolean;
} 