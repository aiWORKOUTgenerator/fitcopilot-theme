/**
 * Tooltip Component
 * 
 * A reusable tooltip component that supports different themes,
 * positions, and interaction modes.
 * This is a wrapper component that loads the appropriate theme variant.
 * 
 * @example Uncontrolled (hover-based)
 * <Tooltip content="Tooltip text" themeContext="hero">
 *   <button>Hover me</button>
 * </Tooltip>
 * 
 * @example Controlled
 * <Tooltip 
 *   content="Tooltip text" 
 *   isVisible={isTooltipVisible}
 *   showOnHover={false}
 * >
 *   <button onClick={() => setIsTooltipVisible(!isTooltipVisible)}>
 *     Toggle tooltip
 *   </button>
 * </Tooltip>
 */

import React, { Suspense, useEffect, useState } from 'react';
import { useEffectiveTheme } from './context';
import './Tooltip.scss';
import { TooltipProps, TooltipThemeContext } from './types';

// Log config for debugging
console.log('Loading Tooltip component with variants');

// Dynamically import tooltip theme variants using React.lazy
const DefaultTooltip = React.lazy(() => {
    console.log('Loading DefaultTooltip variant');
    return import('./variants/default/Tooltip').then(module => ({ default: module.default }));
});

const HeroTooltip = React.lazy(() => {
    console.log('Loading HeroTooltip variant');
    return import('./variants/hero/Tooltip').then(module => ({ default: module.default }));
});

const PricingTooltip = React.lazy(() => {
    console.log('Loading PricingTooltip variant');
    return import('./variants/pricing/Tooltip').then(module => ({ default: module.default }));
});

/**
 * Map of theme variants to their respective components
 */
const TOOLTIP_VARIANTS: Record<TooltipThemeContext, React.LazyExoticComponent<React.ComponentType<TooltipProps>>> = {
    'default': DefaultTooltip,
    'hero': HeroTooltip,
    'pricing': PricingTooltip,
};

/**
 * Main Tooltip component that selects the appropriate theme variant
 * Supports both controlled and uncontrolled usage
 */
const Tooltip: React.FC<TooltipProps> = ({
    themeContext,
    isVisible: controlledIsVisible,
    initialVisible = false,
    ...props
}) => {
    // Handle both controlled (isVisible) and uncontrolled (initialVisible) modes
    const [internalIsVisible, setInternalIsVisible] = useState(initialVisible);
    const isVisible = controlledIsVisible !== undefined ? controlledIsVisible : internalIsVisible;

    // Update internal state if controlled prop changes
    useEffect(() => {
        if (controlledIsVisible !== undefined) {
            setInternalIsVisible(controlledIsVisible);
        }
    }, [controlledIsVisible]);

    // Determine theme using the context system and add fallback
    let effectiveTheme: TooltipThemeContext;
    try {
        effectiveTheme = useEffectiveTheme(themeContext);
        console.log('Tooltip using theme:', effectiveTheme);
    } catch (error) {
        console.error('Error getting effective theme, falling back to default', error);
        effectiveTheme = themeContext || 'default';
    }

    // Log the theme being used
    console.log('Tooltip variant being used:', effectiveTheme);

    // Get the variant component based on theme
    const TooltipVariant = TOOLTIP_VARIANTS[effectiveTheme];

    // Simple fallback while loading the variant
    const fallback = (
        <div className="tooltip-wrapper tooltip-loading">
            {props.children}
        </div>
    );

    // Use React.Suspense to handle the dynamic import
    return (
        <Suspense fallback={fallback}>
            <TooltipVariant
                {...props}
                themeContext={effectiveTheme}
                isVisible={isVisible}
                initialVisible={initialVisible}
                className={`tooltip-theme-${effectiveTheme} ${props.className || ''}`}
            />
        </Suspense>
    );
};

export default Tooltip; 