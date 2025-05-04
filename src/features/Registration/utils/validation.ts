import { RegistrationData, RegistrationStep } from '../types';

/**
 * Email validation
 * 
 * @param email - Email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Password strength validation
 * 
 * @param password - Password to validate
 * @returns Object with validation result and strength score
 */
export const validatePassword = (password: string): {
    isValid: boolean;
    score: number;
    message: string;
} => {
    // Initial values
    let score = 0;
    let message = '';

    // Check if password is at least 8 characters
    if (password.length >= 8) {
        score += 1;
    }

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
        score += 1;
    }

    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
        score += 1;
    }

    // Check for numbers
    if (/[0-9]/.test(password)) {
        score += 1;
    }

    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) {
        score += 1;
    }

    // Determine message based on score
    if (score === 0 || score === 1) {
        message = 'Weak password';
    } else if (score === 2) {
        message = 'Fair password';
    } else if (score === 3) {
        message = 'Good password';
    } else if (score === 4) {
        message = 'Strong password';
    } else if (score === 5) {
        message = 'Very strong password';
    }

    return {
        isValid: score >= 3,
        score,
        message,
    };
};

/**
 * Check if required fields for a specific step are filled
 * 
 * @param data - Registration data
 * @param step - Current registration step
 * @returns Boolean indicating if step data is valid
 */
export const isStepDataValid = (data: RegistrationData, step: RegistrationStep): boolean => {
    switch (step) {
        case RegistrationStep.SPLASH:
            // Splash screen doesn't require validation
            return true;

        case RegistrationStep.EXPERIENCE_LEVEL:
            return !!data.experienceLevel;

        case RegistrationStep.GOALS:
            return !!data.goals && data.goals.length > 0;

        case RegistrationStep.EQUIPMENT:
            return !!data.equipment;

        case RegistrationStep.TIME_COMMITMENT:
            return !!data.timeCommitment;

        case RegistrationStep.PRICING:
            return !!data.selectedPlan;

        case RegistrationStep.PAYMENT:
            if (data.selectedPlan === 'free_trial') {
                return true;
            }
            return !!data.paymentDetails?.cardholderName;

        default:
            return false;
    }
}; 