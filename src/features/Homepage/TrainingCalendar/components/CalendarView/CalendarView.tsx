/**
 * Calendar View Component - FullCalendar Integration
 * 
 * Real FullCalendar React component with WordPress data integration
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { DateSelectArg, EventApi, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CalendarEvent, CalendarSettings, CalendarView as CalendarViewType } from '../../interfaces';
import './CalendarView.scss';

/**
 * CalendarView Component Props
 */
interface CalendarViewProps {
  /** Array of calendar events to display */
  events: CalendarEvent[];
  /** REMOVED: trainers - no longer needed */
  /** Calendar configuration settings */
  settings: CalendarSettings;
  /** Loading state indicator */
  loading?: boolean;
  /** Current calendar view */
  currentView?: CalendarViewType;
  /** Current date being displayed */
  currentDate?: Date;
  /** Event click handler */
  onEventClick?: (event: EventApi) => void;
  /** Date selection handler */
  onDateSelect?: (selectInfo: DateSelectArg) => void;
  /** Event drop handler for drag and drop */
  onEventDrop?: (dropInfo: EventDropArg) => void;
  /** Event resize handler */
  onEventResize?: (resizeInfo: any) => void;
  /** View change handler */
  onViewChange?: (view: CalendarViewType) => void;
  /** Date navigation handler */
  onDateChange?: (date: Date) => void;
  /** Custom CSS class */
  className?: string;
}

/**
 * CalendarView Component - FullCalendar Integration
 */
