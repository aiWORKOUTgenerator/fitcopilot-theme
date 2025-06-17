/**
 * Event Registry System
 * 
 * Central registry for managing all event types in the training calendar
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent } from '../../../interfaces';
import { FreeConsultationModule } from './FreeConsultation';
import { GroupFitnessClassModule } from './GroupFitnessClass';
import { PersonalTrainingSessionModule } from './PersonalTrainingSession';
import { EventConfig, EventModule, ValidationErrors } from './types';

/**
 * Event Registry - Central store for all event modules
 */
export const EventRegistry: Record<string, EventModule> = {
  'free_consultation': FreeConsultationModule,
  'group_fitness_class': GroupFitnessClassModule,
  'personal_training_session': PersonalTrainingSessionModule
};

/**
 * Legacy event configurations - Now empty as all events are modularized!
 * This can be removed in a future cleanup
 */
const LEGACY_EVENT_CONFIGS = {
  // All events now modularized! 🎉
};

/**
 * Get event configuration by title
 * 
 * @param title - Event title to look up
 * @returns EventConfig or null if not found
 */
export const getEventConfig = (title: string): EventConfig | null => {
  // Check modular events first
  const moduleEntry = Object.values(EventRegistry).find(module => module.config.title === title);
  if (moduleEntry) {
    return moduleEntry.config;
  }
  
  // Check legacy events (temporary until Stories 3-4 completed)
  if (LEGACY_EVENT_CONFIGS[title as keyof typeof LEGACY_EVENT_CONFIGS]) {
    return LEGACY_EVENT_CONFIGS[title as keyof typeof LEGACY_EVENT_CONFIGS] as any;
  }
  
  return null;
};

/**
 * Get event module by title
 * 
 * @param title - Event title to look up
 * @returns EventModule or null if not found
 */
export const getEventModule = (title: string): EventModule | null => {
  return Object.values(EventRegistry).find(module => module.config.title === title) || null;
};

/**
 * Get all available event titles
 * 
 * @returns Array of event title options for dropdowns
 */
export const getEventTitleOptions = (): { value: string; label: string }[] => {
  const options = [{ value: '', label: '- Choose Event -' }];
  
  // Add modular events
  Object.values(EventRegistry).forEach(module => {
    options.push({
      value: module.config.title,
      label: module.config.title
    });
  });
  
  // Add legacy events (temporary)
  Object.keys(LEGACY_EVENT_CONFIGS).forEach(title => {
    options.push({
      value: title,
      label: title
    });
  });
  
  return options;
};

/**
 * Get event description by title
 * 
 * @param title - Event title
 * @returns Event description or empty string
 */
export const getEventDescription = (title: string): string => {
  const config = getEventConfig(title);
  return config?.description || '';
};

/**
 * Validate event data using appropriate validator
 * 
 * @param formData - Form data to validate
 * @returns ValidationErrors object
 */
export const validateEventData = (formData: Partial<CalendarEvent>): ValidationErrors => {
  const title = formData.title;
  if (!title) {
    return { title: 'Please select an event type' };
  }
  
  // Use modular validator if available
  const module = getEventModule(title);
  if (module) {
    return module.validator(formData);
  }
  
  // Legacy validation (temporary)
  const errors: ValidationErrors = {};
  
  if (!formData.location?.trim()) {
    errors.location = 'Please select a location for the session';
  }
  
  if (title === 'Personal Training Session' && !formData.duration) {
    errors.duration = 'Please select a duration for the training session';
  }
  
  if (formData.maxParticipants && formData.maxParticipants < 1) {
    errors.maxParticipants = 'Maximum participants must be at least 1';
  }
  
  if (formData.price && formData.price < 0) {
    errors.price = 'Price cannot be negative';
  }
  
  return errors;
};

/**
 * Get duration options for an event type
 * 
 * @param title - Event title
 * @returns Duration options array
 */
export const getDurationOptions = (title: string): { value: string | number; label: string }[] => {
  const module = getEventModule(title);
  if (module) {
    return module.getDurationOptions();
  }
  
  // Legacy duration options (temporary)
  const baseOptions = [
    { value: '', label: '- Select Duration -' },
    { value: 30, label: '30 Min' },
    { value: 45, label: '45 Min' },
    { value: 60, label: '60 Min' }
  ];
  
  return baseOptions;
};

/**
 * Check if an event requires duration selection
 * 
 * @param title - Event title
 * @returns boolean indicating if duration is required
 */
export const eventRequiresDuration = (title: string): boolean => {
  const config = getEventConfig(title);
  return config?.requiresDuration ?? (title === 'Personal Training Session');
};

/**
 * Get form defaults for an event type
 * 
 * @param title - Event title
 * @returns Partial CalendarEvent with defaults
 */
export const getEventFormDefaults = (title: string): Partial<CalendarEvent> => {
  const module = getEventModule(title);
  if (module) {
    return module.getFormDefaults();
  }
  
  // Legacy defaults (temporary)
  return {
    title,
    description: getEventDescription(title),
    eventType: 'session',
    sessionType: 'individual',
    bookingStatus: 'available',
    maxParticipants: 1,
    currentParticipants: 0,
    price: 0,
    currency: 'USD'
  };
};

/**
 * Development helper: Check registry status
 */
export const getRegistryStatus = () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      modularEvents: Object.keys(EventRegistry).length,
      legacyEvents: Object.keys(LEGACY_EVENT_CONFIGS).length,
      totalEvents: Object.keys(EventRegistry).length + Object.keys(LEGACY_EVENT_CONFIGS).length,
      modularizationProgress: `${Object.keys(EventRegistry).length}/${Object.keys(EventRegistry).length + Object.keys(LEGACY_EVENT_CONFIGS).length} events modularized`,
      isComplete: Object.keys(LEGACY_EVENT_CONFIGS).length === 0
    };
  }
  return null;
}; 