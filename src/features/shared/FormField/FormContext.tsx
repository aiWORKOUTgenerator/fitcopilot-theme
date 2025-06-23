/**
 * FormContext - Shared form state management
 * 
 * Provides centralized form state management, validation, and submission handling
 * using React Context.
 */

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { runValidators, ValidatorFn } from './validators';

// Types for form state management
export interface FormConfig {
  initialValues?: Record<string, any>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
}

export interface FormFieldConfig<T = any> {
  validators?: Array<ValidatorFn<T>>;
  defaultValue?: T;
}

export type FormValues = Record<string, any>;
export type FormErrors = Record<string, string | null>;
export type FormTouched = Record<string, boolean>;
export type FieldConfigs = Record<string, FormFieldConfig>;

export interface FormContextValue {
  // State
  values: FormValues;
  errors: FormErrors;
  touched: FormTouched;
  
  // Field operations
  registerField: <T>(name: string, config?: FormFieldConfig<T>) => void;
  unregisterField: (name: string) => void;
  setValue: <T>(name: string, value: T) => void;
  setError: (name: string, error: string | null) => void;
  setTouched: (name: string, isTouched: boolean) => void;
  
  // Form operations
  reset: () => void;
  validate: () => Promise<boolean>;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isValidating: boolean;
  isDirty: boolean;
  isValid: boolean;
}

export interface FormProviderProps extends FormConfig {
  children: React.ReactNode;
  onSubmit?: (values: FormValues) => void | Promise<void>;
  onError?: (errors: FormErrors) => void;
}

// Create form context
const FormContext = createContext<FormContextValue | undefined>(undefined);

// Custom hook to use form context
export const useFormContext = (): FormContextValue => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

