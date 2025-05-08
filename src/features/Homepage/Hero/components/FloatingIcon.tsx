import React from 'react';
import { FloatingIconProps } from '../types';

/**
 * FloatingIcon component for decorative background elements
 */
const FloatingIcon: React.FC<FloatingIconProps> = ({
    Icon,
    size = 24,
    delay = 0,
    speed = 8,
    left = 0,
    top = 0
}) => {
    return (
        <div
            className="floating-icon"
            style={{
                left: `${left}%`,
                top: `${top}%`,
                animation: `float ${speed}s ease-in-out infinite ${delay}s`
            }}
            aria-hidden="true"
        >
            <Icon size={size} />
        </div>
    );
};

export default FloatingIcon; 