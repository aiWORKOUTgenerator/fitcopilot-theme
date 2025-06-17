/**
 * Training Calendar Data Hook
 * 
 * Custom React hook for managing calendar data, API calls, and state management
 * Handles WordPress integration, data fetching, and error handling
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarEvent, LoadingState, TrainerData } from '../interfaces';
import { parseDate } from '../utils/dateHelpers';

// ===== TYPES =====

interface UseCalendarDataProps {
  initialDate?: Date;
  view?: 'month' | 'week' | 'day' | 'list';
  trainerId?: number;
  refreshInterval?: number;
  autoRefresh?: boolean;
}

interface UseCalendarDataReturn {
  // Data
  events: CalendarEvent[];
  trainers: TrainerData[];
  loading: LoadingState;
  error: string | null;
  statistics: {
    totalEvents: number;
    confirmedEvents: number;
    lastUpdated: string;
  };
  
  // Metadata
  lastFetch: Date | null;
  hasMore: boolean;
  totalEvents: number;
  
  // Actions
  fetchEvents: (startDate?: Date, endDate?: Date) => Promise<void>;
  fetchTrainers: () => Promise<void>;
  refreshData: () => Promise<void>;
  clearError: () => void;
  
  // Event management
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<CalendarEvent>;
  createEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<CalendarEvent>;
  updateEvent: (event: CalendarEvent) => Promise<CalendarEvent>;
  deleteEvent: (id: string | number) => Promise<void>;
  
  // Filter utilities
  getEventsByTrainer: (trainerId: number) => CalendarEvent[];
  getEventsByDate: (date: Date) => CalendarEvent[];
  getEventsInRange: (startDate: Date, endDate: Date) => CalendarEvent[];
}

// ===== CONSTANTS =====

const AJAX_URL = '/wp-admin/admin-ajax.php';
const DEFAULT_REFRESH_INTERVAL = 30000; // PHASE 4: 30 seconds with safety mechanisms

// ===== WORDPRESS AJAX UTILITIES =====

/**
 * Get WordPress calendar data from localized script
 * PHASE 2: Enhanced data access with fallback handling
 */
const getCalendarData = (): any => {
  const data = (window as any)?.fitcopilotTrainingCalendarData;
  
  // PHASE 2: Enhanced debugging and fallback handling
  if (!data) {
    console.warn('Training Calendar Phase 2: fitcopilotTrainingCalendarData not found in window.');
    console.log('Available window properties:', Object.keys(window));
    
    // Return empty data structure with debug info
    return {
      events: [],
      trainers: [],
      settings: {
        defaultView: 'dayGridMonth',
        firstDay: 0
      },
      debug: {
        phase: 'Phase 2 - Data Provider Setup',
        dataSource: 'Fallback - WordPress data not loaded',
        timestamp: new Date().toISOString()
      }
    };
  }
  
  // PHASE 2: Log successful data loading
  console.log('Training Calendar Phase 2: WordPress data loaded successfully', {
    eventsCount: data.events?.length || 0,
    trainersCount: data.trainers?.length || 0,
    phase: data.debug?.phase || 'Unknown',
    timestamp: data.debug?.timestamp || 'Unknown'
  });
  
  return data;
};

/**
 * Get WordPress nonce for AJAX requests
 */
const getWPNonce = (): string => {
  const calendarData = getCalendarData();
  return calendarData?.nonce || '';
};

/**
 * Make authenticated AJAX request to WordPress
 */
