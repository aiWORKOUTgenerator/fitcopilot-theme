/**
 * Registration feature shared types
 */

/**
 * Top-level registration steps
 */
export enum RegistrationStepId {
    SPLASH = "splash",
    EXPERIENCE_LEVEL = "experienceLevel",
    JOURNEY = "journey",
    PRICING = "pricing",
    PAYMENT = "payment",
    CONFIRMATION = "confirmation"
}

/**
 * @deprecated Use RegistrationStepId instead - kept for backward compatibility during migration
 */
export enum RegistrationStep {
    SPLASH = 'splash',
    EXPERIENCE_LEVEL = 'experience_level',
    GOALS = 'goals',
    EQUIPMENT = 'equipment',
    TIME_COMMITMENT = 'time_commitment',
    PRICING = 'pricing',
    PAYMENT = 'payment',
    CONFIRMATION = 'confirmation'
}

/**
 * Journey sub-steps
 */
export enum JourneySubstepId {
    GOALS = "goals",
    EQUIPMENT = "equipment",
    TIME_COMMITMENT = "timeCommitment",
    MEDICAL = "medical",
    ANALYTICS = "analytics"
}

/**
 * Component sections within sub-steps
 */
export enum SectionId {
    // Equipment sections
    EQUIPMENT_HOME = "equipmentHome",
    EQUIPMENT_GYM = "equipmentGym",
    EQUIPMENT_TRAVEL = "equipmentTravel",

    // Time commitment sections
    TIME_DAYS = "timeDays",
    TIME_DURATION = "timeDuration",

    // Medical sections
    MEDICAL_CONDITIONS = "medicalConditions",
    MEDICAL_INJURIES = "medicalInjuries",
    MEDICAL_LIMITATIONS = "medicalLimitations"
}

/**
 * Hierarchical relationship map
 */
export const NAVIGATION_HIERARCHY = {
    steps: {
        [RegistrationStepId.SPLASH]: null,
        [RegistrationStepId.EXPERIENCE_LEVEL]: null,
        [RegistrationStepId.JOURNEY]: [
            JourneySubstepId.GOALS,
            JourneySubstepId.EQUIPMENT,
            JourneySubstepId.TIME_COMMITMENT,
            JourneySubstepId.MEDICAL,
            JourneySubstepId.ANALYTICS
        ],
        [RegistrationStepId.PRICING]: null,
        [RegistrationStepId.PAYMENT]: null,
        [RegistrationStepId.CONFIRMATION]: null
    },
    sections: {
        [JourneySubstepId.EQUIPMENT]: [
            SectionId.EQUIPMENT_HOME,
            SectionId.EQUIPMENT_GYM,
            SectionId.EQUIPMENT_TRAVEL
        ],
        [JourneySubstepId.TIME_COMMITMENT]: [
            SectionId.TIME_DAYS,
            SectionId.TIME_DURATION
        ],
        [JourneySubstepId.MEDICAL]: [
            SectionId.MEDICAL_CONDITIONS,
            SectionId.MEDICAL_INJURIES,
            SectionId.MEDICAL_LIMITATIONS
        ]
    }
};

/**
 * Experience level enum
 */
export enum ExperienceLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced'
}

/**
 * Workout goal enum
 */
export enum WorkoutGoal {
    WEIGHT_LOSS = 'weight_loss',
    MUSCLE_GAIN = 'muscle_gain',
    ENDURANCE = 'endurance',
    STRENGTH = 'strength',
    FLEXIBILITY = 'flexibility',
    OVERALL_FITNESS = 'overall_fitness'
}

/**
 * Equipment availability enum
 */
export enum EquipmentAvailability {
    NONE = 'none', // Bodyweight only
    MINIMAL = 'minimal', // Bands, light dumbbells
    HOME_GYM = 'home_gym', // More extensive home equipment
    FULL_GYM = 'full_gym' // Commercial gym access
}

/**
 * Time commitment enum
 */
export enum TimeCommitment {
    MINIMAL = 'minimal', // 1-2 sessions per week, 20-30 minutes
    MODERATE = 'moderate', // 3-4 sessions per week, 30-45 minutes
    DEDICATED = 'dedicated', // 4-5 sessions per week, 45-60 minutes
    EXTENSIVE = 'extensive' // 5+ sessions per week, 60+ minutes
}

/**
 * Main registration data interface
 */
export interface RegistrationData {
    // User information
    experienceLevel?: string;
    goals?: string[];

    // Equipment data
    [SectionId.EQUIPMENT_HOME]?: any;
    [SectionId.EQUIPMENT_GYM]?: any;
    [SectionId.EQUIPMENT_TRAVEL]?: any;

    // Time commitment data
    [SectionId.TIME_DAYS]?: any;
    [SectionId.TIME_DURATION]?: any;

    // Medical data
    [SectionId.MEDICAL_CONDITIONS]?: any;
    [SectionId.MEDICAL_INJURIES]?: any;
    [SectionId.MEDICAL_LIMITATIONS]?: any;

    // Analytics preferences
    analyticsConsent?: boolean;

    // Payment information
    selectedPlan?: string;
    paymentDetails?: any;

    // Registration status
    registrationCompleted?: boolean;
    registrationDate?: string;

    // Section completion tracking
    completedCustomizationSections?: string[];
}

/**
 * Registration component props
 */
export interface RegistrationProps {
    className?: string;
    initialStep?: RegistrationStepId;
    onComplete?: (data: RegistrationData) => void;
    onCancel?: () => void;
}

/**
 * Props for individual step components
 */
export interface RegistrationStepProps {
    data: RegistrationData;
    updateData: (newData: Partial<RegistrationData>) => void;
    onNext: () => void;
    onBack?: () => void;
    className?: string;
} 