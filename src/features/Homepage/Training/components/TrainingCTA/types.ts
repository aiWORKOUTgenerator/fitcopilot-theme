import { BaseButtonProps, GlobalVariantKey } from '../../../types/shared';

/**
 * Training-specific variant keys that extend the global variants
 * with program type variations
 */
export type TrainingVariantKey = GlobalVariantKey | 'strength' | 'fatLoss' | 'fitness' | 'athletic';

/**
 * Size variants for TrainingCTA component
 * - primary: Full-width variant for homepage display (max-width: 500px)
 * - secondary: Narrower variant for benefits list display (max-width: 280px)
 */
export type TrainingCTASize = 'primary' | 'secondary';

/**
 * Props for the TrainingCTA component
 * Enhanced to align with Homepage architecture while maintaining visual compatibility
 */
export interface TrainingCTAProps extends Omit<BaseButtonProps, 'size' | 'onClick' | 'variant'> {
    /**
     * Function called when the CTA button is clicked
     */
    onNavigate: (title: string) => void;

    /**
     * Visual variant including training program types
     * @default 'default'
     */
    variant?: TrainingVariantKey;

    /**
     * Size variant for different display contexts
     * - primary: Homepage display with full styling
     * - secondary: Benefits list display with narrower width and enhanced shimmer
     * @default 'primary'
     */
    size?: TrainingCTASize;

    /**
     * Program title for dynamic CTA text generation
     * When provided, CTA will show "View [programTitle]"
     * When not provided, defaults to "View All Programs"
     */
    programTitle?: string;

    /**
     * Additional CSS class names
     */
    className?: string;

    /**
     * Optional href for direct navigation (fallback to onNavigate)
     */
    href?: string;

    /**
     * Whether to show in splash context with enhanced background styling
     * @default false
     */
    useSplashContext?: boolean;

    /**
     * Loading state for the button
     * @default false
     */
    loading?: boolean;

    /**
     * Accessibility label override
     */
    'aria-label'?: string;
} 