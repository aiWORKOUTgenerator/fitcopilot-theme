import React, { CSSProperties, ReactNode } from 'react';

/**
 * Interface for FloatingIcon component props
 */
export interface FloatingIconProps {
    left: string | number;
    top: string | number;
    delay?: number;
    speed?: number;
    children: ReactNode;
    style?: CSSProperties;
}

/**
 * Type definition for icon data that can be used with FloatingIcon
 */
export interface FloatingIconData {
    Icon: React.ElementType;
    size: number;
    left: number;
    top: number;
    delay: number;
    speed: number;
    className?: string;
}

/**
 * Floating icon component for decorative background elements
 */
export const FloatingIcon: React.FC<FloatingIconProps> = ({
    left,
    top,
    delay = 0,
    speed = 10,
    children,
    style,
}) => {
    // Helper function to convert values to CSS compatible strings
    const toCss = (v: string | number) =>
        typeof v === 'number' ? `${v}%` : v;

    return (
        <div
            className="floating-icon"
            style={{
                left: toCss(left),
                top: toCss(top),
                animation: `float ${speed}s ease-in-out infinite ${delay}s`,
                ...style,
            }}
            aria-hidden="true"
        >
            {children}
        </div>
    );
};

/**
 * Helper function to properly render an icon from icon data
 */
export const renderFloatingIcon = (icon: FloatingIconData, index: number) => {
    const { Icon, size, left, top, delay, speed, className } = icon;

    return (
        <FloatingIcon
            key={index}
            left={left}
            top={top}
            delay={delay}
            speed={speed}
        >
            {/* We need to wrap the Icon in span to apply styles safely */}
            <span className={className}>
                <Icon size={size} />
            </span>
        </FloatingIcon>
    );
};

export default FloatingIcon; 