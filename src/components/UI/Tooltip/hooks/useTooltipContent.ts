import { useMemo } from 'react';

/**
 * Custom hook for optimizing tooltip content rendering
 * This helps prevent unnecessary re-renders by memoizing complex content
 * 
 * @param contentRenderer A function that returns the tooltip content
 * @param deps Dependencies array for content memoization
 * @returns Memoized tooltip content
 */
export function useTooltipContent<T>(
    contentRenderer: (data: T) => React.ReactNode,
    data: T,
    deps: React.DependencyList = []
) {
    // Memoize the content based on dependencies
    return useMemo(() => {
        return contentRenderer(data);
        // Include data in dependencies to catch reference changes
    }, [contentRenderer, data, ...deps]);
}

/**
 * Example usage:
 * 
 * const tooltipContent = useTooltipContent(
 *   (userData) => (
 *     <div>
 *       <h3>{userData.name}</h3>
 *       <p>{userData.details}</p>
 *     </div>
 *   ),
 *   userData,
 *   [userData.id] // Only recompute if the user ID changes
 * );
 * 
 * <Tooltip content={tooltipContent}>
 *   <button>Hover me</button>
 * </Tooltip>
 */ 