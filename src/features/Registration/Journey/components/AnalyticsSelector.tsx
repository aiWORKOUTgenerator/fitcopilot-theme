import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useJourney } from './JourneyContext';
import { JourneyStepFeature } from './JourneyStepCard';

// Define the analytics tracking features enum (will be used in registration data)
export enum AnalyticsFeature {
    VISUAL_ANALYTICS = 'visual_analytics',
    ACHIEVEMENTS = 'achievements',
    BODY_COMPOSITION = 'body_composition',
    SMART_INSIGHTS = 'smart_insights'
}

interface AnalyticsSelectorProps {
    features: JourneyStepFeature[];
    onValidChange: (isValid: boolean) => void;
}

// Map features to analytics features
const featureToAnalyticsMap: Record<string, AnalyticsFeature> = {
    "Visual Analytics": AnalyticsFeature.VISUAL_ANALYTICS,
    "Achievement System": AnalyticsFeature.ACHIEVEMENTS,
    "Body Composition": AnalyticsFeature.BODY_COMPOSITION,
    "Smart Insights": AnalyticsFeature.SMART_INSIGHTS
};

const AnalyticsSelector: React.FC<AnalyticsSelectorProps> = ({ features, onValidChange }) => {
    const { registrationData, updateRegistrationData } = useJourney();

    // Convert from registration data to AnalyticsFeature[] for component state
    const [selectedAnalytics, setSelectedAnalytics] = useState<AnalyticsFeature[]>(() => {
        if (!registrationData.analyticsFeatures || registrationData.analyticsFeatures.length === 0) {
            return [];
        }

        // Filter valid enum values only
        return registrationData.analyticsFeatures
            .filter((item): item is AnalyticsFeature =>
                Object.values(AnalyticsFeature).includes(item as AnalyticsFeature))
    });

    // Update validation status whenever selected analytics change
    useEffect(() => {
        const isValid = selectedAnalytics.length > 0;
        onValidChange(isValid);

        // Update registration data when analytics preferences change
        if (selectedAnalytics.length > 0) {
            // No need for type assertions since AnalyticsFeature values are already strings
            updateRegistrationData({
                analyticsFeatures: selectedAnalytics
            });
        } else {
            // Clear analytics features if none selected
            updateRegistrationData({
                analyticsFeatures: []
            });
        }
    }, [selectedAnalytics, onValidChange, updateRegistrationData]);

    const toggleAnalyticFeature = (feature: JourneyStepFeature) => {
        const analyticFeature = featureToAnalyticsMap[feature.title];
        if (!analyticFeature) return;

        setSelectedAnalytics(prev => {
            // If already selected, remove it
            if (prev.includes(analyticFeature)) {
                return prev.filter(a => a !== analyticFeature);
            }

            // Otherwise add the feature
            return [...prev, analyticFeature];
        });
    };

    // Check if a feature is selected
    const isSelected = (feature: JourneyStepFeature): boolean => {
        const analyticFeature = featureToAnalyticsMap[feature.title];
        return analyticFeature ? selectedAnalytics.includes(analyticFeature) : false;
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-4">
                <p className="text-gray-300 text-sm">
                    Select the progress tracking features you're interested in
                    <span className="text-amber-400 ml-1">
                        (at least 1 recommended)
                    </span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        onClick={() => toggleAnalyticFeature(feature)}
                        className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer
              ${isSelected(feature)
                                ? 'bg-gray-700/50 border-2 border-amber-400 shadow-lg shadow-amber-400/10'
                                : 'bg-gray-700/30 border-2 border-transparent hover:bg-gray-700/40'
                            }
            `}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected(feature)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleAnalyticFeature(feature);
                            }
                        }}
                    >
                        <div
                            className={`bg-gray-800 p-2 rounded-lg transition-transform relative
                ${isSelected(feature) ? 'scale-110 bg-amber-900/50' : ''}
              `}
                        >
                            {feature.icon}
                            {isSelected(feature) && (
                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                                    <Check size={12} className="text-gray-900" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className={`font-semibold mb-1 ${isSelected(feature) ? 'text-amber-300' : 'text-white'}`}>
                                {feature.title}
                            </h4>
                            <p className="text-sm text-gray-400">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedAnalytics.length > 0 && (
                <div className="text-center text-sm mt-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30">
                        <span className="text-amber-300">
                            {selectedAnalytics.length === 1
                                ? '1 tracking feature selected'
                                : `${selectedAnalytics.length} tracking features selected`}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsSelector; 