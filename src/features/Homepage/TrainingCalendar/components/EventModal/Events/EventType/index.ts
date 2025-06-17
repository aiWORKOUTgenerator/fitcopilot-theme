/**
 * Event Type Module - Smart Scheduling System
 * 
 * Central module for handling event type selection, duration calculation,
 * and smart scheduling integration
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

// Export main component
export { default as EventTypeSelector } from './EventTypeSelector';

// Export configuration and types
export * from './EventTypeConfig';
export * from './EventTypeInterfaces';

// Export scheduling utilities
export * from './SchedulingEngine';
export * from './SchedulingUtils';

// Export validation
export * from './EventTypeValidator';
