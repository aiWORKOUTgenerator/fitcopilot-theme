import { AccordionSectionRef } from "../components/AccordionSection";

/**
 * Common props for all selector components
 */
export interface SelectorProps {
    onValidChange: (isValid: boolean) => void;
    isCompleted?: boolean;
    onConfirm: () => void;
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
    };
    weight?: {
        value: number;
        unit: 'kg' | 'lbs';
    };
    age?: number;
    biologicalSex?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
}

export interface InjuriesData {
    selectedInjuries: string[];
    otherInjuries?: string;
}

export interface MedicalClearanceData {
    hasDisease: 'yes' | 'no' | 'not-sure';
    additionalDetails?: string;
}

export interface LiabilityWaiverData {
    hasAgreed: boolean;
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