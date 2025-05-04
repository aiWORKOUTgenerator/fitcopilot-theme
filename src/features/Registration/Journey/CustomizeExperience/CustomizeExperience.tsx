import { Clock, Dumbbell, Target } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import ProgressIndicator from '../../components/ProgressIndicator';
import { AccordionSectionRef } from '../components/AccordionSection';
import { useJourney } from '../components/JourneyContext';
import StandardSection from '../components/StandardSection';
import EquipmentSelector from './components/EquipmentSelector';
import ExperienceLevelIndicator from './components/ExperienceLevelIndicator';
import TimeCommitmentSelector from './components/TimeCommitmentSelector';
import WorkoutPreferenceSelector from './components/WorkoutPreferenceSelector';
import { SECTION_IDS } from './constants/sectionConstants';
import { CustomizationProvider, useCustomization } from './context/CustomizationContext';
import './CustomizeExperience.scss';

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
const CustomizeExperienceContent: React.FC<CustomizeExperienceProps> = ({ onValidChange }) => {
    const {
        validSections,
        completedSections,
        isCustomizationValid,
        isLoading,
        error,
        markSectionComplete,
        updateSectionValidity
    } = useCustomization();

    const { registrationData } = useJourney();

    // Refs for accordion sections
    const equipmentRef = useRef<AccordionSectionRef>(null);
    const timeCommitmentRef = useRef<AccordionSectionRef>(null);
    const workoutPreferenceRef = useRef<AccordionSectionRef>(null);

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
    }, [completedSections, isLoading]);

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
            <StandardSection
                ref={equipmentRef}
                sectionId={SECTION_IDS.equipment}
                title="Equipment Selection"
                icon={<Dumbbell size={18} />}
                description="Select the equipment you have available for your workouts."
                onValidChange={(isValid) => updateSectionValidity(SECTION_IDS.equipment, isValid)}
                isCompleted={completedSections.includes(SECTION_IDS.equipment)}
                onConfirm={() => handleConfirmSection(SECTION_IDS.equipment)}
                isLoading={isLoading}
                error={error}
            >
                <EquipmentSelector />
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
                isLoading={isLoading}
                error={error}
            >
                <TimeCommitmentSelector />
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
                isLoading={isLoading}
                error={error}
            >
                <WorkoutPreferenceSelector />
            </StandardSection>

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