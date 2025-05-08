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
    variant?: 'default' | 'sports' | 'boutique' | 'classic' | 'minimalist' | 'modern' | 'wellness';

    /**
     * Additional CSS class names
     */
    className?: string;
} 