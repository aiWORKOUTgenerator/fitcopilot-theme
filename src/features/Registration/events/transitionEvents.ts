import { RegistrationStep } from '../types';

/**
 * Types of transitions between registration steps
 */
export enum TransitionType {
    STANDARD = 'standard',     // Regular next step in sequence
    MAP_BASED = 'map_based',   // Using STEP_TRANSITION_MAP for non-sequential transitions
    DIRECT = 'direct',         // Using goToStep for direct navigation
    BACK = 'back',             // Going backward in flow
    OVERRIDE = 'override'      // System override (like forced navigation)
}

/**
 * Event data structure for step transitions
 */
export interface StepTransitionEvent {
    sourceStep: RegistrationStep;
    destinationStep: RegistrationStep;
    transitionType: TransitionType;
    timestamp: number;
    metadata?: Record<string, any>;
}

/**
 * Listener function type for transition events
 */
export type TransitionEventListener = (event: StepTransitionEvent) => void; 