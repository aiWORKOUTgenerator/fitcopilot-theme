import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useTooltip } from '../../hooks/useTooltip';
import { TooltipProps } from '../../types';
import './Tooltip.scss';

/**
 * Extended CSS properties with CSS variables
 */
interface ExtendedCSSProperties extends React.CSSProperties {
    '--accent-color'?: string;
}

/**
 * Default Tooltip component
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

    // Memoized event handlers to prevent unnecessary re-renders
    const handleMouseEnter = useCallback(() => {
        if (showOnHover && controlledIsVisible === undefined) {
            show();
        }
    }, [showOnHover, controlledIsVisible, show]);

    const handleMouseLeave = useCallback(() => {
        if (showOnHover && controlledIsVisible === undefined) {
            hide();
        }
    }, [showOnHover, controlledIsVisible, hide]);

    const handleFocus = useCallback(() => {
        if (showOnFocus && controlledIsVisible === undefined) {
            show();
        }
    }, [showOnFocus, controlledIsVisible, show]);

    const handleBlur = useCallback(() => {
        if (showOnFocus && controlledIsVisible === undefined) {
            hide();
        }
    }, [showOnFocus, controlledIsVisible, hide]);

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
        <div className="tooltip-wrapper">
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

// Custom prop comparison function for React.memo optimization
const arePropsEqual = (prevProps: TooltipProps, nextProps: TooltipProps) => {
    // Always re-render if visibility state changes
    if (prevProps.isVisible !== nextProps.isVisible) return false;

    // Check for content changes
    if (prevProps.content !== nextProps.content) return false;
    if (prevProps.title !== nextProps.title) return false;

    // Children changes should always trigger re-render
    if (prevProps.children !== nextProps.children) return false;

    // Check styling props
    if (prevProps.position !== nextProps.position) return false;
    if (prevProps.width !== nextProps.width) return false;
    if (prevProps.accentColor !== nextProps.accentColor) return false;
    if (prevProps.titleColor !== nextProps.titleColor) return false;

    // If we get here, props are considered equal
    return true;
};

// Export memoized version of the tooltip component
export default memo(Tooltip, arePropsEqual); 