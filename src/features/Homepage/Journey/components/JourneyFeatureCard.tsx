import React from 'react';
import { JourneyFeatureCardProps, isVariant } from '../types';

/**
 * Get variant-specific background styling
 */
const getBackgroundStyle = (props: JourneyFeatureCardProps): string => {
    const { variant } = props;

    if (isVariant(variant, 'gym')) {
        return 'bg-gray-700/20 group-hover/feature:bg-gray-700/40';
    } else if (isVariant(variant, 'sports')) {
        return 'bg-gray-700/30 group-hover/feature:bg-gray-700/50';
    } else if (isVariant(variant, 'wellness')) {
        return 'bg-gray-700/25 group-hover/feature:bg-gray-700/45';
    } else if (isVariant(variant, 'modern')) {
        return 'bg-gray-700/35 group-hover/feature:bg-gray-700/55';
    }

    // Default
    return 'bg-gray-700/30 group-hover/feature:bg-gray-700/50';
};

/**
 * JourneyFeatureCard - Individual feature card within the journey steps
 */
const JourneyFeatureCard: React.FC<JourneyFeatureCardProps> = (props) => {
    const { feature, variant } = props;
    const backgroundStyle = getBackgroundStyle(props);

    return (
        <div
            className={`journey-feature-card flex items-start rounded-xl ${backgroundStyle} transition-colors group/feature gap-3`}
            data-theme={variant !== 'default' ? variant : undefined}
        >
            <div className="bg-gray-800 p-2 rounded-lg group-hover/feature:scale-110 transition-transform flex-shrink-0" aria-hidden="true">
                {feature.icon}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="feature-title font-semibold text-white mb-1 truncate">{feature.title}</h4>
                <p className="feature-description text-gray-400 group-hover/feature:text-gray-300 transition-colors small">
                    {feature.description}
                </p>
            </div>
        </div>
    );
};

export default JourneyFeatureCard; 