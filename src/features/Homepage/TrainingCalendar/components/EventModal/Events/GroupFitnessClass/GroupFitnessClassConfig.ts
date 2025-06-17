/**
 * Group Fitness Class Event Configuration
 * 
 * Configuration for 45-minute online group fitness classes
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { EventConfig } from '../types';

/**
 * Group Fitness Class Event Configuration
 * 
 * Defines the settings and constraints for online group fitness classes
 */
export const GroupFitnessClassConfig: EventConfig = {
  // Unique identifier for this event type
  id: 'group_fitness_class',
  
  // Display title (matches current EventModal implementation)
  title: 'Online Group Fitness Class (45 Min)',
  
  // Default description (extracted from current getDefaultDescription)
  description: 'Join our energizing 45-minute online group fitness class designed for all fitness levels. This virtual session includes a dynamic warm-up, full-body workout with modifications provided, and cool-down stretching. All you need is a small space and water bottle!',
  
  // Fixed 45-minute duration
  defaultDuration: 45,
  
  // Duration selection not required (fixed duration)
  requiresDuration: false,
  
  // Only 45-minute option available
  availableDurations: [45],
  
  // Location selection required for virtual meeting
  requiresLocation: true,
  
  // Default event classification
  defaultEventType: 'group_class',
  
  // Group session type (multiple participants)
  defaultSessionType: 'group',
  
  // Available for booking by default
  defaultBookingStatus: 'available',
  
  // Group class capacity
  minParticipants: 1,
  maxParticipants: 20, // Typical group class size
  
  // Paid group class (configurable pricing)
  defaultPrice: 25,
  
  // Supports pricing configuration
  supportsPricing: true,
  
  // Category classification
  category: 'class'
}; 