/**
 * Type definitions for the Training component
 */
import { ReactNode } from 'react';
import { GlobalVariantKey } from '../types/shared';
import { ProgramTypeKey } from './utils/gradientTokens';

/**
 * Supported theme variant keys for the Training component
 * @deprecated Use GlobalVariantKey from '../types/shared' instead
 */
export type VariantKey = GlobalVariantKey;

/**
 * Icon type that can be either a string emoji or a React node
 */
export type ProgramIcon = string | ReactNode;

/**
 * Program data structure for displaying training programs
 */
export interface ProgramType {
    /**
     * Title of the training program
     */
    title: string;

    /**
     * Description of the program
     */
    description: string;

    /**
     * Icon to display for the program
     * Can be either a string emoji or a React node
     */
    icon: ProgramIcon;

    /**
     * List of program benefits to display
     */
    benefits: string[];

    /**
     * Program type identifier for styling
     * @example "strength" | "fatLoss" | "fitness" | "athletic"
     */
    programType?: ProgramTypeKey;

    /**
     * @deprecated Use programType instead
     * Gradient or color classes for the program accent
     * @example "from-lime-300 to-emerald-400"
     */
    accentColor?: string;

    /**
     * @deprecated Use programType instead
     * Text color class for the title
     * @example "text-lime-200"
     */
    textColor?: string;

    /**
     * @deprecated Use programType instead
     * Accent class name for theme-specific styling
     * @example "accent-primary"
     */
    accentClass?: string;
}

/**
 * Props interface for the Training component
 */
export interface TrainingProps {
    /**
     * Visual theme variant to display
     * @default 'default'
     */
    variant?: VariantKey;

    /**
     * Optional custom program data to display
     * If not provided, default data will be used
     */
    programs?: ProgramType[];

    /**
     * Optional custom title for the section
     */
    sectionTitle?: string;

    /**
     * Optional custom description for the section
     */
    sectionDescription?: string;

    /**
     * Additional CSS class names
     */
    className?: string;

    /**
     * Callback function when a program is selected
     * @param title Title of the selected program
     */
    onProgramSelect?: (title: string) => void;
} 