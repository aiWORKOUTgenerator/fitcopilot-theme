import { BaseButtonProps, GlobalVariantKey } from '../../../types/shared';

/**
 * TrainingFeatures-specific variant keys that extend the global variants
 * with feature type variations
 */
export type TrainingFeaturesVariantKey = GlobalVariantKey | 'virtual' | 'tracking' | 'support' | 'mobile' | 'analytics';

/**
 * Size variants for TrainingFeaturesCTA component
 * - primary: Full-scale display (500px max-width)
 * - secondary: Compact display for feature cards (320px max-width)  
 * - compact: Minimal display for tight spaces (240px max-width)
 */
export type TrainingFeaturesCTASize = 'primary' | 'secondary' | 'compact';

/**
 * Context types for dynamic CTA text generation
 */
export type TrainingFeaturesContextType = 'explore' | 'learn' | 'discover';

/**
 * Props for the TrainingFeaturesCTA component
 * Built on proven TrainingCTA architecture with TrainingFeatures-specific adaptations
 */
export interface TrainingFeaturesCTAProps extends Omit<BaseButtonProps, 'size' | 'onClick' | 'variant'> {
    /**
     * Function called when the CTA button is clicked
     */
    onNavigate: (featureType: string) => void;

    /**
     * Visual variant including TrainingFeatures-specific types
     * @default 'default'
     */
    variant?: TrainingFeaturesVariantKey;

    /**
     * Size variant matching TrainingFeaturesButton sizes
     * @default 'large'
     */
    size?: 'small' | 'medium' | 'large';

    /**
     * Feature title for dynamic CTA text generation
     * When provided, CTA will show "Explore [featureTitle]"
     * When not provided, defaults to "Explore All Features"
     */
    featureTitle?: string;

    /**
     * Custom text override for the CTA button
     * When provided, this exact text will be used instead of generated text
     * Takes precedence over featureTitle and contextType
     */
    customText?: string;

    /**
     * Context type for CTA text variation
     * @default 'explore'
     */
    contextType?: TrainingFeaturesContextType;

    /**
     * Additional CSS class names
     */
    className?: string;

    /**
     * Optional href for direct navigation (fallback to onNavigate)
     */
    href?: string;

    /**
     * Whether to show icon on the button
     * @default true
     */
    showIcon?: boolean;

    /**
     * Optional custom icon (defaults to ArrowRight)
     */
    icon?: React.ReactNode;

    /**
     * Accessibility label override
     */
    'aria-label'?: string;
} 