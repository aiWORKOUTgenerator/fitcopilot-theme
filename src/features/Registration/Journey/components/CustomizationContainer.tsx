import React, { useEffect, useRef, useState } from 'react';
import EquipmentSelector from '../CustomizeExperience/components/EquipmentSelector';
import TimeCommitmentSelector from '../CustomizeExperience/components/TimeCommitmentSelector';
import { AccordionSectionRef } from './AccordionSection';
import { useJourney } from './JourneyContext';
import { scrollToAccordionSection } from './scrollUtils';
import WorkoutPreferenceSelector from './WorkoutPreferenceSelector';

interface CustomizationContainerProps {
    onValidChange: (isValid: boolean) => void;
}

// Define section IDs for consistent reference
export const SECTION_IDS = {
  equipment: 'equipment',
  timeManagement: 'time-management',
  workoutPreference: 'workout-preference'
};

const CustomizationContainer: React.FC<CustomizationContainerProps> = ({ onValidChange }) => {
  const { registrationData, updateRegistrationData } = useJourney();

  // Track valid sections and completed sections
  // validSections will be used with the planned CompletionContext integration
  // to track validation state of each section before allowing completion
  const [_validSections, setValidSections] = useState({
    [SECTION_IDS.equipment]: false,
    [SECTION_IDS.timeManagement]: false,
    [SECTION_IDS.workoutPreference]: false
  });

  const [completedSections, setCompletedSections] = useState<string[]>(
    registrationData.completedCustomizationSections || []
  );

  // Create refs for the accordion sections
  const equipmentRef = useRef<AccordionSectionRef>(null);
  const timeManagementRef = useRef<AccordionSectionRef>(null);
  const workoutPreferenceRef = useRef<AccordionSectionRef>(null);

  // Get ref by section ID
  const getSectionRef = (sectionId: string): React.RefObject<AccordionSectionRef> => {
    switch (sectionId) {
    case SECTION_IDS.equipment:
      return equipmentRef;
    case SECTION_IDS.timeManagement:
      return timeManagementRef;
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

  // Check overall validity based on section validity and completion
  useEffect(() => {
    // At least one section must be valid and completed to proceed
    const isValid = completedSections.length > 0;
    onValidChange(isValid);

    // Save completed sections to context
    updateRegistrationData({
      completedCustomizationSections: completedSections
    });
  }, [completedSections, onValidChange, updateRegistrationData]);

  // Update section validity
  const handleSectionValidChange = (section: string, isValid: boolean) => {
    setValidSections(prev => ({
      ...prev,
      [section]: isValid
    }));
  };

  // Handle confirming a section
  const handleConfirmSection = (sectionId: string) => {
    // Mark as completed if not already
    if (!completedSections.includes(sectionId)) {
      setCompletedSections(prev => [...prev, sectionId]);
    }

    // Close current section
    const currentSectionRef = getSectionRef(sectionId);
    if (currentSectionRef.current) {
      currentSectionRef.current.close();
    }

    // Open next section if available
    const nextSectionId = getNextSectionId(sectionId);
    if (nextSectionId) {
      const nextSectionRef = getSectionRef(nextSectionId);
      if (nextSectionRef.current) {
        // Use a larger delay for a smoother transition
        setTimeout(() => {
          nextSectionRef.current?.open();

          // Scroll to the next section with an improved offset that accounts for the header
          // and provides more space at the top
          setTimeout(() => {
            // Use a smaller offset (60px) to ensure more of the section is visible
            scrollToAccordionSection(nextSectionId, 60);
          }, 350); // Slightly longer delay to ensure animation has started
        }, 400); // Longer delay for smoother transition between sections
      }
    }
  };

  // Initialize based on completed sections from previous session
  useEffect(() => {
    // Only open first incomplete section on mount
    const sections = Object.values(SECTION_IDS);

    // Find first incomplete section
    const firstIncompleteSection = sections.find(section =>
      !completedSections.includes(section)
    );

    // If all completed, open equipment by default
    const sectionToOpen = firstIncompleteSection || SECTION_IDS.equipment;

    // Open the appropriate section after a slight delay 
    // Use a longer delay for initial load to ensure DOM is fully ready
    setTimeout(() => {
      const sectionRef = getSectionRef(sectionToOpen);
      if (sectionRef.current) {
        sectionRef.current.open();

        // Use a more precise scrolling with a smaller offset (60px)
        // to show more content above the section
        setTimeout(() => {
          scrollToAccordionSection(sectionToOpen, 60);
        }, 350);
      }
    }, 600); // Longer initial delay for better user experience
  }, [completedSections]);

  return (
    <div className="space-y-3">
      <p className="text-gray-300 text-sm mb-4">
        Customize your workout experience by selecting your preferences below.
        <span className="text-cyan-400 block mt-1">
          Complete each section and click "Confirm Selection" to proceed.
        </span>
      </p>

      <div id={`accordion-section-${SECTION_IDS.equipment}`}>
        <EquipmentSelector
          ref={equipmentRef}
          onValidChange={(isValid) => handleSectionValidChange(SECTION_IDS.equipment, isValid)}
          isCompleted={completedSections.includes(SECTION_IDS.equipment)}
          onConfirm={() => handleConfirmSection(SECTION_IDS.equipment)}
        />
      </div>

      <div id={`accordion-section-${SECTION_IDS.timeManagement}`}>
        <TimeCommitmentSelector
          ref={timeManagementRef}
          onValidChange={(isValid) => handleSectionValidChange(SECTION_IDS.timeManagement, isValid)}
          isCompleted={completedSections.includes(SECTION_IDS.timeManagement)}
          onConfirm={() => handleConfirmSection(SECTION_IDS.timeManagement)}
        />
      </div>

      <div id={`accordion-section-${SECTION_IDS.workoutPreference}`}>
        <WorkoutPreferenceSelector
          ref={workoutPreferenceRef}
          onValidChange={(isValid) => handleSectionValidChange(SECTION_IDS.workoutPreference, isValid)}
          isCompleted={completedSections.includes(SECTION_IDS.workoutPreference)}
          onConfirm={() => handleConfirmSection(SECTION_IDS.workoutPreference)}
        />
      </div>

      {completedSections.length > 0 && (
        <div className="mt-4 p-3 bg-cyan-900/20 border border-cyan-800/40 rounded-lg">
          <p className="text-cyan-300 text-sm">
            {completedSections.length === Object.keys(SECTION_IDS).length ? (
              "All sections completed! You can now continue to the next step."
            ) : (
              `${completedSections.length} of ${Object.keys(SECTION_IDS).length} sections completed. You can continue to the next step or complete more sections.`
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomizationContainer; 