/**
 * Group Fitness Class Event Validator
 * 
 * Validation logic specific to group fitness class events
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent } from '../../../../interfaces';
import { ValidationErrors } from '../types';
import { validateCommonFields } from '../utils';
import { GroupFitnessClassConfig } from './GroupFitnessClassConfig';

/**
 * Validate Group Fitness Class specific form data
 * 
 * @param formData - Partial calendar event data to validate
 * @returns ValidationErrors object with any validation issues
 */
export const validateGroupFitnessClass = (formData: Partial<CalendarEvent>): ValidationErrors => {
  // Start with common field validation
  const errors = validateCommonFields(formData, GroupFitnessClassConfig);
  
  // Group Fitness Class specific validations
  
  // Title must match exactly
  if (formData.title && formData.title !== GroupFitnessClassConfig.title) {
    errors.title = 'Invalid group class type selected';
  }
  
  // Duration should be 45 minutes (if provided)
  if (formData.duration && formData.duration !== 45) {
    errors.duration = 'Group fitness classes are 45 minutes long';
  }
  
  // Classes should be group type
  if (formData.sessionType && formData.sessionType !== 'group') {
    errors.sessionType = 'Group fitness classes must be group sessions';
  }
  
  // Participant validation for group classes
  if (formData.maxParticipants !== undefined) {
    if (formData.maxParticipants < 1) {
      errors.maxParticipants = 'Group classes must allow at least 1 participant';
    }
    
    if (formData.maxParticipants > 50) {
      errors.maxParticipants = 'Group classes cannot exceed 50 participants for quality instruction';
    }
  }
  
  // Price validation - group classes can have pricing
  if (formData.price !== undefined && formData.price < 0) {
    errors.price = 'Group class price cannot be negative';
  }
  
  // Location validation - required for virtual classes
  if (!formData.location?.trim()) {
    errors.location = 'Please select a location for the group class';
  }
  
  // Event type should be group_class
  if (formData.eventType && formData.eventType !== 'group_class') {
    errors.eventType = 'Group fitness classes must be group_class type events';
  }
  
  return errors;
};

/**
 * Validate if the form data represents a Group Fitness Class
 * 
 * @param formData - Form data to check
 * @returns boolean indicating if this is a Group Fitness Class
 */
export const isGroupFitnessClass = (formData: Partial<CalendarEvent>): boolean => {
  return formData.title === GroupFitnessClassConfig.title;
};

/**
 * Get validation errors specific to group classes
 * 
 * @param formData - Form data to validate
 * @returns ValidationErrors for group class-specific issues
 */
export const getGroupClassSpecificErrors = (formData: Partial<CalendarEvent>): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  // Check for group class-specific business rules
  
  // Capacity management
  if (formData.currentParticipants && formData.maxParticipants) {
    if (formData.currentParticipants > formData.maxParticipants) {
      errors.currentParticipants = 'Current participants cannot exceed maximum capacity';
    }
  }
  
  // Booking status validation for group classes
  if (formData.bookingStatus) {
    const validStatuses = ['available', 'pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(formData.bookingStatus)) {
      errors.bookingStatus = 'Invalid booking status for group class';
    }
    
    // Business rule: completed classes should have participants
    if (formData.bookingStatus === 'completed' && 
        (!formData.currentParticipants || formData.currentParticipants === 0)) {
      errors.currentParticipants = 'Completed classes must have at least one participant';
    }
  }
  
  // Trainer assignment validation
  if (formData.currentParticipants && formData.currentParticipants > 0 && !formData.trainerId) {
    errors.trainerId = 'A trainer must be assigned for group classes with participants';
  }
  
  // Pricing validation for group classes
  if (formData.price && formData.currentParticipants) {
    if (formData.price > 100) {
      errors.price = 'Group class price seems unusually high (>$100). Please verify.';
    }
  }
  
  return errors;
}; 