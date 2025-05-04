import { AccordionSectionRef } from '../AccordionSection';

/**
 * Analytics feature enum used in registration data
 */
export enum AnalyticsFeature {
    VISUAL_ANALYTICS = 'visual_analytics',
    ACHIEVEMENTS = 'achievements',
    BODY_COMPOSITION = 'body_composition',
    SMART_INSIGHTS = 'smart_insights'
}

/**
 * Props for the AnalyticsSelector component
 */
export interface AnalyticsSelectorProps {
    /**
     * Callback function when validity changes
     */
    onValidChange: (isValid: boolean) => void;

    /**
     * Whether the selector is completed
     */
    isCompleted?: boolean;

    /**
     * Callback function when the selection is confirmed
     */
    onConfirm: () => void;

    /**
     * Component reference
     */
    ref?: React.Ref<AccordionSectionRef>;
}

/**
 * AnalyticsSelector internal state
 */
export interface AnalyticsSelectorState {
    /**
     * Selected analytics features
     */
    selectedFeatures: AnalyticsFeature[];
}

/**
 * Analytics option displayed in the selector
 */
export interface AnalyticsOption {
    /**
     * Unique identifier for the analytics feature
     */
    id: string;

    /**
     * Analytics feature enum value
     */
    value: AnalyticsFeature;

    /**
     * Display title
     */
    title: string;

    /**
     * Description text
     */
    description: string;

    /**
     * Icon element
     */
    icon: React.ReactNode;
} 