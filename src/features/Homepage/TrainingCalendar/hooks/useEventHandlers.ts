/**
 * Event Handlers Hook
 * 
 * Manages calendar event interactions and handlers
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { useCallback } from 'react';
import { CalendarEvent } from '../interfaces';

export interface EventHandlerCallbacks {
  onCreate?: (event: Partial<CalendarEvent>) => Promise<CalendarEvent>;
  onUpdate?: (eventId: string, updates: Partial<CalendarEvent>) => Promise<CalendarEvent>;
  onDelete?: (eventId: string) => Promise<void>;
  onBooking?: (eventId: string, bookingData: any) => Promise<void>;
}

export const useEventHandlers = (callbacks: EventHandlerCallbacks) => {
  const handleEventClick = useCallback((event: any) => {
    // Handle event click logic
    console.log('Event clicked:', event);
  }, []);

  const handleDateSelect = useCallback((selectInfo: any) => {
    // Handle date selection logic
    console.log('Date selected:', selectInfo);
    if (callbacks.onCreate) {
      callbacks.onCreate({
        title: 'New Event',
        start: selectInfo.start,
        end: selectInfo.end
      });
    }
  }, [callbacks]);

  const handleEventDrop = useCallback((dropInfo: any) => {
    // Handle event drag and drop logic
    console.log('Event dropped:', dropInfo);
    if (callbacks.onUpdate) {
      callbacks.onUpdate(dropInfo.event.id, {
        start: dropInfo.event.start,
        end: dropInfo.event.end
      });
    }
  }, [callbacks]);

  const handleEventResize = useCallback((resizeInfo: any) => {
    // Handle event resize logic
    console.log('Event resized:', resizeInfo);
    if (callbacks.onUpdate) {
      callbacks.onUpdate(resizeInfo.event.id, {
        start: resizeInfo.event.start,
        end: resizeInfo.event.end
      });
    }
  }, [callbacks]);

  const handleBookingSubmit = useCallback((eventId: string, bookingData: any) => {
    // Handle booking submission logic
    console.log('Booking submitted:', eventId, bookingData);
    if (callbacks.onBooking) {
      return callbacks.onBooking(eventId, bookingData);
    }
    return Promise.resolve();
  }, [callbacks]);

  return {
    handleEventClick,
    handleDateSelect,
    handleEventDrop,
    handleEventResize,
    handleBookingSubmit
  };
}; 