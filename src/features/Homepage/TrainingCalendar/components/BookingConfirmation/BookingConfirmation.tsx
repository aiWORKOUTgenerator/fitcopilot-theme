/**
 * Booking Confirmation Component
 * 
 * Displays comprehensive booking confirmation with user context
 * Shows event details, user information, and next steps
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import React from 'react';
import { CalendarEvent, RegisteredUser, WordPressUser } from '../../interfaces';
import './BookingConfirmation.scss';

/**
 * Booking Confirmation Props Interface
 */
interface BookingConfirmationProps {
  /** Booked event details */
  event: CalendarEvent;
  
  /** User who made the booking (Phase 3) */
  user?: RegisteredUser | WordPressUser;
  
  /** Whether user is authenticated */
  isAuthenticated?: boolean;
  
  /** Close confirmation handler */
  onClose: () => void;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Booking Confirmation Component
 * 
 * Enhanced for Phase 3 with user context and personalization
 */
const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  event,
  user,
  isAuthenticated = false,
  onClose,
  className = ''
}) => {
  
  // Format event date and time
  const eventDate = new Date(event.start).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const eventTime = new Date(event.start).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const endTime = new Date(event.end).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  // Get user display name
  const getUserDisplayName = (): string => {
    if (!user) return 'Valued Client';
    
    if ('firstName' in user && user.firstName) {
      return user.firstName;
    }
    
    if ('displayName' in user && user.displayName) {
      return user.displayName;
    }
    
    return user.email?.split('@')[0] || 'Valued Client';
  };
  
  return (
    <div className={`booking-confirmation ${className}`}>
      <div className="booking-confirmation__container">
        
        {/* Success Header */}
        <div className="booking-confirmation__header">
          <div className="booking-confirmation__success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="booking-confirmation__title">
            {isAuthenticated ? `Thank you, ${getUserDisplayName()}!` : 'Booking Confirmed!'}
          </h2>
          <p className="booking-confirmation__subtitle">
            Your session has been successfully booked
          </p>
        </div>
        
        {/* Event Details */}
        <div className="booking-confirmation__event-details">
          <h3 className="booking-confirmation__event-title">
            {event.title}
          </h3>
          
          <div className="booking-confirmation__event-info">
            <div className="booking-confirmation__info-item">
              <strong>Date:</strong> {eventDate}
            </div>
            <div className="booking-confirmation__info-item">
              <strong>Time:</strong> {eventTime} - {endTime}
            </div>
            {event.location && (
              <div className="booking-confirmation__info-item">
                <strong>Location:</strong> {event.location}
              </div>
            )}
            {event.duration && (
              <div className="booking-confirmation__info-item">
                <strong>Duration:</strong> {event.duration} minutes
              </div>
            )}
          </div>
        </div>
        
        {/* User-Specific Information (Phase 3) */}
        {isAuthenticated && user && (
          <div className="booking-confirmation__user-info">
            <h4 className="booking-confirmation__section-title">Your Account</h4>
            
            <div className="booking-confirmation__user-details">
              <div className="booking-confirmation__info-item">
                <strong>Email:</strong> {user.email}
              </div>
              {user && 'registrationSource' in user && user.registrationSource && (
                <div className="booking-confirmation__info-item">
                  <strong>Account Type:</strong> FitCopilot Member
                </div>
              )}
            </div>
            
            <div className="booking-confirmation__account-benefits">
              <p><strong>As a registered user, you can:</strong></p>
              <ul>
                <li>View your upcoming sessions in your dashboard</li>
                <li>Receive email reminders before your sessions</li>
                <li>Access your fitness journey progress</li>
                <li>Book future sessions with saved preferences</li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Next Steps */}
        <div className="booking-confirmation__next-steps">
          <h4 className="booking-confirmation__section-title">What's Next?</h4>
          
          <div className="booking-confirmation__steps">
            {isAuthenticated ? (
              <>
                <div className="booking-confirmation__step">
                  <span className="booking-confirmation__step-number">1</span>
                  <span>Check your email for a detailed confirmation</span>
                </div>
                <div className="booking-confirmation__step">
                  <span className="booking-confirmation__step-number">2</span>
                  <span>Add this event to your personal calendar</span>
                </div>
                <div className="booking-confirmation__step">
                  <span className="booking-confirmation__step-number">3</span>
                  <span>Prepare any questions for your trainer</span>
                </div>
              </>
            ) : (
              <>
                <div className="booking-confirmation__step">
                  <span className="booking-confirmation__step-number">1</span>
                  <span>You'll receive a confirmation email shortly</span>
                </div>
                <div className="booking-confirmation__step">
                  <span className="booking-confirmation__step-number">2</span>
                  <span>Consider creating an account to manage your bookings</span>
                </div>
                <div className="booking-confirmation__step">
                  <span className="booking-confirmation__step-number">3</span>
                  <span>Prepare any questions for your trainer</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="booking-confirmation__actions">
          {isAuthenticated ? (
            <>
              <button 
                className="booking-confirmation__button booking-confirmation__button--primary"
                onClick={onClose}
              >
                View My Dashboard
              </button>
              <button 
                className="booking-confirmation__button booking-confirmation__button--secondary"
                onClick={onClose}
              >
                Book Another Session
              </button>
            </>
          ) : (
            <>
              <button 
                className="booking-confirmation__button booking-confirmation__button--primary"
                onClick={onClose}
              >
                Create Account
              </button>
              <button 
                className="booking-confirmation__button booking-confirmation__button--secondary"
                onClick={onClose}
              >
                Close
              </button>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default BookingConfirmation; 