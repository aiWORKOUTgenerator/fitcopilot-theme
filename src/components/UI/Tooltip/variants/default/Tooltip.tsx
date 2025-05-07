import classNames from 'classnames';
import React, { useRef } from 'react';
import { useTooltip } from '../../hooks/useTooltip';
import { TooltipProps } from '../../types';
import './Tooltip.scss';

/**
 * Default Tooltip component
 */
const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    title,
    icon,
    position = 'bottom',
    showOnHover = true,
    showOnFocus = true,
    delay = 0,
    className,
    initialVisible = false,
}) => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const { isVisible, show, hide } = useTooltip({
        delay,
        initialVisible
    });

    // Handle mouse events
    const handleMouseEnter = () => {
        if (showOnHover) {
            show();
        }
    };

    const handleMouseLeave = () => {
        if (showOnHover) {
            hide();
        }
    };

    // Handle focus events
    const handleFocus = () => {
        if (showOnFocus) {
            show();
        }
    };

    const handleBlur = () => {
        if (showOnFocus) {
            hide();
        }
    };

    // Get position classes
    const tooltipContentClasses = classNames(
        'tooltip-content',
        `tooltip-${position}`,
        { 'visible': isVisible },
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
                aria-hidden={!isVisible}
            >
                <div className="tooltip-inner">
                    {(icon || title) && (
                        <div className="tooltip-header">
                            {icon && <div className="tooltip-icon">{icon}</div>}
                            {title && <div className="tooltip-title">{title}</div>}
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