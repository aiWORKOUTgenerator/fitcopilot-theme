/**
 * Event Type Validator
 * 
 * Validation utilities for event type selection and smart scheduling
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { getEventTypeOption } from './EventTypeConfig';
import { AvailableTimeSlot, SchedulingPreference } from './EventTypeInterfaces';

/**
 * Validate event type selection
 */
export const validateEventType = (eventType: string): string | null => {
  if (!eventType || eventType === '') {
    return 'Please select an event type';
  }
  
  const option = getEventTypeOption(eventType);
  if (!option) {
    return 'Invalid event type selected';
  }
  
  return null;
};

/**
 * Validate duration selection for events that require it
 */
export const validateDuration = (eventType: string, duration?: number): string | null => {
  const option = getEventTypeOption(eventType);
  
  if (!option) {
    return 'Invalid event type';
  }
  
  if (option.requiresDuration) {
    if (!duration) {
      return 'Please select a duration';
    }
    
    // Validate duration is appropriate for Personal Training
    if (eventType === 'Personal Training Session') {
      const validDurations = [30, 45, 60];
      if (!validDurations.includes(duration)) {
        return 'Please select a valid duration (30, 45, or 60 minutes)';
      }
    }
  }
  
  return null;
};

/**
 * Validate scheduling preferences
 */
export const validateSchedulingPreferences = (preferences: SchedulingPreference): string[] => {
  const errors: string[] = [];
  
  // Validate preferred days
  if (preferences.preferredDays.length === 0) {
    errors.push('Please select at least one preferred day');
  }
  
  // Validate preferred days are valid (0-6)
  const invalidDays = preferences.preferredDays.filter(day => day < 0 || day > 6);
  if (invalidDays.length > 0) {
    errors.push('Invalid preferred days selected');
  }
  
  // Validate timezone
  if (!preferences.timezone || preferences.timezone.trim() === '') {
    errors.push('Timezone is required');
  }
  
  // Validate preferred date if provided
  if (preferences.preferredDate) {
    const now = new Date();
    if (preferences.preferredDate < now) {
      errors.push('Preferred date cannot be in the past');
    }
    
    // Check if preferred date is too far in the future (1 year)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);
    if (preferences.preferredDate > oneYearFromNow) {
      errors.push('Preferred date cannot be more than one year in the future');
    }
  }
  
  return errors;
};

/**
 * Validate time slot availability
 */
export const validateTimeSlot = (slot: AvailableTimeSlot): string[] => {
  const errors: string[] = [];
  
  // Validate start and end times
  if (slot.startTime >= slot.endTime) {
    errors.push('Start time must be before end time');
  }
  
  // Validate start time is not in the past
  const now = new Date();
  if (slot.startTime < now) {
    errors.push('Time slot cannot be in the past');
  }
  
  // Validate spots remaining for group events
  if (slot.spotsRemaining !== undefined) {
    if (slot.spotsRemaining < 0) {
      errors.push('Spots remaining cannot be negative');
    }
    
    if (slot.spotsRemaining === 0 && slot.status === 'available') {
      errors.push('Status cannot be available when no spots remain');
    }
  }
  
  // Validate pricing
  if (slot.price !== undefined && slot.price < 0) {
    errors.push('Price cannot be negative');
  }
  
  return errors;
};

/**
 * Validate event type and duration combination
 */
export const validateEventConfiguration = (eventType: string, duration?: number): string[] => {
  const errors: string[] = [];
  
  // Validate event type
  const eventTypeError = validateEventType(eventType);
  if (eventTypeError) {
    errors.push(eventTypeError);
    return errors; // Don't continue if event type is invalid
  }
  
  // Validate duration
  const durationError = validateDuration(eventType, duration);
  if (durationError) {
    errors.push(durationError);
  }
  
  return errors;
};

/**
 * Validate business hours
 */
export const isWithinBusinessHours = (date: Date, businessStart: number = 6, businessEnd: number = 21): boolean => {
  const hour = date.getHours();
  return hour >= businessStart && hour < businessEnd;
};

/**
 * Validate day of week
 */
export const isValidDayOfWeek = (date: Date, allowedDays: number[]): boolean => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  return allowedDays.includes(dayOfWeek);
};

/**
 * Check if date is a weekend
 */
export const isWeekend = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
};

/**
 * Check if date is a weekday
 */
export const isWeekday = (date: Date): boolean => {
  return !isWeekend(date);
}; 