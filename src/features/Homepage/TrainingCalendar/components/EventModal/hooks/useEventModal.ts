/**
 * useEventModal Hook
 * 
 * Core state management for EventModal components
 * Follows assignment-manager.js patterns for configuration and state
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarEvent } from '../../../interfaces';
import { EventModalConfig, EventModalState, PerformanceMetrics, ValidationErrors } from '../types';
import { EVENT_MODAL_DEFAULTS, PERFORMANCE_CONFIG } from '../utils/eventConstants';

interface UseEventModalProps {
  event?: CalendarEvent;
  mode: 'view' | 'edit' | 'create';
  isOpen: boolean;
  config?: Partial<EventModalConfig>;
}

interface UseEventModalReturn {
  // State
  state: EventModalState;
  
  // Configuration (following assignment-manager.js pattern)
  config: EventModalConfig;
  
  // Core actions
  updateFormData: (updates: Partial<CalendarEvent>) => void;
  updateErrors: (errors: Partial<ValidationErrors>) => void;
  updatePerformanceMetrics: (metrics: Partial<PerformanceMetrics>) => void;
  
  // UI state management
  setSaving: (saving: boolean) => void;
  setDeleting: (deleting: boolean) => void;
  setShowDeleteConfirm: (show: boolean) => void;
  
  // Error recovery (following assignment-manager.js error patterns)
  setComponentError: (error: Error | null) => void;
  incrementRetryCount: () => void;
  setHasRecovered: (recovered: boolean) => void;
  
  // EventType state
  setSelectedEventType: (eventType: string) => void;
  setSelectedDuration: (duration: number | undefined) => void;
  
  // Modal state
  setShowTimeSlotSelector: (show: boolean) => void;
  setShowUserRegistration: (show: boolean) => void;
  
  // Lifecycle methods
  initializeForEvent: (event: CalendarEvent) => void;
  initializeForCreate: () => void;
  resetState: () => void;
}

/**
 * Main EventModal state management hook
 * Following the configuration-driven approach from assignment-manager.js
 */
