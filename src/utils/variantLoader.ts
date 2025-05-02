import * as React from 'react';

/**
 * Creates a variant-aware component loader
 * 
 * @param variantMap Record mapping variant keys to component implementations
 * @param defaultVariant The default variant to use if none specified or invalid
 * @returns A component that will load the appropriate variant
 */
export function createVariantComponent<
    VariantKey extends string,
    Props extends { variant?: VariantKey }
>(
    variantMap: Record<VariantKey, React.ComponentType<Omit<Props, 'variant'>>>,
    defaultVariant: VariantKey
): React.FC<Props> {
    return (props: Props) => {
        // FORCE REGISTRATION VARIANT FOR DEBUGGING
        const forceRegistration = true;
        const forceVariant = forceRegistration ? 'registration' as VariantKey : undefined;

        // Use forced variant, passed variant, or default
        const { variant = forceVariant || defaultVariant, ...restProps } = props;

        // Debug output when in development mode
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[VariantLoader] Rendering component with variant: ${variant}`);
            console.log(`[VariantLoader] Force registration is ${forceRegistration ? 'enabled' : 'disabled'}`);

            if (!variantMap[variant]) {
                console.warn(`[VariantLoader] Variant "${variant}" not found in variant map, using ${defaultVariant} instead`);
                console.log(`[VariantLoader] Available variants:`, Object.keys(variantMap));
            }
        }

        // Use the specified variant or fall back to default
        const Component = variantMap[variant] || variantMap[defaultVariant];

        // Cast is needed because we're removing the variant prop
        return React.createElement(Component, restProps as Omit<Props, 'variant'>);
    };
}

/**
 * WordPress data integration - reads variant settings from the global WP data
 * 
 * @returns An object containing all variant settings from WordPress
 */
export function getWordPressVariants(): Record<string, string> {
    // Debug output when in development mode
    if (process.env.NODE_ENV !== 'production') {
        console.log('[VariantLoader] Reading WordPress variants from global data');
        if (typeof window !== 'undefined') {
            console.log('[VariantLoader] athleteDashboardData:', window.athleteDashboardData);
            if (window.athleteDashboardData?.wpData) {
                console.log('[VariantLoader] wpData.themeVariants:', window.athleteDashboardData.wpData.themeVariants);
            }
        }
    }

    // Access the WordPress localized data if available
    if (typeof window !== 'undefined' &&
        window.athleteDashboardData &&
        window.athleteDashboardData.wpData &&
        typeof window.athleteDashboardData.wpData === 'object' &&
        'themeVariants' in window.athleteDashboardData.wpData &&
        window.athleteDashboardData.wpData.themeVariants) {
        return window.athleteDashboardData.wpData.themeVariants as Record<string, string>;
    }

    // Return empty object if data not available
    if (process.env.NODE_ENV !== 'production') {
        console.warn('[VariantLoader] No WordPress variants data found, returning empty object');
    }
    return {};
}

/**
 * Gets a specific component variant from WordPress settings
 * 
 * @param componentKey The component key in WordPress settings
 * @param defaultVariant The default variant to return if not found
 * @returns The variant name to use
 */
export function getComponentVariant<T extends string>(
    componentKey: string,
    defaultVariant: T
): T {
    const variants = getWordPressVariants();
    const result = (variants[componentKey] as T) || defaultVariant;

    // Debug output when in development mode
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[VariantLoader] Getting variant for "${componentKey}": ${result}`);
    }

    return result;
} 