import { useRef, useState } from 'react';

interface TooltipState {
    show: boolean;
    isAutoShow: boolean;
    isHovered: boolean;
}

interface TooltipStates {
    freeWorkout: TooltipState;
    createAccount: TooltipState;
}

/**
 * Hook for managing tooltip animation states
 */
export const useTooltipAnimation = () => {
    // Animation states for tooltips
    const [tooltipStates, setTooltipStates] = useState<TooltipStates>({
        freeWorkout: {
            show: false,
            isAutoShow: false,
            isHovered: false,
        },
        createAccount: {
            show: false,
            isAutoShow: false,
            isHovered: false,
        }
    });

    // Animation timeline references
    const timeoutsRef = useRef<number[]>([]);

    // Clear all timeouts on cleanup
    const clearAllTimeouts = () => {
        timeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
        timeoutsRef.current = [];
    };

    // Mouse enter handler
    const handleMouseEnter = (button: 'freeWorkout' | 'createAccount') => {
        setTooltipStates(prev => ({
            ...prev,
            [button]: {
                ...prev[button],
                show: true,
                isHovered: true,
            }
        }));
    };

    // Mouse leave handler
    const handleMouseLeave = (button: 'freeWorkout' | 'createAccount') => {
        setTooltipStates(prev => ({
            ...prev,
            [button]: {
                ...prev[button],
                show: false,
                isHovered: false,
            }
        }));
    };

    return {
        tooltipStates,
        setTooltipStates,
        clearAllTimeouts,
        handleMouseEnter,
        handleMouseLeave,
        timeoutsRef
    };
};

export default useTooltipAnimation; 