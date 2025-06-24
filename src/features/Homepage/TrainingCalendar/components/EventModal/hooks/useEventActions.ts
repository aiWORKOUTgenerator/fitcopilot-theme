/**
 * useEventActions Hook
 * 
 * CRUD operations and action handlers for EventModal components
 * Follows AJAX patterns from assignment-manager.js
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { useCallback } from 'react';
import { CalendarEvent } from '../../../interfaces';
import { ValidationErrors } from '../types';

interface UseEventActionsProps {
  // External handlers from parent
  onSave: (event: Partial<CalendarEvent>) => Promise<void>;
  onDelete?: (eventId: string | number) => Promise<void>;
  onClose: () => void;
  onModeChange?: (mode: 'view' | 'edit' | 'create') => void;
  
  // State setters from useEventModal
  setSaving: (saving: boolean) => void;
  setDeleting: (deleting: boolean) => void;
  updateFormData: (updates: Partial<CalendarEvent>) => void;
  updateErrors: (errors: Partial<ValidationErrors>) => void;
  setComponentError: (error: Error | null) => void;
  incrementRetryCount: () => void;
  setHasRecovered: (recovered: boolean) => void;
  setShowUserRegistration: (show: boolean) => void;
  
  // Current state
  formData: Partial<CalendarEvent>;
  retryCount: number;
  retryLimit: number;
}

interface UseEventActionsReturn {
  // Form handling
  handleFormFieldChange: (field: string, value: any) => void;
  
  // CRUD operations (following assignment-manager.js patterns)
  handleSave: () => Promise<void>;
  handleDelete: () => Promise<void>;
  
  // UI actions
  handleClose: () => void;
  handleModeChange: (mode: 'view' | 'edit' | 'create') => void;
  
  // Error handling (following assignment-manager.js error patterns)
  handleComponentError: (error: Error, errorInfo?: string) => void;
  resetErrorState: () => void;
  safeAsyncOperation: <T>(
    operation: () => Promise<T>,
    fallback?: () => T,
    errorMessage?: string
  ) => Promise<T | null>;
  
  // EventType actions
  handleEventTypeChange: (eventType: string) => void;
  handleDurationChange: (duration: number) => void;
  
  // User registration actions
  handleUserRegistrationRequired: () => boolean;
  handleBookSession: () => void;
}

/**
 * Event actions hook
 * Handles all EventModal actions following assignment-manager.js patterns
 */
