import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Options for the useTooltip hook
 */
export interface UseTooltipOptions {
    /** Delay before showing tooltip in milliseconds */
    delay?: number;
    /** Whether the tooltip is initially visible */
    initialVisible?: boolean;
}

/**
 * Hook for managing tooltip state
 * 
 * @param options - Configuration options for the tooltip
 * @returns Tooltip state and control methods
 */
export function useTooltip({
    delay = 0,
    initialVisible = false
}: UseTooltipOptions = {}) {
    const [isVisible, setIsVisible] = useState<boolean>(initialVisible);
    const timeoutRef = useRef<number | null>(null);

    // Show the tooltip with optional delay
    const show = useCallback(() => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }

        if (delay > 0) {
            timeoutRef.current = window.setTimeout(() => {
                setIsVisible(true);
            }, delay);
        } else {
            setIsVisible(true);
        }
    }, [delay]);

    // Hide the tooltip immediately
    const hide = useCallback(() => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsVisible(false);
    }, []);

    // Toggle tooltip visibility
    const toggle = useCallback(() => {
        setIsVisible(prev => !prev);
    }, []);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        isVisible,
        show,
        hide,
        toggle
    };
}

export default useTooltip; 