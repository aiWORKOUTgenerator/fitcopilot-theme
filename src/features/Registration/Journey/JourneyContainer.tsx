import React, { useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { JourneySubstepId, RegistrationStepProps } from '../types';
import AnalyticsPreferences from './AnalyticsPreferences';
import { JourneyProvider, useJourney } from './components/JourneyContext';
import JourneySubstepProgress from './components/JourneySubstepProgress';
import SavingIndicator from './components/SavingIndicator';
import CustomizedMedical from './CustomizedMedical';
import Equipment from './CustomizeExperience/Equipment';
import TimeCommitment from './CustomizeExperience/TimeCommitment';
import Goals from './Goals';
import './Journey.scss';

/**
 * JourneyContainer - Main container for the Journey step that handles substep navigation
 * This component uses NavigationContext for substep management
 */
const JourneyContainer: React.FC<RegistrationStepProps> = ({
    data,
    updateData,
    onNext,
    onBack,
    className = '',
}) => {
    return (
        <JourneyProvider initialData={data}>
            <JourneyContent
                data={data}
                updateData={updateData}
                onNext={onNext}
                onBack={onBack}
                className={className}
            />
            <SavingIndicator />
        </JourneyProvider>
    );
};

/**
 * JourneyContent - Internal component that consumes both JourneyContext and NavigationContext
 */
const JourneyContent: React.FC<RegistrationStepProps> = ({
    data,
    updateData,
    onNext,
    onBack,
    className = '',
}) => {
    // Get navigation context for substep management
    const { state: navigationState, nextSubstep, previousSubstep, goToSubstep, updateRegistrationData: updateNavData } = useNavigation();

    // Get journey context for journey-specific state
    const { updateRegistrationData: updateJourneyData } = useJourney();

    // Current substep from navigation state
    const currentSubstep = navigationState.currentSubstep;

    // Sync data between contexts and parent component
    useEffect(() => {
        // Update journey context with data from parent
        updateJourneyData(data);

        // Update navigation context with data from parent
        updateNavData(data);
    }, [data, updateJourneyData, updateNavData]);

    // Handle substep completion and navigation
    const handleNext = () => {
        // For legacy compatibility
        if (onNext) {
            onNext();
        } else {
            nextSubstep();
        }
    };

    // Handle back navigation
    const handleBack = () => {
        // For legacy compatibility
        if (onBack) {
            onBack();
        } else {
            previousSubstep();
        }
    };

    // Update both contexts and parent component data
    const handleUpdateData = (newData: Partial<typeof data>) => {
        // Update parent component data
        if (updateData) {
            updateData({
                ...data,
                ...newData
            });
        }

        // Update journey context
        updateJourneyData(newData);

        // Update navigation context
        updateNavData(newData);
    };

    // Render the appropriate substep based on the current substep ID
    const renderSubstep = () => {
        switch (currentSubstep) {
            case JourneySubstepId.GOALS:
                return <Goals data={data} updateData={handleUpdateData} onNext={handleNext} onBack={handleBack} />;

            case JourneySubstepId.EQUIPMENT:
                return <Equipment data={data} updateData={handleUpdateData} onNext={handleNext} onBack={handleBack} />;

            case JourneySubstepId.TIME_COMMITMENT:
                return <TimeCommitment data={data} updateData={handleUpdateData} onNext={handleNext} onBack={handleBack} />;

            case JourneySubstepId.MEDICAL:
                return <CustomizedMedical data={data} updateData={handleUpdateData} onNext={handleNext} onBack={handleBack} />;

            case JourneySubstepId.ANALYTICS:
                return <AnalyticsPreferences data={data} updateData={handleUpdateData} onNext={handleNext} onBack={handleBack} />;

            default:
                // Default to Goals if no substep is selected
                return <Goals data={data} updateData={handleUpdateData} onNext={handleNext} onBack={handleBack} />;
        }
    };

    return (
        <div className={`journey-container ${className}`}>
            {/* Journey Substep Progress Indicator */}
            <JourneySubstepProgress
                currentSubstep={currentSubstep || JourneySubstepId.GOALS}
                onSubstepClick={goToSubstep}
                completedSubsteps={navigationState.completedSubsteps}
            />

            {/* Current Substep Content */}
            <div className="journey-substep-content">
                {renderSubstep()}
            </div>
        </div>
    );
};

export default JourneyContainer; 