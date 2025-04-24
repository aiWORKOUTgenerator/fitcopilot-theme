/**
 * Homepage service hook
 * 
 * Provides access to WordPress data specifically formatted for Homepage needs
 * Abstracts the service implementation details from the Homepage components
 */

import { useEffect, useState } from 'react';
import { wordPressService, WordPressServiceData } from '../../../services';

export interface HomepageData {
    siteLinks: {
        registration: string;
        login: string;
    };
    assets: {
        logo: string;
    };
    features: any[];
    journey: any[];
    testimonials: any[];
    pricing: any[];
    footerLinks: any[];
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
    // Prefix the key to namespace it for the Homepage feature
    const homepageKey = `homepage_${key}`;
    return wordPressService.getThemeVariant(homepageKey, defaultVariant);
} 