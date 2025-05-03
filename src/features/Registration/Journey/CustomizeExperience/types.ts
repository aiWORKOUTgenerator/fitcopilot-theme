import { AccordionSectionRef } from "../components/AccordionSection";

/**
 * Common props for all selector components
 */
export interface SelectorProps {
    onValidChange: (isValid: boolean) => void;
    isCompleted?: boolean;
    onConfirm: () => void;
}

/**
 * Props for the EquipmentSelector component
 */
export interface EquipmentSelectorProps extends SelectorProps {
    ref: React.RefObject<AccordionSectionRef>;
}

/**
 * Props for the TimeCommitmentSelector component
 */
export interface TimeCommitmentSelectorProps extends SelectorProps {
    ref: React.RefObject<AccordionSectionRef>;
}

/**
 * Props for the CustomizationProgress component
 */
export interface CustomizationProgressProps {
    completedSections: string[];
    totalSections: number;
}

/**
 * Props for the ExperienceLevelIndicator component
 */
export interface ExperienceLevelIndicatorProps {
    experienceLevel?: string;
}

/**
 * Equipment selection data
 */
export interface EquipmentSelectionData {
    equipment: string[];
    otherEquipment?: string;
}

/**
 * Time commitment data
 */
export interface TimeCommitmentData {
    preferredTimeOfDay: string[];
    preferredDuration: string;
    otherDuration?: string;
}

/**
 * Workout preference data
 */
export interface WorkoutPreferenceData {
    preferredExerciseTypes: string[];
    avoidsExerciseTypes: string[];
    otherPreferences?: string;
}

/**
 * Training frequency data
 */
export interface TrainingFrequencyData {
    daysPerWeek: number;
    sessionsPerDay?: number;
    preferredDays?: string[];
}

/**
 * Combined customization data
 */
export interface CustomizationData {
    equipment?: EquipmentSelectionData;
    timeCommitment?: TimeCommitmentData;
    workoutPreference?: WorkoutPreferenceData;
    trainingFrequency?: TrainingFrequencyData;
    completedSections: string[];
} 