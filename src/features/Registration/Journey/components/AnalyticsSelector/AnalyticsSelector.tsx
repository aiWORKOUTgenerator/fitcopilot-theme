import { BarChart } from 'lucide-react';
import React, { forwardRef, useEffect, useState } from 'react';
import logger from "../../../../../utils/logger";
import { SectionCard, SelectionSummary } from '../../shared/components';
import { selectorStorage, validationUtils } from '../../shared/utils';
import { AccordionSectionRef } from '../AccordionSection';
import { useJourney } from '../JourneyContext';
import JourneySelector from '../JourneySelector';
import './AnalyticsSelector.scss';
import { ANALYTICS_OPTIONS, MIN_FEATURES, STORAGE_KEY } from './constants';
import { AnalyticsFeature, AnalyticsSelectorProps, AnalyticsSelectorState } from './types';

/**
 * AnalyticsSelector component for selecting analytics and tracking features
 */
const AnalyticsSelector = forwardRef<AccordionSectionRef, AnalyticsSelectorProps>(({
    onValidChange,
    isCompleted = false,
    onConfirm
}, ref) => {
    const { registrationData, updateRegistrationData } = useJourney();

    // Initialize state from registration data or storage
    const [selectedFeatures, setSelectedFeatures] = useState<AnalyticsFeature[]>(() => {
        // First try to get from registration data
        if (registrationData.analyticsFeatures && registrationData.analyticsFeatures.length > 0) {
            // Filter for valid enum values
            return registrationData.analyticsFeatures
                .filter((item): item is AnalyticsFeature =>
                    Object.values(AnalyticsFeature).includes(item as AnalyticsFeature));
        }

        // Fall back to storage
        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            if (stored) {
                const storedState = JSON.parse(stored) as AnalyticsSelectorState;
                return storedState.selectedFeatures || [];
            }
        } catch (error) {
            logger.error('Failed to load stored analytics selector data:', error);
        }

        return [];
    });

    // Track validity state
    const [isValid, setIsValid] = useState<boolean>(false);

    // Create storage utility
    const storage = selectorStorage.useSelectorStorage<AnalyticsSelectorState>(
        STORAGE_KEY,
        { selectedFeatures: [] },
        'analyticsFeatures'
    );

    // Validate selection whenever it changes
    useEffect(() => {
        const isValidSelection = validationUtils.validateMinSelection(
            selectedFeatures,
            MIN_FEATURES
        );

        setIsValid(isValidSelection);

        // Sync with context and storage
        if (selectedFeatures.length > 0) {
            storage.syncWithContext(selectedFeatures);

            // You can also update directly if needed for compatibility
            updateRegistrationData({ analyticsFeatures: selectedFeatures });
        }
    }, [selectedFeatures, storage, updateRegistrationData]);

    // Forward validity state to parent
    useEffect(() => {
        onValidChange(isValid);
    }, [isValid, onValidChange]);

    // Handle toggling an analytics feature
    const toggleFeature = (feature: AnalyticsFeature) => {
        setSelectedFeatures(prev => {
            // If already selected, remove it
            if (prev.includes(feature)) {
                return prev.filter(f => f !== feature);
            }

            // Otherwise add the feature
            return [...prev, feature];
        });
    };

    return (
        <JourneySelector
            ref={ref}
            selectorId="analytics"
            title="Track Your Progress"
            icon={<BarChart size={24} />}
            description="Select the progress tracking features you're interested in"
            accentColor="amber"
            isCompleted={isCompleted}
            onValidChange={onValidChange}
            onConfirm={onConfirm}
        >
            <div className="analytics-options">
                <div className="analytics-options-grid">
                    {ANALYTICS_OPTIONS.map((option) => (
                        <SectionCard
                            key={option.id}
                            id={option.id}
                            title={option.title}
                            description={option.description}
                            icon={option.icon}
                            isSelected={selectedFeatures.includes(option.value)}
                            accentColor="amber"
                            onToggle={() => toggleFeature(option.value)}
                            testId={`analytics-option-${option.id}`}
                        />
                    ))}
                </div>

                <SelectionSummary
                    selectedCount={selectedFeatures.length}
                    singularLabel="tracking feature selected"
                    pluralLabel="tracking features selected"
                    accentColor="amber"
                />
            </div>
        </JourneySelector>
    );
});

AnalyticsSelector.displayName = 'AnalyticsSelector';

export default AnalyticsSelector; 