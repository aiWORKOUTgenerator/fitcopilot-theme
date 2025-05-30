import { GlobalVariantKey } from '../../../types/shared';

/**
 * Props for the TrainingCTA component
 */
export interface TrainingCTAProps {
    /**
     * Function called when the CTA button is clicked
     */
    onNavigate: (title: string) => void;

    /**
     * Visual variant
     * @default 'default'
     */
    variant?: GlobalVariantKey;

    /**
     * Additional CSS class names
     */
    className?: string;
} 