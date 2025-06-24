/**
 * Event Modal Types
 * 
 * Centralized type definitions for EventModal components
 * Follows existing interface patterns from main interfaces.ts
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent } from '../../../interfaces';

// ===== VALIDATION TYPES =====

export interface ValidationErrors {
  title?: string;
  duration?: string;
  location?: string;
  trainerId?: string;
  maxParticipants?: string;
  price?: string;
}

// ===== PERFORMANCE TYPES =====

export interface PerformanceMetrics {
  renderTime: number;
  validationTime: number;
  formInitTime: number;
}

// ===== EVENT MODAL STATE =====

export interface EventModalState {
  // Core form data
  formData: Partial<CalendarEvent>;
  
  // UI state
  errors: ValidationErrors;
  saving: boolean;
  deleting: boolean;
  showDeleteConfirm: boolean;
  
  // Performance tracking
  performanceMetrics: PerformanceMetrics;
  
  // Error handling
  componentError: Error | null;
  retryCount: number;
  hasRecovered: boolean;
  
  // EventType integration
  selectedEventType: string;
  selectedDuration: number | undefined;
  
  // Smart scheduling
  showTimeSlotSelector: boolean;
  
  // User registration
  showUserRegistration: boolean;
}

// ===== ACTION TYPES =====

export interface EventModalActions {
  // Form actions
  handleFormFieldChange: (field: string, value: any) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  
  // CRUD operations
  handleSave: () => Promise<void>;
  handleDelete: () => Promise<void>;
  
  // UI actions
  handleClose: () => void;
  handleModeChange: (mode: 'view' | 'edit' | 'create') => void;
  
  // Error handling
  handleComponentError: (error: Error, errorInfo?: string) => void;
  resetErrorState: () => void;
  
  // EventType actions
  handleEventTypeChange: (eventType: string) => void;
  handleDurationChange: (duration: number) => void;
}

// ===== CONFIGURATION TYPES =====

export interface EventModalConfig {
  // Performance limits
  maxRenderTime: number;
  maxValidationTime: number;
  maxFormInitTime: number;
  retryLimit: number;
  
  // Features flags
  enablePerformanceMonitoring: boolean;
  enableErrorRecovery: boolean;
  enableUserRegistration: boolean;
  enableSmartScheduling: boolean;
} 