const CalendarView: React.FC<CalendarViewProps> = ({
  events = [],
  settings,
  loading = false,
  currentView = 'dayGridMonth',
  currentDate = new Date(),
  onEventClick,
  onDateSelect,
  onEventDrop,
  onEventResize,
  onViewChange,
  onDateChange,
  className = ''
}) => {
  
  // ===== STATE =====
  
  const calendarRef = useRef<FullCalendar>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [calendarHeight, setCalendarHeight] = useState<string | number>('auto');
  
  // ===== EFFECTS =====
  
  // Detect screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Set responsive height
      if (mobile) {
        setCalendarHeight(500);
      } else {
        setCalendarHeight('auto');
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Update calendar view when currentView prop changes
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(currentView);
    }
  }, [currentView]);
  
  // Update calendar date when currentDate prop changes
  useEffect(() => {
    if (calendarRef.current && currentDate) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(currentDate);
    }
  }, [currentDate]);
  
  // ===== COMPUTED VALUES =====
  
  // Transform events for FullCalendar
  const fullCalendarEvents = useMemo(() => {
    return events.map((event: CalendarEvent) => {
      // REMOVED: trainer logic - no longer needed
      
      return {
        id: String(event.id),
        title: event.title,
        start: event.start,
        end: event.end,
        backgroundColor: event.backgroundColor || settings.calendarColors[event.eventType] || '#4CAF50',
        borderColor: event.borderColor || settings.calendarColors[event.eventType] || '#388E3C',
        textColor: event.textColor || '#ffffff',
        classNames: [
          `event-type-${event.eventType}`,
          `booking-status-${event.bookingStatus}`,
          `session-type-${event.sessionType}`,
          // REMOVED: trainer featured class
        ].filter(Boolean),
        extendedProps: {
          description: event.description,
          trainerId: event.trainerId,
          trainerName: 'Fitness Trainer', // SIMPLIFIED: Generic trainer name
          eventType: event.eventType,
          bookingStatus: event.bookingStatus,
          sessionType: event.sessionType,
          location: event.location,
          maxParticipants: event.maxParticipants,
          currentParticipants: event.currentParticipants,
          price: event.price,
          currency: event.currency,
          zoomLink: event.zoomLink,
          specialInstructions: event.specialInstructions,
          originalEvent: event
        }
      };
    });
  }, [events, settings.calendarColors]); // REMOVED: trainers dependency
  
  // FullCalendar configuration
  const calendarConfig = useMemo(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth', // Fixed view for assessment booking
    initialDate: currentDate,
    height: calendarHeight,
    
    // REMOVE: Complex responsive header toolbar
    headerToolbar: false as const, // Disable FullCalendar's native header
    footerToolbar: false as const,
    
    // Simplified for assessment booking
    selectable: true,
    selectMirror: true,
    editable: false, // Users can't drag/drop - only book assessments
    droppable: false, // No drag and drop needed
    
    // Time settings optimized for 20-minute assessments
    firstDay: settings.firstDay,
    slotDuration: '00:20:00', // 20-minute slots for assessments
    slotLabelFormat: {
      hour: 'numeric' as const,
      minute: '2-digit' as const,
      omitZeroMinute: false,
      meridiem: true
    },
    
    // Business hours for assessments
    businessHours: settings.weekendEnabled ? undefined : {
      daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
      startTime: settings.businessHours.start,
      endTime: settings.businessHours.end,
    },
    
    // Event display optimized for assessments
    eventDisplay: 'block',
    eventTimeFormat: {
      hour: 'numeric' as const,
      minute: '2-digit' as const,
      meridiem: true
    },
    dayMaxEvents: 3, // Limit events per day for clarity
    moreLinkClick: 'popover',
    
    // Weekend display
    weekends: settings.weekendEnabled,
    
    // Fixed aspect ratio for consistent display
    aspectRatio: 1.35,
    
    // Accessibility
    eventOrder: ['start', 'title'],
    
    // Custom content for assessment booking
    eventContent: (arg: any) => {
      const { event } = arg;
      const { extendedProps } = event;
      
      // Simplified event display for assessments
      return {
        html: `
          <div class="fc-event-content-wrapper assessment-event">
            <div class="fc-event-time">${arg.timeText}</div>
            <div class="fc-event-title">Fitness Assessment</div>
            <div class="fc-event-duration">20 minutes</div>
            <div class="fc-event-status fc-event-status-${extendedProps.bookingStatus}">
              ${extendedProps.bookingStatus === 'available' ? 'Available' : 'Booked'}
            </div>
          </div>
        `
      };
    },
    
    // Loading state
    loading: (isLoading: boolean) => {
      // Handle loading state if needed
      console.log('Calendar loading:', isLoading);
    }
  }), [currentDate, calendarHeight, settings]);
  
  // ===== EVENT HANDLERS =====
  
  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    if (onEventClick) {
      onEventClick(clickInfo.event);
    }
  }, [onEventClick]);
  
  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    console.log('🔍 CalendarView: Date selected!', selectInfo);
    console.log('🔍 CalendarView: onDateSelect exists?', !!onDateSelect);
    if (onDateSelect) {
      console.log('🔍 CalendarView: Calling onDateSelect...');
      onDateSelect(selectInfo);
    } else {
      console.log('⚠️ CalendarView: No onDateSelect handler provided!');
    }
  }, [onDateSelect]);
  
  const handleEventDrop = useCallback((dropInfo: EventDropArg) => {
    if (onEventDrop) {
      onEventDrop(dropInfo);
    }
  }, [onEventDrop]);
  
  const handleEventResize = useCallback((resizeInfo: any) => {
    if (onEventResize) {
      onEventResize(resizeInfo);
    }
  }, [onEventResize]);
  
  const handleViewChange = useCallback((view: any) => {
    if (onViewChange) {
      onViewChange(view.type as CalendarViewType);
    }
  }, [onViewChange]);
  
  const handleDateChange = useCallback((dateInfo: any) => {
    if (onDateChange) {
      onDateChange(dateInfo.start);
    }
  }, [onDateChange]);
  
  // ===== RENDER =====
  
  const containerClasses = [
    'training-calendar-view',
    `training-calendar-view--${currentView}`,
    isMobile ? 'training-calendar-view--mobile' : 'training-calendar-view--desktop',
    loading ? 'training-calendar-view--loading' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClasses}>
      <div className="training-calendar-view__container">
        <FullCalendar
          ref={calendarRef}
          {...calendarConfig}
          events={fullCalendarEvents}
          eventClick={handleEventClick}
          select={handleDateSelect}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          viewDidMount={handleViewChange}
          datesSet={handleDateChange}
        />
      </div>
      
      {loading && (
        <div className="training-calendar-view__loading-overlay">
          <div className="training-calendar-view__loading-spinner">
            <div className="spinner"></div>
            <span className="loading-text">Loading calendar...</span>
          </div>
        </div>
      )}
      
      {events.length === 0 && !loading && (
        <div className="training-calendar-view__empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">📅</div>
            <h3>No Events Scheduled</h3>
            <p>There are no training sessions scheduled for this period.</p>
            <button 
              className="empty-state-button"
              onClick={() => onDateSelect && onDateSelect({} as DateSelectArg)}
            >
              Schedule a Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView; 