import React from 'react';
import { JourneyCTAProps, VariantKey, isVariant } from '../types';

/**
 * Get variant-specific button gradient using type guards
 */
const getButtonGradient = (variant: VariantKey): string => {
    if (isVariant(variant, 'gym')) {
        return 'from-lime-400 to-emerald-500 hover:from-lime-500 hover:to-emerald-600';
    } else if (isVariant(variant, 'sports')) {
        return 'from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600';
    } else if (isVariant(variant, 'wellness')) {
        return 'from-violet-400 to-purple-500 hover:from-violet-500 hover:to-purple-600';
    } else if (isVariant(variant, 'modern')) {
        return 'from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600';
    }

    // Default
    return 'from-lime-300 to-emerald-400 hover:from-lime-400 hover:to-emerald-500';
};

/**
 * Get variant-specific shadow color using type guards
 */
const getShadowColor = (variant: VariantKey): string => {
    if (isVariant(variant, 'gym')) {
        return 'shadow-lime-400/30 hover:shadow-lime-400/40';
    } else if (isVariant(variant, 'sports')) {
        return 'shadow-cyan-400/30 hover:shadow-cyan-400/40';
    } else if (isVariant(variant, 'wellness')) {
        return 'shadow-violet-400/30 hover:shadow-violet-400/40';
    } else if (isVariant(variant, 'modern')) {
        return 'shadow-amber-400/30 hover:shadow-amber-400/40';
    }

    // Default
    return 'shadow-lime-300/30 hover:shadow-lime-300/40';
};

/**
 * JourneyCTA - Call to action button at the bottom of the Journey section
 */
const JourneyCTA: React.FC<JourneyCTAProps> = (props) => {
    const {
        text = "Start Your Journey",
        href = "https://builder.fitcopilot.ai",
        variant
    } = props;

    const buttonGradient = getButtonGradient(variant);
    const shadowColor = getShadowColor(variant);

    return (
        <div
            className="text-center mt-8 md:mt-12 lg:mt-16"
            data-aos="fade-up"
            data-aos-delay="500"
            data-theme={variant !== 'default' ? variant : undefined}
        >
            <a
                href={href}
                className={`journey-cta-button inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 bg-gradient-to-r ${buttonGradient} text-gray-900 shadow-lg ${shadowColor} hover:shadow-xl hover:-translate-y-1 px-6 py-3 md:px-8 md:py-4 w-full md:w-auto button primary`}
                data-theme={variant !== 'default' ? variant : undefined}
            >
                <span className="truncate">{text}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </a>
        </div>
    );
};

export default JourneyCTA; 