import React, { ReactNode, useState } from 'react';
import './Tooltip.scss';

export interface TooltipProps {
    /** Content to display inside the tooltip */
    content: ReactNode;
    /** Element that triggers the tooltip */
    children: ReactNode;
    /** Position of the tooltip relative to the trigger element */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /** Width of the tooltip in pixels or any valid CSS width */
    width?: string;
    /** Icon to display at the start of the tooltip content */
    icon?: ReactNode;
    /** Title of the tooltip (optional) */
    title?: string;
    /** Title color class (Tailwind color class) */
    titleColor?: string;
    /** Whether the tooltip is visible (for controlled usage) */
    isVisible?: boolean;
    /** Border accent color (in rgba format) */
    accentColor?: string;
    /** Additional classes to apply to the tooltip */
    className?: string;
    /** ID for the tooltip (for accessibility) */
    id?: string;
    /** Whether to show the tooltip on hover (default: true) */
    showOnHover?: boolean;
}

/**
 * Tooltip component displays contextual information when hovering over or focusing on an element.
 * Can be used in hover mode or controlled mode.
 */
export const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    position = 'top',
    width = '260px',
    icon,
    title,
    titleColor = 'text-lime-300',
    isVisible: controlledIsVisible,
    accentColor = 'rgba(132, 204, 22, 0.3)',
    className = '',
    id,
    showOnHover = true,
}) => {
    const [isHovering, setIsHovering] = useState(false);

    // Use controlled visibility if provided, otherwise use hover state
    const isVisible = controlledIsVisible !== undefined ? controlledIsVisible : (showOnHover && isHovering);

    // Handle mouse events for hover-based tooltips
    const handleMouseEnter = () => {
        if (showOnHover) setIsHovering(true);
    };

    const handleMouseLeave = () => {
        if (showOnHover) setIsHovering(false);
    };

    // Set position classes based on the position prop
    const getPositionClass = () => {
        switch (position) {
            case 'bottom':
                return 'tooltip-bottom';
            case 'left':
                return 'tooltip-left';
            case 'right':
                return 'tooltip-right';
            case 'top':
            default:
                return 'tooltip-top';
        }
    };

    return (
        <div
            className="tooltip-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            <div
                className={`tooltip ${getPositionClass()} ${isVisible ? 'visible' : 'invisible'} ${className}`}
                role="tooltip"
                id={id}
                aria-hidden={!isVisible}
                style={{
                    width,
                    '--accent-color': accentColor
                } as React.CSSProperties}
            >
                {(icon || title) && (
                    <div className="flex items-start mb-2">
                        {icon && <div className="tooltip-icon mr-2 flex-shrink-0 mt-0.5">{icon}</div>}
                        {title && (
                            <div>
                                <h5 className={`font-medium ${titleColor} text-sm`}>{title}</h5>
                                <div className="text-xs text-gray-300">{content}</div>
                            </div>
                        )}
                    </div>
                )}

                {!title && content}
            </div>
        </div>
    );
};

export default Tooltip; 