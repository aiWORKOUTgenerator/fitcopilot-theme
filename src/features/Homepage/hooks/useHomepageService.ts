/**
 * Homepage service hook
 * 
 * Provides access to WordPress data specifically formatted for Homepage needs
 * Abstracts the service implementation details from the Homepage components
 */

import { useEffect, useState } from 'react';
import { wordPressService, WordPressServiceData } from '../../../services';
import logger from '../../../utils/logger';

export interface Feature {
    id: string;
    title: string;
    description: string;
    icon?: string;
    link?: string;
}

export interface JourneyStep {
    id: string;
    title: string;
    description: string;
    icon?: string;
    order: number;
}

export interface Testimonial {
    id: string;
    author: string;
    content: string;
    rating: number;
    avatar?: string;
}

export interface PricingPlan {
    id: string;
    name: string;
    price: number;
    features: string[];
    popular?: boolean;
}

export interface FooterLink {
    id: string;
    title: string;
    url: string;
    category: string;
}

export interface HomepageData {
    siteLinks: {
        registration: string;
        login: string;
    };
    assets: {
        logo: string;
    };
    features: Feature[];
    journey: JourneyStep[];
    testimonials: Testimonial[];
    pricing: PricingPlan[];
    footerLinks: FooterLink[];
    demoMode: boolean;
}

/**
 * Hook that provides WordPress data formatted for the Homepage
 * 
 * @returns Homepage-specific data from WordPress
 */
export const useHomepageService = (): HomepageData => {
    // Initialize state with current data
    const [data, setData] = useState<HomepageData>(() => {
        const wpData = wordPressService.getData();
        return formatHomepageData(wpData);
    });

    // Subscribe to data changes
    useEffect(() => {
        // Create subscription to service
        const unsubscribe = wordPressService.subscribe({
            onDataChange: (newData) => {
                setData(formatHomepageData(newData));
            }
        });

        // Clean up subscription on unmount
        return unsubscribe;
    }, []);

    return data;
};

/**
 * Format WordPress data for Homepage use
 * 
 * @param wpData Raw WordPress data
 * @returns Homepage-specific formatted data
 */
function formatHomepageData(wpData: WordPressServiceData): HomepageData {
    return {
        siteLinks: wpData.siteLinks,
        assets: wpData.assets,
        features: wpData.features,
        journey: wpData.journey,
        testimonials: wpData.testimonials,
        pricing: wpData.pricing,
        footerLinks: wpData.footerLinks,
        demoMode: wpData.demoMode
    };
}

/**
 * Get a Homepage-specific theme variant
 * 
 * @param key Variant key
 * @param defaultVariant Default variant to use if not found
 * @returns The variant value
 */
export function getHomepageVariant<T extends string>(key: string, defaultVariant: T): T {
    // The PHP Customizer uses keys without prefix (e.g., 'fitcopilot_hero_variant')
    // Rather than adding a prefix, map directly to the key used in PHP
    const wpKey = `fitcopilot_${key}_variant`;

    // Get the variant value from WordPress service
    const variantValue = wordPressService.getThemeVariant(wpKey, defaultVariant);

    // Log for debugging
    logger.debug(`Getting variant for ${key}, using WP key: ${wpKey}, value: ${variantValue}`);

    return variantValue;
} 