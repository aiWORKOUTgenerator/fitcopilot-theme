/**
 * Training Calendar Component
 * 
 * Complete FullCalendar implementation with WordPress integration
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { Calendar as CalendarIcon } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Component imports
import { BookingConfirmation } from './components/BookingConfirmation';
import CalendarView from './components/CalendarView/CalendarView';
import EventModal from './components/EventModal/EventModal';

// Hook imports
import { useCalendarData } from './hooks/useCalendarData';

// Type imports
import { CalendarEvent, CalendarSettings, CalendarView as CalendarViewType } from './interfaces';

import './TrainingCalendar.scss';

export interface TrainingCalendarProps {
  /** Initial view type */
  initialView?: CalendarViewType;
  /** Calendar height */
  height?: number | 'auto';
  /** Context for display */
  context?: 'homepage' | 'fullpage' | 'widget';
  /** Custom CSS classes */
  className?: string;
}

/**
 * Event Modal State Interface
 */
interface EventModalState {
  isOpen: boolean;
  event: CalendarEvent | null;
  mode: 'view' | 'edit' | 'create';
  selectedDate?: Date; // Date selected from calendar for new events
}

/**
 * Training Calendar Component
 */
export const TrainingCalendar: React.FC<TrainingCalendarProps> = ({
  initialView = 'dayGridMonth',
  height = 'auto',
  context = 'homepage',
  className = ''
}) => {
  
  // ===== STATE =====
  
  const [currentView, setCurrentView] = useState<CalendarViewType>(initialView);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Modal state management
  const [modalState, setModalState] = useState<EventModalState>({
    isOpen: false,
    event: null,
    mode: 'view',
    selectedDate: undefined
  });
  
  // ===== HOOKS =====

  // Calendar data management with CRUD operations
  const {
    events,
    trainers,
    statistics,
    loading,
    error,
    recentBooking,
    bookingConfirmationVisible,
    updateEvent,
    deleteEvent,
    createEvent,
    refreshData,
    clearBookingConfirmation
  } = useCalendarData();

  // ===== DATA TRANSFORMATION =====
  
  // Get WordPress calendar data
  const wordpressData = useMemo(() => {
    if (typeof window !== 'undefined') {
      console.log('🔍 TrainingCalendar: Checking window data...');
      console.log('🔍 window.fitcopilotTrainingCalendarData:', (window as any)?.fitcopilotTrainingCalendarData);
      console.log('🔍 All window.fitcopilot* keys:', Object.keys(window).filter(key => key.includes('fitcopilot')));
      
      const data = (window as any)?.fitcopilotTrainingCalendarData || {};
      console.log('🔍 Using data:', data);
      console.log('🔍 Trainers in data:', data.trainers);
      
      return data;
    }
    return {};
  }, []);

  // Transform WordPress settings to CalendarSettings format
  const calendarSettings: CalendarSettings = useMemo(() => {
    const wpSettings = wordpressData.settings || {};
    
    return {
      defaultView: (wpSettings.defaultView || initialView) as CalendarViewType,
      firstDay: wpSettings.firstDay || 0,
      timeFormat: wpSettings.timeFormat || 'h:mm a',
      dateFormat: wpSettings.dateFormat || 'MMM d, yyyy',
      slotDuration: wpSettings.slotDuration || '00:30:00',
      businessHours: wpSettings.businessHours || {
        start: '09:00',
        end: '17:00'
      },
      weekendEnabled: wpSettings.weekendEnabled || false,
      emailNotifications: wpSettings.emailNotifications || true,
      calendarColors: wpSettings.calendarColors || {
        session: '#4CAF50',
        availability: '#2196F3', 
        blocked: '#F44336',
        group_class: '#FF9800',
        workshop: '#9C27B0',
        assessment: '#00BCD4'
      },
      bookingSettings: wpSettings.bookingSettings || {
        advanceDays: 30,
        noticeHours: 24,
        autoConfirm: false
      }
    };
  }, [wordpressData.settings, initialView]);

  // Transform WordPress events to CalendarEvent format using the proper transformation function
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    console.log('🔄 TrainingCalendar: Transforming events...');
    console.log('🔄 WordPress events data:', wordpressData.events);
    console.log('🔄 Hook events data:', events);
    
    // Prioritize WordPress data over hook data for consistency
    const wpEvents = wordpressData.events || events || [];
    console.log('🔄 Using events:', wpEvents);
    console.log('🔄 Event count:', wpEvents.length);
    
    if (wpEvents.length > 0) {
      console.log('🔄 Sample event structure:', wpEvents[0]);
    }
    
    const transformedEvents = wpEvents.map((event: any) => {
      // Enhanced transformation with better data handling
      const transformedEvent = {
        id: event.id || event.event_id || `temp-${Date.now()}-${Math.random()}`,
        title: event.title || 'Untitled Event',
      description: event.description || '',
        start: event.start || event.start_datetime || new Date().toISOString(),
        end: event.end || event.end_datetime || new Date().toISOString(),
        trainerId: event.trainerId || event.trainer_id || event.trainer || null,
        eventType: event.eventType || event.event_type || event.type || 'session',
        bookingStatus: event.bookingStatus || event.booking_status || event.status || 'available',
      sessionType: event.sessionType || event.session_type || 'individual',
        location: event.location || 'Online',
      maxParticipants: event.maxParticipants || event.max_participants || 1,
      currentParticipants: event.currentParticipants || event.current_participants || 0,
        backgroundColor: event.backgroundColor || event.background_color || '#8b5cf6',
        borderColor: event.borderColor || event.border_color || '#8b5cf6',
      textColor: event.textColor || event.text_color || '#ffffff',
        price: event.price || 0,
      currency: event.currency || 'USD',
        zoomLink: event.zoomLink || event.zoom_link || '',
        specialInstructions: event.specialInstructions || event.special_instructions || ''
      };
      
      console.log('🔄 Transformed event:', { 
        original: { id: event.id, title: event.title }, 
        transformed: { id: transformedEvent.id, title: transformedEvent.title }
      });
      
      return transformedEvent;
    });
    
    console.log('🔄 Final transformed events:', transformedEvents.length, 'events');
    return transformedEvents;
  }, [wordpressData.events, events]);

  // REMOVED: All trainer data processing - no longer needed

  // ===== MODAL HANDLERS =====
  
  // Add debugging effect to track modal state changes
  useEffect(() => {
    console.log('🔍 MODAL STATE CHANGED:', modalState);
    if (modalState.isOpen) {
      console.log('✅ Modal should be visible now');
    } else {
      console.log('❌ Modal should be hidden now');
    }
  }, [modalState]);
  
  const openEventModal = useCallback((event: CalendarEvent | null, mode: 'view' | 'edit' | 'create', selectedDate?: Date) => {
    console.log('🚀 openEventModal CALLED with:', {
      event: event ? { id: event.id, title: event.title } : null,
      mode,
      selectedDate
    });
    console.log('🚀 Current modal state before change:', modalState);
    
    setModalState({
      isOpen: true,
      event,
      mode,
      selectedDate
    });
    
    console.log('🚀 setModalState called - modal should now be open');
    
    // Force a re-render check
    setTimeout(() => {
      console.log('🚀 Modal state after 100ms:', modalState);
    }, 100);
  }, [modalState]);
  
  const closeEventModal = useCallback(() => {
    setModalState({
      isOpen: false,
      event: null,
      mode: 'view',
      selectedDate: undefined
    });
  }, []);
  
  const handleModalModeChange = useCallback((mode: 'view' | 'edit' | 'create') => {
    setModalState(prev => ({
      ...prev,
      mode
    }));
  }, []);
  
  const handleEventSave = useCallback(async (eventData: Partial<CalendarEvent>) => {
    try {
      if (modalState.mode === 'create') {
        // Create new event
        await createEvent(eventData as Omit<CalendarEvent, 'id'>);
        console.log('✅ Event created successfully');
      } else if (modalState.mode === 'edit' && modalState.event) {
        // Update existing event
        const updatedEvent = { ...modalState.event, ...eventData };
        await updateEvent(updatedEvent);
        console.log('✅ Event updated successfully');
      }
      
      // Refresh calendar data to show changes
      await refreshData();
      
      // Close modal
      closeEventModal();
    } catch (error) {
      console.error('❌ Error saving event:', error);
      // Error is already handled by the hooks, just log it
    }
  }, [modalState, createEvent, updateEvent, refreshData, closeEventModal]);
  
  const handleEventDelete = useCallback(async (eventId: string | number) => {
    try {
      await deleteEvent(eventId);
      console.log('✅ Event deleted successfully');
      
      // Refresh calendar data to remove deleted event
      await refreshData();
      
      // Close modal
      closeEventModal();
    } catch (error) {
      console.error('❌ Error deleting event:', error);
      // Error is already handled by the hooks, just log it
    }
  }, [deleteEvent, refreshData, closeEventModal]);

  // ===== CALENDAR EVENT HANDLERS =====
  
  const handleEventClick = useCallback((eventInfo: any) => {
    try {
      console.log('🔥 EVENT CLICK DEBUG START 🔥');
      console.log('📅 Full eventInfo structure:', eventInfo);
      
      // Handle both direct event object and FullCalendar clickInfo structure
      const event = eventInfo?.event || eventInfo;
      console.log('📅 Event object:', event);
      console.log('📅 Event clicked:', event?.title || 'Unknown event');
      console.log('📅 Event extendedProps:', event?.extendedProps);
      
      // Safely extract event ID
      const eventId = event?.id;
      console.log('🆔 Extracted event ID:', eventId, typeof eventId);
      
      if (!eventId) {
        console.warn('⚠️ No event ID found in eventInfo:', eventInfo);
        return;
      }
      
      // Debug available calendar events
      console.log('📊 Available calendar events:', calendarEvents.length);
      console.log('📊 Calendar events IDs:', calendarEvents.map(e => ({ id: e.id, type: typeof e.id, title: e.title })));
      
      // Find the corresponding calendar event with enhanced matching
      console.log('🔍 Looking for event with ID:', eventId, 'Type:', typeof eventId);
      console.log('🔍 Available calendar events for matching:');
      calendarEvents.forEach((event, index) => {
        console.log(`  ${index}: ID=${event.id} (${typeof event.id}), Title=${event.title}`);
      });
      
      const calendarEvent = calendarEvents.find(event => {
        const eventIdStr = event.id.toString();
        const searchIdStr = eventId.toString();
        const matches = eventIdStr === searchIdStr;
        console.log(`🔍 Comparing: "${eventIdStr}" === "${searchIdStr}" = ${matches}`);
        return matches;
      });
      
      console.log('🔍 Found calendar event:', calendarEvent ? {
        id: calendarEvent.id,
        title: calendarEvent.title,
        eventType: calendarEvent.eventType
      } : null);
      
      if (calendarEvent) {
        console.log('✅ Found calendar event:', calendarEvent);
        console.log('🚀 About to open modal with event:', calendarEvent.title);
        
        // Open event in view mode
        openEventModal(calendarEvent, 'view');
        
        console.log('🚀 openEventModal called successfully');
        
      } else {
        // Enhanced fallback: Create event from FullCalendar data
        console.log('⚠️ Event not found in calendar data, creating from FullCalendar event');
        
        const fallbackEvent = {
          id: event?.id || 'unknown',
          title: event?.title || 'Unknown Event',
          description: event?.extendedProps?.description || '',
          start: event?.start ? event.start.toISOString() : new Date().toISOString(),
          end: event?.end ? event.end.toISOString() : new Date().toISOString(),
          trainerId: event?.extendedProps?.trainerId || null,
          eventType: event?.extendedProps?.eventType || 'session',
          bookingStatus: event?.extendedProps?.bookingStatus || 'available',
          sessionType: event?.extendedProps?.sessionType || 'individual',
          location: event?.extendedProps?.location || 'Online',
          maxParticipants: event?.extendedProps?.maxParticipants || 1,
          currentParticipants: event?.extendedProps?.currentParticipants || 0,
          backgroundColor: event?.backgroundColor || '#8b5cf6',
          borderColor: event?.borderColor || '#8b5cf6',
          textColor: event?.textColor || '#ffffff'
        };
        
        console.log('✅ Created fallback event:', fallbackEvent);
        openEventModal(fallbackEvent, 'view');
      }
      
      console.log('🔥 EVENT CLICK DEBUG END 🔥');
      
    } catch (error) {
      console.error('❌ Error in handleEventClick:', error);
      console.error('EventInfo that caused error:', eventInfo);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    }
  }, [calendarEvents, openEventModal]);

  const handleDateSelect = useCallback((selectInfo: any) => {
    console.log('📅 Date selected for new event:', selectInfo.startStr);
    
    // Create a new event template
    // REMOVED: defaultTrainerId - no longer using trainers
    
    const newEventTemplate: Partial<CalendarEvent> = {
      title: '',
      description: '',
      start: selectInfo.start.toISOString(),
      end: selectInfo.end.toISOString(),
      trainerId: undefined, // REMOVED: No longer using trainers
      eventType: 'session',
      bookingStatus: 'available',
      sessionType: 'individual',
      location: '',
      maxParticipants: 1,
      currentParticipants: 0,
      price: 0,
      currency: 'USD'
    };
    
    // Open modal in create mode with selected date
    openEventModal(newEventTemplate as CalendarEvent, 'create', selectInfo.start);
  }, [openEventModal]); // REMOVED: calendarTrainers dependency

  const handleEventDrop = useCallback(async (dropInfo: any) => {
    console.log('📅 Event dropped:', dropInfo.event.title);
    
    try {
      // Find the corresponding calendar event
      const eventId = dropInfo.event.id;
      const calendarEvent = calendarEvents.find(event => 
        event.id.toString() === eventId.toString()
      );
      
      if (calendarEvent) {
        // Update event with new dates
        const updatedEvent = {
          ...calendarEvent,
          start: dropInfo.event.start.toISOString(),
          end: dropInfo.event.end.toISOString()
        };
        
        await updateEvent(updatedEvent);
        console.log('✅ Event moved successfully');
        
        // Refresh calendar data
        await refreshData();
      }
    } catch (error) {
      console.error('❌ Error moving event:', error);
      // Revert the move
      dropInfo.revert();
    }
  }, [calendarEvents, updateEvent, refreshData]);

  const handleEventResize = useCallback(async (resizeInfo: any) => {
    console.log('📅 Event resized:', resizeInfo.event.title);
    
    try {
      // Find the corresponding calendar event
      const eventId = resizeInfo.event.id;
      const calendarEvent = calendarEvents.find(event => 
        event.id.toString() === eventId.toString()
      );
      
      if (calendarEvent) {
        // Update event with new end time
        const updatedEvent = {
          ...calendarEvent,
          start: resizeInfo.event.start.toISOString(),
          end: resizeInfo.event.end.toISOString()
        };
        
        await updateEvent(updatedEvent);
        console.log('✅ Event resized successfully');
        
        // Refresh calendar data
        await refreshData();
      }
    } catch (error) {
      console.error('❌ Error resizing event:', error);
      // Revert the resize
      resizeInfo.revert();
    }
  }, [calendarEvents, updateEvent, refreshData]);

  const handleViewChange = useCallback((view: CalendarViewType) => {
    setCurrentView(view);
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  // ===== LOADING STATE =====
  
  // Only show loading spinner when actively loading, not when idle
  const isLoading = loading === 'loading';
  
  if (isLoading) {
    return (
      <div className={`training-calendar training-calendar--loading ${className}`}>
        <div className="training-calendar__header">
          <CalendarIcon className="training-calendar__icon" size={24} />
          <h3 className="training-calendar__title">Training Calendar</h3>
        </div>
        <div className="training-calendar__loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Loading calendar events...</span>
          </div>
        </div>
      </div>
    );
  }

  // ===== ERROR STATE =====
  
  if (error) {
    return (
      <div className={`training-calendar training-calendar--error ${className}`}>
        <div className="training-calendar__header">
          <CalendarIcon className="training-calendar__icon" size={24} />
          <h3 className="training-calendar__title">Training Calendar</h3>
        </div>
        <div className="training-calendar__error">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
          <p>Error loading calendar: {error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== MAIN RENDER =====
  
  return (
    <div className={`training-calendar training-calendar--${context} ${className}`}>
      {context !== 'widget' && (
        <div className="training-calendar__header">
          <div className="training-calendar__header-content">
            <div className="training-calendar__title-section">
              <CalendarIcon className="training-calendar__icon" size={24} />
              <div className="training-calendar__title-group">
                <h3 className="training-calendar__title">Schedule Your Fitness Assessment</h3>
                <p className="training-calendar__subtitle">Book your complimentary 20-minute fitness evaluation</p>
              </div>
            </div>
            
            {/* Custom Navigation Controls */}
            <div className="training-calendar__navigation">
              <button 
                className="nav-button nav-button--prev"
                onClick={() => {
                  const prevMonth = new Date(currentDate);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setCurrentDate(prevMonth);
                }}
                aria-label="Previous month"
              >
                ←
              </button>
              
              <div className="current-month">
                {currentDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
              
              <button 
                className="nav-button nav-button--next"
                onClick={() => {
                  const nextMonth = new Date(currentDate);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setCurrentDate(nextMonth);
                }}
                aria-label="Next month"
              >
                →
              </button>
              
              <button 
                className="nav-button nav-button--today"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </button>
            </div>
            
            {/* Assessment Booking Stats */}
            <div className="training-calendar__booking-stats">
              <div className="stat-item">
                <span className="stat-value">{statistics?.totalEvents || calendarEvents.length}</span>
                <span className="stat-label">Available Slots</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">20</span>
                <span className="stat-label">Minutes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">FREE</span>
                <span className="stat-label">Assessment</span>
              </div>
            </div>
          </div>
          
          {/* Booking Instructions or Confirmation */}
          <div className="training-calendar__instructions">
            {bookingConfirmationVisible && recentBooking && (
              <BookingConfirmation
                event={recentBooking}
                onClose={clearBookingConfirmation}
                className="training-calendar__booking-confirmation"
              />
            )}
          </div>
        </div>
      )}
      
      <div className="training-calendar__content">
        <CalendarView
          events={calendarEvents}
          settings={calendarSettings}
          loading={isLoading}
          currentView={currentView}
          currentDate={currentDate}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          onViewChange={handleViewChange}
          onDateChange={handleDateChange}
          className="training-calendar__calendar-view"
        />
      </div>
      
      {/* Event Modal for Create/Edit/View */}
      <EventModal
        isOpen={modalState.isOpen}
        onClose={closeEventModal}
        event={modalState.event || undefined}
        mode={modalState.mode}
        loading={isLoading}
        selectedDate={modalState.selectedDate}
        onModeChange={handleModalModeChange}
        onSave={handleEventSave}
        onDelete={modalState.event ? handleEventDelete : undefined}
      />
    </div>
  );
};

export default TrainingCalendar; 