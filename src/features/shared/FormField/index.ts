/**
 * FormField Component System
 * 
 * Standardized form field components with consistent layout, validation, and accessibility.
 */

// Main FormField components
export { default as FieldWrapper } from './fields/FieldWrapper';
export { default, default as FormField } from './fields/FormField';
export { default as TextareaField } from './fields/TextareaField';
export { default as TextField } from './fields/TextField';

// Individual field components
export { default as Checkbox } from './fields/Checkbox';
export { default as DateField } from './fields/DatePicker';
export { default as FileField } from './fields/FileUpload';
export { default as MultiSelectField } from './fields/MultiSelectField';
export { default as Radio } from './fields/Radio';
export { default as RadioGroup } from './fields/RadioGroup';
export { default as SelectField } from './fields/SelectField';
export { default as Switch } from './fields/Switch';

// Form state management
export {
  default as FormContext,
  FormProvider,
  useFormContext,
  useFormField,
  type FormConfig, type FormContextValue, type FormErrors, type FormFieldConfig, type FormTouched, type FormValues
} from './FormContext';
export { useForm } from './useForm';
export type { UseFormOptions, UseFormReturn } from './useForm';

// Types and utilities
export * from './events';
export {
  createFieldState,
  createFormState,
  getFormValues,
  hasErrors,
  validateFormState,
  type FieldState,
  type FormState
} from './formState';
export * from './types';
export * from './validators';

// Utility functions
export { filterComponentProps } from './fields/FormField';

