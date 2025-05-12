/**
 * Registration form data structure
 */
export interface RegistrationFormData {
    /** User's email address */
    email: string;

    /** User's full name */
    name: string;

    /** Selected fitness goal */
    fitnessGoal: string;

    /** Current step in the form process */
    step: number;
}

/**
 * Available fitness goals for registration
 */
export enum FitnessGoal {
    WEIGHT_LOSS = 'weight-loss',
    MUSCLE_GAIN = 'muscle-gain',
    ENDURANCE = 'endurance',
    FLEXIBILITY = 'flexibility'
}

/**
 * Form validation errors
 */
export interface FormErrors {
    [key: string]: string;
}

/**
 * Props for the form step component
 */
export interface FormStepProps {
    /** Current step number */
    step: number;

    /** Form data object */
    formData: RegistrationFormData;

    /** Validation errors object */
    errors: FormErrors;

    /** Handler for form field changes */
    onChange: (field: keyof RegistrationFormData, value: string) => void;

    /** Handler for next step button */
    onNext: () => void;

    /** Handler for previous step button */
    onPrev: () => void;
}

/**
 * Props for the progress indicator component
 */
export interface ProgressIndicatorProps {
    /** Current step number */
    currentStep: number;

    /** Total number of steps */
    totalSteps: number;
}

/**
 * User data returned after successful registration
 */
export interface UserData {
    /** Unique user ID */
    id: string | number;
    /** User email */
    email: string;
    /** User display name */
    displayName?: string;
    /** Profile completion percentage */
    profileCompletion?: number;
    /** Account verification status */
    verified?: boolean;
    /** Custom user fields */
    [key: string]: unknown;
}

/**
 * Registration form submission result
 */
export interface RegistrationResult {
    /** Whether registration was successful */
    success: boolean;

    /** User ID or error message */
    message: string;

    /** User data returned from the registration process */
    data?: UserData;
} 