/**
 * Interface for WordPress data returned from the REST API
 */

export interface Feature {
    id: number;
    title: string;
    description: string;
    icon?: string;
    link?: string;
}

export interface JourneyStep {
    id: number;
    title: string;
    description: string;
    image?: string;
    step: number;
    number: number;
}

export interface Testimonial {
    id: number;
    name: string;
    role: string;
    content: string;
    quote: string;
    avatar?: string;
    rating?: number;
}

export interface PlanFeature {
    id: number;
    text: string;
    included: boolean;
}

export interface PricingPlan {
    id: number;
    title: string;
    name: string;
    description: string;
    price: string;
    period: string;
    currency?: string;
    interval?: string;
    features: PlanFeature[];
    isPopular?: boolean;
    popular?: boolean;
    ctaLabel?: string;
    ctaLink: string;
    ctaText: string;
}

export interface FooterLink {
    id: number;
    title: string;
    url: string;
    group?: string;
}

export interface FooterLinkGroup {
    id: number;
    title: string;
    links: FooterLink[];
}

export interface WordPressData {
    siteLinks?: {
        registration?: string;
        login?: string;
    };
    assets?: {
        logo?: string;
    };
    themeVariants?: Record<string, string>;
    demoMode?: boolean;
    features?: Feature[];
    journey?: JourneyStep[];
    testimonials?: Testimonial[];
    pricing?: PricingPlan[];
    footerLinks?: FooterLinkGroup[];
} 