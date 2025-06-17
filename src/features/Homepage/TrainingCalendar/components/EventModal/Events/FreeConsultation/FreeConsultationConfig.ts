/**
 * Free Consultation Event Configuration
 * 
 * Configuration for 20-minute complimentary consultation sessions
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { EventConfig } from '../types';

/**
 * Free Consultation Event Configuration
 * 
 * Defines the settings and constraints for free consultation events
 */
export const FreeConsultationConfig: EventConfig = {
  // Unique identifier for this event type
  id: 'free_consultation',
  
  // Display title (matches current EventModal implementation)
  title: 'Free Consultation (20 Min)',
  
  // Default description (extracted from current getDefaultDescription)
  description: 'A complimentary 20-minute consultation to discuss your fitness goals, assess your current fitness level, and create a personalized training plan. This session includes a brief movement assessment and goal-setting discussion to determine the best approach for your fitness journey.',
  
  // Fixed 20-minute duration
  defaultDuration: 20,
  
  // Duration selection not required (fixed duration)
  requiresDuration: false,
  
  // Only 20-minute option available
  availableDurations: [20],
  
  // Location selection required for virtual meeting
  requiresLocation: true,
  
  // Default event classification
  defaultEventType: 'session',
  
  // Individual consultation
  defaultSessionType: 'individual',
  
  // Available for booking by default
  defaultBookingStatus: 'available',
  
  // Single participant consultations
  minParticipants: 1,
  maxParticipants: 1,
  
  // Free consultation (no charge)
  defaultPrice: 0,
  
  // Pricing not applicable for free consultations
  supportsPricing: false,
  
  // Category classification
  category: 'consultation'
}; 