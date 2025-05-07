import React from 'react';

/**
 * Tooltip position types
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Theme context for Tooltip
 */
export type TooltipThemeContext = 'default' | 'hero';

/**
 * Base Tooltip props interface
 */
export interface TooltipProps {
    /** Element that triggers the tooltip */
    children: React.ReactNode;
    /** Tooltip content */
    content: React.ReactNode;
    /** Optional title for the tooltip */
    title?: string;
    /** Optional icon */
    icon?: React.ReactNode;
    /** Position of the tooltip relative to the trigger element */
    position?: TooltipPosition;
    /** Whether to show on hover */
    showOnHover?: boolean;
    /** Whether to show on focus */
    showOnFocus?: boolean;
    /** Delay before showing (ms) */
    delay?: number;
    /** Additional classes for styling */
    className?: string;
    /** Theme context (default, hero, etc) */
    themeContext?: string;
    /** Whether the tooltip is initially visible */
    initialVisible?: boolean;
} 