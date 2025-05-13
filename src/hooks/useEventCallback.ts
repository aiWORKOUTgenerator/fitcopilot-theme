import { useCallback, useRef } from 'react';

/**
 * A hook that returns a memorized callback that changes if one of the dependencies changes.
 * Similar to useCallback, but guarantees that the latest callback is called even if
 * the dependencies haven't changed.
 * 
 * This is useful when the callback needs to access the latest props or state but shouldn't
 * trigger re-renders when those values change.
 * 
 * @param callback The callback to memoize
 * @param dependencies Dependencies array that will trigger a new callback when changed
 * @returns A memoized callback function
 */
function useEventCallback<T extends (...args: unknown[]) => unknown>(
    callback: T,
    dependencies: React.DependencyList
): T {
    // Use a ref to store the most recent callback
    const callbackRef = useRef<T>(callback);

    // Update the ref whenever the callback changes
    callbackRef.current = callback;

    // The callback memorizes the last callback passed to useEventCallback but accesses latest values
    // This is intentionally passing a variable dependency array - we want to use the passed dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const stableCallback = useCallback(
        ((...args) => {
            // Call the most recent callback from the ref
            return callbackRef.current(...args);
        }) as T,
        // For this specialized hook, using a variable dependency array is intentional
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
        dependencies
    );

    return stableCallback;
}

export default useEventCallback; 