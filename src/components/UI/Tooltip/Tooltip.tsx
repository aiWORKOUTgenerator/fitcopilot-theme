/**
 * Tooltip Component
 * 
 * A reusable tooltip component that supports different themes,
 * positions, and interaction modes.
 * This is a wrapper component that loads the appropriate theme variant.
 * 
 * @example
 * <Tooltip content="Tooltip text">
 *   <button>Hover me</button>
 * </Tooltip>
 */

import React, { Suspense } from 'react';
import { getTooltipThemeContext } from './context';
import './Tooltip.scss';
import { TooltipProps } from './types';

// Dynamically import tooltip theme variants
const DefaultTooltip = React.lazy(() => import('./variants/default/Tooltip'));
const HeroTooltip = React.lazy(() => import('./variants/hero/Tooltip'));

/**
 * Main Tooltip component that selects the appropriate theme variant
 */
const Tooltip: React.FC<TooltipProps> = ({
    themeContext = 'default',
    ...props
}) => {
    const theme = getTooltipThemeContext(themeContext);

    // Simple fallback while loading the variant
    const fallback = (
        <div>
            {props.children}
        </div>
    );

    // Use React.Suspense to handle the dynamic import
    return (
        <Suspense fallback={fallback}>
            {theme === 'hero' ? (
                <HeroTooltip {...props} />
            ) : (
                <DefaultTooltip {...props} />
            )}
        </Suspense>
    );
};

export default Tooltip; 