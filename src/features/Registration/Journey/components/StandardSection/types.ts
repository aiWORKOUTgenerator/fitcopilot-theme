import React from 'react';
import { AccordionSectionRef } from '../AccordionSection';

/**
 * Base props interface for all selector/section components
 */
export interface SectionProps {
    /** Callback for validation state changes */
    onValidChange: (isValid: boolean) => void;
    /** Whether the section is completed */
    isCompleted?: boolean;
    /** Callback when section is confirmed */
    onConfirm: () => void;
}

/**
 * Props for the StandardSection component
 */
export interface StandardSectionProps extends SectionProps {
    /** Section ID for tracking and storage */
    sectionId: string;
    /** Section title to display */
    title: string;
    /** Icon to display next to title (optional) */
    icon?: React.ReactNode;
    /** Description text for the section (optional) */
    description?: string;
    /** Custom class names */
    className?: string;
    /** Whether to show the section as required */
    required?: boolean;
    /** Error message to display (if any) */
    error?: string | null;
    /** Whether the component is currently loading */
    isLoading?: boolean;
    /** Reference to the accordion section */
    ref?: React.Ref<AccordionSectionRef>;
    /** Children content */
    children: React.ReactNode;
    /** Callback when section is opened */
    onOpen?: () => void;
    /** Callback when section is closed */
    onClose?: () => void;
} 