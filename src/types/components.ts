import React from 'react';
import { ButtonClickHandler } from './events';

/**
 * Base component props with common properties
 */
export interface BaseComponentProps {
    className?: string;
    id?: string;
    testId?: string;
}

/**
 * Extended CSS Properties interface with support for custom properties
 */
export interface ExtendedCSSProperties extends React.CSSProperties {
    [key: `--${string}`]: string | number;
}

/**
 * Base Button component props
 */
export interface BaseButtonProps extends BaseComponentProps {
    /** Button text content */
    label?: React.ReactNode;
    /** Click handler */
    onClick?: ButtonClickHandler;
    /** Disabled state */
    disabled?: boolean;
    /** Loading state */
    loading?: boolean;
    /** Button type */
    type?: 'button' | 'submit' | 'reset';
    /** Button variant */
    variant?: 'primary' | 'secondary' | 'text' | 'outline';
    /** Button size */
    size?: 'small' | 'medium' | 'large';
    /** Shows loading spinner and disables button when true */
    isLoading?: boolean;
    /** Icon to display before button text */
    leftIcon?: React.ReactNode;
    /** Icon to display after button text */
    rightIcon?: React.ReactNode;
    /** Sets width to 100% when true */
    fullWidth?: boolean;
    /** Theme context for specific styling */
    themeContext?: string;
    /** Additional CSS classes */
    className?: string;
    /** Children elements */
    children?: React.ReactNode;
    /** Custom CSS properties for token overrides */
    style?: ExtendedCSSProperties;
}

/**
 * Hero Button specific props
 */
export interface HeroButtonProps extends BaseButtonProps {
    /** Hero-specific visual treatment */
    heroStyle?: 'gradient' | 'outlined' | 'solid';
    /** Animation variant for hero buttons */
    animation?: 'pulse' | 'bounce' | 'none';
}

/**
 * Button props using discriminated union for type safety
 */
export type ButtonProps =
    | (BaseButtonProps & { _variant?: 'default' })
    | (HeroButtonProps & { _variant: 'hero' });

/**
 * Tooltip position options
 */
export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/**
 * Theme context for Tooltip
 */
export type TooltipThemeContext = 'default' | 'hero' | 'pricing';

/**
 * Plan type for pricing tooltips
 */
export type TooltipPlanType = 'basic' | 'pro' | 'elite';

/**
 * Base Tooltip component props
 */
export interface BaseTooltipProps extends BaseComponentProps {
    /** Content to display inside the tooltip */
    content: React.ReactNode;
    /** Element that triggers the tooltip */
    children: React.ReactNode;
    /** Optional title for the tooltip */
    title?: string;
    /** Title color class (Tailwind color class) */
    titleColor?: string;
    /** Optional icon */
    icon?: React.ReactNode;
    /** Position of the tooltip relative to the trigger */
    position?: TooltipPosition;
    /** Width of the tooltip in pixels or any valid CSS width */
    width?: string;
    /** Whether to show on hover */
    showOnHover?: boolean;
    /** Whether to show on focus */
    showOnFocus?: boolean;
    /** Delay before showing tooltip (ms) */
    showDelay?: number;
    /** Delay before hiding tooltip (ms) */
    hideDelay?: number;
    /** Additional classes for styling */
    className?: string;
    /** Theme context (default, hero, pricing, etc) */
    themeContext?: TooltipThemeContext;
    /** Whether the tooltip is initially visible */
    initialVisible?: boolean;
    /** Whether tooltip should be visible */
    isVisible?: boolean;
    /** Border accent color (in rgba format) */
    accentColor?: string;
    /** Maximum width of the tooltip */
    maxWidth?: number | string;
    /** Custom CSS properties for token overrides */
    style?: ExtendedCSSProperties;
}

/**
 * Exercise Tooltip specific props
 */
export interface ExerciseTooltipProps extends BaseTooltipProps {
    /** Exercise data to display in tooltip */
    exerciseData: {
        name: string;
        muscleGroups: string[];
        difficulty: 'beginner' | 'intermediate' | 'advanced';
        thumbnailUrl?: string;
    };
}

/**
 * Help Tooltip specific props
 */
export interface HelpTooltipProps extends BaseTooltipProps {
    /** Icon to use for the help trigger */
    iconVariant?: 'question' | 'info' | 'lightbulb';
    /** Size of the help icon */
    iconSize?: 'sm' | 'md' | 'lg';
}

/**
 * Tooltip props using discriminated union for type safety
 */
export type TooltipProps =
    | (BaseTooltipProps & { _variant?: 'default' })
    | (ExerciseTooltipProps & { _variant: 'exercise' })
    | (HelpTooltipProps & { _variant: 'help' });

