import { useState } from 'react';
import { FormErrors, RegistrationFormData, RegistrationResult } from '../types';

/**
 * Custom hook for managing registration form state and operations
 * 
 * Encapsulates form logic for validation, state management, and submission
 */
export const useRegistrationForm = () => {
  // Form state
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    name: '',
    fitnessGoal: '',
    step: 1
  });

  // Form validation
  const [errors, setErrors] = useState<FormErrors>({});

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Success state
  const [submitResult, setSubmitResult] = useState<RegistrationResult | null>(null);

  /**
     * Input change handler
     */
  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }

    // Clear submission result on any change
    if (submitResult) {
      setSubmitResult(null);
    }
  };

  /**
     * Validates the current step
     */
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
    case 1:
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      break;
    case 2:
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      break;
    case 3:
      if (!formData.fitnessGoal) {
        newErrors.fitnessGoal = 'Please select a fitness goal';
      }
      break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
     * Go to next step
     */
  const handleNextStep = () => {
    if (validateStep(formData.step)) {
      setFormData({ ...formData, step: formData.step + 1 });
    }
  };

  /**
     * Go to previous step
     */
  const handlePrevStep = () => {
    setFormData({ ...formData, step: Math.max(1, formData.step - 1) });
  };

  /**
     * Submit form to backend
     */
  const handleSubmit = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();

    if (!validateStep(formData.step)) {
      return false;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - replace with actual implementation
      // await api.register(formData);

      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubmitResult({
        success: true,
        message: 'Registration successful!',
        data: { userId: 'user_' + Date.now() }
      });

      return true;
    } catch (error) {
      setSubmitResult({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      });

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
     * Reset form to initial state
     */
  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      fitnessGoal: '',
      step: 1
    });
    setErrors({});
    setSubmitResult(null);
  };

  return {
    formData,
    errors,
    isSubmitting,
    submitResult,
    handleInputChange,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
    resetForm,
    validateStep
  };
}; 