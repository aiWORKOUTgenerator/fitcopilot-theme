/**
 * Event Module Utilities
 * 
 * Shared utility functions for event modules
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent } from '../../../interfaces';
import { DurationOption, EventConfig, ValidationErrors } from './types';

/**
 * Create duration options from available durations
 */
export const createDurationOptions = (
  availableDurations: number[],
  includeEmpty: boolean = true
): DurationOption[] => {
  const options: DurationOption[] = [];
  
  if (includeEmpty) {
    options.push({ value: '', label: '- Select Duration -' });
  }
  
  availableDurations.forEach(duration => {
    options.push({
      value: duration,
      label: `${duration} Min`
    });
  });
  
  return options;
};

/**
 * Create form defaults from event config
 */
export const createFormDefaults = (config: EventConfig): Partial<CalendarEvent> => {
  return {
    title: config.title,
    description: config.description,
    duration: config.defaultDuration,
    location: config.defaultLocation || 'google_meet',
    eventType: config.defaultEventType as any,
    sessionType: config.defaultSessionType as any,
    bookingStatus: config.defaultBookingStatus as any,
    maxParticipants: config.maxParticipants || 1,
    currentParticipants: 0,
    price: config.defaultPrice,
    currency: 'USD',
    backgroundColor: '',
    borderColor: '',
    textColor: ''
  };
};

/**
 * Validate common form fields
 */
export const validateCommonFields = (
  formData: Partial<CalendarEvent>,
  config: EventConfig
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  // Title validation
  if (!formData.title?.trim()) {
    errors.title = 'Please select an event type';
  }
  
  // Duration validation
  if (config.requiresDuration && !formData.duration) {
    errors.duration = `Please select a duration for the ${config.title.toLowerCase()}`;
  }
  
  // Location validation
  if (config.requiresLocation && !formData.location?.trim()) {
    errors.location = 'Please select a location for the session';
  }
  
  // Participants validation
  if (formData.maxParticipants) {
    if (formData.maxParticipants < config.minParticipants) {
      errors.maxParticipants = `Maximum participants must be at least ${config.minParticipants}`;
    }
    
    if (config.maxParticipants > 0 && formData.maxParticipants > config.maxParticipants) {
      errors.maxParticipants = `Maximum participants cannot exceed ${config.maxParticipants}`;
    }
  }
  
  // Price validation
  if (config.supportsPricing && formData.price !== undefined) {
    if (formData.price < 0) {
      errors.price = 'Price cannot be negative';
    }
  }
  
  return errors;
};

/**
 * Get event title from form data
 */
export const getEventTitle = (formData: Partial<CalendarEvent>): string => {
  return formData.title || '';
};

/**
 * Check if event type matches config
 */
export const isEventType = (formData: Partial<CalendarEvent>, config: EventConfig): boolean => {
  return formData.title === config.title;
};

/**
 * Merge validation errors
 */
export const mergeValidationErrors = (...errorObjects: ValidationErrors[]): ValidationErrors => {
  return errorObjects.reduce((merged, errors) => {
    return { ...merged, ...errors };
  }, {});
};

/**
 * Format duration for display
 */
export const formatDuration = (duration: number): string => {
  if (duration < 60) {
    return `${duration} minutes`;
  }
  
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours}h ${minutes}m`;
};

/**
 * Get event category display name
 */
export const getCategoryDisplayName = (category: EventConfig['category']): string => {
  const displayNames = {
    consultation: 'Consultation',
    training: 'Training',
    class: 'Class',
    assessment: 'Assessment'
  };
  
  return displayNames[category] || category;
};

/**
 * Default location options (shared across events)
 */
export const DEFAULT_LOCATION_OPTIONS = [
  { value: 'google_meet', label: '📹 Google Meet (Recommended)' },
  { value: 'zoom', label: '💻 Zoom (Coming Soon)' },
  { value: 'in_person', label: '🏢 In-Person Session' },
  { value: 'phone_call', label: '📞 Phone Call' }
];

/**
 * Default booking status options (shared across events)
 */
export const DEFAULT_BOOKING_STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' }
];

/**
 * Default event type options (shared across events)
 */
export const DEFAULT_EVENT_TYPE_OPTIONS = [
  { value: 'session', label: 'Training Session' },
  { value: 'availability', label: 'Availability Slot' },
  { value: 'blocked', label: 'Blocked Time' },
  { value: 'group_class', label: 'Group Class' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'assessment', label: 'Assessment' }
];

/**
 * Default session type options (shared across events)
 */
export const DEFAULT_SESSION_TYPE_OPTIONS = [
  { value: 'individual', label: 'Individual' },
  { value: 'group', label: 'Group' },
  { value: 'assessment', label: 'Assessment' }
]; 