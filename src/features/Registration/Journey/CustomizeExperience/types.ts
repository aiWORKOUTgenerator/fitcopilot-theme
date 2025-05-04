import React from 'react';
import { AccordionSectionRef } from "../components/AccordionSection";

/**
 * Base props interface for all selector/section components
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
 * Props for the WorkoutPreferenceSelector component
 */
export interface WorkoutPreferenceSelectorProps extends SelectorProps {
    ref: React.RefObject<AccordionSectionRef>;
}

/**
 * Equipment selection data
 */
export interface EquipmentSelectionData {
    selectedEquipment: string[];
    otherEquipment?: string;
    hasNoEquipment: boolean;
}

/**
 * Time commitment and training frequency data
 */
export interface TimeCommitmentData {
    preferredTimeOfDay: string[];
    preferredDuration: string;
    otherDuration: string;
    timeCommitmentPackage: string;
    preferredDays: string[];
    trainingFrequency: string;
}

/**
 * Training frequency data
 */
export interface TrainingFrequencyData {
    preferredDays: string[];
    trainingFrequency: string;
}

/**
 * Workout preference data
 */
export interface WorkoutPreferenceData {
    preferredExercises: string[];
    preferredWorkoutTypes: string[];
    avoidedExercises: string[];
    focusAreas: string[];
}

/**
 * Combined customization data
 */
export interface CustomizationData {
    equipment?: EquipmentSelectionData;
    timeCommitment?: TimeCommitmentData;
    workoutPreference?: WorkoutPreferenceData;
    completedSections: string[];
} 