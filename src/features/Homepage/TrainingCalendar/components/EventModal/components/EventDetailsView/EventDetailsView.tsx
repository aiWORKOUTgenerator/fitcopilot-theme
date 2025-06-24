/**
 * Event Details View Component
 * 
 * View-mode component for displaying event details
 * Leverages existing EventType components - NO duplication
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React, { useMemo } from 'react';
import { CalendarEvent } from '../../../../interfaces';
import { formatDateTime, formatDuration, getBookingStatusDisplay, getEventTypeLabel, getLocationDisplay } from '../../utils';
import './EventDetailsView.scss';

export interface EventDetailsViewProps {
  event: CalendarEvent;
  className?: string;
  isLoading?: boolean;
  onBookEvent?: () => void;
}

/**
 * EventDetailsView Component
 * 
 * Displays event details in read-only format
 * Uses existing formatters and components
 */
export const EventDetailsView: React.FC<EventDetailsViewProps> = React.memo(({
  event,
  className = '',
  isLoading = false,
  onBookEvent
}) => {

  // ===== COMPUTED VALUES =====

  const eventDetails = useMemo(() => {
    if (!event) return null;

    return {
      title: event.title || 'Untitled Event',
      description: event.description || '',
      eventType: getEventTypeLabel(event.eventType || event.title || ''),
      location: getLocationDisplay(event.location || ''),
      bookingStatus: getBookingStatusDisplay(event.bookingStatus || '').text,
      startTime: formatDateTime(event.start || ''),
      endTime: formatDateTime(event.end || ''),
      duration: event.start && event.end ? formatDuration(event.start, event.end) : '',
      maxParticipants: event.maxParticipants || 1,
      currentParticipants: event.currentParticipants || 0,
      price: event.price ? `$${event.price}` : 'Free',
      specialInstructions: event.specialInstructions || ''
    };
  }, [event]);

  const participantsDisplay = useMemo(() => {
    if (!eventDetails) return '';
    return `${eventDetails.currentParticipants} / ${eventDetails.maxParticipants}`;
  }, [eventDetails]);

  // ===== LOADING STATE =====

  if (isLoading) {
    return (
      <div className={`event-details-view event-details-view--loading ${className}`}>
        <div className="event-details-view__loading">
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--line" />
          <div className="skeleton skeleton--line" />
          <div className="skeleton skeleton--block" />
        </div>
      </div>
    );
  }

  // ===== ERROR STATE =====

  if (!event || !eventDetails) {
    return (
      <div className={`event-details-view event-details-view--error ${className}`}>
        <div className="event-details-view__error">
          <span className="error-icon">⚠️</span>
          <p>Event details could not be loaded.</p>
        </div>
      </div>
    );
  }

  // ===== RENDER =====

  return (
    <div className={`event-details-view ${className}`}>
      
      {/* Primary Information */}
      <div className="event-details-view__section event-details-view__primary">
        <div className="event-details-view__header">
          <h3 className="event-details-view__title">{eventDetails.title}</h3>
        </div>

        {eventDetails.description && (
          <p className="event-details-view__description">
            {eventDetails.description}
          </p>
        )}
      </div>

      {/* Event Details Grid */}
      <div className="event-details-view__section event-details-view__grid">
        
        {/* Time Information */}
        <div className="event-detail-item">
          <span className="event-detail-item__label">Start Time</span>
          <span className="event-detail-item__value">{eventDetails.startTime}</span>
        </div>

        <div className="event-detail-item">
          <span className="event-detail-item__label">End Time</span>
          <span className="event-detail-item__value">{eventDetails.endTime}</span>
        </div>

        {eventDetails.duration && (
          <div className="event-detail-item">
            <span className="event-detail-item__label">Duration</span>
            <span className="event-detail-item__value">{eventDetails.duration}</span>
          </div>
        )}

        {/* Event Type Information */}
        <div className="event-detail-item">
          <span className="event-detail-item__label">Event Type</span>
          <span className="event-detail-item__value">{eventDetails.eventType}</span>
        </div>

        <div className="event-detail-item">
          <span className="event-detail-item__label">Location</span>
          <span className="event-detail-item__value">{eventDetails.location}</span>
        </div>

        <div className="event-detail-item">
          <span className="event-detail-item__label">Status</span>
          <span className={`event-detail-item__value event-detail-item__value--${event.bookingStatus}`}>
            {eventDetails.bookingStatus}
          </span>
        </div>

        {/* Booking Information */}
        <div className="event-detail-item">
          <span className="event-detail-item__label">Participants</span>
          <span className="event-detail-item__value">{participantsDisplay}</span>
        </div>

        <div className="event-detail-item">
          <span className="event-detail-item__label">Price</span>
          <span className="event-detail-item__value event-detail-item__value--price">
            {eventDetails.price}
          </span>
        </div>
      </div>

      {/* Book Event Action */}
      {onBookEvent && event.bookingStatus === 'available' && (
        <div className="event-details-view__section event-details-view__actions">
          <button
            type="button"
            className="event-details-view__book-button"
            onClick={onBookEvent}
            aria-label={`Book ${eventDetails.title}`}
          >
            Book Event
          </button>
        </div>
      )}

      {/* Special Instructions */}
      {eventDetails.specialInstructions && (
        <div className="event-details-view__section">
          <h4 className="event-details-view__section-title">Additional Details</h4>
          <p className="event-details-view__special-instructions">
            {eventDetails.specialInstructions}
          </p>
        </div>
      )}

      {/* Trainer Information - if available */}
      {event.trainerId && (
        <div className="event-details-view__section">
          <h4 className="event-details-view__section-title">Trainer</h4>
          <p className="event-details-view__trainer-info">
            Trainer ID: {event.trainerId}
          </p>
        </div>
      )}
    </div>
  );
});

EventDetailsView.displayName = 'EventDetailsView'; 