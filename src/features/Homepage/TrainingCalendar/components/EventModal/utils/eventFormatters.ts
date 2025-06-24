/**
 * Event Formatting Utilities
 * 
 * Pure functions for formatting event data, dates, and displays
 * Extracted from EventModal to maintain single responsibility
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

import { EVENT_TYPE_OPTIONS, LOCATION_OPTIONS } from './eventConstants';

// ===== DATE FORMATTERS =====

/**
 * Format date-time string for display
 */
export const formatDateTime = (dateString: string | Date): string => {
  if (!dateString) return 'Not set';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.warn('Date formatting error:', error);
    return 'Invalid date';
  }
};

/**
 * Calculate and format duration between start and end times
 */
export const formatDuration = (start: string | Date, end: string | Date): string => {
  if (!start || !end) return 'Duration not set';
  
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 'Invalid duration';
    }
    
    const durationMs = endDate.getTime() - startDate.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
    }
  } catch (error) {
    console.warn('Duration calculation error:', error);
    return 'Invalid duration';
  }
};

// ===== LABEL GETTERS =====

/**
 * Get display label for event type
 */
export const getEventTypeLabel = (eventType: string): string => {
  const option = EVENT_TYPE_OPTIONS.find(opt => opt.value === eventType);
  return option ? option.label : eventType || 'Unknown Type';
};

/**
 * Get display label for location
 */
export const getLocationDisplay = (location: string): string => {
  const option = LOCATION_OPTIONS.find(opt => opt.value === location);
  return option ? option.label : location || 'Location not set';
};

/**
 * Get display information for booking status
 */
export const getBookingStatusDisplay = (status: string): {
  text: string;
  icon: string;
  class: string;
} => {
  const statusMap = {
    available: { text: 'Available', icon: '✅', class: 'status-available' },
    pending: { text: 'Pending', icon: '⏳', class: 'status-pending' },
    confirmed: { text: 'Confirmed', icon: '📅', class: 'status-confirmed' },
    cancelled: { text: 'Cancelled', icon: '❌', class: 'status-cancelled' },
    completed: { text: 'Completed', icon: '✔️', class: 'status-completed' }
  };
  
  return statusMap[status as keyof typeof statusMap] || {
    text: status || 'Unknown',
    icon: '❓',
    class: 'status-unknown'
  };
}; 