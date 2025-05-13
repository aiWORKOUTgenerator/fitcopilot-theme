/* eslint-disable @typescript-eslint/no-explicit-any */
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

        /**
         * Global logger utility
         * Available as fallback when imports fail
         */
        logger: {
            debug: (message: string, ...data: unknown[]) => void;
            info: (message: string, ...data: unknown[]) => void;
            warn: (message: string, ...data: unknown[]) => void;
            error: (message: string, ...data: unknown[]) => void;
            captureError: (err: unknown, context?: Record<string, unknown>) => void;
            group: (label: string, callback: () => void) => void;
            time: (label: string) => string;
            timeEnd: (timerId: string) => void;
            addContext: (component: string) => {
                debug: (msg: string, ...args: unknown[]) => void;
                info: (msg: string, ...args: unknown[]) => void;
                warn: (msg: string, ...args: unknown[]) => void;
                error: (msg: string, ...args: unknown[]) => void;
                captureError: (err: unknown, context?: Record<string, unknown>) => void;
                time: (label: string) => string;
                timeEnd: (timerId: string) => void;
                group: (label: string, callback: () => void) => void;
            };
            setLogLevel: (level: number) => void;
            LogLevel: {
                DEBUG: number;
                INFO: number;
                WARN: number;
                ERROR: number;
            };
        };
    }
}

export { };
