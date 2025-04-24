/**
 * Concrete implementation of the WordPress service
 * 
 * This service accesses WordPress data from the window object
 * and provides it to the application. It includes fallback data
 * and event handling for data changes.
 */

import {
    Assets,
    SiteLinks,
    ThemeVariants,
    WordPressService,
    WordPressServiceData,
    WordPressServiceEventHandlers
} from '../interfaces/wordpress';

import {
    Feature,
    FooterLinkGroup,
    JourneyStep,
    PricingPlan,
    Testimonial
} from '../../types/wordpress';

class DefaultWordPressService implements WordPressService {
    private data: WordPressServiceData;
    private subscribers: WordPressServiceEventHandlers[] = [];

    constructor() {
        // Initialize with default/fallback data
        this.data = this.getInitialData();

        // Set up event listener for data changes if in browser environment
        if (typeof window !== 'undefined') {
            // Listen for custom event from WordPress
            window.addEventListener('athleteDashboardDataLoaded', this.handleDataChange);

            // Get initial data from window if available
            this.handleDataChange();
        }
    }

    /**
     * Get initial data with fallbacks
     */
    private getInitialData(): WordPressServiceData {
        const fallbackData: WordPressServiceData = {
            siteLinks: {
                registration: 'https://builder.fitcopilot.ai/register',
                login: 'https://builder.fitcopilot.ai/login',
            },
            assets: {
                logo: '/wp-content/themes/fitcopilot/assets/images/logo.png',
            },
            themeVariants: {},
            demoMode: false,
            features: [],
            journey: [],
            testimonials: [],
            pricing: [],
            footerLinks: [],
        };

        // Try to get data from window if available
        if (typeof window !== 'undefined' && window.athleteDashboardData?.wpData) {
            const wpData = window.athleteDashboardData.wpData;

            return {
                siteLinks: this.extractSiteLinks(wpData),
                assets: this.extractAssets(wpData),
                themeVariants: this.extractThemeVariants(wpData),
                demoMode: this.extractDemoMode(wpData),
                features: this.extractFeatures(wpData),
                journey: this.extractJourney(wpData),
                testimonials: this.extractTestimonials(wpData),
                pricing: this.extractPricing(wpData),
                footerLinks: this.extractFooterLinks(wpData),
            };
        }

        return fallbackData;
    }

    /**
     * Handle data change event from WordPress
     */
    private handleDataChange = () => {
        if (typeof window !== 'undefined' && window.athleteDashboardData?.wpData) {
            const wpData = window.athleteDashboardData.wpData;

            const newData: WordPressServiceData = {
                siteLinks: this.extractSiteLinks(wpData),
                assets: this.extractAssets(wpData),
                themeVariants: this.extractThemeVariants(wpData),
                demoMode: this.extractDemoMode(wpData),
                features: this.extractFeatures(wpData),
                journey: this.extractJourney(wpData),
                testimonials: this.extractTestimonials(wpData),
                pricing: this.extractPricing(wpData),
                footerLinks: this.extractFooterLinks(wpData),
            };

            // Update internal data
            this.data = newData;

            // Notify subscribers
            this.notifySubscribers();
        }
    };

    /**
     * Extract site links from WordPress data
     */
    private extractSiteLinks(wpData: any): SiteLinks {
        return {
            registration: wpData.siteLinks?.registration || this.data?.siteLinks.registration,
            login: wpData.siteLinks?.login || this.data?.siteLinks.login,
        };
    }

    /**
     * Extract assets from WordPress data
     */
    private extractAssets(wpData: any): Assets {
        return {
            logo: wpData.assets?.logo || this.data?.assets.logo,
        };
    }

    /**
     * Extract theme variants from WordPress data
     */
    private extractThemeVariants(wpData: any): ThemeVariants {
        return wpData.themeVariants || this.data?.themeVariants || {};
    }

    /**
     * Extract demo mode from WordPress data
     */
    private extractDemoMode(wpData: any): boolean {
        return wpData.demoMode || this.data?.demoMode || false;
    }

    /**
     * Extract features from WordPress data
     */
    private extractFeatures(wpData: any): Feature[] {
        return wpData.features || this.data?.features || [];
    }

    /**
     * Extract journey from WordPress data
     */
    private extractJourney(wpData: any): JourneyStep[] {
        return wpData.journey || this.data?.journey || [];
    }

    /**
     * Extract testimonials from WordPress data
     */
    private extractTestimonials(wpData: any): Testimonial[] {
        return wpData.testimonials || this.data?.testimonials || [];
    }

    /**
     * Extract pricing from WordPress data
     */
    private extractPricing(wpData: any): PricingPlan[] {
        return wpData.pricing || this.data?.pricing || [];
    }

    /**
     * Extract footer links from WordPress data
     */
    private extractFooterLinks(wpData: any): FooterLinkGroup[] {
        return wpData.footerLinks || this.data?.footerLinks || [];
    }

    /**
     * Notify all subscribers of data changes
     */
    private notifySubscribers() {
        this.subscribers.forEach((handlers) => {
            if (handlers.onDataChange) {
                handlers.onDataChange(this.data);
            }
        });
    }

    /**
     * Get the current WordPress data
     */
    public getData(): WordPressServiceData {
        return { ...this.data };
    }

    /**
     * Subscribe to data changes
     * @param handlers Event handlers for data changes
     * @returns Unsubscribe function
     */
    public subscribe(handlers: WordPressServiceEventHandlers): () => void {
        this.subscribers.push(handlers);

        // Return unsubscribe function
        return () => {
            const index = this.subscribers.indexOf(handlers);
            if (index > -1) {
                this.subscribers.splice(index, 1);
            }
        };
    }

    /**
     * Get a specific theme variant
     * @param key The variant key
     * @param defaultVariant Default value if variant doesn't exist
     */
    public getThemeVariant<T extends string>(key: string, defaultVariant: T): T {
        const variants = this.data.themeVariants;

        // Debug information
        console.log('Available theme variants:', variants);
        console.log(`Looking for variant with key: ${key}`);

        // First try the exact key
        if (variants[key] !== undefined) {
            console.log(`Found exact match for ${key}: ${variants[key]}`);
            return variants[key] as T;
        }

        // Then try without fitcopilot_ prefix if it exists
        if (key.startsWith('fitcopilot_') && key.endsWith('_variant')) {
            // Extract the middle part (e.g., 'hero' from 'fitcopilot_hero_variant')
            const shortKey = key.replace('fitcopilot_', '').replace('_variant', '');

            // Check if the short key exists
            if (variants[shortKey] !== undefined) {
                console.log(`Found match for ${shortKey}: ${variants[shortKey]}`);
                return variants[shortKey] as T;
            }
        }

        // If we're falling back to default, log this for debugging
        console.log(`No match found for ${key}, using default: ${defaultVariant}`);
        return defaultVariant;
    }
}

// Create singleton instance
const wordPressService = new DefaultWordPressService();

export default wordPressService; 