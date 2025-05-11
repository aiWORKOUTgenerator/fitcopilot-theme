import { useMemo } from 'react';

/**
 * Custom hook for optimizing tooltip content rendering
 * This helps prevent unnecessary re-renders by memoizing complex content
 * 
 * @param contentRenderer A function that returns the tooltip content
 * @param data Data to use for rendering
 * @returns Memoized tooltip content
 */
export function useTooltipContent<T>(
    contentRenderer: (data: T) => React.ReactNode,
    data: T
) {
    // Memoize the content based on contentRenderer and data
    return useMemo(() => {
        return contentRenderer(data);
    }, [contentRenderer, data]);
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
 *   userData
 * );
 * 
 * <Tooltip content={tooltipContent}>
 *   <button>Hover me</button>
 * </Tooltip>
 */ 