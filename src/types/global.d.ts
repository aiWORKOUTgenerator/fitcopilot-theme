/**
 * Global TypeScript declarations
 */
declare global {
    interface Window {
        /**
         * WordPress localized data for theme variants and other settings
         */
        athleteDashboardData?: {
            wpData: {
                /**
                 * Theme variants configuration
                 * Maps component keys to variant names
                 */
                themeVariants?: Record<string, string>;

                /**
                 * Demo mode flag
                 * When true, shows navigation and variant switchers
                 */
                demoMode?: boolean;

                /**
                 * Site links for navigation
                 */
                siteLinks?: {
                    registration?: string;
                    login?: string;
                };

                /**
                 * Site assets like logo
                 */
                assets?: {
                    logo?: string;
                };

                /**
                 * Other WordPress data can be added here
                 */
                [key: string]: any;
            };
        };

        /**
         * Animation on scroll library
         */
        AOS?: {
            init: (options: object) => void;
            refresh: () => void;
        };
    }
}

export { };
