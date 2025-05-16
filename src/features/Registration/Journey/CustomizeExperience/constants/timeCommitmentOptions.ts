/**
 * Time of day options
 */
export const TIME_OF_DAY_OPTIONS = [
  'Morning',
  'Afternoon',
  'Evening',
  'Night',
  'Flexible'
];

/**
 * Duration options
 */
export const DURATION_OPTIONS = [
  'Less than 30 minutes',
  '30-45 minutes',
  '45-60 minutes',
  '60+ minutes'
];

/**
 * Training frequency options
 */
export const FREQUENCY_OPTIONS = [
  '1-2 days per week',
  '3-4 days per week',
  '5-6 days per week',
  'Every day'
];

/**
 * Days of the week
 */
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

/**
 * Interface for time commitment packages
 */
export interface TimeCommitmentPackage {
    name: string;
    description: string;
    duration: string;
    frequency: string;
    totalWeeklyTime: string;
    days: string[];
}

/**
 * Workout time commitment packages with predefined configurations
 */
export const TIME_COMMITMENT_PACKAGES: Record<string, TimeCommitmentPackage> = {
  minimal: {
    name: 'Minimal',
    description: '1-2 sessions per week, 20-30 minutes',
    duration: 'Less than 30 minutes',
    frequency: '1-2 days per week',
    totalWeeklyTime: '20-60 minutes per week',
    days: ['Monday', 'Thursday']
  },
  moderate: {
    name: 'Moderate',
    description: '3-4 sessions per week, 30-45 minutes',
    duration: '30-45 minutes',
    frequency: '3-4 days per week',
    totalWeeklyTime: '90-180 minutes per week',
    days: ['Monday', 'Wednesday', 'Friday']
  },
  dedicated: {
    name: 'Dedicated',
    description: '5-6 sessions per week, 45-60 minutes',
    duration: '45-60 minutes',
    frequency: '5-6 days per week',
    totalWeeklyTime: '225-360 minutes per week',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday']
  },
  extensive: {
    name: 'Extensive',
    description: 'Daily workouts, 60+ minutes',
    duration: '60+ minutes',
    frequency: 'Every day',
    totalWeeklyTime: '420+ minutes per week',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }
}; 