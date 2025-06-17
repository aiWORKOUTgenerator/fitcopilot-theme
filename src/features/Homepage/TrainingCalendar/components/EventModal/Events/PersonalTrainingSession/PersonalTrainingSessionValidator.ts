/**
 * Personal Training Session Event Validator
 * 
 * Validation logic specific to personal training session events
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent } from '../../../../interfaces';
import { ValidationErrors } from '../types';
import { validateCommonFields } from '../utils';
import { PersonalTrainingSessionConfig } from './PersonalTrainingSessionConfig';

/**
 * Validate Personal Training Session specific form data
 * 
 * @param formData - Partial calendar event data to validate
 * @returns ValidationErrors object with any validation issues
 */
export const validatePersonalTrainingSession = (formData: Partial<CalendarEvent>): ValidationErrors => {
  // Start with common field validation
  const errors = validateCommonFields(formData, PersonalTrainingSessionConfig);
  
  // Personal Training Session specific validations
  
  // Title must match exactly
  if (formData.title && formData.title !== PersonalTrainingSessionConfig.title) {
    errors.title = 'Invalid training session type selected';
  }
  
  // Duration is required and must be valid option
  if (!formData.duration) {
    errors.duration = 'Please select a duration for the training session';
  } else if (!PersonalTrainingSessionConfig.availableDurations.includes(formData.duration)) {
    errors.duration = 'Please select a valid duration (30, 45, or 60 minutes)';
  }
  
  // Training sessions are individual only
  if (formData.sessionType && formData.sessionType !== 'individual') {
    errors.sessionType = 'Personal training sessions must be individual sessions';
  }
  
  // Maximum one participant for personal training
  if (formData.maxParticipants && formData.maxParticipants > 1) {
    errors.maxParticipants = 'Personal training sessions are limited to one participant';
  }
  
  // Price validation - personal training should have pricing
  if (formData.price !== undefined) {
    if (formData.price < 0) {
      errors.price = 'Training session price cannot be negative';
    }
    
    // Warn about unusually low pricing for personal training
    if (formData.price < 30 && formData.price > 0) {
      errors.price = 'Personal training session price seems unusually low. Please verify.';
    }
  }
  
  // Location validation - required for session coordination
  if (!formData.location?.trim()) {
    errors.location = 'Please select a location for the training session';
  }
  
  // Event type should be session
  if (formData.eventType && formData.eventType !== 'session') {
    errors.eventType = 'Personal training sessions must be session type events';
  }
  
  return errors;
};

/**
 * Validate if the form data represents a Personal Training Session
 * 
 * @param formData - Form data to check
 * @returns boolean indicating if this is a Personal Training Session
 */
export const isPersonalTrainingSession = (formData: Partial<CalendarEvent>): boolean => {
  return formData.title === PersonalTrainingSessionConfig.title;
};

/**
 * Get validation errors specific to personal training sessions
 * 
 * @param formData - Form data to validate
 * @returns ValidationErrors for personal training-specific issues
 */
export const getPersonalTrainingSpecificErrors = (formData: Partial<CalendarEvent>): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  // Check for personal training-specific business rules
  
  // Trainer assignment validation - personal training requires a trainer
  if (formData.currentParticipants && formData.currentParticipants > 0 && !formData.trainerId) {
    errors.trainerId = 'A trainer must be assigned for booked personal training sessions';
  }
  
  // Booking status validation for personal training
  if (formData.bookingStatus) {
    const validStatuses = ['available', 'pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(formData.bookingStatus)) {
      errors.bookingStatus = 'Invalid booking status for personal training session';
    }
    
    // Business rule: completed sessions should have a participant
    if (formData.bookingStatus === 'completed' && 
        (!formData.currentParticipants || formData.currentParticipants === 0)) {
      errors.currentParticipants = 'Completed training sessions must have a participant';
    }
    
    // Business rule: confirmed sessions should have pricing
    if (formData.bookingStatus === 'confirmed' && 
        (!formData.price || formData.price === 0)) {
      errors.price = 'Confirmed personal training sessions should have pricing information';
    }
  }
  
  // Duration-based pricing validation
  if (formData.duration && formData.price) {
    const pricePerMinute = formData.price / formData.duration;
    
    // Warn about pricing that seems inconsistent
    if (pricePerMinute < 1) {
      errors.price = 'Training session price seems low for the selected duration';
    } else if (pricePerMinute > 3) {
      errors.price = 'Training session price seems high for the selected duration';
    }
  }
  
  // Capacity validation (should always be 1 for personal training)
  if (formData.currentParticipants && formData.currentParticipants > 1) {
    errors.currentParticipants = 'Personal training sessions can only have one participant';
  }
  
  return errors;
}; 