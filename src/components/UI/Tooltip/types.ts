import React from 'react';

/**
 * Tooltip position types
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Theme context for Tooltip
 */
export type TooltipThemeContext = 'default' | 'hero' | 'pricing';

/**
 * Plan type for pricing tooltips
 */
export type TooltipPlanType = 'basic' | 'pro' | 'elite';

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
    /** Title color class (Tailwind color class) */
    titleColor?: string;
    /** Optional icon */
    icon?: React.ReactNode;
    /** Position of the tooltip relative to the trigger element */
    position?: TooltipPosition;
    /** Width of the tooltip in pixels or any valid CSS width */
    width?: string;
    /** Whether to show on hover */
    showOnHover?: boolean;
    /** Whether to show on focus */
    showOnFocus?: boolean;
    /** Delay before showing (ms) */
    delay?: number;
    /** Additional classes for styling */
    className?: string;
    /** Theme context (default, hero, pricing, etc) */
    themeContext?: TooltipThemeContext;
    /** Whether the tooltip is initially visible */
    initialVisible?: boolean;
    /** Whether the tooltip is visible (for controlled usage) */
    isVisible?: boolean;
    /** Border accent color (in rgba format) */
    accentColor?: string;
    /** ID for the tooltip (for accessibility) */
    id?: string;
    /** Plan type for styling plan-specific tooltips (basic, pro, elite) - primarily for pricing tooltips */
    planType?: TooltipPlanType;
} 