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
                themeVariants: Record<string, string>;

                /**
                 * Other WordPress data can be added here
                 */
                [key: string]: any;
            };
        };
    }
}

export { };
