/**
 * Personal Training Session Event Module
 * 
 * Complete module implementation for Personal Training Session events
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent } from '../../../../interfaces';
import { DurationOption, EventModule } from '../types';
import { createDurationOptions, createFormDefaults } from '../utils';
import { PersonalTrainingSessionConfig } from './PersonalTrainingSessionConfig';
import { validatePersonalTrainingSession } from './PersonalTrainingSessionValidator';

/**
 * Personal Training Session Event Module
 * 
 * Implements the EventModule interface for Personal Training Session events
 */
export const PersonalTrainingSessionModule: EventModule = {
  // Event configuration
  config: PersonalTrainingSessionConfig,
  
  // Validation function
  validator: validatePersonalTrainingSession,
  
  // Get duration options for Personal Training Session
  getDurationOptions: (): DurationOption[] => {
    // Personal training has multiple duration options with user selection required
    return createDurationOptions(PersonalTrainingSessionConfig.availableDurations, true);
  },
  
  // Get form defaults for Personal Training Session
  getFormDefaults: (): Partial<CalendarEvent> => {
    return createFormDefaults(PersonalTrainingSessionConfig);
  }
};

/**
 * Helper function to check if an event is a Personal Training Session
 * 
 * @param formData - Form data to check
 * @returns boolean indicating if this is a Personal Training Session
 */
export const isPersonalTrainingSessionEvent = (formData: Partial<CalendarEvent>): boolean => {
  return formData.title === PersonalTrainingSessionConfig.title;
};

/**
 * Get Personal Training Session specific form configuration
 * 
 * @returns Configuration for Personal Training Session form fields
 */
export const getPersonalTrainingSessionFormConfig = () => {
  return {
    // Duration field should be shown (user must select)
    showDurationField: true,
    
    // Duration is required
    durationRequired: true,
    
    // Description is readonly (auto-generated)
    descriptionReadonly: true,
    
    // Price field should be shown (personal training has pricing)
    showPriceField: true,
    
    // Session type should be fixed to individual
    sessionTypeOptions: [
      { value: 'individual', label: 'Individual' }
    ],
    
    // Max participants should be fixed to 1
    maxParticipantsFixed: 1,
    
    // Event type should be fixed to session
    eventTypeFixed: 'session',
    
    // Duration options with descriptions
    durationOptionsWithPricing: [
      { value: '', label: '- Select Duration -' },
      { value: 30, label: '30 Min (Quick Session)', description: 'Perfect for focused skill work or quick check-ins' },
      { value: 45, label: '45 Min (Standard Session)', description: 'Most popular option for comprehensive training' },
      { value: 60, label: '60 Min (Extended Session)', description: 'In-depth training with warm-up, workout, and cool-down' }
    ],
    
    // Special instructions for personal training
    placeholderText: {
      specialInstructions: 'Please describe your fitness goals, any injuries or limitations, preferred training style, and specific areas you\'d like to focus on during your session.'
    },
    
    // Additional personal training specific settings
    requireTrainerSelection: true,
    allowRescheduling: true,
    requirePaymentUpfront: true,
    cancellationPolicy: '24-hour cancellation policy applies',
    
    // Pricing guidelines by duration
    pricingGuidelines: {
      30: { min: 40, max: 70, suggested: 55 },
      45: { min: 60, max: 100, suggested: 85 },
      60: { min: 80, max: 130, suggested: 110 }
    }
  };
};

/**
 * Get suggested pricing based on duration
 * 
 * @param duration - Session duration in minutes
 * @returns Suggested pricing information
 */
export const getSuggestedPricing = (duration: number): { min: number; max: number; suggested: number } | null => {
  const config = getPersonalTrainingSessionFormConfig();
  return config.pricingGuidelines[duration as keyof typeof config.pricingGuidelines] || null;
};

/**
 * Validate duration selection for personal training
 * 
 * @param duration - Selected duration
 * @returns boolean indicating if duration is valid
 */
export const isValidDuration = (duration: number): boolean => {
  return PersonalTrainingSessionConfig.availableDurations.includes(duration);
}; 