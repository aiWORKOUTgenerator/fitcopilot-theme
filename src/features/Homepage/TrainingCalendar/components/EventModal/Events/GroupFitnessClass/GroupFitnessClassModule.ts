/**
 * Group Fitness Class Event Module
 * 
 * Complete module implementation for Group Fitness Class events
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent } from '../../../../interfaces';
import { DurationOption, EventModule } from '../types';
import { createDurationOptions, createFormDefaults } from '../utils';
import { GroupFitnessClassConfig } from './GroupFitnessClassConfig';
import { validateGroupFitnessClass } from './GroupFitnessClassValidator';

/**
 * Group Fitness Class Event Module
 * 
 * Implements the EventModule interface for Group Fitness Class events
 */
export const GroupFitnessClassModule: EventModule = {
  // Event configuration
  config: GroupFitnessClassConfig,
  
  // Validation function
  validator: validateGroupFitnessClass,
  
  // Get duration options for Group Fitness Class
  getDurationOptions: (): DurationOption[] => {
    // Group classes have fixed 45-minute duration, no selection needed
    return createDurationOptions(GroupFitnessClassConfig.availableDurations, false);
  },
  
  // Get form defaults for Group Fitness Class
  getFormDefaults: (): Partial<CalendarEvent> => {
    return createFormDefaults(GroupFitnessClassConfig);
  }
};

/**
 * Helper function to check if an event is a Group Fitness Class
 * 
 * @param formData - Form data to check
 * @returns boolean indicating if this is a Group Fitness Class
 */
export const isGroupFitnessClassEvent = (formData: Partial<CalendarEvent>): boolean => {
  return formData.title === GroupFitnessClassConfig.title;
};

/**
 * Get Group Fitness Class specific form configuration
 * 
 * @returns Configuration for Group Fitness Class form fields
 */
export const getGroupFitnessClassFormConfig = () => {
  return {
    // Duration field should be hidden (fixed 45 minutes)
    showDurationField: false,
    
    // Description is readonly (auto-generated)
    descriptionReadonly: true,
    
    // Price field should be shown (group classes can have pricing)
    showPriceField: true,
    
    // Session type should be fixed to group
    sessionTypeOptions: [
      { value: 'group', label: 'Group' }
    ],
    
    // Max participants defaults to class capacity
    maxParticipantsDefault: 20,
    
    // Special instructions for group classes
    placeholderText: {
      specialInstructions: 'Please note any fitness experience level, injuries, or special requirements. Include any questions about the class format or intensity level.'
    },
    
    // Event type should be fixed to group_class
    eventTypeFixed: 'group_class',
    
    // Additional group class specific settings
    allowWaitlist: true,
    autoConfirmBookings: false,
    requirePaymentUpfront: true
  };
}; 