export const useEventActions = ({
  onSave,
  onDelete,
  onClose,
  onModeChange,
  setSaving,
  setDeleting,
  updateFormData,
  updateErrors,
  setComponentError,
  incrementRetryCount,
  setHasRecovered,
  setShowUserRegistration,
  formData,
  retryCount,
  retryLimit
}: UseEventActionsProps): UseEventActionsReturn => {
  
  // ===== ERROR HANDLING (Following assignment-manager.js patterns) =====
  
  /**
   * Handle component errors with retry logic
   * Following assignment-manager.js error handling patterns
   */
  const handleComponentError = useCallback((error: Error, errorInfo?: string) => {
    console.error('EventModal Component Error:', error);
    console.error('Error Info:', errorInfo);
    
    setComponentError(error);
    
    if (retryCount < retryLimit) {
      setTimeout(() => {
        incrementRetryCount();
        setComponentError(null);
        setHasRecovered(true);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`EventModal: Recovery attempt ${retryCount + 1}/${retryLimit}`);
        }
      }, 1000);
    }
  }, [retryCount, retryLimit, setComponentError, incrementRetryCount, setHasRecovered]);
  
  /**
   * Reset error state
   */
  const resetErrorState = useCallback(() => {
    setComponentError(null);
    setHasRecovered(false);
  }, [setComponentError, setHasRecovered]);
  
  /**
   * Safe async operation wrapper
   * Following assignment-manager.js safeAsyncOperation pattern
   */
  const safeAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    fallback?: () => T,
    errorMessage: string = 'Operation failed'
  ): Promise<T | null> => {
    try {
      return await operation();
    } catch (error) {
      console.error(`EventModal ${errorMessage}:`, error);
      handleComponentError(error instanceof Error ? error : new Error(errorMessage));
      
      if (fallback) {
        try {
          return fallback();
        } catch (fallbackError) {
          console.error('Fallback operation also failed:', fallbackError);
        }
      }
      
      return null;
    }
  }, [handleComponentError]);
  
  // ===== FORM ACTIONS =====
  
  /**
   * Handle form field changes with automatic description updates
   */
  const handleFormFieldChange = useCallback((field: string, value: any) => {
    // Get event description helper
    const getEventDescription = (eventType: string): string => {
      try {
        const { getEventDescription } = require('../Events/EventRegistry');
        return getEventDescription(eventType);
      } catch (error) {
        console.warn('Failed to get event description:', error);
        return '';
      }
    };
    
    updateFormData({
      [field]: value,
      ...(field === 'title' && value ? { description: getEventDescription(value) } : {})
    });
    
    // Clear field-specific errors when user starts typing
    updateErrors({ [field]: undefined });
  }, [updateFormData, updateErrors]);
  
  // ===== CRUD OPERATIONS (Following assignment-manager.js AJAX patterns) =====
  
  /**
   * Handle save operation with loading states and error recovery
   */
  const handleSave = useCallback(async () => {
    setSaving(true);
    
    const result = await safeAsyncOperation(
      () => onSave(formData),
      undefined,
      'Failed to save event'
    );
    
    if (result !== null) {
      onClose();
      resetErrorState();
    }
    
    setSaving(false);
  }, [formData, onSave, onClose, setSaving, safeAsyncOperation, resetErrorState]);
  
  /**
   * Handle delete operation with loading states
   */
  const handleDelete = useCallback(async () => {
    if (!onDelete || !formData.id) return;
    
    setDeleting(true);
    
    const result = await safeAsyncOperation(
      () => onDelete(formData.id!),
      undefined,
      'Failed to delete event'
    );
    
    if (result !== null) {
      onClose();
      resetErrorState();
    }
    
    setDeleting(false);
  }, [formData.id, onDelete, onClose, setDeleting, safeAsyncOperation, resetErrorState]);
  
  // ===== UI ACTIONS =====
  
  /**
   * Handle modal close
   */
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);
  
  /**
   * Handle mode changes
   */
  const handleModeChange = useCallback((newMode: 'view' | 'edit' | 'create') => {
    if (onModeChange) {
      onModeChange(newMode);
    }
  }, [onModeChange]);
  
  // ===== EVENTTYPE ACTIONS =====
  
  /**
   * Handle event type selection with auto-updates
   */
  const handleEventTypeChange = useCallback((eventType: string) => {
    handleFormFieldChange('title', eventType);
    
    // Clear title-related errors
    updateErrors({ title: undefined });
  }, [handleFormFieldChange, updateErrors]);
  
  /**
   * Handle duration selection
   */
  const handleDurationChange = useCallback((duration: number) => {
    handleFormFieldChange('duration', duration);
    
    // Clear duration-related errors
    updateErrors({ duration: undefined });
  }, [handleFormFieldChange, updateErrors]);
  
  // ===== USER REGISTRATION ACTIONS =====
  
  /**
   * Check if user registration is required
   * Placeholder for future authentication integration
   */
  const handleUserRegistrationRequired = useCallback((): boolean => {
    // TODO: Implement user authentication check
    const isAuthenticated = false;
    
    if (!isAuthenticated) {
      // Show user registration modal
      // This will be handled by the parent component
      return true; // Prevent normal save flow
    }
    
    return false; // Allow normal save flow
  }, []);
  
  /**
   * Handle book session action
   */
  const handleBookSession = useCallback(() => {
    console.log('📅 Book Session clicked - checking user registration...');
    
    // Check if user registration is required
    if (handleUserRegistrationRequired()) {
      console.log('📅 User registration required - showing registration modal');
      setShowUserRegistration(true);
      return; // User registration modal will be shown
    }
    
    // If user is already authenticated, proceed to booking/edit mode
    console.log('📅 User authenticated - proceeding to booking');
    if (onModeChange) {
      onModeChange('edit');
    }
  }, [handleUserRegistrationRequired, onModeChange, setShowUserRegistration]);
  
  return {
    handleFormFieldChange,
    handleSave,
    handleDelete,
    handleClose,
    handleModeChange,
    handleComponentError,
    resetErrorState,
    safeAsyncOperation,
    handleEventTypeChange,
    handleDurationChange,
    handleUserRegistrationRequired,
    handleBookSession
  };
}; 