export const useEventModal = ({
  event,
  mode,
  isOpen,
  config: configOverrides = {}
}: UseEventModalProps): UseEventModalReturn => {
  
  // ===== CONFIGURATION (Following assignment-manager.js pattern) =====
  
  const config = useMemo((): EventModalConfig => ({
    // Performance limits from eventConstants
    maxRenderTime: PERFORMANCE_CONFIG.maxRenderTime,
    maxValidationTime: PERFORMANCE_CONFIG.maxValidationTime,
    maxFormInitTime: PERFORMANCE_CONFIG.maxFormInitTime,
    retryLimit: PERFORMANCE_CONFIG.retryLimit,
    
    // Feature flags
    enablePerformanceMonitoring: process.env.NODE_ENV === 'development',
    enableErrorRecovery: true,
    enableUserRegistration: true,
    enableSmartScheduling: true,
    
    // Apply overrides
    ...configOverrides
  }), [configOverrides]);
  
  // ===== STATE MANAGEMENT (Following assignment-manager.js state pattern) =====
  
  const [state, setState] = useState<EventModalState>(() => ({
    // Core form data
    formData: { ...EVENT_MODAL_DEFAULTS },
    
    // UI state
    errors: {},
    saving: false,
    deleting: false,
    showDeleteConfirm: false,
    
    // Performance tracking
    performanceMetrics: {
      renderTime: 0,
      validationTime: 0,
      formInitTime: 0
    },
    
    // Error handling
    componentError: null,
    retryCount: 0,
    hasRecovered: false,
    
    // EventType integration
    selectedEventType: '',
    selectedDuration: undefined,
    
    // Smart scheduling
    showTimeSlotSelector: false,
    
    // User registration
    showUserRegistration: false
  }));
  
  // ===== STATE UPDATE FUNCTIONS =====
  
  const updateFormData = useCallback((updates: Partial<CalendarEvent>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...updates }
    }));
  }, []);
  
  const updateErrors = useCallback((errors: Partial<ValidationErrors>) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, ...errors }
    }));
  }, []);
  
  const updatePerformanceMetrics = useCallback((metrics: Partial<PerformanceMetrics>) => {
    setState(prev => ({
      ...prev,
      performanceMetrics: { ...prev.performanceMetrics, ...metrics }
    }));
  }, []);
  
  // ===== UI STATE HELPERS =====
  
  const setSaving = useCallback((saving: boolean) => {
    setState(prev => ({ ...prev, saving }));
  }, []);
  
  const setDeleting = useCallback((deleting: boolean) => {
    setState(prev => ({ ...prev, deleting }));
  }, []);
  
  const setShowDeleteConfirm = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showDeleteConfirm: show }));
  }, []);
  
  // ===== ERROR MANAGEMENT (Following assignment-manager.js error patterns) =====
  
  const setComponentError = useCallback((error: Error | null) => {
    setState(prev => ({ ...prev, componentError: error }));
  }, []);
  
  const incrementRetryCount = useCallback(() => {
    setState(prev => ({ ...prev, retryCount: prev.retryCount + 1 }));
  }, []);
  
  const setHasRecovered = useCallback((recovered: boolean) => {
    setState(prev => ({ ...prev, hasRecovered: recovered }));
  }, []);
  
  // ===== EVENTTYPE STATE =====
  
  const setSelectedEventType = useCallback((eventType: string) => {
    setState(prev => ({ ...prev, selectedEventType: eventType }));
  }, []);
  
  const setSelectedDuration = useCallback((duration: number | undefined) => {
    setState(prev => ({ ...prev, selectedDuration: duration }));
  }, []);
  
  // ===== MODAL STATE =====
  
  const setShowTimeSlotSelector = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showTimeSlotSelector: show }));
  }, []);
  
  const setShowUserRegistration = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showUserRegistration: show }));
  }, []);
  
  // ===== LIFECYCLE METHODS =====
  
  const initializeForEvent = useCallback((event: CalendarEvent) => {
    const initStartTime = performance.now();
    
    setState(prev => ({
      ...prev,
      formData: {
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
      },
      selectedEventType: event.title || '',
      selectedDuration: event.duration,
      errors: {}
    }));
    
    // Performance tracking
    if (config.enablePerformanceMonitoring) {
      const initTime = performance.now() - initStartTime;
      updatePerformanceMetrics({ formInitTime: initTime });
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`EventModal form initialization time: ${initTime.toFixed(2)}ms`);
      }
    }
  }, [config.enablePerformanceMonitoring, updatePerformanceMetrics]);
  
  const initializeForCreate = useCallback(() => {
    setState(prev => ({
      ...prev,
      formData: { ...EVENT_MODAL_DEFAULTS },
      selectedEventType: '',
      selectedDuration: undefined,
      errors: {}
    }));
  }, []);
  
  const resetState = useCallback(() => {
    setState(prev => ({
      ...prev,
      formData: { ...EVENT_MODAL_DEFAULTS },
      errors: {},
      saving: false,
      deleting: false,
      showDeleteConfirm: false,
      performanceMetrics: {
        renderTime: 0,
        validationTime: 0,
        formInitTime: 0
      },
      componentError: null,
      retryCount: 0,
      hasRecovered: false,
      selectedEventType: '',
      selectedDuration: undefined,
      showTimeSlotSelector: false,
      showUserRegistration: false
    }));
  }, []);
  
  // ===== EFFECTS (Following assignment-manager.js lifecycle patterns) =====
  
  // Initialize based on mode and event
  useEffect(() => {
    if (!isOpen) return;
    
    if (event && mode !== 'create') {
      initializeForEvent(event);
    } else if (mode === 'create') {
      initializeForCreate();
    }
  }, [event, mode, isOpen, initializeForEvent, initializeForCreate]);
  
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);
  
  // Performance monitoring
  useEffect(() => {
    if (config.enablePerformanceMonitoring && isOpen) {
      const startTime = performance.now();
      
      return () => {
        const renderTime = performance.now() - startTime;
        updatePerformanceMetrics({ renderTime });
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`EventModal render time: ${renderTime.toFixed(2)}ms`);
        }
      };
    }
  }, [config.enablePerformanceMonitoring, isOpen, updatePerformanceMetrics]);
  
  return {
    state,
    config,
    updateFormData,
    updateErrors,
    updatePerformanceMetrics,
    setSaving,
    setDeleting,
    setShowDeleteConfirm,
    setComponentError,
    incrementRetryCount,
    setHasRecovered,
    setSelectedEventType,
    setSelectedDuration,
    setShowTimeSlotSelector,
    setShowUserRegistration,
    initializeForEvent,
    initializeForCreate,
    resetState
  };
}; 