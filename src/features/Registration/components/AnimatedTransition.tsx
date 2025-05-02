import React, { useEffect, useRef, useState } from 'react';

interface AnimatedTransitionProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Animated transition component for smooth transitions between registration steps
 */
const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
    children,
    className = '',
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Set transition-in state after component mounts for animation
        const timeoutId = setTimeout(() => {
            setIsVisible(true);
        }, 50);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div
            ref={componentRef}
            className={`animated-transition ${isVisible ? 'animated-transition--visible' : ''} ${className}`}
        >
            {children}
        </div>
    );
};

export default AnimatedTransition; 