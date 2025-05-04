/**
 * Options for preferred time of day for workouts
 */
export const TIME_OF_DAY_OPTIONS = [
    'Morning',
    'Midday',
    'Afternoon',
    'Evening',
    'Late Night'
];

/**
 * Options for workout duration
 */
export const DURATION_OPTIONS = [
    '5–10 minutes (Quick session)',
    '15 minutes',
    '30 minutes',
    '45 minutes',
    '60 minutes',
    '90 minutes',
    '120 minutes',
    '180 minutes (Marathon/Endurance)'
];

/**
 * Options for workout frequency
 * IMPORTANT: These must match exactly with the frequencyRange values in the packages
 */
export const FREQUENCY_OPTIONS = [
    '1-2 days per week',
    '3-4 days per week',
    '5-6 days per week',
    'Every day'
];

/**
 * Days of the week for training day selection
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
 * Workout time commitment packages with predefined configurations
 */
export const TIME_COMMITMENT_PACKAGES = [
    {
        id: 'minimal',
        label: 'Minimal',
        description: '1-2 sessions per week, 20-30 minutes',
        frequencyRange: '1-2 days per week',
        durationRange: '20-30 minutes',
        totalWeeklyTime: '20-60 minutes per week',
        icon: 'clock',
        daysPerWeek: 2,
        suggestedDays: ['Monday', 'Thursday']
    },
    {
        id: 'moderate',
        label: 'Moderate',
        description: '3-4 sessions per week, 30-45 minutes',
        frequencyRange: '3-4 days per week',
        durationRange: '30-45 minutes',
        totalWeeklyTime: '90-180 minutes per week',
        icon: 'clock',
        daysPerWeek: 3,
        suggestedDays: ['Monday', 'Wednesday', 'Friday']
    },
    {
        id: 'dedicated',
        label: 'Dedicated',
        description: '5-6 sessions per week, 45-60 minutes',
        frequencyRange: '5-6 days per week',
        durationRange: '45-60 minutes',
        totalWeeklyTime: '225-360 minutes per week',
        icon: 'clock',
        daysPerWeek: 5,
        suggestedDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday']
    },
    {
        id: 'extensive',
        label: 'Extensive',
        description: 'Daily workouts, 60+ minutes',
        frequencyRange: 'Every day',
        durationRange: '60+ minutes',
        totalWeeklyTime: '420+ minutes per week',
        icon: 'clock',
        daysPerWeek: 7,
        suggestedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
]; 