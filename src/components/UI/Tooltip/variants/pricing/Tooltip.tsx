import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { useTooltip } from '../../hooks/useTooltip';
import { TooltipProps } from '../../types';
import './Tooltip.scss';

/**
 * Pricing Tooltip variant
 * 
 * Enhanced tooltip styling for the Pricing section
 * Adds special styling for feature comparisons and pricing-specific metadata
 */
const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    title,
    titleColor,
    icon,
    position = 'bottom',
    width,
    showOnHover = true,
    showOnFocus = true,
    delay = 0,
    className,
    initialVisible = false,
    isVisible: controlledIsVisible,
    accentColor,
    id,
    planType,
}) => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const { isVisible, show, hide } = useTooltip({
        delay,
        initialVisible
    });

    // Support both controlled and uncontrolled modes
    const visible = controlledIsVisible !== undefined ? controlledIsVisible : isVisible;

    // Update visibility based on controlled prop
    useEffect(() => {
        if (controlledIsVisible !== undefined) {
            if (controlledIsVisible) {
                show();
            } else {
                hide();
            }
        }
    }, [controlledIsVisible, show, hide]);

    // Handle mouse events only in uncontrolled mode
    const handleMouseEnter = () => {
        if (showOnHover && controlledIsVisible === undefined) {
            show();
        }
    };

    const handleMouseLeave = () => {
        if (showOnHover && controlledIsVisible === undefined) {
            hide();
        }
    };

    // Handle focus events only in uncontrolled mode
    const handleFocus = () => {
        if (showOnFocus && controlledIsVisible === undefined) {
            show();
        }
    };

    const handleBlur = () => {
        if (showOnFocus && controlledIsVisible === undefined) {
            hide();
        }
    };

    // Style object for dynamic properties
    const tooltipStyle: React.CSSProperties = {
        ...(width && { width }),
        ...(accentColor && { '--accent-color': accentColor } as any),
    };

    // Get position classes
    const tooltipContentClasses = classNames(
        'tooltip-content',
        `tooltip-${position}`,
        { 'visible': visible },
        className
    );

    // Determine plan type for specific styling
    const plan = planType || (accentColor && accentColor.includes('59, 130, 246') ? 'basic' :
        accentColor && accentColor.includes('132, 204, 22') ? 'pro' :
            accentColor && accentColor.includes('139, 92, 246') ? 'elite' : undefined);

    return (
        <div className="tooltip-wrapper tooltip-theme-pricing" data-plan={plan}>
            <div
                className="tooltip-trigger"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                {children}
            </div>

            <div
                ref={tooltipRef}
                className={tooltipContentClasses}
                role="tooltip"
                id={id}
                aria-hidden={!visible}
                style={tooltipStyle}
            >
                <div className="tooltip-inner">
                    {(icon || title) && (
                        <div className="tooltip-header">
                            {icon && <div className="tooltip-icon">{icon}</div>}
                            {title && <div className={`tooltip-title ${titleColor || ''}`}>{title}</div>}
                        </div>
                    )}
                    <div className="tooltip-body">
                        {typeof content === 'object' && React.isValidElement(content) ?
                            content :
                            <div className="tooltip-content-text">{content}</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tooltip; 