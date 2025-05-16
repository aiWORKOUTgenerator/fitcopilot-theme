import React, { useCallback, useEffect, useRef, useState } from 'react';
import './Tooltip.scss';
import { TooltipProps } from './types';

/**
 * Tooltip component for displaying contextual information.
 * A lightweight implementation that supports different positions and themes.
 * 
 * @example Basic usage
 * <Tooltip content="This is a tooltip">
 *   <button>Hover me</button>
 * </Tooltip>
 * 
 * @example With options
 * <Tooltip 
 *   content="This is a tooltip with options"
 *   position="top"
 *   theme="light"
 *   title="Information"
 *   delay={300}
 * >
 *   <button>Hover me</button>
 * </Tooltip>
 */
const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'bottom',
  theme = 'dark',
  children,
  className = '',
  title,
  showOnHover = true,
  showOnFocus = true,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Handle showing the tooltip with optional delay
  const showTooltip = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    if (delay > 0) {
      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(true);
    }
  }, [delay]);

  // Hide the tooltip immediately
  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);

  // Clean up any timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle escape key to close tooltip
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isVisible]);

  // Event handlers based on prop settings
  const eventHandlers = {
    ...(showOnHover && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
    }),
    ...(showOnFocus && {
      onFocus: showTooltip,
      onBlur: hideTooltip,
    }),
  };

  return (
    <div
      className={`tooltip-wrapper ${className}`}
      ref={triggerRef}
      {...eventHandlers}
    >
      {children}
      <div
        className={`
          tooltip 
          tooltip-${position} 
          tooltip-theme-${theme}
          ${isVisible ? 'visible' : ''}
        `}
        role="tooltip"
        aria-hidden={!isVisible}
      >
        {title && <div className="tooltip-title">{title}</div>}
        <div className="tooltip-content">{content}</div>
      </div>
    </div>
  );
};

export default Tooltip; 