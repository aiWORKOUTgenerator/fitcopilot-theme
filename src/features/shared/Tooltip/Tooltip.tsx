import React, { useEffect, useRef, useState } from 'react';
import './Tooltip.scss';

export interface TooltipProps {
    /** Content to display in the tooltip */
    content: React.ReactNode;
    /** Element that triggers the tooltip */
    children: React.ReactNode;
    /** Optional title for the tooltip */
    title?: string;
    /** Optional title color (for different plan types) */
    titleColor?: string;
    /** Optional icon to display */
    icon?: React.ReactNode;
    /** Tooltip position */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /** Custom width */
    width?: string;
    /** Whether to show on hover */
    showOnHover?: boolean;
    /** Whether to show on focus */
    showOnFocus?: boolean;
    /** Delay before showing (ms) */
    delay?: number;
    /** Controlled visibility state */
    isVisible?: boolean;
    /** Initial visibility state */
    initialVisible?: boolean;
    /** Plan type for pricing tooltips */
    planType?: 'basic' | 'pro' | 'elite';
    /** ID for accessibility */
    id?: string;
}

export type TooltipMouseEnterEvent = React.MouseEvent<HTMLDivElement>;
export type TooltipMouseLeaveEvent = React.MouseEvent<HTMLDivElement>;
export type TooltipFocusEvent = React.FocusEvent<HTMLDivElement>;
export type TooltipBlurEvent = React.FocusEvent<HTMLDivElement>;

export type TooltipMouseEnterHandler = (event: TooltipMouseEnterEvent) => void;
export type TooltipMouseLeaveHandler = (event: TooltipMouseLeaveEvent) => void;
export type TooltipFocusHandler = (event: TooltipFocusEvent) => void;
export type TooltipBlurHandler = (event: TooltipBlurEvent) => void;

/**
 * Simple tooltip component - shows content on hover or with controlled visibility
 */
const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  title,
  titleColor,
  icon,
  position = 'bottom',
  width,
  showOnHover = true,
  showOnFocus = true,
  delay = 0,
  isVisible: controlledIsVisible,
  initialVisible = false,
  planType,
  id,
}) => {
  // Internal state for uncontrolled mode
  const [isVisible, setIsVisible] = useState(initialVisible);
  const timeoutRef = useRef<number | null>(null);

  // Determine if component is in controlled mode
  const isControlled = controlledIsVisible !== undefined;
  const shouldShow = isControlled ? controlledIsVisible : isVisible;

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Update based on controlled state
  useEffect(() => {
    if (isControlled && controlledIsVisible !== isVisible) {
      setIsVisible(controlledIsVisible);
    }
  }, [controlledIsVisible, isControlled, isVisible]);

  // Event handlers for showing/hiding tooltip
  const handleShow: TooltipMouseEnterHandler & TooltipFocusHandler = () => {
    if (isControlled) return;

    if (delay > 0) {
      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(true);
    }
  };

  const handleHide: TooltipMouseLeaveHandler & TooltipBlurHandler = () => {
    if (isControlled) return;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  // Mouse and focus event handlers
  const mouseHandlers = showOnHover ? {
    onMouseEnter: handleShow,
    onMouseLeave: handleHide,
  } : {};

  const focusHandlers = showOnFocus ? {
    onFocus: handleShow,
    onBlur: handleHide,
  } : {};

  // Style for custom width
  const tooltipStyle = width ? { width } : undefined;

  // Plan-specific class
  const planTypeClass = planType ? `tooltip-plan-${planType}` : '';

  return (
    <div className={`tooltip-wrapper ${planTypeClass}`} id={id}>
      {/* Trigger element */}
      <div
        className="tooltip-trigger"
        {...mouseHandlers}
        {...focusHandlers}
      >
        {children}
      </div>

      {/* Actual tooltip */}
      <div
        className={`tooltip tooltip-${position} ${shouldShow ? 'visible' : ''}`}
        style={tooltipStyle}
        role="tooltip"
        aria-hidden={!shouldShow}
      >
        <div className="tooltip-inner">
          {/* Title and icon if provided */}
          {(title || icon) && (
            <div className="tooltip-header">
              {icon && <span className={`tooltip-icon ${titleColor || ''}`}>{icon}</span>}
              {title && <h5 className={`tooltip-title ${titleColor || ''}`}>{title}</h5>}
            </div>
          )}

          {/* Content */}
          <div className="tooltip-content">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip; 