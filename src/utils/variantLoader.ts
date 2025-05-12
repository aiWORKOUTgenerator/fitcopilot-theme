import React from 'react';
import { ThemeVariant } from '../types/theme';
import logger from './logger';

/**
 * Enhanced Variant Loader Utility
 * 
 * This utility provides dynamic loading of component variants based on the theme
 * setting or user preferences. It uses React's lazy loading to reduce initial
 * bundle size by dynamically importing variant components when needed.
 */

// Type definitions for variant components
export type VariantKey = ThemeVariant;

// Map of variant to component path (for dynamic imports)
const variantPaths: Record<ThemeVariant, string> = {
    'default': 'default',
    'modern': 'modern',
    'wellness': 'wellness',
    'sports': 'sports',
    'gym': 'gym',
    'boutique': 'boutique',
    'classic': 'classic',
    'minimalist': 'minimalist',
    'registration': 'registration'
};

// Generic component type
export type GenericComponent<P = Record<string, unknown>> = React.ComponentType<P>;

// Cache for loaded variant components
const variantCache: Record<string, Record<VariantKey, GenericComponent>> = {};

/**
 * Dynamic variant importer function
 * 
 * @param featurePath Path to the feature (e.g., 'Homepage/Hero')
 * @param variant Variant key to load
 * @returns Promise that resolves to the variant component
 */
export const importVariant = async (
    featurePath: string,
    variant: VariantKey = 'default'
): Promise<GenericComponent> => {
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
export const getComponentVariant = <P extends Record<string, unknown>>(
    variantMap: Record<VariantKey, GenericComponent<P>>,
    defaultVariant: GenericComponent<P>
): GenericComponent<P> => {
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
 * Component props type with optional variant
 */
export interface VariantComponentProps extends Record<string, unknown> {
    variant?: VariantKey;
    fallback?: React.ReactNode;
}

/**
 * Creates a React component that dynamically loads the appropriate variant
 * 
 * @param featurePath Path to the feature (e.g., 'Homepage/Hero')
 * @returns A component that will render the appropriate variant
 */
export const createVariantComponent = <P extends VariantComponentProps>(featurePath: string): React.FC<P> => {
    // Create a React component
    const VariantLoader: React.FC<P> = (props) => {
        // Determine which variant to use (from data-theme attribute or props)
        const [_variant, setVariant] = React.useState<VariantKey>('default');
        const [VariantComponent, setVariantComponent] = React.useState<GenericComponent<P> | null>(null);
        const [isLoading, setIsLoading] = React.useState(true);
        const [error, setError] = React.useState<Error | null>(null);

        // Effect to determine and load the variant
        React.useEffect(() => {
            const determineVariant = () => {
                // First check props for variant
                if (props.variant && variantPaths[props.variant as ThemeVariant]) {
                    return props.variant as VariantKey;
                }

                // Then check for body data-theme attribute
                const bodyTheme = document.body.getAttribute('data-theme');
                if (bodyTheme && variantPaths[bodyTheme as ThemeVariant]) {
                    return bodyTheme as VariantKey;
                }

                // Default fallback
                return 'default' as VariantKey;
            };

            const selectedVariant = determineVariant();
            setVariant(selectedVariant);

            // Load the variant if not already cached
            if (!variantCache[featurePath]) {
                variantCache[featurePath] = {} as Record<VariantKey, GenericComponent<P>>;
            }

            // If we have the component in cache, use it
            if (variantCache[featurePath][selectedVariant]) {
                setVariantComponent(variantCache[featurePath][selectedVariant] as GenericComponent<P>);
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
                    setVariantComponent(() => Component as GenericComponent<P>);
                    setIsLoading(false);
                })
                .catch(err => {
                    logger.error(`Failed to load variant ${selectedVariant} for ${featurePath}:`, err);
                    setError(err as Error);
                    setIsLoading(false);
                });
        }, [props.variant]);  // Remove featurePath dependency as it doesn't change

        // Show loading state
        if (isLoading) {
            return props.fallback as React.ReactElement || React.createElement('div', { className: "lazy-loading-skeleton" });
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
        return React.createElement(VariantComponent, props as unknown as P);
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
export const createLazyVariantComponent = <P extends Record<string, unknown>>(featurePath: string): React.LazyExoticComponent<React.ComponentType<P>> => {
    return React.lazy(() => {
        // Determine variant from data-theme attribute
        const bodyTheme = document.body.getAttribute('data-theme');
        const variant = (bodyTheme && variantPaths[bodyTheme as ThemeVariant]) ?
            bodyTheme as VariantKey : 'default';

        return importVariant(featurePath, variant)
            .then(module => {
                // Return in the format expected by React.lazy
                return { default: module as React.ComponentType<P> };
            });
    });
};

/**
 * Utility to preload specific variants
 * 
 * @param featurePath Path to the feature
 * @param variants Array of variants to preload
 */
export const preloadVariants = (featurePath: string, variants: VariantKey[] = ['default']): void => {
    variants.forEach(variant => {
        // Preload the variant
        importVariant(featurePath, variant)
            .then(module => {
                // Cache the module
                if (!variantCache[featurePath]) {
                    variantCache[featurePath] = {} as Record<VariantKey, GenericComponent>;
                }

                variantCache[featurePath][variant] = module;
                logger.debug(`Preloaded variant ${variant} for ${featurePath}`);
            })
            .catch(err => {
                logger.error(`Failed to preload variant ${variant} for ${featurePath}:`, err);
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