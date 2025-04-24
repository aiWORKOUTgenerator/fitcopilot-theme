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
    return getHomepageVariant<T>(componentKey, defaultVariant);
} 