/**
 * Events Module Index
 * 
 * Central export point for the modular event system
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

// Export types
export * from './types';

// Export utilities
export * from './utils';

// Export individual event modules
export { FreeConsultationModule } from './FreeConsultation';
export { GroupFitnessClassModule } from './GroupFitnessClass';
export { PersonalTrainingSessionModule } from './PersonalTrainingSession';

// Export EventType smart scheduling module
export * from './EventType';

// Export event registry
export {
  EventRegistry, eventRequiresDuration, getDurationOptions, getEventConfig, getEventDescription, getEventFormDefaults, getEventModule,
  getEventTitleOptions, getRegistryStatus, validateEventData
} from './EventRegistry';
