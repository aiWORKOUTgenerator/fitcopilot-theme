import * as React from 'react';
import { getHomepageVariant } from '../hooks/useHomepageService';

/**
 * Creates a variant-aware component specifically for Homepage features
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
        
        // Debug: Log when component renders with specified variant
        console.log(`Rendering variant component with variant: ${variant}`);
        
        // If the specified variant doesn't exist in the map, use default
        if (!variantMap[variant]) {
            console.warn(`Variant "${variant}" not found in variant map, using default instead`);
        }
        
        // Use the specified variant or fall back to default
        const Component = variantMap[variant] || variantMap[defaultVariant];

        // Cast is needed because we're removing the variant prop
        return React.createElement(Component, restProps as Omit<Props, 'variant'>);
    };
}

/**
 * Gets a specific component variant from WordPress settings for the Homepage
 * 
 * @param componentKey The component key in WordPress settings
 * @param defaultVariant The default variant to return if not found
 * @returns The variant name to use
 */
export function getComponentVariant<T extends string>(
    componentKey: string,
    defaultVariant: T
): T {
    // Check if window.athleteDashboardData is available for debugging
    if (typeof window !== 'undefined' && window.athleteDashboardData?.wpData) {
        console.log('Debug - window.athleteDashboardData.wpData:', window.athleteDashboardData.wpData);
    }
    
    // Get variant from WordPress settings
    const variant = getHomepageVariant<T>(componentKey, defaultVariant);
    
    // Add additional debugging
    console.log(`getComponentVariant: key=${componentKey}, result=${variant}`);
    
    return variant;
} 