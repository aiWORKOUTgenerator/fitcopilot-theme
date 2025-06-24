/**
 * Event Modal Components Barrel Export
 * 
 * Centralized exports for all EventModal components
 * Following Phase 2 modular architecture patterns
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

// ===== PHASE 3: ORCHESTRATOR COMPONENT =====
export { EventModalContainer } from './EventModalContainer/EventModalContainer';
export type { EventModalContainerProps } from './EventModalContainer/EventModalContainer';

// ===== PHASE 2: EXTRACTED COMPONENTS =====
export { EventModalHeader } from './EventModalHeader/EventModalHeader';
export type { EventModalHeaderProps } from './EventModalHeader/EventModalHeader';

export { EventDetailsView } from './EventDetailsView/EventDetailsView';
export type { EventDetailsViewProps } from './EventDetailsView/EventDetailsView';

export { EventForm } from './EventForm/EventForm';
export type { EventFormProps } from './EventForm/EventForm';

