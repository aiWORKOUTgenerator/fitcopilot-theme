import { RegistrationData } from '../types';

/**
 * Submit registration data to WordPress backend
 * 
 * @param data - Registration data to submit
 * @returns Promise with the submission response
 */
export const submitRegistration = async (data: RegistrationData) => {
    try {
        // Get the WordPress REST API URL and nonce from the global variable
        const wpData = (window as any).athleteDashboardData?.wpData || {};
        const restUrl = wpData.restUrl || '/wp-json';
        const nonce = wpData.nonce || '';

        // Create request options
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': nonce,
            },
            body: JSON.stringify(data),
        };

        // Make the API request
        const response = await fetch(`${restUrl}/fitcopilot/v1/registration`, options);

        // Check if the request was successful
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit registration');
        }

        // Parse the response data
        return await response.json();
    } catch (error) {
        console.error('Registration submission error:', error);
        throw error;
    }
};

/**
 * Validate an email address for registration
 * 
 * @param email - Email address to validate
 * @returns Promise with validation result
 */
export const validateEmail = async (email: string) => {
    try {
        const wpData = (window as any).athleteDashboardData?.wpData || {};
        const restUrl = wpData.restUrl || '/wp-json';
        const nonce = wpData.nonce || '';

        const response = await fetch(
            `${restUrl}/fitcopilot/v1/validate-email?email=${encodeURIComponent(email)}`,
            {
                method: 'GET',
                headers: {
                    'X-WP-Nonce': nonce,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to validate email');
        }

        return await response.json();
    } catch (error) {
        console.error('Email validation error:', error);
        throw error;
    }
};

/**
 * Get initial workout recommendation based on user selections
 * 
 * @param data - User profile data
 * @returns Promise with workout recommendation data
 */
export const getWorkoutRecommendation = async (data: Partial<RegistrationData>) => {
    try {
        const wpData = (window as any).athleteDashboardData?.wpData || {};
        const restUrl = wpData.restUrl || '/wp-json';
        const nonce = wpData.nonce || '';

        const response = await fetch(`${restUrl}/fitcopilot/v1/workout-recommendation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': nonce,
            },
            body: JSON.stringify({
                experienceLevel: data.experienceLevel,
                goals: data.goals,
                equipment: data.equipment,
                timeCommitment: data.timeCommitment,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get workout recommendation');
        }

        return await response.json();
    } catch (error) {
        console.error('Workout recommendation error:', error);
        throw error;
    }
}; 