import {
    EquipmentAvailability,
    ExperienceLevel,
    RegistrationData,
    TimeCommitment,
    WorkoutGoal
} from '../types';

/**
 * Transform experience level enum to human-readable text
 * 
 * @param level - Experience level enum value
 * @returns Human-readable text
 */
export const experienceLevelToText = (level: ExperienceLevel): string => {
    switch (level) {
        case ExperienceLevel.BEGINNER:
            return 'New to Exercise';
        case ExperienceLevel.INTERMEDIATE:
            return 'Some Experience';
        case ExperienceLevel.ADVANCED:
            return 'Advanced Athlete';
        default:
            return 'Unknown Level';
    }
};

/**
 * Transform goal enum to human-readable text
 * 
 * @param goal - Workout goal enum value
 * @returns Human-readable text
 */
export const goalToText = (goal: WorkoutGoal): string => {
    switch (goal) {
        case WorkoutGoal.WEIGHT_LOSS:
            return 'Weight Loss';
        case WorkoutGoal.MUSCLE_GAIN:
            return 'Muscle Gain';
        case WorkoutGoal.ENDURANCE:
            return 'Improved Endurance';
        case WorkoutGoal.STRENGTH:
            return 'Increased Strength';
        case WorkoutGoal.FLEXIBILITY:
            return 'Better Flexibility';
        case WorkoutGoal.OVERALL_FITNESS:
            return 'Overall Fitness';
        default:
            return 'Unknown Goal';
    }
};

/**
 * Transform equipment availability enum to human-readable text
 * 
 * @param equipment - Equipment availability enum value
 * @returns Human-readable text
 */
export const equipmentToText = (equipment: EquipmentAvailability): string => {
    switch (equipment) {
        case EquipmentAvailability.NONE:
            return 'Bodyweight Only';
        case EquipmentAvailability.MINIMAL:
            return 'Minimal Equipment';
        case EquipmentAvailability.HOME_GYM:
            return 'Home Gym';
        case EquipmentAvailability.FULL_GYM:
            return 'Full Gym Access';
        default:
            return 'Unknown Equipment';
    }
};

/**
 * Transform time commitment enum to human-readable text
 * 
 * @param time - Time commitment enum value
 * @returns Human-readable text
 */
export const timeCommitmentToText = (time: TimeCommitment): string => {
    switch (time) {
        case TimeCommitment.MINIMAL:
            return '1-2 sessions per week (20-30 min)';
        case TimeCommitment.MODERATE:
            return '3-4 sessions per week (30-45 min)';
        case TimeCommitment.DEDICATED:
            return '4-5 sessions per week (45-60 min)';
        case TimeCommitment.EXTENSIVE:
            return '5+ sessions per week (60+ min)';
        default:
            return 'Unknown Time Commitment';
    }
};

/**
 * Format registration data for summary display
 * 
 * @param data - Registration data
 * @returns Formatted data object with human-readable values
 */
export const formatRegistrationDataForSummary = (data: RegistrationData) => {
    return {
        personalInfo: {
            name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : 'Not provided',
            email: data.email || 'Not provided',
        },
        workoutPreferences: {
            experienceLevel: data.experienceLevel ? experienceLevelToText(data.experienceLevel) : 'Not selected',
            goals: data.goals?.map(goalToText).join(', ') || 'Not selected',
            equipment: data.equipment ? equipmentToText(data.equipment) : 'Not selected',
            timeCommitment: data.timeCommitment ? timeCommitmentToText(data.timeCommitment) : 'Not selected',
        },
        subscription: {
            plan: data.selectedPlan === 'monthly' ? 'Monthly Plan' :
                data.selectedPlan === 'yearly' ? 'Annual Plan' :
                    data.selectedPlan === 'free_trial' ? 'Free Trial' : 'Not selected',
        }
    };
}; 