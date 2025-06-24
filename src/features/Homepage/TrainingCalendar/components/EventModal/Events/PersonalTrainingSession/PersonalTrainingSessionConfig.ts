/**
 * Personal Training Session Event Configuration
 * 
 * Configuration for personalized 1-on-1 training sessions with variable duration
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { EventConfig } from '../types';

/**
 * Personal Training Session Event Configuration
 * 
 * Defines the settings and constraints for personalized training sessions
 */
export const PersonalTrainingSessionConfig: EventConfig = {
  // Unique identifier for this event type
  id: 'personal_training_session',
  
  // Display title (matches current EventModal implementation)
  title: 'Personal Training Session',
  
  // Default description (extracted from current getDefaultDescription)
  description: 'One-on-one personalized training session tailored to your specific goals and fitness level. Includes customized workout programming, form correction, motivation, and progress tracking. Sessions can be conducted in-person or virtually based on your preference.',
  
  // No default duration (user must select)
  defaultDuration: undefined,
  
  // Duration selection required for personal training
  requiresDuration: true,
  
  // Multiple duration options available (30, 45, 60 minutes)
  availableDurations: [30, 45, 60],
  
  // Location selection required for session coordination
  requiresLocation: true,
  
  // Default to Google Meet for virtual sessions
  defaultLocation: 'google_meet',
  
  // Default event classification
  defaultEventType: 'session',
  
  // Individual training sessions
  defaultSessionType: 'individual',
  
  // Available for booking by default
  defaultBookingStatus: 'available',
  
  // Single participant training sessions
  minParticipants: 1,
  maxParticipants: 1,
  
  // Premium pricing for personal training (configurable)
  defaultPrice: 85,
  
  // Supports variable pricing based on duration and trainer
  supportsPricing: true,
  
  // Category classification
  category: 'training'
}; 