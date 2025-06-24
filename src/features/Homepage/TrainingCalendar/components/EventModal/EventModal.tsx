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
import { BookingStatus, CalendarEvent, EventModalProps, EventType, RegisteredUser, SessionType, UserRegistrationData } from '../../interfaces';
import { parseFromDateTimeLocal } from '../../utils/dateTimeUtils';
import UserRegistrationModal from '../UserRegistrationModal/UserRegistrationModal';
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
  
  // User Registration Integration
  const [showUserRegistration, setShowUserRegistration] = useState(false);
  const [userRegistrationData, setUserRegistrationData] = useState<Partial<UserRegistrationData> | null>(null);
  
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
      location: 'google_meet',
      duration: undefined,
      maxParticipants: 1,
      currentParticipants: 0,
      price: 0,
      currency: 'USD',
      zoomLink: '',
      specialInstructions: ''
    };
  }, []);
  
  const memoizedOptions = useMemo(() => ({
    locationOptions: [
      { value: 'google_meet', label: '📹 Google Meet (Recommended)' },
      { value: 'zoom', label: '💻 Zoom (Coming Soon)' },
      { value: 'in_person', label: '🏢 In-Person Session' },
      { value: 'phone_call', label: '📞 Phone Call' }
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
      
      // Handle datetime fields specially
      if (field === 'start' || field === 'end') {
        if (typeof value === 'string' && value) {
          // Convert datetime-local value to proper Date object
          const parsedDate = parseFromDateTimeLocal(value);
          if (parsedDate) {
            newData[field] = parsedDate.toISOString();
          } else {
            newData[field] = value;
          }
        } else {
          newData[field] = value;
        }
      }
      
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
  
  // ===== USER REGISTRATION HANDLERS =====
  
  const handleUserRegistrationRequired = useCallback(() => {
    // Check if user is already authenticated (placeholder for future implementation)
    const isAuthenticated = false; // TODO: Implement user authentication check
    
    if (!isAuthenticated) {
      setShowUserRegistration(true);
      return true; // Prevent normal save flow
    }
    
    return false; // Allow normal save flow
  }, []);

  const handleBookSession = useCallback(() => {
    console.log('📅 Book Session clicked - checking user registration...');
    
    // Check if user registration is required
    if (handleUserRegistrationRequired()) {
      console.log('📅 User registration required - showing registration modal');
      return; // User registration modal will be shown
    }
    
    // If user is already authenticated, proceed to booking/edit mode
    console.log('📅 User authenticated - proceeding to booking');
    if (onModeChange) {
      onModeChange('edit');
    }
  }, [handleUserRegistrationRequired, onModeChange]);
  
  const handleUserRegistered = useCallback(async (user: RegisteredUser) => {
    console.log('User registered successfully:', user);
    
    // Store user context for this session
    setUserRegistrationData(user);
    
    // Close registration modal
    setShowUserRegistration(false);
    
    // Proceed with event creation now that user is registered
    const eventDataWithUser = {
      ...formData,
      userId: user.id,
      createdBy: user.id
    };
    
    // Call the normal save flow with user context
    await handleSaveWithUser(eventDataWithUser);
  }, [formData]);
  
  const handleSaveWithUser = useCallback(async (eventData: Partial<CalendarEvent>) => {
    setSaving(true);
    
    const result = await safeAsyncOperation(
      () => onSave(eventData),
      undefined,
      'Failed to save event with user context'
    );
    
    if (result !== null) {
      onClose();
      resetErrorState();
    }
    
    setSaving(false);
  }, [onSave, onClose, safeAsyncOperation, resetErrorState]);
  
  // ===== MODIFIED SAVE HANDLER =====
  
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    
    // Check if user registration is required before proceeding
    if (handleUserRegistrationRequired()) {
      return; // User registration modal will be shown
    }
    
    // Proceed with normal save flow
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
  }, [formData, validateForm, handleUserRegistrationRequired, onSave, onClose, safeAsyncOperation, resetErrorState]);
  
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
    
    // Validate slot has required time properties
    if (!slot || !slot.startTime || !slot.endTime) {
      console.error('Invalid time slot selected - missing time properties:', slot);
      return;
    }
    
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
  
  // ===== VIEW MODE RENDERING HELPERS =====

  // ===== FORM RENDERING HELPERS =====
  
  /**
   * Render form field with validation and error handling
   */
  const renderFormField = useCallback((
    label: string,
    field: string,
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'number' | 'datetime-local',
    options?: { value: string; label: string }[],
    placeholder?: string,
    required = false
  ) => {
    const fieldParts = field.split('.');
    let value = formData as any;
    
    for (const part of fieldParts) {
      value = value?.[part];
    }
    
    const error = errors[field as keyof ValidationErrors];
    
    return (
      <div className="event-modal__field">
        <label className="event-modal__label">
          {label}
          {required && <span className="required">*</span>}
        </label>
        
        {type === 'textarea' ? (
          <textarea
            className={`event-modal__input ${error ? 'error' : ''}`}
            value={value || ''}
            placeholder={placeholder}
            onChange={(e) => handleFormFieldChange(field, e.target.value)}
            rows={4}
          />
        ) : type === 'select' ? (
          <select
            className={`event-modal__input ${error ? 'error' : ''}`}
            value={value || ''}
            onChange={(e) => handleFormFieldChange(field, e.target.value)}
          >
            <option value="">Select...</option>
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            className={`event-modal__input ${error ? 'error' : ''}`}
            value={value || ''}
            placeholder={placeholder}
            onChange={(e) => handleFormFieldChange(field, e.target.value)}
          />
        )}
        
        {error && (
          <span className="event-modal__error">{error}</span>
        )}
      </div>
    );
  }, [formData, errors]);

  /**
   * Handle form field changes
   */
  const handleFormFieldChange = useCallback((field: string, value: string) => {
    const fieldParts = field.split('.');
    
    setFormData(prev => {
      const newData = { ...prev };
      let current = newData as any;
      
      // Navigate to the nested property
      for (let i = 0; i < fieldParts.length - 1; i++) {
        const part = fieldParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      
      // Set the final value
      const finalField = fieldParts[fieldParts.length - 1];
      
      // Handle special conversions
      if (field === 'maxParticipants' && value) {
        current[finalField] = parseInt(value, 10);
      } else if (field === 'trainerId' && value) {
        current[finalField] = parseInt(value, 10);
      } else {
        current[finalField] = value;
      }
      
      return newData;
    });
    
    // Clear field error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);
  
    // ===== VIEW MODE RENDERING =====
  
  /**
   * Render event details in view mode (read-only)
   */
  const renderViewMode = useCallback(() => {
    if (!event) return null;
    
    const formatDateTime = (dateString: string | Date) => {
      try {
        const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
        return date.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      } catch (error) {
        return dateString?.toString() || 'Invalid date';
      }
    };

    const formatDuration = (start: string | Date, end: string | Date) => {
      try {
        const startDate = typeof start === 'string' ? new Date(start) : start;
        const endDate = typeof end === 'string' ? new Date(end) : end;
        const durationMs = endDate.getTime() - startDate.getTime();
        const minutes = Math.round(durationMs / (1000 * 60));
        
        if (minutes < 60) {
          return `${minutes} minutes`;
        } else {
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
        }
      } catch (error) {
        return 'Duration unavailable';
      }
    };

    const getEventTypeLabel = (eventType: string) => {
      switch (eventType) {
        case 'Free Consultation (20 Min)': return 'Free Consultation';
        case 'Online Group Fitness Class (45 Min)': return 'Group Fitness Class';
        case 'Personal Training Session': return 'Personal Training';
        case 'assessment': return 'Fitness Assessment';
        case 'session': return 'Training Session';
        case 'consultation': return 'Consultation';
        default: return eventType || 'Training Session';
      }
    };

    const getLocationDisplay = (location: string) => {
      switch (location) {
        case 'google_meet': return '📹 Google Meet (Online)';
        case 'zoom': return '💻 Zoom (Coming Soon)';
        case 'in_person': return '🏢 In-Person Session';
        case 'phone_call': return '📞 Phone Call';
        case 'Google Meet (Active)': return '📹 Google Meet (Online)'; // Legacy support
        case 'Zoom (Coming Soon)': return '💻 Zoom (Coming Soon)'; // Legacy support
        case 'online': return '📹 Online Session';
        default: return location || '📹 Google Meet (Online)';
      }
    };

    const getBookingStatusDisplay = (status: string) => {
      switch (status) {
        case 'available': return { text: 'Available for Booking', class: 'status--available', icon: '✅' };
        case 'confirmed': return { text: 'Confirmed Booking', class: 'status--confirmed', icon: '🔒' };
        case 'cancelled': return { text: 'Cancelled', class: 'status--cancelled', icon: '❌' };
        case 'completed': return { text: 'Completed', class: 'status--completed', icon: '✅' };
        default: return { text: status || 'Unknown', class: 'status--unknown', icon: '❓' };
      }
    };

    const statusInfo = getBookingStatusDisplay(event.bookingStatus || 'available');

    return (
      <div className="event-modal__view-content">
        {/* Event Header */}
        <div className="event-modal__event-header">
          <div className="event-modal__event-title-section">
            <h3 className="event-modal__event-title">{event.title}</h3>
            <div className={`event-modal__booking-status ${statusInfo.class}`}>
              <span className="status-icon">{statusInfo.icon}</span>
              <span className="status-text">{statusInfo.text}</span>
            </div>
          </div>
          <div className="event-modal__event-type">
            <span className="event-type-badge">{getEventTypeLabel(event.eventType || 'session')}</span>
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="event-modal__details-grid">
          {/* Date & Time Section */}
          <div className="event-modal__detail-section">
            <h4 className="section-title">📅 Date & Time</h4>
            <div className="detail-content">
              <div className="detail-item">
                <strong>Start:</strong> {formatDateTime(event.start)}
              </div>
              <div className="detail-item">
                <strong>End:</strong> {formatDateTime(event.end)}
              </div>
              <div className="detail-item">
                <strong>Duration:</strong> {formatDuration(event.start, event.end)}
              </div>
            </div>
          </div>

          {/* Location Section - ENHANCED with Google Meet default */}
          <div className="event-modal__detail-section location-section">
            <h4 className="section-title">📍 Meeting Location</h4>
            <div className="detail-content">
              <div className="detail-item location-item">
                <div className="location-display">
                  <div className="location-main">
                    {getLocationDisplay(event.location || 'google_meet')}
                  </div>
                  {(event.location === 'google_meet' || !event.location) && (
                    <div className="location-features">
                      <span className="feature-badge">✨ HD Video & Audio</span>
                      <span className="feature-badge">🔒 Secure & Private</span>
                      <span className="feature-badge">📱 Mobile Friendly</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Enhanced Meeting Link Section */}
              {(event.location === 'google_meet' || !event.location) && (
                <div className="detail-item meeting-link-section">
                  <div className="meeting-link-container">
                    <div className="meeting-link-header">
                      <strong>📹 Meeting Access</strong>
                      <span className="meeting-status available">Ready to Join</span>
                    </div>
                    {event.zoomLink ? (
                      <a 
                        href={event.zoomLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="meeting-link-button primary"
                      >
                        <span className="link-icon">🚀</span>
                        <span className="link-text">Join Google Meet Session</span>
                        <span className="link-arrow">→</span>
                      </a>
                    ) : (
                      <div className="meeting-link-placeholder">
                        <span className="placeholder-icon">🔗</span>
                        <span className="placeholder-text">Meeting link will be provided upon booking confirmation</span>
                      </div>
                    )}
                    <div className="meeting-instructions">
                      <p><strong>📋 How to Join:</strong></p>
                      <ul>
                        <li>Click the meeting link 5 minutes before your session</li>
                        <li>Allow camera and microphone permissions</li>
                        <li>Have a stable internet connection ready</li>
                        <li>Find a quiet, well-lit space for your session</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {/* Zoom Coming Soon Section */}
              {event.location === 'zoom' && (
                <div className="detail-item meeting-link-section">
                  <div className="meeting-link-container coming-soon">
                    <div className="meeting-link-header">
                      <strong>💻 Zoom Integration</strong>
                      <span className="meeting-status coming-soon">Coming Soon</span>
                    </div>
                    <div className="coming-soon-notice">
                      <span className="notice-icon">🚧</span>
                      <span className="notice-text">Zoom integration is currently in development. Please use Google Meet for now.</span>
                    </div>
                  </div>
                </div>
              )}
              {/* In-Person Location Details */}
              {event.location === 'in_person' && (
                <div className="detail-item meeting-link-section">
                  <div className="meeting-link-container in-person">
                    <div className="meeting-link-header">
                      <strong>🏢 Studio Location</strong>
                      <span className="meeting-status confirmed">Address Confirmed</span>
                    </div>
                    <div className="location-details">
                      <p><strong>📍 Address:</strong> FitCopilot Training Studio<br />
                      123 Fitness Ave, Suite 100<br />
                      Your City, State 12345</p>
                      <div className="location-instructions">
                        <p><strong>📋 What to Bring:</strong></p>
                        <ul>
                          <li>Workout clothes and athletic shoes</li>
                          <li>Water bottle and towel</li>
                          <li>Arrive 10 minutes early for check-in</li>
                          <li>Valid ID for first-time visitors</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Phone Call Details */}
              {event.location === 'phone_call' && (
                <div className="detail-item meeting-link-section">
                  <div className="meeting-link-container phone-call">
                    <div className="meeting-link-header">
                      <strong>📞 Phone Consultation</strong>
                      <span className="meeting-status ready">Call Details</span>
                    </div>
                    <div className="phone-details">
                      <p><strong>📱 How it Works:</strong></p>
                      <ul>
                        <li>Your trainer will call you at the scheduled time</li>
                        <li>Ensure you have good phone reception</li>
                        <li>Have a pen and paper ready for notes</li>
                        <li>Find a quiet space for your consultation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Participants Section */}
          <div className="event-modal__detail-section">
            <h4 className="section-title">👥 Participants</h4>
            <div className="detail-content">
              <div className="detail-item">
                <strong>Capacity:</strong> {event.currentParticipants || 0} / {event.maxParticipants || 1} participants
              </div>
              <div className="participants-progress">
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${((event.currentParticipants || 0) / (event.maxParticipants || 1)) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          {event.price !== undefined && event.price > 0 && (
            <div className="event-modal__detail-section">
              <h4 className="section-title">💰 Pricing</h4>
              <div className="detail-content">
                <div className="detail-item price-item">
                  <span className="price">
                    {event.currency === 'USD' ? '$' : event.currency || '$'}{event.price}
                  </span>
                  <span className="price-note">per session</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description Section */}
        {event.description && (
          <div className="event-modal__description-section">
            <h4 className="section-title">📝 Description</h4>
            <div className="description-content">
              <p>{event.description}</p>
            </div>
          </div>
        )}

        {/* Special Instructions */}
        {event.specialInstructions && (
          <div className="event-modal__instructions-section">
            <h4 className="section-title">📋 Special Instructions</h4>
            <div className="instructions-content">
              <p>{event.specialInstructions}</p>
            </div>
          </div>
        )}

        {/* Action Buttons for Available Events */}
        {event.bookingStatus === 'available' && (
          <div className="event-modal__view-actions">
            <button
              type="button"
              className="btn btn--primary btn--large"
              onClick={handleBookSession}
              disabled={loading}
            >
              📅 Book This Session
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => onModeChange && onModeChange('edit')}
              disabled={loading}
            >
              ✏️ Edit Details
            </button>
          </div>
        )}

        {/* Read-only Actions for Non-Available Events */}
        {event.bookingStatus !== 'available' && (
          <div className="event-modal__view-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
            >
              Close
            </button>
            {event.bookingStatus === 'confirmed' && (
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => onModeChange && onModeChange('edit')}
                disabled={loading}
              >
                View Booking Details
              </button>
            )}
          </div>
        )}
      </div>
    );
  }, [event, loading, onModeChange, onClose]);
  
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
          ) : mode === 'view' ? (
            renderViewMode()
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

              {/* Show selected time slot info if any - DEFENSIVE PROGRAMMING */}
              {(() => {
                try {
                  // Enhanced safety checks for time slot display
                  if (!selectedTimeSlot) {
                    return null;
                  }

                  // Validate time slot structure with comprehensive checks
                  const hasValidStartTime = selectedTimeSlot.startTime && 
                                          (selectedTimeSlot.startTime instanceof Date || 
                                           typeof selectedTimeSlot.startTime === 'string');
                  
                  const hasValidEndTime = selectedTimeSlot.endTime && 
                                        (selectedTimeSlot.endTime instanceof Date || 
                                         typeof selectedTimeSlot.endTime === 'string');

                  if (!hasValidStartTime || !hasValidEndTime) {
                    return null;
                  }

                  // Convert to Date objects if needed with error handling
                  let startTime: Date;
                  let endTime: Date;

                  try {
                    startTime = selectedTimeSlot.startTime instanceof Date 
                      ? selectedTimeSlot.startTime 
                      : new Date(selectedTimeSlot.startTime);
                    
                    endTime = selectedTimeSlot.endTime instanceof Date 
                      ? selectedTimeSlot.endTime 
                      : new Date(selectedTimeSlot.endTime);

                    // Validate Date objects
                    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                      return null;
                    }

                  } catch (dateError) {
                    console.error('❌ Error creating Date objects:', dateError);
                    return null;
                  }

                  // Safe rendering with try-catch for toLocaleString
                  return (
                    <div className="event-modal__selected-slot-info">
                      <h4>Selected Time Slot</h4>
                      <p>
                        <strong>Time:</strong> {(() => {
                          try {
                            return `${startTime.toLocaleString()} - ${endTime.toLocaleString()}`;
                          } catch (formatError) {
                            console.warn('⚠️ Error formatting time:', formatError);
                            return `${startTime.toString()} - ${endTime.toString()}`;
                          }
                        })()}
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
                  );

                } catch (error) {
                  console.error('❌ Error rendering time slot info:', error);
                  
                  return (
                    <div className="event-modal__selected-slot-info event-modal__error-fallback">
                      <h4>Time Slot Selected</h4>
                      <p><em>Time slot information temporarily unavailable</em></p>
                      <button
                        type="button"
                        onClick={() => setShowTimeSlotSelector(true)}
                        className="event-modal__change-slot-button"
                      >
                        Change Time Slot
                      </button>
                    </div>
                  );
                }
              })()}

              {/* DEFENSIVE PROGRAMMING: Safe time slot rendering with comprehensive null checks */}
              {(() => {
                try {
                  // Enhanced safety checks for time slot display
                  if (!selectedTimeSlot) {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('🔍 No time slot selected');
                    }
                    return null;
                  }

                  // Validate time slot structure
                  const hasValidStartTime = selectedTimeSlot.startTime && 
                                          (selectedTimeSlot.startTime instanceof Date || 
                                           typeof selectedTimeSlot.startTime === 'string');
                  
                  const hasValidEndTime = selectedTimeSlot.endTime && 
                                        (selectedTimeSlot.endTime instanceof Date || 
                                         typeof selectedTimeSlot.endTime === 'string');

                  if (process.env.NODE_ENV === 'development') {
                    console.log('🔍 Time Slot Validation:', {
                      hasTimeSlot: !!selectedTimeSlot,
                      hasStartTime: hasValidStartTime,
                      hasEndTime: hasValidEndTime,
                      startTimeType: typeof selectedTimeSlot.startTime,
                      endTimeType: typeof selectedTimeSlot.endTime,
                      startTimeValue: selectedTimeSlot.startTime,
                      endTimeValue: selectedTimeSlot.endTime
                    });
                  }

                  if (!hasValidStartTime || !hasValidEndTime) {
                    if (process.env.NODE_ENV === 'development') {
                      console.warn('⚠️ Invalid time slot structure:', selectedTimeSlot);
                    }
                    return null;
                  }

                  // Convert to Date objects if needed
                  let startTime: Date;
                  let endTime: Date;

                  try {
                    startTime = selectedTimeSlot.startTime instanceof Date 
                      ? selectedTimeSlot.startTime 
                      : new Date(selectedTimeSlot.startTime);
                    
                    endTime = selectedTimeSlot.endTime instanceof Date 
                      ? selectedTimeSlot.endTime 
                      : new Date(selectedTimeSlot.endTime);

                    // Validate Date objects
                    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                      if (process.env.NODE_ENV === 'development') {
                        console.warn('⚠️ Invalid Date objects created from time slot');
                      }
                      return null;
                    }

                  } catch (dateError) {
                    if (process.env.NODE_ENV === 'development') {
                      console.error('❌ Error creating Date objects:', dateError);
                    }
                    return null;
                  }

                  // Safe rendering with try-catch for toLocaleString
                  return (
                    <div className="event-modal__selected-slot-info">
                      <h4>Selected Time Slot</h4>
                      <p>
                        <strong>Time:</strong> {(() => {
                          try {
                            return `${startTime.toLocaleString()} - ${endTime.toLocaleString()}`;
                          } catch (formatError) {
                            if (process.env.NODE_ENV === 'development') {
                              console.warn('⚠️ Error formatting time:', formatError);
                            }
                            return `${startTime.toString()} - ${endTime.toString()}`;
                          }
                        })()}
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
                  );

                } catch (error) {
                  if (process.env.NODE_ENV === 'development') {
                    console.error('❌ Error rendering time slot info:', error);
                    console.error('Time slot data:', selectedTimeSlot);
                  }
                  
                  return (
                    <div className="event-modal__selected-slot-info event-modal__error-fallback">
                      <h4>Time Slot Selected</h4>
                      <p><em>Time slot information temporarily unavailable</em></p>
                      <button
                        type="button"
                        onClick={() => setShowTimeSlotSelector(true)}
                        className="event-modal__change-slot-button"
                      >
                        Change Time Slot
                      </button>
                    </div>
                  );
                }
              })()}

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
          onDelete={onDelete ? () => {
            if (event?.id) {
              onDelete(event.id);
            }
          } : undefined}
          onShowDeleteConfirm={setShowDeleteConfirm}
          onConfirmDelete={() => {
            setShowDeleteConfirm(false);
            if (onDelete && event?.id) {
              onDelete(event.id);
            }
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

        {/* User Registration Modal */}
        {showUserRegistration && (
          <div className="event-modal__backdrop" style={{ zIndex: 1002 }}>
            <div className="event-modal__container" onClick={(e) => e.stopPropagation()}>
              <UserRegistrationModal
                isOpen={showUserRegistration}
                eventData={formData}
                onClose={() => setShowUserRegistration(false)}
                onUserRegistered={handleUserRegistered}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

EventModal.displayName = 'EventModal';

export default EventModal; 