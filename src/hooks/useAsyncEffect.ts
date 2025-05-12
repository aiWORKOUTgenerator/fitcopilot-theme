import { useEffect, useRef } from 'react';

/**
 * A hook that safely handles async functions in useEffect
 * Properly handles cleanup and avoids race conditions
 * 
 * @param asyncEffect The async function to run in the effect
 * @param dependencies Dependencies array that will trigger the effect when changed
 * @param onError Optional error handler function
 */
function useAsyncEffect(
    asyncEffect: () => Promise<void | (() => void)>,
    dependencies: React.DependencyList = [],
    onError?: (error: Error) => void
): void {
    // Use refs to avoid including function identities in dependencies
    const asyncEffectRef = useRef(asyncEffect);
    const onErrorRef = useRef(onError);

    // Keep refs updated with the latest values
    asyncEffectRef.current = asyncEffect;
    onErrorRef.current = onError;

    useEffect(() => {
        // Track if the component is still mounted
        let isMounted = true;
        // Store the cleanup function if returned from the async effect
        let cleanup: void | (() => void);

        // Execute the async function
        const execute = async () => {
            try {
                // Run the async effect
                cleanup = await asyncEffectRef.current();
            } catch (error) {
                // If there's an error and the component is still mounted, call the error handler
                if (isMounted && onErrorRef.current && error instanceof Error) {
                    onErrorRef.current(error);
                }
            }
        };

        // Start the async operation
        execute();

        // Return a cleanup function
        return () => {
            // Mark component as unmounted to prevent state updates on unmounted component
            isMounted = false;

            // Run the cleanup function if it was returned from the effect
            if (typeof cleanup === 'function') {
                cleanup();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencies]); // Spread dependencies to ensure it's always an array
}

export default useAsyncEffect; 