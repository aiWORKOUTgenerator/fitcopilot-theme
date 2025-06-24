/**
 * EventModal Hooks Barrel Export
 * 
 * Centralized exports for all EventModal hooks
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

export { useEventActions } from './useEventActions';
export { useEventModal } from './useEventModal';
export { useEventModalIntegration } from './useEventModalIntegration';
export { useEventValidation } from './useEventValidation';

// Re-export types for convenience
export type {
    EventModalConfig, EventModalState, PerformanceMetrics, ValidationErrors
} from '../types';