// Form provider component
export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  initialValues = {},
  validateOnChange = true,
  validateOnBlur = true,
  validateOnSubmit = true,
  onSubmit,
  onError,
}) => {
  // State for form values, errors, and field interaction tracking
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [fieldConfigs, setFieldConfigs] = useState<FieldConfigs>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Register a field in the form
  const registerField = useCallback(<T,>(name: string, config?: FormFieldConfig<T>) => {
    setFieldConfigs(prev => {
      // Don't overwrite existing field config
      if (prev[name]) return prev;
      
      return {
        ...prev,
        [name]: config || {}
      };
    });
    
    // Initialize value if not already set
    setValues(prev => {
      if (name in prev) return prev;
      
      return {
        ...prev,
        [name]: config?.defaultValue ?? ''
      };
    });
  }, []);

  // Unregister a field from the form
  const unregisterField = useCallback((name: string) => {
    setFieldConfigs(prev => {
      const newFieldConfigs = { ...prev };
      delete newFieldConfigs[name];
      return newFieldConfigs;
    });
  }, []);

  // Set a field value
  const setValue = useCallback(<T,>(name: string, value: T) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    setIsDirty(true);
    
    // Validate on change if enabled
    if (validateOnChange && fieldConfigs[name]?.validators) {
      const fieldValidators = fieldConfigs[name].validators!;
      const result = runValidators(value, fieldValidators, values);
      
      if (result && typeof result === 'object' && 'pending' in result) {
        // Handle async validation
        setIsValidating(true);
        setErrors(prev => ({
          ...prev,
          [name]: result.message || 'Validating...'
        }));
        
        result.validate().then((error) => {
          setErrors(prev => ({
            ...prev,
            [name]: error
          }));
          setIsValidating(false);
        });
      } else {
        // Handle sync validation
        setErrors(prev => ({
          ...prev,
          [name]: result as string | null
        }));
      }
    }
  }, [validateOnChange, fieldConfigs, values]);

  // Set a field error
  const setError = useCallback((name: string, error: string | null) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  // Set a field touched state
  const setFieldTouched = useCallback((name: string, isTouched: boolean) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched
    }));
    
    // Validate on blur if enabled
    if (validateOnBlur && isTouched && fieldConfigs[name]?.validators) {
      const fieldValidators = fieldConfigs[name].validators!;
      const value = values[name];
      const result = runValidators(value, fieldValidators, values);
      
      if (result && typeof result === 'object' && 'pending' in result) {
        // Handle async validation
        setIsValidating(true);
        setErrors(prev => ({
          ...prev,
          [name]: result.message || 'Validating...'
        }));
        
        result.validate().then((error) => {
          setErrors(prev => ({
            ...prev,
            [name]: error
          }));
          setIsValidating(false);
        });
      } else {
        // Handle sync validation
        setErrors(prev => ({
          ...prev,
          [name]: result as string | null
        }));
      }
    }
  }, [validateOnBlur, fieldConfigs, values]);

  // Reset the form to initial values
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
    setIsSubmitting(false);
  }, [initialValues]);

  // Validate all fields in the form
  const validate = useCallback(async (): Promise<boolean> => {
    setIsValidating(true);
    
    const newErrors: FormErrors = {};
    const pendingValidations: Array<Promise<void>> = [];
    
    // Run validation for each field
    Object.entries(fieldConfigs).forEach(([name, config]) => {
      if (config.validators && config.validators.length > 0) {
        const value = values[name];
        const result = runValidators(value, config.validators, values);
        
        if (result && typeof result === 'object' && 'pending' in result) {
          // Handle async validation
          newErrors[name] = result.message || 'Validating...';
          
          const pendingValidation = result.validate().then((error) => {
            newErrors[name] = error;
          });
          
          pendingValidations.push(pendingValidation);
        } else {
          // Handle sync validation
          newErrors[name] = result as string | null;
        }
      }
    });
    
    // Wait for all async validations to complete
    if (pendingValidations.length > 0) {
      await Promise.all(pendingValidations);
    }
    
    setErrors(newErrors);
    setIsValidating(false);
    
    // Check if form is valid
    const hasErrors = Object.values(newErrors).some(error => error !== null);
    return !hasErrors;
  }, [fieldConfigs, values]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = Object.keys(fieldConfigs).reduce<FormTouched>((acc, name) => {
      acc[name] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    // Validate if enabled
    let isValid = true;
    if (validateOnSubmit) {
      isValid = await validate();
    }
    
    if (isValid) {
      try {
        // Call onSubmit callback
        if (onSubmit) {
          await onSubmit(values);
        }
      } catch (error) {
        logger.error('Form submission error:', error);
      }
    } else if (onError) {
      // Call onError callback
      onError(errors);
    }
    
    setIsSubmitting(false);
  }, [validateOnSubmit, validate, values, errors, onSubmit, onError, fieldConfigs]);

  // Check if form is valid
  const isValid = useMemo(() => {
    return !Object.values(errors).some(error => error !== null);
  }, [errors]);

  // Create form context value
  const formContextValue = useMemo<FormContextValue>(() => ({
    values,
    errors,
    touched,
    registerField,
    unregisterField,
    setValue,
    setError,
    setTouched: setFieldTouched,
    reset,
    validate,
    handleSubmit,
    isSubmitting,
    isValidating,
    isDirty,
    isValid
  }), [
    values, errors, touched,
    registerField, unregisterField,
    setValue, setError, setFieldTouched,
    reset, validate, handleSubmit,
    isSubmitting, isValidating, isDirty, isValid
  ]);

  return (
    <FormContext.Provider value={formContextValue}>
      {children}
    </FormContext.Provider>
  );
};

/**
 * Hook to register and manage a form field
 */
export const useFormField = <T,>(name: string, config?: FormFieldConfig<T>) => {
  const {
    values,
    errors,
    touched,
    registerField,
    unregisterField,
    setValue,
    setTouched
  } = useFormContext();
  
  // Register field on mount
  React.useEffect(() => {
    registerField(name, config);
    
    // Cleanup on unmount
    return () => {
      unregisterField(name);
    };
  }, [name, registerField, unregisterField, config]);
  
  // Create field props
  const fieldProps = useMemo(() => ({
    name,
    value: values[name] as T,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | T) => {
      // Handle direct value changes (for custom components)
      if (!e || typeof e !== 'object' || !('target' in e)) {
        setValue(name, e as T);
        return;
      }
      
      // Handle standard DOM events
      const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      const value = target.type === 'checkbox' 
        ? (target as HTMLInputElement).checked 
        : target.value;
      setValue(name, value as unknown as T);
    },
    onBlur: () => setTouched(name, true),
    error: errors[name] || undefined,
    touched: !!touched[name]
  }), [name, values, errors, touched, setValue, setTouched]);
  
  return fieldProps;
};

export default FormContext; 