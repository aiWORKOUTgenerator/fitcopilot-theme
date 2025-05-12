import { useEffect } from 'react';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        // Track if the component is still mounted
        let isMounted = true;
        // Store the cleanup function if returned from the async effect
        let cleanup: void | (() => void);

        // Execute the async function
        const execute = async () => {
            try {
                // Run the async effect
                cleanup = await asyncEffect();
            } catch (error) {
                // If there's an error and the component is still mounted, call the error handler
                if (isMounted && onError && error instanceof Error) {
                    onError(error);
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
    }, dependencies);
}

export default useAsyncEffect; 