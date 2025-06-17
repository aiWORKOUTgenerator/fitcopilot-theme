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
import React, { useCallback, useMemo, useState } from 'react';

// Component imports
import CalendarView from './components/CalendarView/CalendarView';
import EventModal from './components/EventModal/EventModal';

// Hook imports
import { useCalendarData } from './hooks/useCalendarData';

// Type imports
import { CalendarEvent, CalendarSettings, CalendarView as CalendarViewType, TrainerData } from './interfaces';

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
    mode: 'view'
  });
  
  // ===== HOOKS =====

  // Calendar data management with CRUD operations
  const {
    events,
    trainers,
    statistics,
    loading,
    error,
    updateEvent,
    deleteEvent,
    createEvent,
    refreshData
  } = useCalendarData();

  // ===== DATA TRANSFORMATION =====
  
  // Get WordPress calendar data
  const wordpressData = useMemo(() => {
    if (typeof window !== 'undefined') {
      return (window as any)?.fitcopilotTrainingCalendarData || {};
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

  // Transform WordPress events to CalendarEvent format
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const wpEvents = wordpressData.events || events || [];
    
    return wpEvents.map((event: any) => ({
      id: event.id || event.event_id,
      title: event.title,
      description: event.description || '',
      start: event.start || event.start_datetime,
      end: event.end || event.end_datetime,
      trainerId: event.trainerId || event.trainer_id,
      eventType: event.eventType || event.event_type || 'session',
      bookingStatus: event.bookingStatus || event.booking_status || 'available',
      sessionType: event.sessionType || event.session_type || 'individual',
      location: event.location || '',
      maxParticipants: event.maxParticipants || event.max_participants || 1,
      currentParticipants: event.currentParticipants || event.current_participants || 0,
      backgroundColor: event.backgroundColor || event.background_color,
      borderColor: event.borderColor || event.border_color,
      textColor: event.textColor || event.text_color || '#ffffff',
      price: event.price,
      currency: event.currency || 'USD',
      zoomLink: event.zoomLink || event.zoom_link,
      specialInstructions: event.specialInstructions || event.special_instructions
    }));
  }, [wordpressData.events, events]);

  // Transform WordPress trainers to TrainerData format
  const calendarTrainers: TrainerData[] = useMemo(() => {
    const wpTrainers = wordpressData.trainers || trainers || [];
    
    return wpTrainers.map((trainer: any) => ({
      id: trainer.id,
      name: trainer.name,
      email: trainer.email || '',
      specialty: trainer.specialty || '',
      bio: trainer.bio || '',
      imageUrl: trainer.imageUrl || trainer.image_url || '',
      avatar: trainer.avatar || trainer.imageUrl || trainer.image_url || '',
      yearsExperience: trainer.yearsExperience || trainer.years_experience || 0,
      clientsCount: trainer.clientsCount || trainer.clients_count || 0,
      featured: trainer.featured || false,
      active: trainer.active !== false,
      isActive: trainer.isActive !== false && trainer.active !== false,
      coachType: trainer.coachType || trainer.coach_type || 'personal',
      availability: trainer.availability || {},
      color: trainer.color || trainer.calendarConfig?.color || '#8b5cf6',
      metadata: trainer.metadata || {}
    }));
  }, [wordpressData.trainers, trainers]);

  // ===== MODAL HANDLERS =====
  
  const openEventModal = useCallback((event: CalendarEvent | null, mode: 'view' | 'edit' | 'create') => {
    setModalState({
      isOpen: true,
      event,
      mode
    });
  }, []);
  
  const closeEventModal = useCallback(() => {
    setModalState({
      isOpen: false,
      event: null,
      mode: 'view'
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
  
  const handleEventDelete = useCallback(async (eventId: number) => {
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
    console.log('📅 Event clicked:', eventInfo.event.title);
    
    // Find the corresponding calendar event
    const eventId = eventInfo.event.id;
    const calendarEvent = calendarEvents.find(event => 
      event.id.toString() === eventId.toString()
    );
    
    if (calendarEvent) {
      // Open event in view mode
      openEventModal(calendarEvent, 'view');
    } else {
      console.warn('⚠️ Event not found in calendar data:', eventId);
    }
  }, [calendarEvents, openEventModal]);

  const handleDateSelect = useCallback((selectInfo: any) => {
    console.log('📅 Date selected for new event:', selectInfo.startStr);
    
    // Create a new event template
    const newEventTemplate: Partial<CalendarEvent> = {
      title: '',
      description: '',
      start: selectInfo.start.toISOString(),
      end: selectInfo.end.toISOString(),
      trainerId: calendarTrainers.length > 0 ? calendarTrainers[0].id : undefined,
      eventType: 'session',
      bookingStatus: 'available',
      sessionType: 'individual',
      location: '',
      maxParticipants: 1,
      currentParticipants: 0,
      price: 0,
      currency: 'USD'
    };
    
    // Open modal in create mode
    openEventModal(newEventTemplate as CalendarEvent, 'create');
  }, [calendarTrainers, openEventModal]);

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
          
          {/* Booking Instructions */}
          <div className="training-calendar__instructions">
            <p>Click on any available date to schedule your fitness assessment. Our certified trainers will evaluate your current fitness level and create a personalized training plan.</p>
          </div>
        </div>
      )}
      
      <div className="training-calendar__content">
        <CalendarView
          events={calendarEvents}
          trainers={calendarTrainers}
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
        event={modalState.event}
        trainers={calendarTrainers}
        mode={modalState.mode}
        onModeChange={handleModalModeChange}
        onSave={handleEventSave}
        onDelete={modalState.event ? handleEventDelete : undefined}
      />
    </div>
  );
};

export default TrainingCalendar; 