/**
 * Event Modal Component
 * 
 * Modal component for displaying and editing calendar event details
 * Handles event creation, editing, and deletion with form validation
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useTrainerAvailability } from '../../hooks/useTrainerAvailability';
import { BookingStatus, CalendarEvent, EventModalProps, EventType, SessionType } from '../../interfaces';
import './EventModal.scss';
import { EventModalFooter } from './EventModalFooter';
import { EVENT_TYPE_OPTIONS, EventTypeSelector } from './Events/EventType';
import { AvailableTimeSlot, SchedulingPreference } from './Events/EventType/EventTypeInterfaces';
import TimeSlotSelector from './TimeSlotSelector/TimeSlotSelector';

/**
 * Form validation errors
 */
interface ValidationErrors {
  title?: string;
  duration?: string;
  location?: string;
  trainerId?: string;
  maxParticipants?: string;
  price?: string;
}

/**
 * Performance monitoring interface
 */
interface PerformanceMetrics {
  renderTime: number;
  validationTime: number;
  formInitTime: number;
}

/**
 * Event Modal Component - Optimized for Performance
 */
const EventModal: React.FC<EventModalProps> = React.memo(({
  isOpen,
  event,
  mode,
  trainers = [],
  loading = false,
  selectedDate,
  onClose,
  onSave,
  onDelete,
  onModeChange,
  className
}) => {
  
  // ===== STATE =====
  
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    validationTime: 0,
    formInitTime: 0
  });
  const [componentError, setComponentError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasRecovered, setHasRecovered] = useState(false);
  
  // EventType Smart Scheduling state
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number | undefined>(undefined);
  
  // Smart Scheduling Integration
  const [showTimeSlotSelector, setShowTimeSlotSelector] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<AvailableTimeSlot | null>(null);
  
  // ===== ACCESSIBILITY & KEYBOARD NAVIGATION =====
  
  const [focusedElementIndex, setFocusedElementIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);
  
  // ===== PERFORMANCE MONITORING =====
  
  const startTime = useMemo(() => performance.now(), []);
  
  useEffect(() => {
    const renderTime = performance.now() - startTime;
    setPerformanceMetrics(prev => ({ ...prev, renderTime }));
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`EventModal render time: ${renderTime.toFixed(2)}ms`);
    }
  }, [startTime]);
  
  // ===== SMART SCHEDULING INTEGRATION =====
  
  const {
    schedulingResult,
    loading: schedulingLoading,
    error: schedulingError,
    selectedSlot: hookSelectedSlot,
    findAvailableSlots,
    clearResults,
    retryLastSearch,
    selectSlot,
    clearSelectedSlot
  } = useTrainerAvailability();
  
  // ===== HELPER FUNCTIONS =====
  
  // Helper function to get event description from EventType module
  const getEventDescription = useCallback((eventType: string): string => {
    try {
      const { getEventDescription } = require('./Events/EventRegistry');
      return getEventDescription(eventType);
    } catch (error) {
      console.warn('Failed to get event description:', error);
      return '';
    }
  }, []);
  
  // ===== ERROR HANDLING =====
  
  const handleComponentError = useCallback((error: Error, errorInfo?: string) => {
    console.error('EventModal Component Error:', error);
    console.error('Error Info:', errorInfo);
    
    setComponentError(error);
    
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setComponentError(null);
        setHasRecovered(true);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`EventModal: Recovery attempt ${retryCount + 1}/3`);
        }
      }, 1000);
    }
  }, [retryCount]);
  
  const resetErrorState = useCallback(() => {
    setComponentError(null);
    setRetryCount(0);
    setHasRecovered(false);
  }, []);
  
  const safeAsyncOperation = useCallback(async (
    operation: () => Promise<any>,
    fallback?: () => any,
    errorMessage: string = 'Operation failed'
  ): Promise<any> => {
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
  
  // ===== MEMOIZED COMPUTATIONS =====
  
  const memoizedFormDefaults = useMemo(() => {
    return {
      title: '',
      description: '',
      trainerId: undefined,
      eventType: 'session' as EventType,
      bookingStatus: 'available' as BookingStatus,
      sessionType: 'individual' as SessionType,
      location: '',
      duration: undefined,
      maxParticipants: 1,
      currentParticipants: 0,
      price: 0,
      currency: 'USD',
      backgroundColor: '',
      borderColor: '',
      textColor: ''
    };
  }, []);
  
  const memoizedOptions = useMemo(() => ({
    locationOptions: [
      { value: '', label: '- Select Location -' },
      { value: 'google_meet', label: 'Google Meet (Active)' },
      { value: 'zoom', label: 'Zoom (Coming Soon)' }
    ],
    eventTypeOptions: [
      { value: 'session', label: 'Training Session' },
      { value: 'availability', label: 'Availability Slot' },
      { value: 'blocked', label: 'Blocked Time' },
      { value: 'group_class', label: 'Group Class' },
      { value: 'workshop', label: 'Workshop' },
      { value: 'assessment', label: 'Assessment' }
    ],
    bookingStatusOptions: [
      { value: 'available', label: 'Available' },
      { value: 'pending', label: 'Pending' },
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'completed', label: 'Completed' }
    ],
    sessionTypeOptions: [
      { value: 'individual', label: 'Individual' },
      { value: 'group', label: 'Group' },
      { value: 'assessment', label: 'Assessment' }
    ]
  }), []);
  
  // ===== DEVELOPMENT STATUS INDICATOR =====
  
  const getModularSystemStatus = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      try {
        const { getRegistryStatus } = require('./Events');
        const status = getRegistryStatus();
        return {
          ...status,
          eventTypeIntegrated: true,
          isComplete: true,
          modularizationProgress: 'EventType Smart Scheduling Integrated'
        };
      } catch (error) {
        return {
          modularEvents: 3,
          legacyEvents: 0,
          totalEvents: 3,
          eventTypeIntegrated: true,
          isComplete: true,
          modularizationProgress: 'EventType Smart Scheduling Integrated',
          error: 'Registry not available but EventType integrated'
        };
      }
    }
    return null;
  }, []);

  // ===== EFFECTS =====
  
  useEffect(() => {
    const initStartTime = performance.now();
    
    if (event) {
      setFormData({
        id: event.id,
        title: event.title,
        description: event.description,
        trainerId: event.trainerId,
        eventType: event.eventType,
        bookingStatus: event.bookingStatus,
        sessionType: event.sessionType,
        location: event.location,
        duration: event.duration,
        maxParticipants: event.maxParticipants,
        currentParticipants: event.currentParticipants,
        price: event.price,
        currency: event.currency,
        backgroundColor: event.backgroundColor,
        borderColor: event.borderColor,
        textColor: event.textColor
      });
      
      // Sync EventType state with existing event data
      setSelectedEventType(event.title || '');
      setSelectedDuration(event.duration);
    } else if (mode === 'create') {
      setFormData(memoizedFormDefaults);
      setSelectedEventType('');
      setSelectedDuration(undefined);
    }
    
    setErrors({});
    
    const initTime = performance.now() - initStartTime;
    setPerformanceMetrics(prev => ({ ...prev, formInitTime: initTime }));
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`EventModal form initialization time: ${initTime.toFixed(2)}ms`);
    }
  }, [event, mode, memoizedFormDefaults]);
  
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setSaving(false);
      setDeleting(false);
      setShowDeleteConfirm(false);
      setPerformanceMetrics({
        renderTime: 0,
        validationTime: 0,
        formInitTime: 0
      });
    }
  }, [isOpen]);
  
  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('EventModal: Cleaning up component');
      }
    };
  }, []);
  
  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus the modal container when it opens
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);
  
  // ===== FORM HANDLING =====
  
  const handleInputChange = useCallback((field: keyof CalendarEvent, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'title' && typeof value === 'string') {
        newData.description = getEventDescription(value);
        
        if (value === 'Personal Training Session') {
          newData.duration = undefined;
        } else {
          newData.duration = undefined;
        }
      }
      
      return newData;
    });
    
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors, getEventDescription]);
  
  const validateForm = useCallback((): boolean => {
    const validationStartTime = performance.now();
    let newErrors: ValidationErrors = {};
    
    // Use the new EventType validation system
    try {
      const { validateEventData } = require('./Events/EventRegistry');
      newErrors = validateEventData(formData);
    } catch (error) {
      console.warn('EventType validation failed, falling back to basic validation:', error);
      // Fallback to basic validation
      if (!formData.title?.trim()) {
        newErrors.title = 'Please select an event type';
      }
      if (!formData.location?.trim()) {
        newErrors.location = 'Please select a location for the session';
      }
    }
    
    const validationTime = performance.now() - validationStartTime;
    setPerformanceMetrics(prev => ({ ...prev, validationTime }));
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`EventModal validation time: ${validationTime.toFixed(2)}ms`);
      console.log(`Using EventType modular validation for: ${formData.title}`);
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    
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
  }, [formData, validateForm, onSave, onClose, safeAsyncOperation, resetErrorState]);
  
  const handleDelete = useCallback(async () => {
    if (!event?.id || !onDelete) return;
    
    setDeleting(true);
    
    const result = await safeAsyncOperation(
      () => onDelete(event.id),
      undefined,
      'Failed to delete event'
    );
    
    if (result !== null) {
      onClose();
      resetErrorState();
    }
    
    setDeleting(false);
    setShowDeleteConfirm(false);
  }, [event, onDelete, onClose, safeAsyncOperation, resetErrorState]);
  
  // ===== EVENT HANDLERS =====
  
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    
    // Handle Tab navigation with focus trapping
    if (e.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
    
    // Arrow key navigation for form fields
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && modalRef.current) {
      const formInputs = modalRef.current.querySelectorAll(
        'input:not(:disabled), select:not(:disabled), textarea:not(:disabled)'
      ) as NodeListOf<HTMLElement>;
      
      if (formInputs.length === 0) return;
      
      const currentIndex = Array.from(formInputs).indexOf(document.activeElement as HTMLElement);
      
      if (currentIndex !== -1) {
        e.preventDefault();
        
        if (e.key === 'ArrowDown') {
          const nextIndex = (currentIndex + 1) % formInputs.length;
          formInputs[nextIndex].focus();
        } else {
          const prevIndex = currentIndex === 0 ? formInputs.length - 1 : currentIndex - 1;
          formInputs[prevIndex].focus();
        }
      }
    }
  }, [onClose]);
  
  const handleModeChange = useCallback((newMode: 'view' | 'edit' | 'create') => {
    if (onModeChange) {
      onModeChange(newMode);
    }
  }, [onModeChange]);
  
  // ===== EVENT TYPE HANDLERS =====
  
  const handleEventTypeChange = useCallback((eventType: string) => {
    setSelectedEventType(eventType);
    setFormData(prev => ({
      ...prev,
      title: eventType,
      description: eventType ? getEventDescription(eventType) : ''
    }));
    
    // Clear any title-related errors
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  }, [errors.title]);
  
  const handleDurationChange = useCallback((duration: number) => {
    setSelectedDuration(duration);
    setFormData(prev => ({
      ...prev,
      duration
    }));
    
    // Clear any duration-related errors
    if (errors.duration) {
      setErrors(prev => ({ ...prev, duration: undefined }));
    }
  }, [errors.duration]);
  
  const handleAutomaticSelectionsChange = useCallback((selections: { eventType?: string; sessionType?: string; bookingStatus?: string; price?: number }) => {
    setFormData(prev => ({
      ...prev,
      ...(selections.eventType && { eventType: selections.eventType as EventType }),
      ...(selections.sessionType && { sessionType: selections.sessionType as SessionType }),
      ...(selections.bookingStatus && { bookingStatus: selections.bookingStatus as BookingStatus }),
      ...(selections.price !== undefined && { price: selections.price })
    }));
  }, []);
  
  const handleSmartScheduling = useCallback(async (preferences: SchedulingPreference) => {
    try {
      console.log('🎯 Smart Scheduling triggered with preferences:', preferences);
      
      if (!selectedEventType) {
        console.warn('No event type selected for smart scheduling');
        return;
      }
      
      // Show the time slot selector
      setShowTimeSlotSelector(true);
      
      // Clear any previous results
      clearResults();
      clearSelectedSlot();
      setSelectedTimeSlot(null);
      
      // Use selected date from calendar if available, otherwise use preferred date from preferences
      const targetDate = selectedDate || preferences.preferredDate || new Date();
      
      // Get duration based on event type or selected duration
      let eventDuration = selectedDuration;
      if (!eventDuration) {
        // Set default duration based on event type
        switch (selectedEventType) {
          case 'Free Consultation (20 Min)':
            eventDuration = 20;
            break;
          case 'Online Group Fitness Class (45 Min)':
            eventDuration = 45;
            break;
          case 'Personal Training Session':
            eventDuration = selectedDuration || 60; // Default to 60 minutes
            break;
          default:
            eventDuration = 30;
        }
      }
      
      console.log('🔍 Searching for availability:', {
        date: targetDate.toLocaleDateString(),
        eventType: selectedEventType,
        duration: eventDuration,
        preferences
      });
      
      // Call the availability API
      await findAvailableSlots(targetDate, selectedEventType, eventDuration, preferences);
      
    } catch (error) {
      console.error('Smart scheduling error:', error);
      setComponentError(error instanceof Error ? error : new Error('Smart scheduling failed'));
    }
  }, [selectedEventType, selectedDuration, selectedDate, findAvailableSlots, clearResults, clearSelectedSlot]);
  
  const handleTimeSlotSelect = useCallback((slot: AvailableTimeSlot) => {
    console.log('⏰ Time slot selected:', slot);
    
    setSelectedTimeSlot(slot);
    selectSlot(slot);
    
    // Update form data with selected time slot
    setFormData(prev => ({
      ...prev,
      start: slot.startTime.toISOString(),
      end: slot.endTime.toISOString(),
      startDate: slot.startTime.toISOString().split('T')[0],
      endDate: slot.endTime.toISOString().split('T')[0],
      startTime: slot.startTime.toTimeString().slice(0, 5),
      endTime: slot.endTime.toTimeString().slice(0, 5),
      trainerId: slot.trainerId ? parseInt(slot.trainerId, 10) || undefined : undefined,
      price: slot.price || 0,
      ...(slot.spotsRemaining && { maxParticipants: slot.spotsRemaining })
    }));
    
    // Hide time slot selector after selection
    setShowTimeSlotSelector(false);
    
    console.log('✅ Form data updated with time slot information');
  }, [selectSlot]);
  
  const handleTimeSlotSelectorRetry = useCallback(() => {
    console.log('🔄 Retrying time slot search...');
    retryLastSearch();
  }, [retryLastSearch]);
  
  const handleCloseTimeSlotSelector = useCallback(() => {
    setShowTimeSlotSelector(false);
  }, []);
  
  // ===== RENDER HELPERS =====
  
  const renderFormField = (
    label: string,
    field: keyof CalendarEvent,
    type: 'text' | 'textarea' | 'datetime-local' | 'number' | 'select',
    options?: { value: any; label: string }[],
    placeholder?: string
  ) => {
    const value = formData[field] ?? (type === 'number' ? 0 : '');
    const error = errors[field as keyof ValidationErrors];
    const isReadonly = mode === 'view';
    
    return (
      <div className="event-modal__form-field" key={field}>
        <label 
          className="event-modal__form-label"
          htmlFor={`event-modal-${field}`}
        >
          {label}
          {!isReadonly && <span className="required" aria-label="required">*</span>}
        </label>
        
        {type === 'textarea' ? (
          <textarea
            id={`event-modal-${field}`}
            className={`event-modal__form-input ${error ? 'error' : ''}`}
            value={value as string}
            placeholder={placeholder}
            readOnly={isReadonly}
            onChange={(e) => handleInputChange(field, e.target.value)}
            rows={3}
            aria-invalid={!!error}
            aria-describedby={error ? `event-modal-${field}-error` : undefined}
            aria-required={!isReadonly}
          />
        ) : type === 'select' ? (
          <select
            id={`event-modal-${field}`}
            className={`event-modal__form-input ${error ? 'error' : ''}`}
            value={value as string}
            disabled={isReadonly}
            onChange={(e) => handleInputChange(field, e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? `event-modal-${field}-error` : undefined}
            aria-required={!isReadonly}
          >
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={`event-modal-${field}`}
            type={type}
            className={`event-modal__form-input ${error ? 'error' : ''}`}
            value={value as string}
            placeholder={placeholder}
            readOnly={isReadonly}
            onChange={(e) => {
              const inputValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
              handleInputChange(field, inputValue);
            }}
            aria-invalid={!!error}
            aria-describedby={error ? `event-modal-${field}-error` : undefined}
            aria-required={!isReadonly}
          />
        )}
        
        {error && (
          <span 
            id={`event-modal-${field}-error`}
            className="event-modal__form-error"
            role="alert"
            aria-live="polite"
          >
            {error}
          </span>
        )}
      </div>
    );
  };
  
  // ===== MAIN RENDER =====

  if (!isOpen) return null;

  if (componentError && retryCount >= 3) {
    return (
      <div className="event-modal__backdrop" onClick={onClose}>
        <div className="event-modal__container event-modal__error-state" onClick={(e) => e.stopPropagation()}>
          <div className="event-modal__header">
            <h3 className="event-modal__title">Component Error</h3>
            <button onClick={onClose} className="event-modal__close">×</button>
          </div>
          <div className="event-modal__content">
            <p>EventModal encountered an error and couldn't recover.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={onClose} className="event-modal__button event-modal__button--secondary">Close</button>
              <button onClick={resetErrorState} className="event-modal__button event-modal__button--primary">Reset</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="event-modal__backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div 
        className={`event-modal__container ${className || ''}`}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        aria-modal="true"
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
        role="dialog"
      >
        {hasRecovered && (
          <div className="event-modal__recovery-notice">
            <span>Component recovered successfully</span>
            <button onClick={() => setHasRecovered(false)}>×</button>
          </div>
        )}

        {/* Error Display */}
        {componentError && retryCount < 3 && (
          <div className="event-modal__error-notice">
            <span>Error: {componentError.message}</span>
            <button onClick={resetErrorState}>Retry</button>
          </div>
        )}

        {/* Header */}
        <div className="event-modal__header">
          <h2 id="event-modal-title" className="event-modal__title">
            {mode === 'create' ? 'Create New Event' : 
             mode === 'edit' ? 'Edit Event' : 
             'Event Details'}
          </h2>
          <button
            ref={lastFocusableRef}
            className="event-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Main Content */}
        <div className="event-modal__content">
          {loading ? (
            <div className="event-modal__loading">
              <div className="spinner" />
              <span>Loading event data...</span>
            </div>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="event-modal__form">
              {/* EventType Smart Scheduling Integration */}
              <div className="event-modal__form-section">
                <EventTypeSelector
                  selectedEventType={selectedEventType}
                  eventTypeOptions={EVENT_TYPE_OPTIONS}
                  disabled={saving || deleting}
                  loading={loading}
                  selectedDate={selectedDate}
                  onChange={handleEventTypeChange}
                  onDurationChange={handleDurationChange}
                  onAutomaticSelectionsChange={handleAutomaticSelectionsChange}
                  onTriggerSmartScheduling={handleSmartScheduling}
                  className="event-modal__event-type-selector"
                />
              </div>

              {/* Show selected time slot info if any */}
              {selectedTimeSlot && (
                <div className="event-modal__selected-slot-info">
                  <h4>Selected Time Slot</h4>
                  <p>
                    <strong>Time:</strong> {selectedTimeSlot.startTime.toLocaleString()} - {selectedTimeSlot.endTime.toLocaleString()}
                  </p>
                  {selectedTimeSlot.trainerName && (
                    <p><strong>Trainer:</strong> {selectedTimeSlot.trainerName}</p>
                  )}
                  {selectedTimeSlot.price && (
                    <p><strong>Price:</strong> ${selectedTimeSlot.price}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowTimeSlotSelector(true)}
                    className="event-modal__change-slot-button"
                  >
                    Change Time Slot
                  </button>
                </div>
              )}

              {/* Rest of form fields... */}
              <div className="event-modal__form-grid">
                <div className="event-modal__form-section">
                  <h3 className="event-modal__section-title">Event Details</h3>
                  {renderFormField('Event Title', 'title', 'select', memoizedOptions.eventTypeOptions)}
                  {renderFormField('Description', 'description', 'textarea', undefined, 'Enter event description')}
                </div>
                
                <div className="event-modal__form-section">
                  <h3 className="event-modal__section-title">Schedule</h3>
                  {renderFormField('Start Date & Time', 'start', 'datetime-local')}
                  {renderFormField('End Date & Time', 'end', 'datetime-local')}
                </div>

                <div className="event-modal__form-section">
                  <h3 className="event-modal__section-title">Session Details</h3>
                  {renderFormField('Location', 'location', 'select', memoizedOptions.locationOptions)}
                  {renderFormField('Max Participants', 'maxParticipants', 'number')}
                </div>
              </div>
              
            </form>
          )}
        </div>

        {/* Footer */}
        <EventModalFooter
          mode={mode}
          loading={loading}
          saving={saving}
          deleting={deleting}
          event={event}
          isEditable={mode !== 'view'}
          showDeleteConfirm={showDeleteConfirm}
          onClose={onClose}
          onSave={handleSave}
          onDelete={handleDelete}
          onShowDeleteConfirm={setShowDeleteConfirm}
          onConfirmDelete={() => {
            setShowDeleteConfirm(false);
            handleDelete();
          }}
        />

        {/* Time Slot Selector Modal */}
        {showTimeSlotSelector && (
          <div className="event-modal__backdrop" style={{ zIndex: 1001 }}>
            <div className="event-modal__container" onClick={(e) => e.stopPropagation()}>
              <div className="event-modal__header">
                <h3 className="event-modal__title">Select Available Time Slot</h3>
                <button
                  className="event-modal__close"
                  onClick={handleCloseTimeSlotSelector}
                  aria-label="Close time slot selector"
                >
                  ×
                </button>
              </div>
              
              <div className="event-modal__content">
                <TimeSlotSelector
                  schedulingResult={schedulingResult}
                  selectedSlot={selectedTimeSlot}
                  loading={schedulingLoading}
                  eventType={selectedEventType}
                  selectedDate={selectedDate}
                  onSlotSelect={handleTimeSlotSelect}
                  onRetry={handleTimeSlotSelectorRetry}
                  className="event-modal__time-slot-selector"
                />
                
                {schedulingError && (
                  <div className="event-modal__scheduling-error">
                    <p>Error loading time slots: {schedulingError}</p>
                    <button onClick={handleTimeSlotSelectorRetry}>Retry</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

EventModal.displayName = 'EventModal';

export default EventModal; 