import React, { lazy, Suspense } from 'react';

interface LazyLoadOptions {
    /**
     * Custom fallback component to show while loading
     * @default default skeleton loader
     */
    fallback?: React.ReactNode;

    /**
     * Error boundary fallback to show on error
     * @default generic error UI
     */
    errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;

    /**
     * Minimum delay before showing component (prevents flash)
     * @default 0
     */
    delay?: number;

    /**
     * Whether to prefetch the component
     * @default false
     */
    prefetch?: boolean;
}

/**
 * Default skeleton loader for lazy loaded components
 */
const DefaultSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div
        className={`lazy-loading-skeleton ${className}`}
        role="status"
        aria-busy="true"
        aria-live="polite"
    >
        <div className="skeleton-animation"></div>
        <span className="visually-hidden">Loading...</span>
    </div>
);

/**
 * Default error fallback for lazy loaded components
 */
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
    <div className="lazy-loading-error" role="alert">
        <h3>Something went wrong</h3>
        <p>{error.message || 'Failed to load component'}</p>
        <button onClick={retry} className="retry-button">
            Try Again
        </button>
    </div>
);

/**
 * Error boundary component for handling lazy loading errors
 */
class ErrorBoundary extends React.Component<
    {
        children: React.ReactNode;
        fallback: React.ComponentType<{ error: Error; retry: () => void }>;
    },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode; fallback: React.ComponentType<{ error: Error; retry: () => void }> }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        const { hasError, error } = this.state;
        const { children, fallback: Fallback } = this.props;

        if (hasError && error) {
            return <Fallback error={error} retry={this.handleRetry} />;
        }

        return children;
    }
}

/**
 * Creates a lazy-loaded component with error boundary and custom fallback
 * 
 * @param factory Function that imports the component
 * @param options Configuration options for lazy loading
 * @returns Lazy-loaded component with error handling
 * 
 * @example
 * // Basic usage
 * const LazyHero = lazyLoad(() => import('../features/Homepage/Hero/Hero'));
 * 
 * @example
 * // With custom fallback
 * const LazyTraining = lazyLoad(
 *   () => import('../features/Homepage/Training/Training'),
 *   { 
 *     fallback: <TrainingSkeleton />,
 *     prefetch: true
 *   }
 * );
 */
export function lazyLoad<T extends React.ComponentType<any>>(
    factory: () => Promise<{ default: T }>,
    options: LazyLoadOptions = {}
): React.ComponentType<React.ComponentProps<T>> {
    const {
        fallback = <DefaultSkeleton />,
        errorFallback = DefaultErrorFallback,
        delay = 0,
        prefetch = false
    } = options;

    // Create the lazy component
    const LazyComponent = lazy(() => {
        if (delay > 0) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(factory());
                }, delay);
            });
        }
        return factory();
    });

    // Handle prefetching
    if (prefetch) {
        // Prefetch in the next idle period
        window.requestIdleCallback?.(() => {
            factory().catch(() => {
                // Silent prefetch error
            });
        }, { timeout: 2000 });
    }

    // Return wrapped component
    return (props: React.ComponentProps<T>) => (
        <ErrorBoundary fallback={errorFallback}>
            <Suspense fallback={fallback}>
                <LazyComponent {...props} />
            </Suspense>
        </ErrorBoundary>
    );
}

/**
 * Creates a variant-aware lazy loaded component that only loads the selected variant
 * 
 * @param variantMap Map of variant keys to component import factories
 * @param options Configuration options for lazy loading
 * @returns A component that will dynamically load the selected variant
 * 
 * @example
 * const LazyFeatures = lazyLoadVariant({
 *   default: () => import('../features/Homepage/Features/variants/default'),
 *   sports: () => import('../features/Homepage/Features/variants/sports'),
 *   wellness: () => import('../features/Homepage/Features/variants/wellness')
 * });
 * 
 * // Later in JSX:
 * <LazyFeatures variant="sports" />
 */
export function lazyLoadVariant<V extends string, P extends { variant?: V }>(
    variantMap: Record<string, () => Promise<{ default: React.ComponentType<P> }>>,
    options: LazyLoadOptions = {}
): React.ComponentType<P> {
    const lazyVariants: Record<string, React.ComponentType<P>> = {};

    // Create lazy component for each variant
    Object.entries(variantMap).forEach(([variant, factory]) => {
        lazyVariants[variant] = lazyLoad(factory, options);
    });

    // Return component that renders the appropriate variant
    return function VariantComponent(props: P) {
        const variant = (props.variant || 'default') as string;
        const Component = lazyVariants[variant] || lazyVariants['default'];

        return <Component {...props} />;
    };
}

export default lazyLoad; 