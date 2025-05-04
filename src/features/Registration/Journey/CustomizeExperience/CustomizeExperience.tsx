import React, { useEffect, useRef } from 'react';
import ProgressIndicator from '../../components/ProgressIndicator';
import { AccordionSectionRef } from '../components/AccordionSection';
import { useJourney } from '../components/JourneyContext';
import EquipmentSelector from './components/EquipmentSelector';
import ExperienceLevelIndicator from './components/ExperienceLevelIndicator';
import TimeCommitmentSelector from './components/TimeCommitmentSelector';
import WorkoutPreferenceSelector from './components/WorkoutPreferenceSelector';
import { SECTION_IDS } from './constants/sectionConstants';
import './CustomizeExperience.scss';
import { useCustomizationState } from './hooks/useCustomizationState';
import { loadCustomizationData } from './utils/customizationStorage';

interface CustomizeExperienceProps {
    onValidChange: (isValid: boolean) => void;
}

const CustomizeExperience: React.FC<CustomizeExperienceProps> = ({ onValidChange }) => {
    const {
        validSections,
        completedSections,
        updateSectionValidity,
        markSectionComplete,
        isCustomizationValid,
        syncWithStoredCompletedSections
    } = useCustomizationState();

    const { registrationData, updateRegistrationData } = useJourney();

    // Refs for accordion sections
    const equipmentRef = useRef<AccordionSectionRef>(null);
    const timeCommitmentRef = useRef<AccordionSectionRef>(null);
    const workoutPreferenceRef = useRef<AccordionSectionRef>(null);

    // Sync with stored data on initial mount
    useEffect(() => {
        // Check for stored data
        const storedData = loadCustomizationData();
        if (storedData?.completedSections?.length) {
            // Sync the completed sections from storage
            syncWithStoredCompletedSections(storedData.completedSections);

            // Also update the journey context if needed
            if (!registrationData.completedCustomizationSections?.length) {
                updateRegistrationData({
                    completedCustomizationSections: storedData.completedSections
                });
            }
        }
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    // Effect to update parent validation state
    useEffect(() => {
        onValidChange(isCustomizationValid);
    }, [isCustomizationValid, onValidChange]);

    // Get ref by section ID
    const getSectionRef = (sectionId: string): React.RefObject<AccordionSectionRef> => {
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
    };

    // Get the next section ID
    const getNextSectionId = (currentSectionId: string): string | null => {
        const sections = Object.values(SECTION_IDS);
        const currentIndex = sections.indexOf(currentSectionId);
        if (currentIndex < sections.length - 1) {
            return sections[currentIndex + 1];
        }
        return null;
    };

    // Handle section confirmation and transition to next section
    const handleConfirmSection = (sectionId: string) => {
        // Mark section as complete
        markSectionComplete(sectionId);

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
        }
    };

    // Initialize first section or restore from saved state
    useEffect(() => {
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
    }, [completedSections]);

    return (
        <div className="customize-experience-container">
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
            <div id={`accordion-section-${SECTION_IDS.equipment}`}>
                <EquipmentSelector
                    ref={equipmentRef}
                    onValidChange={(isValid) => updateSectionValidity(SECTION_IDS.equipment, isValid)}
                    isCompleted={completedSections.includes(SECTION_IDS.equipment)}
                    onConfirm={() => handleConfirmSection(SECTION_IDS.equipment)}
                />
            </div>

            {/* Time Commitment Selection */}
            <div id={`accordion-section-${SECTION_IDS.timeCommitment}`}>
                <TimeCommitmentSelector
                    ref={timeCommitmentRef}
                    onValidChange={(isValid) => updateSectionValidity(SECTION_IDS.timeCommitment, isValid)}
                    isCompleted={completedSections.includes(SECTION_IDS.timeCommitment)}
                    onConfirm={() => handleConfirmSection(SECTION_IDS.timeCommitment)}
                />
            </div>

            {/* Workout Preference Selection */}
            <div id={`accordion-section-${SECTION_IDS.workoutPreference}`}>
                <WorkoutPreferenceSelector
                    ref={workoutPreferenceRef}
                    onValidChange={(isValid) => updateSectionValidity(SECTION_IDS.workoutPreference, isValid)}
                    isCompleted={completedSections.includes(SECTION_IDS.workoutPreference)}
                    onConfirm={() => handleConfirmSection(SECTION_IDS.workoutPreference)}
                />
            </div>

            {/* Progress indicator */}
            <ProgressIndicator
                completedSections={completedSections}
                totalSections={Object.keys(SECTION_IDS).length}
                sectionLabels={Object.entries(SECTION_IDS).reduce((acc, [key, value]) => {
                    acc[value] = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
                    return acc;
                }, {} as Record<string, string>)}
                variant="default"
                showLabels={true}
                accentColor="purple"
            />
        </div>
    );
};

export default CustomizeExperience; 