/**
 * Trainer Availability Hook
 * 
 * Custom React hook for managing trainer availability state and API calls
 * Integrates with the smart scheduling system
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AvailableTimeSlot, SchedulingPreference, SchedulingResult } from '../components/EventModal/Events/EventType/EventTypeInterfaces';
import { trainerApiService } from '../services/trainerApi';

/**
 * Hook state interface
 */
interface UseTrainerAvailabilityState {
  /** Current scheduling result */
  schedulingResult: SchedulingResult | null;
  
  /** Loading state */
  loading: boolean;
  
  /** Error state */
  error: string | null;
  
  /** Currently selected time slot */
  selectedSlot: AvailableTimeSlot | null;
  
  /** Last search parameters for retry */
  lastSearchParams: {
    date?: Date;
    eventType?: string;
    duration?: number;
    preferences?: SchedulingPreference;
  } | null;
}

/**
 * Hook return interface
 */
interface UseTrainerAvailabilityReturn extends UseTrainerAvailabilityState {
  /** Find available time slots */
  findAvailableSlots: (
    date: Date,
    eventType: string,
    duration?: number,
    preferences?: SchedulingPreference
  ) => Promise<void>;
  
  /** Clear current results */
  clearResults: () => void;
  
  /** Retry last search */
  retryLastSearch: () => Promise<void>;
  
  /** Select a time slot */
  selectSlot: (slot: AvailableTimeSlot) => void;
  
  /** Clear selected slot */
  clearSelectedSlot: () => void;
  
  /** Check if a slot is selected */
  isSlotSelected: (slot: AvailableTimeSlot) => boolean;
  
  /** Get API health status */
  getApiHealth: () => Promise<{ healthy: boolean; responseTime: number; error?: string }>;
}

/**
 * Trainer Availability Hook
 * 
 * Provides state management and API integration for trainer availability
 */
export const useTrainerAvailability = (): UseTrainerAvailabilityReturn => {
  
  // ===== STATE =====
  
  const [state, setState] = useState<UseTrainerAvailabilityState>({
    schedulingResult: null,
    loading: false,
    error: null,
    selectedSlot: null,
    lastSearchParams: null
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // ===== CLEANUP =====
  
  useEffect(() => {
    return () => {
      // Cancel any pending requests on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Cancel any pending API requests
      trainerApiService.cancelPendingRequests();
    };
  }, []);
  
  // ===== API METHODS =====
  
  const findAvailableSlots = useCallback(async (
    date: Date,
    eventType: string,
    duration?: number,
    preferences?: SchedulingPreference
  ): Promise<void> => {
    try {
      // Cancel any existing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new abort controller
      abortControllerRef.current = new AbortController();
      
      // Update loading state
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        lastSearchParams: { date, eventType, duration, preferences }
      }));
      
      // Log search initiation
      if (process.env.NODE_ENV === 'development') {
        logger.info('🔍 Searching for trainer availability:', {
          date: date.toLocaleDateString(),
          eventType,
          duration,
          preferences
        });
      }
      
      let result: SchedulingResult;
      
      if (preferences) {
        // Use preferences-aware search
        result = await trainerApiService.findAvailableSlotsWithPreferences(
          date,
          eventType,
          duration || 30,
          preferences
        );
      } else {
        // Use basic search
        result = await trainerApiService.getTrainerAvailabilityWithRetry(
          date,
          eventType,
          duration
        );
      }
      
      // Check if component is still mounted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      // Update state with results
      setState(prev => ({
        ...prev,
        loading: false,
        schedulingResult: result,
        error: result.success ? null : result.error || 'Failed to load availability'
      }));
      
      // Log results
      if (process.env.NODE_ENV === 'development') {
        logger.info('✅ Trainer availability results:', {
          success: result.success,
          slotsFound: result.availableSlots.length,
          hasRecommendation: !!result.recommendedSlot,
          performanceMs: result.metadata.performanceMs
        });
      }
      
    } catch (error) {
      // Check if error was due to cancellation
      if (error instanceof Error && error.message.includes('cancelled')) {
        logger.info('Trainer availability search was cancelled');
        return;
      }
      
      logger.error('Error finding trainer availability:', error);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load trainer availability',
        schedulingResult: null
      }));
    }
  }, []);
  
  const retryLastSearch = useCallback(async (): Promise<void> => {
    if (!state.lastSearchParams) {
      logger.warn('No previous search to retry');
      return;
    }
    
    const { date, eventType, duration, preferences } = state.lastSearchParams;
    
    if (date && eventType) {
      await findAvailableSlots(date, eventType, duration, preferences);
    }
  }, [state.lastSearchParams, findAvailableSlots]);
  
  const getApiHealth = useCallback(async () => {
    return trainerApiService.getApiHealthStatus();
  }, []);
  
  // ===== STATE MANAGEMENT =====
  
  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      schedulingResult: null,
      error: null,
      selectedSlot: null,
      lastSearchParams: null
    }));
  }, []);
  
  const selectSlot = useCallback((slot: AvailableTimeSlot) => {
    setState(prev => ({
      ...prev,
      selectedSlot: slot
    }));
    
    if (process.env.NODE_ENV === 'development') {
      logger.info('📅 Time slot selected:', {
        time: `${slot.startTime.toLocaleTimeString()} - ${slot.endTime.toLocaleTimeString()}`,
        trainer: slot.trainerName,
        status: slot.status,
        price: slot.price
      });
    }
  }, []);
  
  const clearSelectedSlot = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedSlot: null
    }));
  }, []);
  
  const isSlotSelected = useCallback((slot: AvailableTimeSlot): boolean => {
    if (!state.selectedSlot) return false;
    
    return (
      state.selectedSlot.startTime.getTime() === slot.startTime.getTime() &&
      state.selectedSlot.trainerId === slot.trainerId
    );
  }, [state.selectedSlot]);
  
  // ===== RETURN =====
  
  return {
    ...state,
    findAvailableSlots,
    clearResults,
    retryLastSearch,
    selectSlot,
    clearSelectedSlot,
    isSlotSelected,
    getApiHealth
  };
};

/**
 * Hook for simple availability checking without full state management
 */
export const useSimpleTrainerAvailability = () => {
  const [loading, setLoading] = useState(false);
  
  const checkAvailability = useCallback(async (
    date: Date,
    eventType: string,
    duration?: number
  ): Promise<SchedulingResult> => {
    setLoading(true);
    
    try {
      const result = await trainerApiService.getTrainerAvailabilityWithRetry(
        date,
        eventType,
        duration
      );
      
      return result;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    checkAvailability
  };
}; 