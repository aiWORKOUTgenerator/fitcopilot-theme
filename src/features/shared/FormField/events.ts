/**
 * FormField event handler types
 * 
 * This file provides centralized definitions for all event handlers used
 * in FormField components to ensure consistency and avoid duplicated types.
 */

import * as React from 'react';
import {
  FocusEventHandler,
  FormSubmitHandler,
  InputChangeHandler,
  InputKeyPressHandler,
  SelectChangeHandler,
  TextAreaChangeHandler
} from '../../../types/events';

// Re-export common event handlers for FormField components
export {
  FocusEventHandler, FormSubmitHandler, InputChangeHandler, InputKeyPressHandler, SelectChangeHandler, TextAreaChangeHandler
};

/**
 * Generic field change handler with type parameter
 */
export type FieldChangeHandler<T = unknown> = (value: T) => void;

/**
 * Field blur handler type
 */
export type FieldBlurHandler = React.FocusEventHandler<HTMLElement>;

/**
 * Field focus handler type
 */
export type FieldFocusHandler = React.FocusEventHandler<HTMLElement>;

/**
 * Common event handlers interface for input fields
 */
export interface InputFieldEventHandlers {
  onChange: InputChangeHandler;
  onBlur?: FieldBlurHandler;
  onFocus?: FieldFocusHandler;
  onKeyPress?: InputKeyPressHandler;
}

/**
 * Common event handlers interface for textarea fields
 */
export interface TextAreaFieldEventHandlers {
  onChange: TextAreaChangeHandler;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
}

/**
 * Common event handlers interface for select fields
 */
export interface SelectFieldEventHandlers {
  onChange: SelectChangeHandler;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  onFocus?: React.FocusEventHandler<HTMLSelectElement>;
}

/**
 * Common event handlers interface for checkbox fields
 */
export interface CheckboxFieldEventHandlers {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
}

/**
 * Form submission event handler with submit event
 */
export type FormSubmitEventHandler = (event: React.FormEvent<HTMLFormElement>) => void;

/**
 * Type guard to check if an event is an input change event
 */
export function isInputChangeEvent(event: React.SyntheticEvent): event is React.ChangeEvent<HTMLInputElement> {
  return event.type === 'change' && 'value' in (event.target as HTMLInputElement);
}

/**
 * Type guard to check if an event is a checkbox change event
 */
export function isCheckboxChangeEvent(event: React.SyntheticEvent): event is React.ChangeEvent<HTMLInputElement> {
  return event.type === 'change' && 'checked' in (event.target as HTMLInputElement);
} 