/**
 * JourneyStep status types
 */
export type JourneyStepStatus = 'incomplete' | 'active' | 'complete' | 'locked';

/**
 * Available theme variants
 */
export type VariantKey = 'default' | 'gym' | 'sports' | 'wellness' | 'modern' | 'classic' | 'minimalist';

/**
 * Step feature interface
 */
export interface DetailedFeature {
    title: string;
    description: string;
    icon: React.ReactNode;
}

/**
 * Journey step data interface
 */
export interface JourneyStep {
    id: number;
    title: string;
    description: string;
    number: number;
    icon?: React.ReactNode;
    delay?: number;
    accentColor?: string;
    ctaText?: string;
    detailedFeatures?: DetailedFeature[];
}

/**
 * Base JourneyStep component props
 */
export interface BaseJourneyStepProps extends BaseComponentProps {
    /** Step data */
    step: JourneyStep;
    /** Position index of step */
    index: number;
    /** Whether step is currently expanded */
    isExpanded: boolean;
    /** Handler for when step is toggled */
    onToggle: () => void;
    /** Whether this is the last step */
    isLast?: boolean;
    /** Theme variant */
    variant?: VariantKey;
    /** Custom CSS properties for token overrides */
    style?: ExtendedCSSProperties;
}

/**
 * Expanded content props
 */
export interface ExpandedContentProps {
    /** Step data */
    step: JourneyStep;
    /** Position index of step */
    index: number;
    /** Whether step is currently expanded */
    isExpanded: boolean;
    /** Theme variant */
    variant: VariantKey;
}

/**
 * Step CTA properties
 */
export interface StepCTAProps {
    /** Step data */
    step: JourneyStep;
    /** Whether step is expanded */
    isExpanded: boolean;
    /** Theme variant */
    variant: VariantKey;
    /** URL for the CTA */
    ctaUrl?: string;
    /** CSS class for the CTA */
    className?: string;
    /** Additional HTML attributes */
    additionalAttributes?: React.HTMLAttributes<HTMLAnchorElement | HTMLButtonElement>;
}

/**
 * Onboarding journey step props
 */
export interface OnboardingJourneyStepProps extends BaseJourneyStepProps {
    /** Whether this step is skippable */
    isSkippable?: boolean;
    /** Estimated time to complete (in minutes) */
    estimatedTime?: number;
    /** Handler for skipping this step */
    onSkip?: () => void;
}

/**
 * Tutorial journey step props
 */
export interface TutorialJourneyStepProps extends BaseJourneyStepProps {
    /** Difficulty level of this tutorial step */
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    /** Tags associated with this tutorial step */
    tags?: string[];
    /** Whether the tutorial has video content */
    hasVideo?: boolean;
    /** Video URL if applicable */
    videoUrl?: string;
}

/**
 * Workout journey step props
 */
export interface WorkoutJourneyStepProps extends BaseJourneyStepProps {
    /** Exercise data for this workout step */
    exercise?: {
        name: string;
        muscleGroups: string[];
        sets?: number;
        reps?: number;
        duration?: number;
    };
    /** Rest period after this step (in seconds) */
    restPeriod?: number;
    /** Callback when exercise is marked complete */
    onExerciseComplete?: () => void;
}

/**
 * JourneyStep props using discriminated union for type safety
 */
export type JourneyStepProps =
    | (BaseJourneyStepProps & { _variant?: 'default' })
    | (OnboardingJourneyStepProps & { _variant: 'onboarding' })
    | (TutorialJourneyStepProps & { _variant: 'tutorial' })
    | (WorkoutJourneyStepProps & { _variant: 'workout' });

/**
 * Card component props
 */
export interface CardProps extends BaseComponentProps {
    /** Card title */
    title?: React.ReactNode;
    /** Card content */
    children: React.ReactNode;
    /** Card footer */
    footer?: React.ReactNode;
    /** Card image source */
    image?: string;
    /** Image alt text */
    imageAlt?: string;
    /** Clickable card */
    onClick?: ButtonClickHandler;
    /** Card padding size */
    padding?: 'none' | 'small' | 'medium' | 'large';
    /** Aspect ratio for image */
    aspectRatio?: 'auto' | '16:9' | '4:3' | '1:1';
}

/**
 * Basic component variant props
 */
export interface VariantComponentProps<BaseProps> {
    /** Component theme variant */
    variant?: 'default' | 'gym' | 'sports' | 'wellness';
    /** Light or dark mode */
    theme?: 'light' | 'dark';
    /** Base props passed to the component */
    baseProps: BaseProps;
} 