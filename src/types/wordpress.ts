/**
 * WordPress API Types
 *
 * This file contains type definitions for WordPress API responses and data structures,
 * ensuring type safety when interacting with the WordPress backend.
 */

/**
 * WordPress global data interface
 */
export interface WordPressGlobalData {
    wpData?: WordPressData;
}

/**
 * WordPress data structure
 */
export interface WordPressData {
    /** Site links and navigation */
    siteLinks?: {
        /** Registration page URL */
        registration?: string;
        /** Login page URL */
        login?: string;
        /** Dashboard page URL */
        dashboard?: string;
        /** Workout page URL */
        workout?: string;
        /** Profile page URL */
        profile?: string;
        /** Logout endpoint */
        logout?: string;
    };

    /** Static assets */
    assets?: {
        /** Logo URL */
        logo?: string;
        /** Favicon URL */
        favicon?: string;
        /** Hero background image */
        heroBackground?: string;
        /** Default avatar image */
        defaultAvatar?: string;
    };

    /** Theme variants configuration */
    themeVariants?: Record<string, string>;

    /** Demo mode flag */
    demoMode?: boolean;

    /** REST API configuration */
    restApi?: {
        /** Base URL for REST API */
        baseUrl?: string;
        /** Nonce for authentication */
        nonce?: string;
        /** User ID if authenticated */
        userId?: number;
    };

    /** Features list */
    features?: Feature[];

    /** Journey steps configuration */
    journey?: JourneyStep[];

    /** Testimonials */
    testimonials?: Testimonial[];

    /** Pricing plans */
    pricing?: PricingPlan[];

    /** Footer links */
    footerLinks?: FooterLinkGroup[];
}

/**
 * Feature item structure
 */
export interface Feature {
    /** Unique identifier */
    id: string;
    /** Feature title */
    title: string;
    /** Feature description */
    description: string;
    /** Icon name or path */
    icon?: string;
    /** Feature image URL */
    imageUrl?: string;
    /** Call to action link */
    ctaLink?: string;
    /** Call to action text */
    ctaText?: string;
}

/**
 * Journey step configuration
 */
export interface JourneyStep {
    /** Unique identifier */
    id: string;
    /** Step number */
    stepNumber: number;
    /** Step title */
    title: string;
    /** Step description */
    description: string;
    /** Icon name or path */
    icon?: string;
    /** Step image URL */
    imageUrl?: string;
    /** Whether step is initially expanded */
    isExpanded?: boolean;
}

/**
 * Testimonial structure
 */
export interface Testimonial {
    /** Unique identifier */
    id: string;
    /** Author name */
    author: string;
    /** Author role or title */
    role?: string;
    /** Testimonial content */
    content: string;
    /** Rating (1-5) */
    rating?: number;
    /** Author avatar URL */
    avatarUrl?: string;
    /** Before/after image URL */
    beforeAfterImage?: string;
}

/**
 * Pricing plan structure
 */
export interface PricingPlan {
    /** Unique identifier */
    id: string;
    /** Plan name */
    name: string;
    /** Plan description */
    description: string;
    /** Price */
    price: number | string;
    /** Billing period */
    billingPeriod?: string;
    /** Is featured plan */
    isFeatured?: boolean;
    /** Features included */
    features: string[];
    /** Call to action text */
    ctaText: string;
    /** Call to action link */
    ctaLink: string;
}

/**
 * Footer link group structure
 */
export interface FooterLinkGroup {
    /** Group title */
    title: string;
    /** Links in this group */
    links: FooterLink[];
}

/**
 * Footer link structure
 */
export interface FooterLink {
    /** Link text */
    text: string;
    /** Link URL */
    url: string;
    /** Open in new tab */
    newTab?: boolean;
}

/**
 * WordPress REST API response structure
 */
export interface WordPressApiResponse<T> {
    /** Response data */
    data: T;
    /** Response status */
    status: number;
    /** Response headers */
    headers: Record<string, string>;
}

/**
 * WordPress error response
 */
export interface WordPressApiError {
    /** Error code */
    code: string;
    /** Error message */
    message: string;
    /** Error data */
    data?: {
        /** HTTP status */
        status: number;
        /** Additional details */
        details?: Record<string, unknown>;
    };
}

/**
 * WordPress service data structure
 */
export interface WordPressServiceData {
    /** Site links */
    siteLinks: {
        /** Registration page URL */
        registration: string;
        /** Login page URL */
        login: string;
    };
    /** Static assets */
    assets: {
        /** Logo URL */
        logo: string;
    };
    /** Theme variants configuration */
    themeVariants: Record<string, string>;
    /** Demo mode flag */
    demoMode: boolean;
    /** Features list */
    features: Feature[];
    /** Journey steps */
    journey: JourneyStep[];
    /** Testimonials */
    testimonials: Testimonial[];
    /** Pricing plans */
    pricing: PricingPlan[];
    /** Footer links */
    footerLinks: FooterLinkGroup[];
}

/**
 * WordPress service event handlers
 */
export interface WordPressServiceEventHandlers {
    /** Handler for data changes */
    onDataChange?: (data: WordPressServiceData) => void;
}

/**
 * Global window augmentation to include WordPress data
 */
declare global {
    interface Window {
        /** WordPress global data */
        athleteDashboardData?: WordPressGlobalData;
    }
} 