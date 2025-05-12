import { Clock, Dumbbell, Target } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ProgressIndicator from '../../components/ProgressIndicator';
import { AccordionSectionRef } from '../components/AccordionSection';
import { useJourney } from '../components/JourneyContext';
import StandardSection from '../components/StandardSection';
import EquipmentSelector from './components/EquipmentSelector';
import ExperienceLevelIndicator from './components/ExperienceLevelIndicator';
import SectionErrorState from './components/SectionErrorState';
import TimeCommitmentSelector from './components/TimeCommitmentSelector';
import WorkoutPreferenceSelector from './components/WorkoutPreferenceSelector';
import { SECTION_IDS } from './constants/sectionConstants';
import { CustomizationProvider, useCustomization } from './context/CustomizationContext';
import './CustomizeExperience.scss';
import { announceToScreenReader } from './utils/a11y';
import { saveWithRetry } from './utils/validators';

interface CustomizeExperienceProps {
    onValidChange: (isValid: boolean) => void;
}

/**
 * Main CustomizeExperience component with context provider
 */
const CustomizeExperience: React.FC<CustomizeExperienceProps> = ({ onValidChange }) => {
    return (
        <CustomizationProvider>
            <CustomizeExperienceContent onValidChange={onValidChange} />
        </CustomizationProvider>
    );
};

/**
 * Inner component that consumes the CustomizationContext
 */
