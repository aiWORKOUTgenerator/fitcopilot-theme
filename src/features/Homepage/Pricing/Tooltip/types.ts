import { ReactNode } from 'react';

/**
 * Position options for the tooltip
 */
export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

/**
 * Theme options for the tooltip
 */
export type TooltipTheme = 'light' | 'dark';

/**
 * Props for the Tooltip component
 */
export interface TooltipProps {
    /** Content to display inside the tooltip */
    content: ReactNode;
    /** Position of the tooltip relative to the trigger element */
    position?: TooltipPosition;
    /** Visual theme of the tooltip */
    theme?: TooltipTheme;
    /** Element that triggers the tooltip */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Optional title for the tooltip */
    title?: string;
    /** Whether to show the tooltip on hover */
    showOnHover?: boolean;
    /** Whether to show the tooltip on focus */
    showOnFocus?: boolean;
    /** Delay before showing the tooltip (ms) */
    delay?: number;
} 