import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { JourneyCTAProps } from '../types';

/**
 * JourneyCTA - Call to action button with gradient styling
 */
const JourneyCTA: React.FC<JourneyCTAProps> = ({
    text = 'Start Your Journey Now',
    href = 'https://aigymengine.com/workout-generator-registration',
    buttonSize = 'large',
    buttonVariant = 'gradient',
    showIcon = true,
    icon,
    gradientColor = 'lime',
    variant
}) => {
    const prefersReducedMotion = useReducedMotion();

    // Get size classes
    const sizeClasses = {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-base'
    };

    // Get gradient classes
    const gradientClasses = {
        lime: 'journey-gradient-lime',
        cyan: 'journey-gradient-cyan',
        violet: 'journey-gradient-violet',
        amber: 'journey-gradient-amber'
    };

    // Determine the button classes
    const buttonClasses = [
        'journey-button inline-flex items-center rounded-full font-medium',
        sizeClasses[buttonSize],
        buttonVariant === 'gradient' ? gradientClasses[gradientColor] : '',
        prefersReducedMotion ? '' : 'hover:-translate-y-1'
    ].join(' ');

    return (
        <a
            href={href}
            className={buttonClasses}
            data-theme={variant !== 'default' ? variant : undefined}
        >
            {text}
            {showIcon && (
                icon ? (
                    // Render custom icon if provided
                    <span className="ml-2" aria-hidden="true">{icon}</span>
                ) : (
                    // Default to ArrowRight
                    <ArrowRight size={buttonSize === 'small' ? 16 : 20} className="ml-2" aria-hidden="true" />
                )
            )}
        </a>
    );
};

export default JourneyCTA; 