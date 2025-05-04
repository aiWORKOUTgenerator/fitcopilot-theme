import React from 'react';
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
 * Props for section components using the new pattern
 */
export interface SectionComponentProps {
    // For the new pattern
    setIsValid?: (isValid: boolean) => void;
    isValid?: boolean;
}

/* Define props for each selector component */
export interface AnthropometricsSelectorProps extends SelectorProps {
    ref: React.RefObject<AccordionSectionRef>;
}

export interface InjuriesSelectorProps extends SelectorProps {
    ref: React.RefObject<AccordionSectionRef>;
}

export interface MedicalClearanceSelectorProps extends SelectorProps {
    ref: React.RefObject<AccordionSectionRef>;
}

export interface LiabilityWaiverSelectorProps extends SelectorProps {
    ref: React.RefObject<AccordionSectionRef>;
}

export interface CustomizationProgressProps {
    completedSections: string[];
    totalSections: number;
}

/* Data structure definitions */
export interface AnthropometricsData {
    height?: {
        value: number;
        unit: 'cm' | 'ft';
        inches?: number; // Required when unit is 'ft'
    };
    weight?: {
        value: number;
        unit: 'kg' | 'lbs';
    };
    age?: number;
    biologicalSex?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
}

export interface InjuriesData {
    hasInjuries?: boolean;
    selectedInjuries?: string[];
    otherInjuries?: string;
}

export interface MedicalClearanceData {
    hasMedicalCondition?: boolean;
    medicalDetails?: string;
}

export interface LiabilityWaiverData {
    hasAcceptedWaiver?: boolean;
    agreementDate?: string;
}

/**
 * Combined medical customization data
 */
export interface MedicalCustomizationData {
    anthropometrics?: AnthropometricsData;
    injuries?: InjuriesData;
    medicalClearance?: MedicalClearanceData;
    liabilityWaiver?: LiabilityWaiverData;
    completedSections: string[];
}

/**
 * Section error state component props
 */
export interface SectionErrorStateProps {
    message: string;
    onRetry: () => void;
}

/**
 * Interface for section validation results
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

/**
 * Props for the StandardSection component
 */
export interface StandardSectionProps {
    sectionId: string;
    title: string;
    icon: React.ReactNode;
    description?: string;
    children: React.ReactNode;
    isCompleted?: boolean;
    isValid?: boolean;
    isLoading?: boolean;
    error?: string | null;
    onOpen?: () => void;
    onClose?: () => void;
    onConfirm?: () => void;
    onValidChange?: (isValid: boolean) => void;
    validationMessage?: string;
    confirmButtonText?: string;
} 