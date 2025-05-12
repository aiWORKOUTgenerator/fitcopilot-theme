import React, { useEffect, useRef } from 'react';
import ProgressIndicator from '../../components/ProgressIndicator';
import { AccordionSectionRef } from '../components/AccordionSection';
import { SECTION_IDS } from './constants/sectionConstants';
import { useMedicalCustomization } from './context/MedicalCustomizationContext';
import './CustomizedMedical.scss';

// Import existing section components temporarily
import AnthropometricsSelector from './components/AnthropometricsSelector';
import InjuriesSelector from './components/InjuriesSelector';
import LiabilityWaiverSelector from './components/LiabilityWaiverSelector';
import MedicalClearanceSelector from './components/MedicalClearanceSelector';

interface CustomizedMedicalContentProps {
    onValidChange: (isValid: boolean) => void;
}

/**
 * Main content component - uses context but doesn't completely refactor section components yet
 */
const CustomizedMedicalContent: React.FC<CustomizedMedicalContentProps> = ({ onValidChange }) => {
    const {
        isCustomizationValid,
        isLoading,
        error,
        state,
        updateSectionValidity,
        markSectionComplete
    } = useMedicalCustomization();

    // Section refs - needed for accordion functionality
    const anthropometricsRef = useRef<AccordionSectionRef>(null);
    const injuriesRef = useRef<AccordionSectionRef>(null);
    const medicalClearanceRef = useRef<AccordionSectionRef>(null);
    const liabilityWaiverRef = useRef<AccordionSectionRef>(null);

    // Update parent validation state
    useEffect(() => {
        onValidChange(isCustomizationValid);
    }, [isCustomizationValid, onValidChange]);

    // Get ref by section ID
    const getSectionRef = (sectionId: string): React.RefObject<AccordionSectionRef> => {
        switch (sectionId) {
            case SECTION_IDS.anthropometrics:
                return anthropometricsRef;
            case SECTION_IDS.injuries:
                return injuriesRef;
            case SECTION_IDS.medicalClearance:
                return medicalClearanceRef;
            case SECTION_IDS.liabilityWaiver:
                return liabilityWaiverRef;
            default:
                return anthropometricsRef;
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
        // Skip during loading
        if (isLoading) return;

        // Find first incomplete section or default to anthropometrics
        const sections = Object.values(SECTION_IDS);
        const firstIncompleteSection = sections.find(section =>
            !state.meta.completedSections.includes(section)
        ) || SECTION_IDS.anthropometrics;

        // Open appropriate section with delay for DOM to be ready
        setTimeout(() => {
            const sectionRef = getSectionRef(firstIncompleteSection);
            if (sectionRef.current) {
                sectionRef.current.open();
            }
        }, 600);
    }, [isLoading, state.meta.completedSections]);

    // Simple loading state
    if (isLoading) {
        return <div className="loading-indicator">Loading your medical information...</div>;
    }

    // Simple error state
    if (error) {
        return (
            <div className="error-state">
                <p>There was a problem loading your medical information: {error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="customized-medical-container">
            <p className="customized-medical-intro">
                Please provide your medical information to help us personalize your workout plan.
                <span className="customized-medical-instruction">
                    Complete each section and click "Confirm" to proceed.
                </span>
            </p>

            {/* Anthropometrics Selection */}
            <div id={`accordion-section-${SECTION_IDS.anthropometrics}`}>
                <AnthropometricsSelector
                    ref={anthropometricsRef}
                    onValidChange={(isValid) => updateSectionValidity(SECTION_IDS.anthropometrics, isValid)}
                    isCompleted={state.meta.completedSections.includes(SECTION_IDS.anthropometrics)}
                    onConfirm={() => handleConfirmSection(SECTION_IDS.anthropometrics)}
                />
            </div>

            {/* Injuries Selection */}
            <div id={`accordion-section-${SECTION_IDS.injuries}`}>
                <InjuriesSelector
                    ref={injuriesRef}
                    onValidChange={(isValid) => updateSectionValidity(SECTION_IDS.injuries, isValid)}
                    isCompleted={state.meta.completedSections.includes(SECTION_IDS.injuries)}
                    onConfirm={() => handleConfirmSection(SECTION_IDS.injuries)}
                />
            </div>

            {/* Medical Clearance */}
            <div id={`accordion-section-${SECTION_IDS.medicalClearance}`}>
                <MedicalClearanceSelector
                    ref={medicalClearanceRef}
                    onValidChange={(isValid) => updateSectionValidity(SECTION_IDS.medicalClearance, isValid)}
                    isCompleted={state.meta.completedSections.includes(SECTION_IDS.medicalClearance)}
                    onConfirm={() => handleConfirmSection(SECTION_IDS.medicalClearance)}
                />
            </div>

            {/* Liability Waiver */}
            <div id={`accordion-section-${SECTION_IDS.liabilityWaiver}`}>
                <LiabilityWaiverSelector
                    ref={liabilityWaiverRef}
                    onValidChange={(isValid) => updateSectionValidity(SECTION_IDS.liabilityWaiver, isValid)}
                    isCompleted={state.meta.completedSections.includes(SECTION_IDS.liabilityWaiver)}
                    onConfirm={() => handleConfirmSection(SECTION_IDS.liabilityWaiver)}
                />
            </div>

            {/* Progress indicator */}
            <ProgressIndicator
                completedSections={state.meta.completedSections}
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
};

export default CustomizedMedicalContent; 