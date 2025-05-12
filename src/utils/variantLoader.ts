import React from 'react';
import logger from './logger';

/**
 * Enhanced Variant Loader Utility
 * 
 * This utility provides dynamic loading of component variants based on the theme
 * setting or user preferences. It uses React's lazy loading to reduce initial
 * bundle size by dynamically importing variant components when needed.
 */

// Type definitions for variant components
export type VariantKey = 'default' | 'modern' | 'wellness' | 'sports' | 'boutique' | 'classic' | 'minimalist' | 'registration';

// Map of variant to component path (for dynamic imports)
const variantPaths: Record<string, string> = {
    'default': 'default',
    'modern': 'modern',
    'wellness': 'wellness',
    'sports': 'sports',
    'boutique': 'boutique',
    'classic': 'classic',
    'minimalist': 'minimalist',
    'registration': 'registration'
};

// Cache for loaded variant components
const variantCache: Record<string, Record<VariantKey, any>> = {};

/**
 * Dynamic variant importer function
 * 
 * @param featurePath Path to the feature (e.g., 'Homepage/Hero')
 * @param variant Variant key to load
 * @returns Promise that resolves to the variant component
 */
export const importVariant = async (featurePath: string, variant: VariantKey = 'default') => {
    try {
        // Use actual variant path or fallback to default
        const variantPathKey = variantPaths[variant] || 'default';

        // Dynamic import based on feature path and variant
        // Use a more specific path to avoid webpack trying to load all files
        const module = await import(`../features/${featurePath}/variants/${variantPathKey}/index.ts`);

        // Return the component or fallback to default export
        return module.default || module;
    } catch (err) {
        logger.error(`Error loading variant ${variant} for ${featurePath}:`, err);

        // Fallback to default variant
        if (variant !== 'default') {
            logger.info(`Falling back to default variant for ${featurePath}`);
            return importVariant(featurePath, 'default');
        }

        // If even the default fails, throw the error
        throw err;
    }
};

/**
 * Gets the appropriate component variant based on the current theme
 * 
 * @param variantMap Map of available variants
 * @param defaultVariant Default variant to use if none matches
 * @returns The appropriate variant component
 */
export const getComponentVariant = (
    variantMap: Record<VariantKey, React.ComponentType<any>>,
    defaultVariant: React.ComponentType<any>
): React.ComponentType<any> => {
    // Determine which variant to use from data-theme attribute or default
    const bodyTheme = document.body.getAttribute('data-theme') as VariantKey;

    // Check if variant exists in map
    if (bodyTheme && variantMap[bodyTheme]) {
        return variantMap[bodyTheme];
    }

    // Return default variant
    return defaultVariant || variantMap.default || variantMap.modern;
};

/**
 * Creates a React component that dynamically loads the appropriate variant
 * 
 * @param featurePath Path to the feature (e.g., 'Homepage/Hero')
 * @returns A component that will render the appropriate variant
 */
export const createVariantComponent = (featurePath: string) => {
    // Create a React component
    const VariantLoader = (props: Record<string, unknown>) => {
        // Determine which variant to use (from data-theme attribute or props)
        const [variant, setVariant] = React.useState<VariantKey>('default');
        const [VariantComponent, setVariantComponent] = React.useState<React.ComponentType<any> | null>(null);
        const [isLoading, setIsLoading] = React.useState(true);
        const [error, setError] = React.useState<Error | null>(null);

        // Effect to determine and load the variant
        React.useEffect(() => {
            const determineVariant = () => {
                // First check props for variant
                if (props.variant && variantPaths[props.variant]) {
                    return props.variant as VariantKey;
                }

                // Then check for body data-theme attribute
                const bodyTheme = document.body.getAttribute('data-theme');
                if (bodyTheme && variantPaths[bodyTheme]) {
                    return bodyTheme as VariantKey;
                }

                // Default fallback
                return 'default' as VariantKey;
            };

            const selectedVariant = determineVariant();
            setVariant(selectedVariant);

            // Load the variant if not already cached
            if (!variantCache[featurePath]) {
                variantCache[featurePath] = {} as Record<VariantKey, any>;
            }

            // If we have the component in cache, use it
            if (variantCache[featurePath][selectedVariant]) {
                setVariantComponent(variantCache[featurePath][selectedVariant]);
                setIsLoading(false);
                return;
            }

            // Otherwise, dynamically import it
            setIsLoading(true);
            importVariant(featurePath, selectedVariant)
                .then(module => {
                    // Cache the component
                    const Component = module.default || module;
                    variantCache[featurePath][selectedVariant] = Component;
                    setVariantComponent(() => Component);
                    setIsLoading(false);
                })
                .catch(err => {
                    logger.error(`Failed to load variant ${selectedVariant} for ${featurePath}:`, err);
                    setError(err);
                    setIsLoading(false);
                });
        }, [props.variant]);  // Remove featurePath dependency as it doesn't change

        // Show loading state
        if (isLoading) {
            return props.fallback || React.createElement('div', { className: "lazy-loading-skeleton" });
        }

        // Show error state
        if (error || !VariantComponent) {
            return React.createElement('div', { className: "variant-error" },
                React.createElement('p', null, 'Failed to load component'),
                process.env.NODE_ENV !== 'production' && error &&
                React.createElement('pre', null, error.message)
            );
        }

        // Render the variant component with props
        return React.createElement(VariantComponent, props);
    };

    // Add display name to fix linting error
    VariantLoader.displayName = `VariantLoader(${featurePath.split('/').pop() || 'Component'})`;

    return VariantLoader;
};

/**
 * Creates a lazy-loaded variant component using React.lazy
 * 
 * @param featurePath Path to the feature (e.g., 'Homepage/Hero')
 * @returns A lazy-loaded component that will render the appropriate variant
 */
export const createLazyVariantComponent = (featurePath: string) => {
    return React.lazy(() => {
        // Determine variant from data-theme attribute
        const bodyTheme = document.body.getAttribute('data-theme');
        const variant = (bodyTheme && variantPaths[bodyTheme]) ?
            bodyTheme as VariantKey : 'default';

        return importVariant(featurePath, variant)
            .then(module => {
                // Return in the format expected by React.lazy
                return { default: module.default || module };
            });
    });
};

/**
 * Utility to preload specific variants
 * 
 * @param featurePath Path to the feature
 * @param variants Array of variants to preload
 */
export const preloadVariants = (featurePath: string, variants: VariantKey[] = ['default']) => {
    variants.forEach(variant => {
        // Create a prefetch link element
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = `/wp-content/themes/fitcopilot/dist/chunks/variant-${variant.toLowerCase()}.js`;
        link.as = 'script';
        document.head.appendChild(link);

        // Also start the actual import (but don't wait for it)
        importVariant(featurePath, variant).catch(() => {
            // Silently catch any errors during preloading
        });
    });
};

export default {
    importVariant,
    createVariantComponent,
    createLazyVariantComponent,
    preloadVariants,
    getComponentVariant
}; 