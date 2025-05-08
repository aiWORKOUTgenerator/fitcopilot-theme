import { VariantKey } from '../../types';

/**
 * Props interface for the BenefitsList component
 */
export interface BenefitsListProps {
    /**
     * Array of benefit strings to display
     */
    benefits: string[];

    /**
     * Visual variant of the list
     * @default 'default'
     */
    variant?: VariantKey;

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
} 