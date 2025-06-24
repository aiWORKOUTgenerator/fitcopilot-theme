/**
 * Event Modal Constants
 * 
 * Centralized constants for EventModal components
 * Following patterns from assignment-manager.js configuration
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { BookingStatus, EventType, SessionType } from '../../../interfaces';

// ===== FORM DEFAULTS =====

export const EVENT_MODAL_DEFAULTS = {
  title: '',
  description: '',
  trainerId: undefined,
  eventType: 'session' as EventType,
  bookingStatus: 'available' as BookingStatus,
  sessionType: 'individual' as SessionType,
  location: 'google_meet',
  duration: undefined,
  maxParticipants: 1,
  currentParticipants: 0,
  price: 0,
  currency: 'USD',
  zoomLink: '',
  specialInstructions: ''
} as const;

// ===== DROPDOWN OPTIONS =====

export const LOCATION_OPTIONS = [
  { value: 'google_meet', label: '📹 Google Meet (Recommended)' },
  { value: 'zoom', label: '💻 Zoom (Coming Soon)' },
  { value: 'in_person', label: '🏢 In-Person Session' },
  { value: 'phone_call', label: '📞 Phone Call' }
] as const;

export const EVENT_TYPE_OPTIONS = [
  { value: 'session', label: 'Training Session' },
  { value: 'availability', label: 'Availability Slot' },
  { value: 'blocked', label: 'Blocked Time' },
  { value: 'group_class', label: 'Group Class' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'assessment', label: 'Assessment' }
] as const;

export const BOOKING_STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' }
] as const;

export const SESSION_TYPE_OPTIONS = [
  { value: 'individual', label: 'Individual' },
  { value: 'group', label: 'Group' },
  { value: 'assessment', label: 'Assessment' }
] as const;

// ===== PERFORMANCE LIMITS =====

export const PERFORMANCE_CONFIG = {
  maxRenderTime: 100, // milliseconds
  maxValidationTime: 50, // milliseconds
  maxFormInitTime: 25, // milliseconds
  retryLimit: 3
} as const; 