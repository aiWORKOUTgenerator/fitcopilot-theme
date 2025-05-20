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
 * Extended RegistrationStep enum with additional steps
 */
enum ExtendedRegistrationStep {
    GOALS = RegistrationStep.GOALS,
    EXPERIENCE_LEVEL = RegistrationStep.EXPERIENCE_LEVEL,
    CUSTOMIZE_EXPERIENCE = 'customize_experience',
    ACCOUNT_CREATION = 'account_creation'
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
  const [currentStep, setCurrentStep] = useState<ExtendedRegistrationStep>(ExtendedRegistrationStep.GOALS);

  // Use our API hooks with proper typing
  const registrationApi = useApi<RegistrationResponse>();
  const emailValidationApi = useApi<EmailValidationResponse>();

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
     * Validate an email address
     */
  const validateEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      const response = await emailValidationApi.fetchApi('/fitcopilot/v1/validate-email', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return (response as ApiResponse<EmailValidationResponse>).data.isValid;
    } catch (error) {
      formLogger.error('Email validation failed', { error });
      setValidation(prev => ({
        ...prev,
        isValid: false,
        errors: {
          ...prev.errors,
          email: 'Failed to validate email. Please try again.'
        }
      }));
      return false;
    }
  }, [emailValidationApi]);

  /**
     * Validate form data for the current step
     */
  const validateCurrentStep = useCallback((): boolean => {
    let isValid = true;
    const errors: Record<string, string> = {};

    switch (currentStep) {
    case ExtendedRegistrationStep.GOALS:
      if (!formData.goals || formData.goals.length === 0) {
        errors.goals = 'Please select at least one goal';
        isValid = false;
      }
      break;

    case ExtendedRegistrationStep.EXPERIENCE_LEVEL:
      if (!formData.experienceLevel) {
        errors.experienceLevel = 'Please select your experience level';
        isValid = false;
      }
      break;

    case ExtendedRegistrationStep.CUSTOMIZE_EXPERIENCE:
      if (!formData.equipment || formData.equipment.length === 0) {
        errors.equipment = 'Please select available equipment';
        isValid = false;
      }
      if (!formData.timeCommitment) {
        errors.timeCommitment = 'Please select your time commitment';
        isValid = false;
      }
      break;

    case ExtendedRegistrationStep.ACCOUNT_CREATION:
      if (!formData.email) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
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
      
      // Get next step value based on current step - safe conversion needed
      // This is simplified logic - you may need a more robust step transition map
      let nextStep: ExtendedRegistrationStep;
      
      if (currentStep === ExtendedRegistrationStep.GOALS) {
        nextStep = ExtendedRegistrationStep.EXPERIENCE_LEVEL;
      } else if (currentStep === ExtendedRegistrationStep.EXPERIENCE_LEVEL) {
        nextStep = ExtendedRegistrationStep.CUSTOMIZE_EXPERIENCE;
      } else if (currentStep === ExtendedRegistrationStep.CUSTOMIZE_EXPERIENCE) {
        nextStep = ExtendedRegistrationStep.ACCOUNT_CREATION;
      } else {
        // Default fallback or final step
        nextStep = currentStep;
      }
      
      setCurrentStep(nextStep);
    }
  }, [currentStep, validateCurrentStep]);

  /**
     * Move to the previous step in the registration flow
     */
  const goToPreviousStep = useCallback(() => {
    formLogger.debug('Moving to previous step', {
      currentStep,
      prevStep: 'previous step'
    });
    
    // Similar logic to goToNextStep but in reverse
    let prevStep: ExtendedRegistrationStep;
    
    if (currentStep === ExtendedRegistrationStep.ACCOUNT_CREATION) {
      prevStep = ExtendedRegistrationStep.CUSTOMIZE_EXPERIENCE;
    } else if (currentStep === ExtendedRegistrationStep.CUSTOMIZE_EXPERIENCE) {
      prevStep = ExtendedRegistrationStep.EXPERIENCE_LEVEL;
    } else if (currentStep === ExtendedRegistrationStep.EXPERIENCE_LEVEL) {
      prevStep = ExtendedRegistrationStep.GOALS;
    } else {
      // Default fallback
      prevStep = currentStep;
    }
    
    setCurrentStep(prevStep);
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

      const typedResponse = response as ApiResponse<RegistrationResponse>;
      
      formLogger.info('Registration submitted successfully', {
        userId: typedResponse.data.user_id,
        status: typedResponse.data.status
      });

      return typedResponse;
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