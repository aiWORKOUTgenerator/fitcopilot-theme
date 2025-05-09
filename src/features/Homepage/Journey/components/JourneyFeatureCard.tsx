import React from 'react';
import { JourneyFeatureCardProps } from '../types';

/**
 * JourneyFeatureCard - Renders an individual feature card within an expanded journey step
 */
const JourneyFeatureCard: React.FC<JourneyFeatureCardProps> = ({
    feature,
    variant
}) => {
    return (
        <div
            className="journey-bg-feature-card hover:journey-bg-feature-card-hover flex items-start gap-4 p-4 rounded-xl transition-colors group/feature"
            data-theme={variant !== 'default' ? variant : undefined}
        >
            <div className="journey-bg-feature-icon p-2 rounded-lg group-hover/feature:scale-110 transition-transform" aria-hidden="true">
                {feature.icon}
            </div>
            <div>
                <h4 className="font-semibold journey-text-heading mb-1">{feature.title}</h4>
                <p className="text-sm journey-text-description group-hover/feature:journey-text-description-hover transition-colors small">
                    {feature.description}
                </p>
            </div>
        </div>
    );
};

export default JourneyFeatureCard; 