import { VariantKey } from '../../types';
import { TrainingVariantKey } from '../TrainingCTA/types';

/**
 * Extended variant type that supports both visual variants and program types
 */
export type BenefitsListVariantKey = VariantKey | TrainingVariantKey;

/**
 * Props interface for the BenefitsList component
 */
export interface BenefitsListProps {
    /**
     * Array of benefit strings to display
     */
    benefits: string[];

    /**
     * Visual variant of the list (supports both style variants and program types)
     * @default 'default'
     */
    variant?: BenefitsListVariantKey;

    /**
     * Additional CSS class names
     */
    className?: string;

    /**
     * ID of the element that labels this list (for aria-labelledby)
     */
    ariaLabelledBy?: string;

    /**
     * ID for the benefits list element
     */
    id?: string;

    /**
     * Whether to include a secondary TrainingCTA at the bottom of the benefits list
     * @default false
     */
    includeCTA?: boolean;

    /**
     * Function to handle CTA button click (required if includeCTA is true)
     */
    onCTAClick?: (title: string) => void;

    /**
     * Custom CTA text (defaults to "View All Programs")
     */
    ctaText?: string;
} 