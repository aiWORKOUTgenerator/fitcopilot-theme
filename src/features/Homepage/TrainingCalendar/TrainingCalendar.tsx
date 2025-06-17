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
  
  // ===== HOOKS =====

  // Calendar data management
  const {
    events,
    trainers,
    statistics,
    loading,
    error
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

  // ===== EVENT HANDLERS =====
  
  const handleEventClick = useCallback((event: any) => {
    console.log('Event clicked:', event);
    // TODO: Open event modal
  }, []);

  const handleDateSelect = useCallback((selectInfo: any) => {
    console.log('Date selected:', selectInfo);
    // TODO: Open create event modal
  }, []);

  const handleEventDrop = useCallback((dropInfo: any) => {
    console.log('Event dropped:', dropInfo);
    // TODO: Update event via API
  }, []);

  const handleEventResize = useCallback((resizeInfo: any) => {
    console.log('Event resized:', resizeInfo);
    // TODO: Update event via API
  }, []);

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
    </div>
  );
};

export default TrainingCalendar; 