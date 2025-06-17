/**
 * Free Consultation Event Module
 * 
 * Complete module implementation for Free Consultation events
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent } from '../../../../interfaces';
import { DurationOption, EventModule } from '../types';
import { createDurationOptions, createFormDefaults } from '../utils';
import { FreeConsultationConfig } from './FreeConsultationConfig';
import { validateFreeConsultation } from './FreeConsultationValidator';

/**
 * Free Consultation Event Module
 * 
 * Implements the EventModule interface for Free Consultation events
 */
export const FreeConsultationModule: EventModule = {
  // Event configuration
  config: FreeConsultationConfig,
  
  // Validation function
  validator: validateFreeConsultation,
  
  // Get duration options for Free Consultation
  getDurationOptions: (): DurationOption[] => {
    // Free consultation has fixed 20-minute duration, no selection needed
    return createDurationOptions(FreeConsultationConfig.availableDurations, false);
  },
  
  // Get form defaults for Free Consultation
  getFormDefaults: (): Partial<CalendarEvent> => {
    return createFormDefaults(FreeConsultationConfig);
  }
};

/**
 * Helper function to check if an event is a Free Consultation
 * 
 * @param formData - Form data to check
 * @returns boolean indicating if this is a Free Consultation
 */
export const isFreeConsultationEvent = (formData: Partial<CalendarEvent>): boolean => {
  return formData.title === FreeConsultationConfig.title;
};

/**
 * Get Free Consultation specific form configuration
 * 
 * @returns Configuration for Free Consultation form fields
 */
export const getFreeConsultationFormConfig = () => {
  return {
    // Duration field should be hidden (fixed 20 minutes)
    showDurationField: false,
    
    // Description is readonly (auto-generated)
    descriptionReadonly: true,
    
    // Price field should be hidden (free consultation)
    showPriceField: false,
    
    // Session type should be fixed to individual
    sessionTypeOptions: [
      { value: 'individual', label: 'Individual' }
    ],
    
    // Max participants should be fixed to 1
    maxParticipantsFixed: 1,
    
    // Special instructions for consultation
    placeholderText: {
      specialInstructions: 'Please describe your fitness goals, any health considerations, and what you hope to achieve from this consultation.'
    }
  };
}; 