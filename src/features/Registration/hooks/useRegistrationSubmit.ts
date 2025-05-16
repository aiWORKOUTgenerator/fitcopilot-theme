import { useCallback, useState } from 'react';
import { RegistrationData } from '../types';
import { submitRegistration } from '../utils/registrationApi';

/**
 * Hook for handling the registration form submission
 * 
 * @returns Object containing submission state and handler
 */
export const useRegistrationSubmit = () => {
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Submit handler
  const submitRegistrationData = useCallback(async (data: RegistrationData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Call the API function to submit registration data
      const response = await submitRegistration(data);

      setSuccess(true);
      return response;
    } catch (err) {
      // Handle error cases
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Reset the submission state
  const resetSubmission = useCallback(() => {
    setIsSubmitting(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    isSubmitting,
    error,
    success,
    submitRegistrationData,
    resetSubmission,
  };
};

export default useRegistrationSubmit; 