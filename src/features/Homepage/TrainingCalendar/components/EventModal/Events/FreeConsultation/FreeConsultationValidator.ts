/**
 * Free Consultation Event Validator
 * 
 * Validation logic specific to free consultation events
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent } from '../../../../interfaces';
import { ValidationErrors } from '../types';
import { validateCommonFields } from '../utils';
import { FreeConsultationConfig } from './FreeConsultationConfig';

/**
 * Validate Free Consultation specific form data
 * 
 * @param formData - Partial calendar event data to validate
 * @returns ValidationErrors object with any validation issues
 */
export const validateFreeConsultation = (formData: Partial<CalendarEvent>): ValidationErrors => {
  // Start with common field validation
  const errors = validateCommonFields(formData, FreeConsultationConfig);
  
  // Free Consultation specific validations
  
  // Title must match exactly
  if (formData.title && formData.title !== FreeConsultationConfig.title) {
    errors.title = 'Invalid consultation type selected';
  }
  
  // Duration should be 20 minutes (if provided)
  if (formData.duration && formData.duration !== 20) {
    errors.duration = 'Free consultations are limited to 20 minutes';
  }
  
  // Consultations are individual only
  if (formData.sessionType && formData.sessionType !== 'individual') {
    errors.sessionType = 'Free consultations are individual sessions only';
  }
  
  // Maximum one participant for consultations
  if (formData.maxParticipants && formData.maxParticipants > 1) {
    errors.maxParticipants = 'Free consultations are limited to one participant';
  }
  
  // Price validation - should be free
  if (formData.price && formData.price > 0) {
    errors.price = 'Free consultations cannot have a price';
  }
  
  // Location validation - required for virtual consultations
  if (!formData.location?.trim()) {
    errors.location = 'Please select a location for the consultation';
  }
  
  return errors;
};

/**
 * Validate if the form data represents a Free Consultation
 * 
 * @param formData - Form data to check
 * @returns boolean indicating if this is a Free Consultation
 */
export const isFreeConsultation = (formData: Partial<CalendarEvent>): boolean => {
  return formData.title === FreeConsultationConfig.title;
};

/**
 * Get validation errors specific to consultations
 * 
 * @param formData - Form data to validate
 * @returns ValidationErrors for consultation-specific issues
 */
export const getConsultationSpecificErrors = (formData: Partial<CalendarEvent>): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  // Check for consultation-specific business rules
  if (formData.currentParticipants && formData.currentParticipants > 0) {
    // If someone is already booked, validate the booking
    if (!formData.trainerId) {
      errors.trainerId = 'A trainer must be assigned for booked consultations';
    }
    
    if (formData.bookingStatus === 'available') {
      errors.bookingStatus = 'Consultation status should not be available if participants are booked';
    }
  }
  
  // Validate booking status transitions
  if (formData.bookingStatus) {
    const validStatuses = ['available', 'pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(formData.bookingStatus)) {
      errors.bookingStatus = 'Invalid booking status for consultation';
    }
    
    // Business rule: completed consultations should have a participant
    if (formData.bookingStatus === 'completed' && (!formData.currentParticipants || formData.currentParticipants === 0)) {
      errors.currentParticipants = 'Completed consultations must have at least one participant';
    }
  }
  
  return errors;
}; 