/**
 * useEventModalIntegration Hook
 * 
 * High-level integration hook that combines all modular EventModal hooks
 * Provides a clean, cohesive API following assignment-manager.js integration patterns
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { CalendarEvent } from '../../../interfaces';
import { EventModalConfig } from '../types';
import { useEventActions } from './useEventActions';
import { useEventModal } from './useEventModal';
import { useEventValidation } from './useEventValidation';

interface UseEventModalIntegrationProps {
  // Modal props
  event?: CalendarEvent;
  mode: 'view' | 'edit' | 'create';
  isOpen: boolean;
  
  // External handlers
  onSave: (event: Partial<CalendarEvent>) => Promise<void>;
  onDelete?: (eventId: string | number) => Promise<void>;
  onClose: () => void;
  onModeChange?: (mode: 'view' | 'edit' | 'create') => void;
  
  // Configuration
  config?: Partial<EventModalConfig>;
}

/**
 * Integrated EventModal hook
 * Combines state management, validation, and actions into single cohesive API
 */
export const useEventModalIntegration = (props: UseEventModalIntegrationProps) => {
  const {
    event,
    mode,
    isOpen,
    onSave,
    onDelete,
    onClose,
    onModeChange,
    config
  } = props;
  
  // ===== CORE STATE MANAGEMENT =====
  
  const eventModal = useEventModal({
    event,
    mode,
    isOpen,
    config
  });
  
  // ===== VALIDATION =====
  
  const validation = useEventValidation({
    enablePerformanceMonitoring: eventModal.config.enablePerformanceMonitoring,
    onPerformanceUpdate: (metrics) => {
      eventModal.updatePerformanceMetrics(metrics);
    }
  });
  
  // ===== ACTIONS =====
  
  const actions = useEventActions({
    // External handlers
    onSave,
    onDelete,
    onClose,
    onModeChange,
    
    // State setters from eventModal
    setSaving: eventModal.setSaving,
    setDeleting: eventModal.setDeleting,
    updateFormData: eventModal.updateFormData,
    updateErrors: eventModal.updateErrors,
    setComponentError: eventModal.setComponentError,
    incrementRetryCount: eventModal.incrementRetryCount,
    setHasRecovered: eventModal.setHasRecovered,
    
    // Current state
    formData: eventModal.state.formData,
    retryCount: eventModal.state.retryCount,
    retryLimit: eventModal.config.retryLimit
  });
  
  // ===== ENHANCED ACTIONS WITH VALIDATION =====
  
  /**
   * Enhanced save handler that includes validation
   */
  const handleSaveWithValidation = async () => {
    const { isValid, errors } = validation.validateForm(eventModal.state.formData);
    
    if (!isValid) {
      eventModal.updateErrors(errors);
      return;
    }
    
    await actions.handleSave();
  };
  
  /**
   * Enhanced form field change with validation
   */
  const handleFormFieldChangeWithValidation = (field: string, value: any) => {
    // Update form data
    actions.handleFormFieldChange(field, value);
    
    // Clear field-specific error if it exists
    if (eventModal.state.errors[field as keyof typeof eventModal.state.errors]) {
      const clearedErrors = validation.clearFieldError(field, eventModal.state.errors);
      eventModal.updateErrors(clearedErrors);
    }
  };
  
  // ===== PUBLIC API =====
  
  return {
    // State (read-only)
    state: eventModal.state,
    config: eventModal.config,
    
    // Form actions
    handleFormFieldChange: handleFormFieldChangeWithValidation,
    validateForm: () => validation.validateForm(eventModal.state.formData),
    validateField: (field: string, value: any) => 
      validation.validateField(field, value, eventModal.state.formData),
    
    // CRUD operations
    handleSave: handleSaveWithValidation,
    handleDelete: actions.handleDelete,
    
    // UI actions
    handleClose: actions.handleClose,
    handleModeChange: actions.handleModeChange,
    
    // EventType actions
    handleEventTypeChange: actions.handleEventTypeChange,
    handleDurationChange: actions.handleDurationChange,
    
    // User registration
    handleUserRegistrationRequired: actions.handleUserRegistrationRequired,
    handleBookSession: actions.handleBookSession,
    
    // Modal state management
    setShowTimeSlotSelector: eventModal.setShowTimeSlotSelector,
    setShowUserRegistration: eventModal.setShowUserRegistration,
    
    // Error handling
    handleComponentError: actions.handleComponentError,
    resetErrorState: actions.resetErrorState,
    safeAsyncOperation: actions.safeAsyncOperation,
    
    // Direct state setters (for special cases)
    updateFormData: eventModal.updateFormData,
    updateErrors: eventModal.updateErrors,
    
    // Lifecycle
    resetState: eventModal.resetState
  };
}; 