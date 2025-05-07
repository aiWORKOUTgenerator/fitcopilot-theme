import { useRef } from 'react';

/**
 * Hook for managing tooltip animation states (Legacy support)
 * 
 * This hook is kept for backwards compatibility.
 * Use the global Tooltip component for new implementations.
 */
export const useTooltipAnimation = () => {
    // Animation timeline references
    const timeoutsRef = useRef<number[]>([]);

    // Clear all timeouts on cleanup
    const clearAllTimeouts = () => {
        timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
        timeoutsRef.current = [];
    };

    return {
        clearAllTimeouts,
        timeoutsRef
    };
};

export default useTooltipAnimation; 