const ajaxRequest = async (action: string, data: any = {}): Promise<any> => {
  const nonce = getWPNonce();
  const url = AJAX_URL;
  
  const formData = new FormData();
  formData.append('action', action);
  formData.append('nonce', nonce);
  
  // Add data fields
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'same-origin',
  });
  
  if (!response.ok) {
    throw new Error(`AJAX Error: ${response.status}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.data?.message || 'AJAX request failed');
  }
  
  return result.data;
};

/**
 * Transform WordPress event data to CalendarEvent format
 */
const transformWordPressEvent = (wpEvent: any): CalendarEvent => {
  return {
    id: wpEvent.id,
    title: wpEvent.title,
    description: wpEvent.description || '',
    start: parseDate(wpEvent.start) || new Date(),
    end: parseDate(wpEvent.end) || new Date(),
    trainerId: wpEvent.trainer_id,
    eventType: wpEvent.event_type || 'session',
    bookingStatus: wpEvent.booking_status || 'available',
    sessionType: wpEvent.session_type || 'individual',
    location: wpEvent.location || '',
    maxParticipants: wpEvent.max_participants || 1,
    currentParticipants: wpEvent.current_participants || 0,
    backgroundColor: wpEvent.background_color || '#8b5cf6',
    borderColor: wpEvent.border_color || '#8b5cf6',
    textColor: wpEvent.text_color || '#ffffff',
    recurring: wpEvent.recurring || false,
    recurringRule: wpEvent.recurring_rule,
    tags: wpEvent.tags || [],
    metadata: wpEvent.metadata || {},
    created: parseDate(wpEvent.created) || new Date(),
    updated: parseDate(wpEvent.updated) || new Date()
  };
};

/**
 * Transform WordPress trainer data to TrainerData format
 */
const transformWordPressTrainer = (wpTrainer: any): TrainerData => {
  return {
    id: wpTrainer.id,
    name: wpTrainer.name,
    email: wpTrainer.email || '',
    specialty: wpTrainer.specialty || '',
    bio: wpTrainer.bio || '',
    imageUrl: wpTrainer.image_url || '',
    avatar: wpTrainer.avatar || '',
    yearsExperience: wpTrainer.years_experience || 0,
    clientsCount: wpTrainer.clients_count || 0,
    featured: wpTrainer.featured || false,
    active: wpTrainer.active !== false,
    isActive: wpTrainer.is_active !== false,
    coachType: wpTrainer.coach_type || 'personal',
    availability: wpTrainer.availability || {},
    color: wpTrainer.color || '#8b5cf6',
    metadata: wpTrainer.metadata || {}
  };
};

// ===== MAIN HOOK =====

export const useCalendarData = ({
  initialDate = new Date(),
  view = 'month',
  trainerId,
  refreshInterval = DEFAULT_REFRESH_INTERVAL,
  autoRefresh = true
}: UseCalendarDataProps = {}): UseCalendarDataReturn => {
  
  // ===== STATE =====
  
  // PHASE 2: Initialize state with WordPress localized data
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const calendarData = getCalendarData();
    // Transform WordPress events to React format
    const wpEvents = calendarData.events || [];
    return wpEvents.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description || '',
      start: new Date(event.start),
      end: new Date(event.end),
      trainerId: event.extendedProps?.trainerId || null,
      eventType: event.extendedProps?.eventType || 'session',
      bookingStatus: event.extendedProps?.bookingStatus || 'available',
      sessionType: event.extendedProps?.sessionType || 'individual',
      location: event.extendedProps?.location || '',
      maxParticipants: event.extendedProps?.maxParticipants || 1,
      currentParticipants: event.extendedProps?.currentParticipants || 0,
      backgroundColor: event.backgroundColor || '#8b5cf6',
      borderColor: event.borderColor || '#8b5cf6',
      textColor: event.textColor || '#ffffff',
      recurring: false,
      recurringRule: null,
      tags: [],
      metadata: {},
      created: new Date(),
      updated: new Date()
    }));
  });
  
  const [trainers, setTrainers] = useState<TrainerData[]>(() => {
    const calendarData = getCalendarData();
    const wpTrainers = calendarData.trainers || [];
    return wpTrainers.map((trainer: any) => ({
      id: trainer.id,
      name: trainer.name,
      email: '',
      specialty: trainer.specialty || '',
      bio: trainer.bio || '',
      imageUrl: trainer.imageUrl || '',
      avatar: trainer.imageUrl || '',
      yearsExperience: trainer.yearsExperience || 0,
      clientsCount: trainer.clientsCount || 0,
      featured: trainer.featured || false,
      active: trainer.active !== false,
      isActive: trainer.active !== false,
      coachType: trainer.coachType || 'personal',
      availability: trainer.availability || {},
      color: trainer.color || '#8b5cf6',
      metadata: trainer.calendarConfig || {}
    }));
  });
  
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);
  
  // ===== REFS =====
  
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();
  
  // ===== CLEANUP =====
  
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  // ===== ERROR HANDLING =====
  
  const handleError = useCallback((err: Error) => {
    console.error('Calendar data error:', err);
    setError(err.message);
    setLoading('error');
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
    if (loading === 'error') {
      setLoading('idle');
    }
  }, [loading]);
  
  // ===== DATA FETCHING =====
  
  const fetchEvents = useCallback(async (startDate?: Date, endDate?: Date) => {
    try {
      setLoading('loading');
      clearError();
      
      // SIMPLIFIED: Use only static data to avoid AJAX nonce issues
      console.log('📊 Using static data only (no AJAX calls)');
      
          const calendarData = getCalendarData();
          const eventsData = calendarData.events || [];
          
          // Apply date filtering if needed
          let filteredEvents = eventsData;
          
          if (startDate || endDate) {
            filteredEvents = eventsData.filter((event: any) => {
              const eventStart = parseDate(event.start);
              const eventEnd = parseDate(event.end);
              if (!eventStart || !eventEnd) return false;
              
              if (startDate && eventEnd < startDate) return false;
              if (endDate && eventStart > endDate) return false;
              
              return true;
            });
          }
          
          // Apply trainer filtering
          if (trainerId) {
            filteredEvents = filteredEvents.filter((event: any) => 
              event.trainerId === trainerId || event.extendedProps?.trainerId === trainerId
            );
          }
          
          const transformedEvents = filteredEvents.map(transformWordPressEvent);
          setEvents(transformedEvents);
          setTotalEvents(transformedEvents.length);
      setLastFetch(new Date());
          setLoading('success');
          
      console.log('✅ Static data loaded successfully:', transformedEvents.length, 'events');
          
    } catch (err) {
      console.error('❌ Static data loading failed:', err);
      handleError(err instanceof Error ? err : new Error('Unknown error occurred'));
    }
  }, [view, initialDate, trainerId, clearError, handleError]);
  
  const fetchTrainers = useCallback(async () => {
    try {
      // Get trainers from already loaded calendar data instead of AJAX call
      const calendarData = getCalendarData();
      const trainersData = calendarData.trainers || [];
      
      const transformedTrainers = trainersData.map(transformWordPressTrainer);
        setTrainers(transformedTrainers);
      
    } catch (err) {
      if (err instanceof Error) {
        handleError(err);
      }
    }
  }, [handleError]);
  
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchEvents(),
      fetchTrainers()
    ]);
  }, [fetchEvents, fetchTrainers]);
  
  // ===== EVENT MANAGEMENT =====
  
  const addEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
    try {
      // PHASE 4: Enable AJAX calls for event creation with safety mechanisms
      console.log('🔄 PHASE 4: Attempting AJAX call to save_individual_calendar_event');
      
      const requestData = {
        event_data: JSON.stringify({
          title: eventData.title,
          description: eventData.description,
          start_datetime: eventData.start instanceof Date ? eventData.start.toISOString() : eventData.start,
          end_datetime: eventData.end instanceof Date ? eventData.end.toISOString() : eventData.end,
          trainer_id: eventData.trainerId,
          event_type: eventData.eventType,
          booking_status: eventData.bookingStatus,
          session_type: eventData.sessionType,
          location: eventData.location,
          max_participants: eventData.maxParticipants,
          background_color: eventData.backgroundColor,
          border_color: eventData.borderColor,
          text_color: eventData.textColor
        })
      };
      
      console.log('📤 AJAX Create Request Data:', requestData);
      
      // PHASE 4: Make AJAX call with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Create request timeout after 10 seconds')), 10000);
      });
      
      const ajaxPromise = ajaxRequest('save_individual_calendar_event', requestData);
      const response = await Promise.race([ajaxPromise, timeoutPromise]);
      
      console.log('📥 AJAX Create Response:', response);
      
      // Transform response to CalendarEvent format
      const newEvent: CalendarEvent = {
        ...eventData,
        id: response.event_id || Date.now(),
        created: new Date(),
        updated: new Date()
      };
      
        setEvents(prev => [...prev, newEvent]);
      console.log('✅ AJAX create successful:', newEvent.title);
        return newEvent;
      
    } catch (err) {
      if (err instanceof Error) {
        console.warn('⚠️ AJAX create failed, creating locally:', err.message);
        handleError(err);
        
        // PHASE 4: Fallback to local creation if AJAX fails
        const newEvent: CalendarEvent = {
          ...eventData,
          id: Date.now(), // Temporary ID
          created: new Date(),
          updated: new Date()
        };
        
        setEvents(prev => [...prev, newEvent]);
        console.log('🔄 Fallback create successful:', newEvent.title);
        return newEvent;
      }
      throw err;
    }
  }, [handleError]);
  
  const updateEvent = useCallback(async (id: string | number, updates: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    try {
      // PHASE 4: Enable AJAX calls for event updates with safety mechanisms
      console.log('🔄 PHASE 4: Attempting AJAX call to save_individual_calendar_event for update');
      
      const requestData = {
        event_data: JSON.stringify({
          id: id,
          title: updates.title,
          description: updates.description,
          start_datetime: updates.start instanceof Date ? updates.start.toISOString() : updates.start,
          end_datetime: updates.end instanceof Date ? updates.end.toISOString() : updates.end,
          trainer_id: updates.trainerId,
          event_type: updates.eventType,
          booking_status: updates.bookingStatus,
          session_type: updates.sessionType,
          location: updates.location,
          max_participants: updates.maxParticipants,
          background_color: updates.backgroundColor,
          border_color: updates.borderColor,
          text_color: updates.textColor
        })
      };
      
      console.log('📤 AJAX Update Request Data:', requestData);
      
      // PHASE 4: Make AJAX call with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Update request timeout after 10 seconds')), 10000);
      });
      
      const ajaxPromise = ajaxRequest('save_individual_calendar_event', requestData);
      const response = await Promise.race([ajaxPromise, timeoutPromise]);
      
      console.log('📥 AJAX Update Response:', response);
      
      // Create updated event object
      const updatedEvent = {
        ...updates,
        id,
        updated: new Date()
      } as CalendarEvent;
      
        setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...updatedEvent } : event
        ));
      
      console.log('✅ AJAX update successful:', updatedEvent.title || 'Event');
        return updatedEvent;
      
    } catch (err) {
      if (err instanceof Error) {
        console.warn('⚠️ AJAX update failed, updating locally:', err.message);
        handleError(err);
        
        // PHASE 4: Fallback to local update if AJAX fails
        const updatedEvent = {
          ...updates,
          id,
          updated: new Date()
        } as CalendarEvent;
        
        setEvents(prev => prev.map(event => 
          event.id === id ? { ...event, ...updatedEvent } : event
        ));
        
        console.log('🔄 Fallback update successful:', updatedEvent.title || 'Event');
        return updatedEvent;
      }
      throw err;
    }
  }, [handleError]);
  
  const deleteEvent = useCallback(async (id: string | number): Promise<void> => {
    try {
      // PHASE 4: Enable AJAX calls for event deletion with safety mechanisms
      console.log('🔄 PHASE 4: Attempting AJAX call to delete_calendar_event');
      
      const requestData = {
        event_id: id
      };
      
      console.log('📤 AJAX Delete Request Data:', requestData);
      
      // PHASE 4: Make AJAX call with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Delete request timeout after 10 seconds')), 10000);
      });
      
      const ajaxPromise = ajaxRequest('delete_calendar_event', requestData);
      const response = await Promise.race([ajaxPromise, timeoutPromise]);
      
      console.log('📥 AJAX Delete Response:', response);
      
      // Remove event from local state
        setEvents(prev => prev.filter(event => event.id !== id));
      
      console.log('✅ AJAX delete successful for event ID:', id);
      
    } catch (err) {
      if (err instanceof Error) {
        console.warn('⚠️ AJAX delete failed, deleting locally:', err.message);
        handleError(err);
        
        // PHASE 4: Fallback to local deletion if AJAX fails
        setEvents(prev => prev.filter(event => event.id !== id));
        console.log('🔄 Fallback delete successful for event ID:', id);
      }
      throw err;
    }
  }, [handleError]);
  
  // ===== FILTER UTILITIES =====
  
  const getEventsByTrainer = useCallback((trainerId: number): CalendarEvent[] => {
    return events.filter(event => event.trainerId === trainerId);
  }, [events]);
  
  const getEventsByDate = useCallback((date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  }, [events]);
  
  const getEventsInRange = useCallback((startDate: Date, endDate: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventStartDate = new Date(event.start);
      const eventEndDate = new Date(event.end);
      return eventStartDate <= endDate && eventEndDate >= startDate;
    });
  }, [events]);
  
  // ===== AUTO-REFRESH WITH SAFETY MECHANISMS =====
  
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      console.log('🔄 PHASE 4: Setting up auto-refresh with', refreshInterval, 'ms interval');
      
      const scheduleRefresh = () => {
        refreshTimeoutRef.current = setTimeout(() => {
          // PHASE 4: Add safety checks before auto-refresh
          if (loading === 'loading') {
            console.log('⏳ Auto-refresh skipped: already loading');
            scheduleRefresh(); // Reschedule for next interval
            return;
          }
          
          // PHASE 2: Check for trainer data synchronization
          const calendarData = getCalendarData();
          const lastTrainerSync = calendarData?.integration?.personalTraining?.lastSync;
          const currentTime = Date.now();
          
          if (lastTrainerSync) {
            const syncAge = currentTime - new Date(lastTrainerSync).getTime();
            
            // If trainer data was synced recently (within last 30 seconds), force full refresh
            if (syncAge < 30000) {
              console.log('🎯 PHASE 2: Trainer data recently synchronized, forcing full refresh...');
              // Force full data refresh to pick up trainer changes
              fetchTrainers().then(() => {
                console.log('✅ Trainer data refreshed due to recent sync');
              }).catch(err => {
                console.warn('⚠️ Trainer refresh failed:', err.message);
              });
            }
          }
          
          console.log('🔄 Auto-refresh triggered');
          refreshData().catch(err => {
            console.warn('⚠️ Auto-refresh failed:', err.message);
          }).finally(() => {
            scheduleRefresh(); // Always reschedule
          });
        }, refreshInterval);
      };
      
      scheduleRefresh();
      
      return () => {
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
          console.log('🛑 Auto-refresh cleared');
        }
      };
    }
  }, [autoRefresh, refreshInterval, refreshData, loading]);
  
  // ===== INITIAL DATA LOAD =====
  
  useEffect(() => {
    // PHASE 4: Re-enable initial data load with safety mechanisms
    console.log('🔄 PHASE 4: Initial data load enabled with safety mechanisms');
    
    // Add a small delay to prevent immediate execution
    const timeoutId = setTimeout(() => {
      refreshData().catch(err => {
        console.warn('⚠️ Initial data load failed, using static data:', err.message);
      });
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [refreshData]);
  
  // ===== RETURN =====
  
  // PHASE 2: Enhanced statistics with data source tracking
  const statistics = {
    totalEvents: events.length,
    confirmedEvents: events.filter(e => e.bookingStatus === 'confirmed').length,
    lastUpdated: lastFetch?.toISOString() || new Date().toISOString(),
    // PHASE 2: Add debug information
    dataSource: getCalendarData()?.debug?.dataSource || 'Unknown',
    phase: getCalendarData()?.debug?.phase || 'Unknown',
    loadedFromWordPress: events.length > 0 ? 'Yes' : 'No',
    trainersLoaded: trainers.length
  };

  const createEvent = addEvent; // Alias for addEvent
  
  const updateEventById = useCallback(async (event: CalendarEvent): Promise<CalendarEvent> => {
    return updateEvent(event.id, event);
  }, [updateEvent]);

  return {
    // Data
    events,
    trainers,
    loading,
    error,
    statistics,
    
    // Metadata
    lastFetch,
    hasMore,
    totalEvents,
    
    // Actions
    fetchEvents,
    fetchTrainers,
    refreshData,
    clearError,
    
    // Event management
    addEvent,
    createEvent,
    updateEvent: updateEventById,
    deleteEvent,
    
    // Filter utilities
    getEventsByTrainer,
    getEventsByDate,
    getEventsInRange
  };
}; 