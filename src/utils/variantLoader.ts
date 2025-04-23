import React from 'react';

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
        const { variant = defaultVariant, ...restProps } = props;
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
    return (variants[componentKey] as T) || defaultVariant;
} 