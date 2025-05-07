import classNames from 'classnames';
import React, { useRef } from 'react';
import { useTooltip } from '../../hooks/useTooltip';
import { TooltipProps } from '../../types';
import './Tooltip.scss';

/**
 * Hero Tooltip component
 * 
 * Special tooltip styling for the Hero section
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

    // Get tooltip classes
    const tooltipClasses = classNames(
        'tooltip',
        { 'show': isVisible, 'hide': !isVisible },
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

            <div className="tooltip-container">
                <div
                    ref={tooltipRef}
                    className={tooltipClasses}
                    role="tooltip"
                    aria-hidden={!isVisible}
                >
                    <div className="tooltip-content">
                        {icon && <div className="tooltip-icon">{icon}</div>}
                        <div className="tooltip-text">
                            {title && <h5 className="tooltip-title">{title}</h5>}
                            {content}
                        </div>
                    </div>
                    <div className="tooltip-arrow"></div>
                </div>
            </div>
        </div>
    );
};

export default Tooltip; 