/**
 * Event Module Types and Interfaces
 * 
 * Shared types and interfaces for modular event system
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent } from '../../../interfaces';

/**
 * Validation errors interface
 */
export interface ValidationErrors {
  title?: string;
  duration?: string;
  location?: string;
  trainerId?: string;
  maxParticipants?: string;
  price?: string;
  [key: string]: string | undefined;
}

/**
 * Event configuration interface
 */
export interface EventConfig {
  /** Unique identifier for the event type */
  id: string;
  
  /** Display title for the event */
  title: string;
  
  /** Default description for the event */
  description: string;
  
  /** Default duration in minutes (if fixed) */
  defaultDuration?: number;
  
  /** Whether duration selection is required */
  requiresDuration: boolean;
  
  /** Available duration options in minutes */
  availableDurations: number[];
  
  /** Whether location selection is required */
  requiresLocation: boolean;
  
  /** Default location for the event */
  defaultLocation?: string;
  
  /** Default event type classification */
  defaultEventType: string;
  
  /** Default session type */
  defaultSessionType: string;
  
  /** Default booking status */
  defaultBookingStatus: string;
  
  /** Minimum participants (0 for no minimum) */
  minParticipants: number;
  
  /** Maximum participants (0 for unlimited) */
  maxParticipants: number;
  
  /** Default price (0 for free) */
  defaultPrice: number;
  
  /** Whether this event type supports pricing */
  supportsPricing: boolean;
  
  /** Event category for grouping */
  category: 'consultation' | 'training' | 'class' | 'assessment';
}

/**
 * Event validator function type
 */
export type EventValidator = (formData: Partial<CalendarEvent>) => ValidationErrors;

/**
 * Event module interface - what each event module should export
 */
export interface EventModule {
  /** Event configuration */
  config: EventConfig;
  
  /** Validation function */
  validator: EventValidator;
  
  /** Get duration options for this event type */
  getDurationOptions: () => { value: number | string; label: string }[];
  
  /** Get form defaults for this event type */
  getFormDefaults: () => Partial<CalendarEvent>;
}

/**
 * Duration option interface
 */
export interface DurationOption {
  value: number | string;
  label: string;
}

/**
 * Form field configuration interface
 */
export interface FormFieldConfig {
  field: keyof CalendarEvent;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  required: boolean;
  readonly?: boolean;
  placeholder?: string;
  options?: { value: any; label: string }[];
}

/**
 * Event form section configuration
 */
export interface EventFormSection {
  title: string;
  fields: FormFieldConfig[];
}

/**
 * Complete event form configuration
 */
export interface EventFormConfig {
  sections: EventFormSection[];
  customValidation?: EventValidator;
} 