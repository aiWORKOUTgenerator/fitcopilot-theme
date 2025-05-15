import { Apple, Bike, Coffee, Dumbbell, Flame, Footprints, Heart, Medal, Timer } from 'lucide-react';
import React from 'react';
import { FloatingIconData } from '../types';
import FloatingIcon from './FloatingIcon';

/**
 * Interface for FloatingIcons component props
 */
export interface FloatingIconsProps {
    variant?: string;
}

/**
 * FloatingIcons component for displaying decorative background icons
 */
export const FloatingIcons: React.FC<FloatingIconsProps> = ({ variant = 'default' }) => {
    // Floating icons data
    const floatingIcons: FloatingIconData[] = [
        { Icon: Dumbbell, size: 28, left: 5, top: 15, delay: 0, speed: 8 },
        { Icon: Timer, size: 36, left: 15, top: 60, delay: 1.5, speed: 10 },
        { Icon: Medal, size: 32, left: 25, top: 25, delay: 0.8, speed: 12 },
        { Icon: Flame, size: 40, left: 80, top: 20, delay: 2, speed: 9 },
        { Icon: Heart, size: 32, left: 85, top: 65, delay: 1, speed: 11 },
        { Icon: Apple, size: 28, left: 10, top: 80, delay: 2.5, speed: 10 },
        { Icon: Coffee, size: 24, left: 70, top: 10, delay: 0.5, speed: 7 },
        { Icon: Footprints, size: 36, left: 90, top: 40, delay: 1.2, speed: 9 },
        { Icon: Bike, size: 40, left: 30, top: 70, delay: 1.8, speed: 13 }
    ];

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none z-10 ${variant !== 'default' ? `theme-${variant}` : ''}`} aria-hidden="true">
            {floatingIcons.map((icon, index) => (
                <FloatingIcon
                    key={index}
                    {...icon}
                />
            ))}
        </div>
    );
};

// Also provide a default export for backward compatibility
export default FloatingIcons; 