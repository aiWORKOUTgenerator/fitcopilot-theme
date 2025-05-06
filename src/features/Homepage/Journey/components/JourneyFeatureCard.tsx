import React from 'react';
import SPACING from '../constants';
import { JourneyFeatureCardProps } from '../types';

const JourneyFeatureCard: React.FC<JourneyFeatureCardProps> = ({ feature }) => {
    return (
        <div
            className={`flex items-start ${SPACING.GAP.SM} ${SPACING.PADDING.FEATURE} rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-colors group/feature`}
        >
            <div className="bg-gray-800 p-2 rounded-lg group-hover/feature:scale-110 transition-transform" aria-hidden="true">
                {feature.icon}
            </div>
            <div>
                <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-400 group-hover/feature:text-gray-300 transition-colors small">
                    {feature.description}
                </p>
            </div>
        </div>
    );
};

export default JourneyFeatureCard; 