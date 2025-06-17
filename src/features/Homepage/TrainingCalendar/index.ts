/**
 * Training Calendar Feature - Main Export
 * 
 * Provides the complete Training Calendar functionality including:
 * - Main TrainingCalendar component
 * - All specialized calendar components
 * - TypeScript interfaces and types
 * - Custom hooks and utilities
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

// Main component export
export { default as TrainingCalendar } from './TrainingCalendar';

// Component exports - fix to match actual exports
export { default as BookingForm } from './components/BookingForm/BookingForm';
export { default as CalendarControls } from './components/CalendarControls/CalendarControls';
export { default as CalendarView } from './components/CalendarView/CalendarView';
export { default as EventModal } from './components/EventModal/EventModal';

// Hook exports - these need to be created or fixed
export { useCalendarData } from './hooks/useCalendarData';

// Type exports
export * from './interfaces';

// Default export
export { default } from './TrainingCalendar';
