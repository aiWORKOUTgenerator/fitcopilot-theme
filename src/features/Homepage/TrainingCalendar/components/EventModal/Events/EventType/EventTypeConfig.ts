/**
 * Event Type Configuration - Smart Scheduling System
 * 
 * Configuration for event types and smart scheduling settings
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { EventTypeOption, SmartSchedulingConfig } from './EventTypeInterfaces';

/**
 * Available Event Type Options
 * Migrated from EventModal.tsx memoizedOptions.eventTitleOptions
 */
export const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
  {
    value: '',
    label: '- Choose Event -',
    description: 'Please select an event type to continue',
    category: 'consultation',
    requiresDuration: false,
    supportsPricing: false
  },
  {
    value: 'Free Consultation (20 Min)',
    label: 'Free Consultation (20 Min)',
    description: 'A complimentary 20-minute consultation to discuss your fitness goals, assess your current fitness level, and create a personalized training plan.',
    duration: 20,
    category: 'consultation',
    requiresDuration: false,
    supportsPricing: false,
    automaticSelections: {
      eventType: 'assessment',
      sessionType: 'individual',
      bookingStatus: 'pending',
      price: 0
    }
  },
  {
    value: 'Online Group Fitness Class (45 Min)',
    label: 'Online Group Fitness Class (45 Min)',
    description: 'Join our energizing 45-minute online group fitness class designed for all fitness levels with dynamic warm-up, full-body workout, and cool-down stretching.',
    duration: 45,
    category: 'class',
    requiresDuration: false,
    supportsPricing: true
  },
  {
    value: 'Personal Training Session',
    label: 'Personal Training Session',
    description: 'One-on-one personalized training session tailored to your specific goals and fitness level with customized workout programming and form correction.',
    category: 'training',
    requiresDuration: true,
    supportsPricing: true
  }
];

/**
 * Duration Options for Personal Training Sessions
 * Migrated from EventModal.tsx memoizedOptions.durationOptions
 */
export const DURATION_OPTIONS = [
  { value: '', label: '- Select Duration -' },
  { value: 30, label: '30 Min', description: 'Quick focused session for skill work or check-ins' },
  { value: 45, label: '45 Min', description: 'Standard session for comprehensive training' },
  { value: 60, label: '60 Min', description: 'Extended session with warm-up, workout, and cool-down' }
];

/**
 * Smart Scheduling Configuration for Free Consultation
 */
export const FREE_CONSULTATION_SCHEDULING: SmartSchedulingConfig = {
  enabled: true,
  minAdvanceHours: 2,
  maxAdvanceDays: 30,
  timeSlots: {
    availableDays: [1, 2, 3, 4, 5], // Monday to Friday
    availableHours: {
      start: 9, // 9 AM
      end: 17  // 5 PM
    },
    slotDuration: 20,
    bufferTime: 10
  },
  trainerRequirements: {
    required: false,
    preferredSpecialties: ['consultation', 'assessment'],
    checkAvailability: true
  }
};

/**
 * Smart Scheduling Configuration for Group Fitness Class
 */
export const GROUP_FITNESS_SCHEDULING: SmartSchedulingConfig = {
  enabled: true,
  minAdvanceHours: 1,
  maxAdvanceDays: 14,
  timeSlots: {
    availableDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
    availableHours: {
      start: 6,  // 6 AM
      end: 20   // 8 PM
    },
    slotDuration: 45,
    bufferTime: 15
  },
  trainerRequirements: {
    required: true,
    preferredSpecialties: ['group_fitness', 'cardio', 'strength'],
    checkAvailability: true
  }
};

/**
 * Smart Scheduling Configuration for Personal Training
 */
export const PERSONAL_TRAINING_SCHEDULING: SmartSchedulingConfig = {
  enabled: true,
  minAdvanceHours: 4,
  maxAdvanceDays: 60,
  timeSlots: {
    availableDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
    availableHours: {
      start: 6,  // 6 AM
      end: 21   // 9 PM
    },
    slotDuration: 30, // Will be overridden by selected duration
    bufferTime: 15
  },
  trainerRequirements: {
    required: true,
    preferredSpecialties: ['personal_training', 'strength', 'conditioning'],
    checkAvailability: true
  }
};

/**
 * Get Smart Scheduling Configuration by Event Type
 */
export const getSmartSchedulingConfig = (eventType: string): SmartSchedulingConfig | null => {
  switch (eventType) {
    case 'Free Consultation (20 Min)':
      return FREE_CONSULTATION_SCHEDULING;
    case 'Online Group Fitness Class (45 Min)':
      return GROUP_FITNESS_SCHEDULING;
    case 'Personal Training Session':
      return PERSONAL_TRAINING_SCHEDULING;
    default:
      return null;
  }
};

/**
 * Get Event Type Option by Value
 */
export const getEventTypeOption = (value: string): EventTypeOption | undefined => {
  return EVENT_TYPE_OPTIONS.find(option => option.value === value);
};

/**
 * Get Duration Options for Event Type
 */
export const getDurationOptionsForEventType = (eventType: string): Array<{ value: number | string; label: string; description?: string }> => {
  const option = getEventTypeOption(eventType);
  
  if (!option?.requiresDuration) {
    // Fixed duration events don't show duration selector
    return [];
  }
  
  // Personal Training Session uses variable durations
  if (eventType === 'Personal Training Session') {
    return DURATION_OPTIONS;
  }
  
  return [];
};

/**
 * Get automatic event type for a given event title
 * Returns the event type that should be automatically selected
 */
export const getAutomaticEventType = (eventTitle: string): string | null => {
  const option = getEventTypeOption(eventTitle);
  return option?.automaticSelections?.eventType || null;
};

/**
 * Get all automatic selections for a given event title
 * Returns all fields that should be automatically selected
 */
export const getAutomaticSelections = (eventTitle: string): { eventType?: string; sessionType?: string; bookingStatus?: string; price?: number } | null => {
  const option = getEventTypeOption(eventTitle);
  return option?.automaticSelections || null;
};

/**
 * Check if an event title has automatic event type selection
 */
export const hasAutomaticEventType = (eventTitle: string): boolean => {
  return getAutomaticEventType(eventTitle) !== null;
};

/**
 * Check if an event title has any automatic selections
 */
export const hasAutomaticSelections = (eventTitle: string): boolean => {
  return getAutomaticSelections(eventTitle) !== null;
};

/**
 * Default Time Zone
 */
export const DEFAULT_TIMEZONE = 'America/New_York';

/**
 * Business Hours Configuration
 */
export const BUSINESS_HOURS = {
  start: 6,  // 6 AM
  end: 21,   // 9 PM
  timezone: DEFAULT_TIMEZONE
};

/**
 * Scheduling Preferences Defaults
 */
export const DEFAULT_SCHEDULING_PREFERENCES = {
  preferredTimeOfDay: 'any' as const,
  preferredDays: [1, 2, 3, 4, 5], // Weekdays
  timezone: DEFAULT_TIMEZONE,
  wantsEarliestSlot: false
}; 