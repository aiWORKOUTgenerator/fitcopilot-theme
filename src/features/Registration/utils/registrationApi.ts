import logger from '../../../utils/logger';
import { RegistrationData } from '../types';

// Create API-specific logger
const apiLogger = logger.addContext('RegistrationAPI');

/**
 * Submit registration data to WordPress backend
 * 
 * @param data - Registration data to submit
 * @returns Promise with the submission response
 */
export const submitRegistration = async (data: RegistrationData) => {
    const timerId = apiLogger.time('submitRegistration');

    try {
        // Get the WordPress REST API URL and nonce from the global variable
        const wpData = (window as any).athleteDashboardData?.wpData || {};
        const restUrl = wpData.restUrl || '/wp-json';
        const nonce = wpData.nonce || '';

        apiLogger.debug('Submitting registration data', {
            endpoint: `${restUrl}/fitcopilot/v1/registration`,
            dataFields: Object.keys(data)
        });

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
            const errorMessage = errorData.message || 'Failed to submit registration';
            apiLogger.error('Registration submission failed', {
                status: response.status,
                statusText: response.statusText,
                errorMessage
            });
            throw new Error(errorMessage);
        }

        // Parse the response data
        const result = await response.json();
        apiLogger.info('Registration submission successful', {
            userId: result.user_id,
            status: result.status
        });

        apiLogger.timeEnd(timerId);
        return result;
    } catch (error) {
        apiLogger.error('Registration submission error', { error });
        apiLogger.timeEnd(timerId);
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
    const timerId = apiLogger.time('validateEmail');

    try {
        const wpData = (window as any).athleteDashboardData?.wpData || {};
        const restUrl = wpData.restUrl || '/wp-json';
        const nonce = wpData.nonce || '';

        apiLogger.debug('Validating email address', {
            endpoint: `${restUrl}/fitcopilot/v1/validate-email`,
            email: email.slice(0, 3) + '***' // Log partial email for privacy
        });

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
            const errorMessage = errorData.message || 'Failed to validate email';
            apiLogger.error('Email validation failed', {
                status: response.status,
                statusText: response.statusText,
                errorMessage
            });
            throw new Error(errorMessage);
        }

        const result = await response.json();
        apiLogger.debug('Email validation successful', { isValid: result.isValid });

        apiLogger.timeEnd(timerId);
        return result;
    } catch (error) {
        apiLogger.error('Email validation error', { error });
        apiLogger.timeEnd(timerId);
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
    const timerId = apiLogger.time('getWorkoutRecommendation');

    try {
        const wpData = (window as any).athleteDashboardData?.wpData || {};
        const restUrl = wpData.restUrl || '/wp-json';
        const nonce = wpData.nonce || '';

        apiLogger.debug('Requesting workout recommendation', {
            endpoint: `${restUrl}/fitcopilot/v1/workout-recommendation`,
            experienceLevel: data.experienceLevel,
            hasGoals: Boolean(data.goals),
            hasEquipment: Boolean(data.equipment)
        });

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
            const errorMessage = errorData.message || 'Failed to get workout recommendation';
            apiLogger.error('Workout recommendation failed', {
                status: response.status,
                statusText: response.statusText,
                errorMessage
            });
            throw new Error(errorMessage);
        }

        const result = await response.json();
        apiLogger.info('Workout recommendation successful', {
            recommendationId: result.id,
            programCount: result.programs?.length || 0
        });

        apiLogger.timeEnd(timerId);
        return result;
    } catch (error) {
        apiLogger.error('Workout recommendation error', { error });
        apiLogger.timeEnd(timerId);
        throw error;
    }
}; 