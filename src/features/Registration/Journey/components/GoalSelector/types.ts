import { WorkoutGoal } from '../../../types';
import { AccordionSectionRef } from '../AccordionSection';

/**
 * Props for the GoalSelector component
 */
export interface GoalSelectorProps {
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
 * GoalSelector internal state
 */
export interface GoalSelectorState {
    /**
     * Selected goals
     */
    selectedGoals: WorkoutGoal[];
}

/**
 * Goal option displayed in the selector
 */
export interface GoalOption {
    /**
     * Unique identifier for the goal
     */
    id: string;

    /**
     * Goal enum value
     */
    value: WorkoutGoal;

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