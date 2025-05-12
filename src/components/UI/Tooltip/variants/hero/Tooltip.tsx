import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { TooltipProps as GlobalTooltipProps } from '../../../../../types/components';
import { useTooltip } from '../../hooks/useTooltip';
import './Tooltip.scss';

/**
 * Extended CSS properties with CSS variables
 */
interface ExtendedCSSProperties extends React.CSSProperties {
    '--accent-color'?: string;
}

/**
 * Hero Tooltip component
 * 
 * Special tooltip styling for the Hero section
 * Supports both controlled and uncontrolled visibility
 */
const Tooltip: React.FC<GlobalTooltipProps> = ({
    children,
    content,
    title,
    titleColor,
    icon,
    position = 'bottom',
    width,
    showOnHover = true,
    showOnFocus = true,
    showDelay: delay = 0,
    className,
    initialVisible = false,
    isVisible: controlledIsVisible,
    accentColor,
    id,
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
    const tooltipStyle: ExtendedCSSProperties = {
        ...(width && { width }),
        ...(accentColor && { '--accent-color': accentColor }),
    };

    // Get position classes
    const tooltipContentClasses = classNames(
        'tooltip-content',
        `tooltip-${position}`,
        { 'visible': visible },
        className
    );

    return (
        <div className="tooltip-wrapper tooltip-theme-hero">
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
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tooltip; 