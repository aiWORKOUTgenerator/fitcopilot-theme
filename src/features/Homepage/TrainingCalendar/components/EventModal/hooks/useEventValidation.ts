/**
 * useEventValidation Hook
 * 
 * Validation logic for EventModal components
 * Leverages existing EventRegistry validation - NO duplication
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { useCallback, useMemo } from 'react';
import { CalendarEvent } from '../../../interfaces';
import { ValidationErrors } from '../types';

interface UseEventValidationProps {
  enablePerformanceMonitoring?: boolean;
  onPerformanceUpdate?: (metrics: { validationTime: number }) => void;
}

interface UseEventValidationReturn {
  validateForm: (formData: Partial<CalendarEvent>) => {
    isValid: boolean;
    errors: ValidationErrors;
    validationTime?: number;
  };
  validateField: (field: string, value: any, formData: Partial<CalendarEvent>) => string | undefined;
  clearFieldError: (field: string, errors: ValidationErrors) => ValidationErrors;
}

/**
 * Event validation hook
 * Leverages existing EventRegistry validation system
 */
export const useEventValidation = ({
  enablePerformanceMonitoring = false,
  onPerformanceUpdate
}: UseEventValidationProps = {}): UseEventValidationReturn => {
  
  // ===== VALIDATION HELPERS =====
  
  /**
   * Get event description from EventType module
   * Uses existing registry - NO duplication
   */
  const getEventDescription = useCallback((eventType: string): string => {
    try {
      const { getEventDescription } = require('../Events/EventRegistry');
      return getEventDescription(eventType);
    } catch (error) {
      console.warn('Failed to get event description:', error);
      return '';
    }
  }, []);
  
  /**
   * Basic validation fallback when EventRegistry fails
   */
  const basicValidation = useCallback((formData: Partial<CalendarEvent>): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    // Required field validation
    if (!formData.title?.trim()) {
      errors.title = 'Please select an event type';
    }
    
    if (!formData.location?.trim()) {
      errors.location = 'Please select a location for the session';
    }
    
    // Duration validation for specific event types
    if (formData.title && formData.title.includes('Personal Training') && !formData.duration) {
      errors.duration = 'Please select a duration for the Personal Training Session';
    }
    
    // Participants validation
    if (formData.maxParticipants && formData.maxParticipants < 1) {
      errors.maxParticipants = 'Maximum participants must be at least 1';
    }
    
    // Price validation
    if (formData.price && formData.price < 0) {
      errors.price = 'Price cannot be negative';
    }
    
    return errors;
  }, []);
  
  // ===== MAIN VALIDATION FUNCTION =====
  
  /**
   * Comprehensive form validation
   * Primary: Use existing EventRegistry validation
   * Fallback: Basic validation if registry unavailable
   */
  const validateForm = useCallback((formData: Partial<CalendarEvent>) => {
    const validationStartTime = enablePerformanceMonitoring ? performance.now() : 0;
    let errors: ValidationErrors = {};
    
    // Try to use existing EventType validation system first
    try {
      const { validateEventData } = require('../Events/EventRegistry');
      errors = validateEventData(formData);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Using EventType modular validation for: ${formData.title}`);
      }
    } catch (error) {
      console.warn('EventType validation failed, falling back to basic validation:', error);
      errors = basicValidation(formData);
    }
    
    // Performance tracking
    let validationTime: number | undefined;
    if (enablePerformanceMonitoring) {
      validationTime = performance.now() - validationStartTime;
      
      if (onPerformanceUpdate) {
        onPerformanceUpdate({ validationTime });
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`EventModal validation time: ${validationTime.toFixed(2)}ms`);
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      validationTime
    };
  }, [enablePerformanceMonitoring, onPerformanceUpdate, basicValidation]);
  
  // ===== FIELD VALIDATION =====
  
  /**
   * Validate individual field
   */
  const validateField = useCallback((
    field: string, 
    value: any, 
    formData: Partial<CalendarEvent>
  ): string | undefined => {
    // Create a temporary form data object with the updated field
    const updatedFormData = { ...formData, [field]: value };
    
    // Run full validation and extract error for this field
    const { errors } = validateForm(updatedFormData);
    return errors[field as keyof ValidationErrors];
  }, [validateForm]);
  
  // ===== ERROR MANAGEMENT =====
  
  /**
   * Clear error for specific field
   */
  const clearFieldError = useCallback((
    field: string, 
    errors: ValidationErrors
  ): ValidationErrors => {
    const { [field as keyof ValidationErrors]: _, ...remainingErrors } = errors;
    return remainingErrors;
  }, []);
  
  // ===== MEMOIZED HELPERS =====
  
  /**
   * Get validation status for common fields
   */
  const getFieldValidationRules = useMemo(() => ({
    title: {
      required: true,
      validator: (value: string) => value?.trim() ? undefined : 'Please select an event type'
    },
    location: {
      required: true,
      validator: (value: string) => value?.trim() ? undefined : 'Please select a location'
    },
    duration: {
      required: (formData: Partial<CalendarEvent>) => 
        formData.title?.includes('Personal Training') ? true : false,
      validator: (value: number, formData: Partial<CalendarEvent>) => {
        if (formData.title?.includes('Personal Training') && !value) {
          return 'Please select a duration for the Personal Training Session';
        }
        return undefined;
      }
    },
    maxParticipants: {
      required: false,
      validator: (value: number) => {
        if (value && value < 1) return 'Maximum participants must be at least 1';
        if (value && value > 50) return 'Maximum participants cannot exceed 50';
        return undefined;
      }
    },
    price: {
      required: false,
      validator: (value: number) => {
        if (value && value < 0) return 'Price cannot be negative';
        return undefined;
      }
    }
  }), []);
  
  return {
    validateForm,
    validateField,
    clearFieldError
  };
}; 