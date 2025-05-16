import React from 'react';

/**
 * Props for a single floating icon used in the Hero section background.
 */
export interface FloatingIconProps {
    children: React.ReactNode;
    delay: number;
    speed: number;
    left: number;
    top: number;
    color?: string;
}

/**
 * FloatingIcon - A single animated icon for decorative background use in Hero.
 *
 * @param {FloatingIconProps} props
 * @returns {JSX.Element}
 */
const FloatingIcon: React.FC<FloatingIconProps> = ({
  children,
  delay,
  speed,
  left,
  top,
  color
}) => {
  return (
    <div
      className="floating-icon"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        animation: `float ${speed}s ease-in-out infinite ${delay}s`,
        color: color
      }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};

export default FloatingIcon; 