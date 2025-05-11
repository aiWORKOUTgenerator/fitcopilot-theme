import { useEffect, useState } from 'react';

/**
 * Hook that detects if the user prefers reduced motion
 * @returns {boolean} True if the user prefers reduced motion
 */
export const useReducedMotion = (): boolean => {
    // Default to false initially since we can't access window during SSR
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Check if window is available (client-side)
        if (typeof window === 'undefined') return;

        // Get the initial value
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        // Set up event listener for changes
        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            };
        }
        // Legacy support
        else if ('addListener' in mediaQuery) {
            // @ts-expect-error - Older TypeScript doesn't know about addListener
            mediaQuery.addListener(handleChange);
            return () => {
                // @ts-expect-error - Older TypeScript doesn't know about removeListener
                mediaQuery.removeListener(handleChange);
            };
        }
    }, []);

    return prefersReducedMotion;
};

export default useReducedMotion; 