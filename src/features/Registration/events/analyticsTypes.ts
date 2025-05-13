/**
 * Type definitions for analytics events and user data
 */

/**
 * Base interface for all analytics events
 */
export interface AnalyticsEvent {
    /**
     * Type of the analytics event
     */
    type: string;

    /**
     * Additional properties for the event
     */
    properties?: Record<string, unknown>;

    /**
     * Timestamp of when the event occurred
     */
    timestamp?: string;
}

/**
 * User data for analytics identification
 */
export interface AnalyticsUser {
    /**
     * Unique identifier for the user
     */
    id: string;

    /**
     * User's email address
     */
    email?: string;

    /**
     * User's display name
     */
    name?: string;

    /**
     * Additional user properties
     */
    traits?: Record<string, unknown>;
}

/**
 * Step view event data
 */
export interface StepViewEvent extends AnalyticsEvent {
    type: 'step_view';
    properties: {
        stepId: string;
        stepName: string;
        stepNumber: number;
        totalSteps: number;
    };
}

/**
 * Transition event data
 */
export interface TransitionEvent extends AnalyticsEvent {
    type: 'transition';
    properties: {
        fromStep: string;
        toStep: string;
        transitionType: 'next' | 'back' | 'skip';
    };
}

/**
 * Registration flow events
 */
export interface RegistrationFlowEvent extends AnalyticsEvent {
    type: 'registration_flow_initiated' | 'registration_completed' | 'registration_cancelled';
    properties: {
        initialStep?: string;
        finalStep?: string;
        cancelledAtStep?: string;
        timestamp: string;
    };
}

/**
 * Step view tracking parameters
 */
export interface StepViewParams {
    stepName: string;
    stepNumber: number;
    totalSteps: number;
} 