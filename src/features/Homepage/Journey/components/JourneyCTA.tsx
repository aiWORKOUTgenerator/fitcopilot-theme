import { ArrowRight } from 'lucide-react';
import React from 'react';
import Button from '../../../../components/UI/Button';
import '../Journey.scss';
import { JourneyCTAProps } from '../types';

/**
 * JourneyCTA - Call to action button for the Journey section
 * 
 * A standardized CTA button component that properly integrates with
 * the design system's gradient tokens and theme variants.
 * 
 * @example
 * <JourneyCTA 
 *   text="Get Started" 
 *   href="/signup" 
 *   variant="gym" 
 * />
 */
const JourneyCTA: React.FC<JourneyCTAProps> = ({
    text = "Start Your Journey",
    href = "https://builder.fitcopilot.ai",
    variant = 'default',
    className = '',
    buttonSize = 'large',
    buttonVariant = 'gradient',
    showIcon = true,
    icon = <ArrowRight size={20} />,
    dataAos = '',
    dataAosDelay = '',
    gradientColor
}) => {
    // Map the journey variant to the appropriate button theme context
    const buttonThemeContext = variant === 'default' ? 'default' : variant;

    // Determine gradient class based on variant or explicit gradientColor
    const gradientClass = gradientColor
        ? `journey-gradient-${gradientColor}`
        : variant === 'default' ? 'journey-gradient-lime'
            : variant === 'gym' ? 'journey-gradient-violet'
                : variant === 'sports' ? 'journey-gradient-cyan'
                    : variant === 'wellness' ? 'journey-gradient-teal'
                        : variant === 'modern' ? 'journey-gradient-amber'
                            : 'journey-gradient-lime';

    // Combine classes
    const componentClasses = `journey-cta-button ${gradientClass} ${className}`;

    return (
        <div
            className={componentClasses}
            data-aos={dataAos}
            data-aos-delay={dataAosDelay}
        >
            <Button
                as="a"
                href={href}
                size={buttonSize}
                variant={buttonVariant}
                themeContext={buttonThemeContext}
                rightIcon={showIcon ? icon : undefined}
            >
                {text}
            </Button>
        </div>
    );
};

export default JourneyCTA; 