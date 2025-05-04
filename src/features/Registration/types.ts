/**
 * Registration feature shared types
 */

/**
 * Registration steps enum
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
    // Personal data
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;

    // Profile data
    experienceLevel?: ExperienceLevel;
    goals?: WorkoutGoal[];
    equipment?: EquipmentAvailability;
    equipmentList?: string[];  // List of selected equipment items
    otherEquipment?: string;   // User-specified equipment not in predefined list
    timeCommitment?: TimeCommitment;

    // Customization data
    completedCustomizationSections?: string[];
    frequencyOption?: string;
    preferredTrainingDays?: string[];
    daysPerWeek?: number;
    timeCommitmentPackage?: string;
    preferredTimeOfDay?: string[];
    preferredDuration?: string;
    otherDuration?: string;
    preferredDays?: string[];  // Preferred days of the week for training
    trainingFrequency?: string; // Training frequency selection

    // Analytics preferences
    analyticsFeatures?: string[];

    // Metrics
    age?: number;
    height?: number; // cm
    weight?: number; // kg
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';

    // Subscription
    selectedPlan?: 'monthly' | 'yearly' | 'free_trial';
    paymentDetails?: {
        cardholderName?: string;
        // We'll use a payment processor, so we don't directly handle card details
    };
}

/**
 * Registration component props
 */
export interface RegistrationProps {
    className?: string;
    initialStep?: RegistrationStep;
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