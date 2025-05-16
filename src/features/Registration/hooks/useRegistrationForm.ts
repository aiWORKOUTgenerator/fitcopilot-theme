import { useCallback, useState } from 'react';
import useApi, { ApiResponse } from '../../../hooks/useApi';
import logger from '../../../utils/logger';
import { RegistrationData, RegistrationStep } from '../types';

// Create form-specific logger
const formLogger = logger.addContext('RegistrationForm');

/**
 * Registration submission response type
 */
interface RegistrationResponse {
    user_id: number;
    status: string;
    message?: string;
    redirect_url?: string;
}

/**
 * Email validation response type
 */
interface EmailValidationResponse {
    isValid: boolean;
    message?: string;
}

/**
 * Form validation state type
 */
interface FormValidationState {
    isValid: boolean;
    errors: Record<string, string>;
}

/**
 * Hook for registration form management with proper type safety
 * 
 * @param initialData Initial registration data (if any)
 * @returns Registration form utilities and state
 */
const useRegistrationForm = (initialData?: Partial<RegistrationData>) => {
  // Form data state
  const [formData, setFormData] = useState<Partial<RegistrationData>>(initialData || {});

  // Form validation state
  const [validation, setValidation] = useState<FormValidationState>({
    isValid: true,
    errors: {}
  });

  // Step state
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(RegistrationStep.GOALS);

  // Use our API hooks with proper typing
  const registrationApi = useApi<RegistrationResponse>();
  const _emailValidationApi = useApi<EmailValidationResponse>();

  /**
     * Update form data with new values
     */
  const updateFormData = useCallback((newData: Partial<RegistrationData>) => {
    formLogger.debug('Updating form data', {
      fields: Object.keys(newData),
      currentStep
    });

    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));

    // Clear any errors for the updated fields
    if (validation.errors && Object.keys(validation.errors).length > 0) {
      const updatedFields = Object.keys(newData);
      const remainingErrors = { ...validation.errors };

      let errorsRemoved = false;
      updatedFields.forEach(field => {
        if (remainingErrors[field]) {
          delete remainingErrors[field];
          errorsRemoved = true;
        }
      });

      if (errorsRemoved) {
        setValidation({
          isValid: Object.keys(remainingErrors).length === 0,
          errors: remainingErrors
        });
      }
    }
  }, [currentStep, validation.errors]);

  /**
     * Validate an _email address
     */
  const validateEmail = useCallback(async (_email: string): Promise<boolean> => {
    try {
      const response = await _emailValidationApi.fetchApi('/fitcopilot/v1/validate-_email', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data.isValid;
    } catch (error) {
      formLogger.error('Email validation failed', { error });
      setValidation(prev => ({
        ...prev,
        isValid: false,
        errors: {
          ...prev.errors,
          _email: 'Failed to validate _email. Please try again.'
        }
      }));
      return false;
    }
  }, [_emailValidationApi]);

  /**
     * Validate form data for the current step
     */
  const validateCurrentStep = useCallback((): boolean => {
    let isValid = true;
    const errors: Record<string, string> = {};

    switch (currentStep) {
    case RegistrationStep.GOALS:
      if (!formData.goals || formData.goals.length === 0) {
        errors.goals = 'Please select at least one goal';
        isValid = false;
      }
      break;

    case RegistrationStep.EXPERIENCE_LEVEL:
      if (!formData.experienceLevel) {
        errors.experienceLevel = 'Please select your experience level';
        isValid = false;
      }
      break;

    case RegistrationStep.CUSTOMIZE_EXPERIENCE:
      if (!formData.equipment || formData.equipment.length === 0) {
        errors.equipment = 'Please select available equipment';
        isValid = false;
      }
      if (!formData.timeCommitment) {
        errors.timeCommitment = 'Please select your time commitment';
        isValid = false;
      }
      break;

    case RegistrationStep.ACCOUNT_CREATION:
      if (!formData._email) {
        errors._email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData._email)) {
        errors._email = 'Please enter a valid _email address';
        isValid = false;
      }
      if (!formData.password) {
        errors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
        isValid = false;
      }
      break;

    default:
      break;
    }

    setValidation({ isValid, errors });
    return isValid;
  }, [currentStep, formData]);

  /**
     * Move to the next step in the registration flow
     */
  const goToNextStep = useCallback(() => {
    if (validateCurrentStep()) {
      formLogger.debug('Moving to next step', {
        currentStep,
        nextStep: currentStep + 1
      });
      setCurrentStep(prevStep => prevStep + 1 as RegistrationStep);
    }
  }, [currentStep, validateCurrentStep]);

  /**
     * Move to the previous step in the registration flow
     */
  const goToPreviousStep = useCallback(() => {
    formLogger.debug('Moving to previous step', {
      currentStep,
      prevStep: currentStep - 1
    });
    setCurrentStep(prevStep => prevStep - 1 as RegistrationStep);
  }, [currentStep]);

  /**
     * Submit the registration form data
     */
  const submitForm = useCallback(async (): Promise<ApiResponse<RegistrationResponse> | null> => {
    if (!validateCurrentStep()) {
      return null;
    }

    try {
      formLogger.debug('Submitting registration form', {
        dataFields: Object.keys(formData)
      });

      const response = await registrationApi.fetchApi('/fitcopilot/v1/registration', {
        method: 'POST',
        body: JSON.stringify(formData as RegistrationData)
      });

      formLogger.info('Registration submitted successfully', {
        userId: response.data.user_id,
        status: response.data.status
      });

      return response;
    } catch (error) {
      formLogger.error('Registration submission failed', { error });
      setValidation(prev => ({
        ...prev,
        isValid: false,
        errors: {
          ...prev.errors,
          form: 'Failed to submit registration. Please try again.'
        }
      }));
      return null;
    }
  }, [formData, registrationApi, validateCurrentStep]);

  return {
    formData,
    updateFormData,
    validation,
    validateEmail,
    validateCurrentStep,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    submitForm,
    isSubmitting: registrationApi.loading,
    submitError: registrationApi.error
  };
};

export default useRegistrationForm; 