const CustomizeExperienceContent: React.FC<CustomizeExperienceProps> = React.memo(({ onValidChange }) => {
    const {
        validSections,
        completedSections,
        isCustomizationValid,
        isLoading,
        error,
        markSectionComplete,
        updateSectionValidity,
        saveAllData,
        syncWithStoredData
    } = useCustomization();

    const { registrationData } = useJourney();

    // Add state for tracking save errors to handle retries
    const [sectionErrors, setSectionErrors] = useState<Record<string, string | null>>({});
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // Refs for accordion sections
    const equipmentRef = useRef<AccordionSectionRef>(null);
    const timeCommitmentRef = useRef<AccordionSectionRef>(null);
    const workoutPreferenceRef = useRef<AccordionSectionRef>(null);

    // Effect to update parent validation state
    useEffect(() => {
        onValidChange(isCustomizationValid);
    }, [isCustomizationValid, onValidChange]);

    // Get ref by section ID
    const getSectionRef = useCallback((sectionId: string): React.RefObject<AccordionSectionRef> => {
        switch (sectionId) {
            case SECTION_IDS.equipment:
                return equipmentRef;
            case SECTION_IDS.timeCommitment:
                return timeCommitmentRef;
            case SECTION_IDS.workoutPreference:
                return workoutPreferenceRef;
            default:
                return equipmentRef;
        }
    }, []);

    // Get the next section ID
    const getNextSectionId = useCallback((currentSectionId: string): string | null => {
        const sections = Object.values(SECTION_IDS);
        const currentIndex = sections.indexOf(currentSectionId);
        if (currentIndex < sections.length - 1) {
            return sections[currentIndex + 1];
        }
        return null;
    }, []);

    // Handle section confirmation and transition to next section
    const handleConfirmSection = useCallback(async (sectionId: string) => {
        // Set saving state
        setIsSaving(true);
        setSectionErrors(prev => ({ ...prev, [sectionId]: null }));

        try {
            // Try to save all data
            const result = await saveWithRetry(saveAllData, {}, 2);

            if (!result.success) {
                // Update section error state
                setSectionErrors(prev => ({ ...prev, [sectionId]: result.error || 'Failed to save' }));
                setIsSaving(false);
                return;
            }

            // Mark section as complete
            markSectionComplete(sectionId);

            // Announce for screen readers
            const sectionTitle = sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace(/-/g, ' ');
            announceToScreenReader(`${sectionTitle} section completed`);

            // Close current section
            const currentSectionRef = getSectionRef(sectionId);
            if (currentSectionRef.current) {
                currentSectionRef.current.close();
            }

            // Open next section with smooth transition
            const nextSectionId = getNextSectionId(sectionId);
            if (nextSectionId) {
                const nextSectionRef = getSectionRef(nextSectionId);
                if (nextSectionRef.current) {
                    setTimeout(() => {
                        nextSectionRef.current?.open();
                    }, 400);
                }
            } else {
                // Announce completion if this was the last section
                announceToScreenReader('All sections completed. You can now proceed to the next step.');
            }
        } catch (error) {
            setSectionErrors(prev => ({
                ...prev,
                [sectionId]: error instanceof Error ? error.message : 'An unknown error occurred'
            }));
        } finally {
            setIsSaving(false);
        }
    }, [getSectionRef, getNextSectionId, markSectionComplete, saveAllData]);

    // Handle retry for a section with error
    const handleRetry = useCallback((sectionId: string) => {
        // Clear error for this section
        setSectionErrors(prev => ({ ...prev, [sectionId]: null }));

        // Try to save again
        handleConfirmSection(sectionId);
    }, [handleConfirmSection]);

    // Initialize first section or restore from saved state
    useEffect(() => {
        if (isLoading) return;

        // Find first incomplete section or default to equipment
        const sections = Object.values(SECTION_IDS);
        const firstIncompleteSection = sections.find(section =>
            !completedSections.includes(section)
        ) || SECTION_IDS.equipment;

        // Open appropriate section with delay for DOM to be ready
        setTimeout(() => {
            const sectionRef = getSectionRef(firstIncompleteSection);
            if (sectionRef.current) {
                sectionRef.current.open();
            }
        }, 600);
    }, [completedSections, isLoading, getSectionRef]);

    return (
        <div className="customize-experience-container">
            <h2 className="sr-only">Customize Your Workout Experience</h2>

            <p className="customize-experience-intro">
                Customize your workout experience by selecting your preferences below.
                <span className="customize-experience-instruction">
                    Complete each section and click "Confirm Selection" to proceed.
                </span>
            </p>

            {/* Experience Level Indicator (read-only) */}
            <ExperienceLevelIndicator
                experienceLevel={registrationData.experienceLevel}
            />

            {/* Equipment Selection */}
            <StandardSection
                ref={equipmentRef}
                sectionId={SECTION_IDS.equipment}
                title="Equipment Selection"
                icon={<Dumbbell size={18} />}
                description="Select the equipment you have available for your workouts."
                onValidChange={(isValid) => updateSectionValidity(SECTION_IDS.equipment, isValid)}
                isCompleted={completedSections.includes(SECTION_IDS.equipment)}
                onConfirm={() => handleConfirmSection(SECTION_IDS.equipment)}
                isLoading={isLoading || (isSaving && !sectionErrors[SECTION_IDS.equipment])}
                error={sectionErrors[SECTION_IDS.equipment] || error}
            >
                {sectionErrors[SECTION_IDS.equipment] ? (
                    <SectionErrorState
                        message={sectionErrors[SECTION_IDS.equipment] || ''}
                        onRetry={() => handleRetry(SECTION_IDS.equipment)}
                    />
                ) : (
                    <EquipmentSelector />
                )}
            </StandardSection>

            {/* Time Commitment Selection */}
            <StandardSection
                ref={timeCommitmentRef}
                sectionId={SECTION_IDS.timeCommitment}
                title="Time Management & Frequency"
                icon={<Clock size={18} />}
                description="Choose how much time you can dedicate to your workouts and how often you want to train."
                onValidChange={(isValid) => updateSectionValidity(SECTION_IDS.timeCommitment, isValid)}
                isCompleted={completedSections.includes(SECTION_IDS.timeCommitment)}
                onConfirm={() => handleConfirmSection(SECTION_IDS.timeCommitment)}
                isLoading={isLoading || (isSaving && !sectionErrors[SECTION_IDS.timeCommitment])}
                error={sectionErrors[SECTION_IDS.timeCommitment] || error}
            >
                {sectionErrors[SECTION_IDS.timeCommitment] ? (
                    <SectionErrorState
                        message={sectionErrors[SECTION_IDS.timeCommitment] || ''}
                        onRetry={() => handleRetry(SECTION_IDS.timeCommitment)}
                    />
                ) : (
                    <TimeCommitmentSelector />
                )}
            </StandardSection>

            {/* Workout Preference Selection */}
            <StandardSection
                ref={workoutPreferenceRef}
                sectionId={SECTION_IDS.workoutPreference}
                title="Workout Preferences"
                icon={<Target size={18} />}
                description="Tell us about your workout preferences and areas you want to focus on."
                onValidChange={(isValid) => updateSectionValidity(SECTION_IDS.workoutPreference, isValid)}
                isCompleted={completedSections.includes(SECTION_IDS.workoutPreference)}
                onConfirm={() => handleConfirmSection(SECTION_IDS.workoutPreference)}
                isLoading={isLoading || (isSaving && !sectionErrors[SECTION_IDS.workoutPreference])}
                error={sectionErrors[SECTION_IDS.workoutPreference] || error}
            >
                {sectionErrors[SECTION_IDS.workoutPreference] ? (
                    <SectionErrorState
                        message={sectionErrors[SECTION_IDS.workoutPreference] || ''}
                        onRetry={() => handleRetry(SECTION_IDS.workoutPreference)}
                    />
                ) : (
                    <WorkoutPreferenceSelector />
                )}
            </StandardSection>

            {/* Progress indicator */}
            <ProgressIndicator
                completedSections={completedSections.filter(section => Object.values(SECTION_IDS).includes(section))}
                totalSections={Object.keys(SECTION_IDS).length}
                sectionLabels={Object.entries(SECTION_IDS).reduce((acc, [_key, value]) => {
                    acc[value] = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
                    return acc;
                }, {} as Record<string, string>)}
                variant="default"
                showLabels={true}
                accentColor="purple"
            />
        </div>
    );
});

CustomizeExperienceContent.displayName = 'CustomizeExperienceContent';

export default CustomizeExperience; 