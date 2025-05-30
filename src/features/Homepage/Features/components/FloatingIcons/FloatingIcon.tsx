import React from 'react';
import { FloatingIconProps } from './types';

/**
 * Individual floating icon component for decorative background elements
 * Provides smooth animations with configurable timing and positioning
 * 
 * @param props - FloatingIcon component props
 * @returns JSX.Element - Rendered floating icon
 * 
 * @example
 * ```tsx
 * <FloatingIcon
 *   left={25}
 *   top={50}
 *   delay={1.5}
 *   speed={10}
 * >
 *   <Dumbbell size={24} />
 * </FloatingIcon>
 * ```
 */
export const FloatingIcon: React.FC<FloatingIconProps> = ({
  children,
  delay,
  speed,
  left,
  top,
  className = '',
  visible = true,
  style = {}
}) => {
  // Don't render if not visible
  if (!visible) {
    return null;
  }

  // Combine base styles with custom styles
  const combinedStyle: React.CSSProperties = {
    left: `${left}%`,
    top: `${top}%`,
    animation: `float ${speed}s ease-in-out infinite ${delay}s`,
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 1,
    ...style
  };

  return (
    <div
      className={`floating-icon ${className}`.trim()}
      style={combinedStyle}
      aria-hidden="true"
      role="presentation"
    >
      {children}
    </div>
  );
}; 