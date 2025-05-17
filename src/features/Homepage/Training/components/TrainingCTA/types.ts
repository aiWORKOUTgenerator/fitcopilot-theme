import { TrainingVariant } from '../../utils/themeUtils';

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
    variant?: TrainingVariant;

    /**
     * Additional CSS class names
     */
    className?: string;
} 