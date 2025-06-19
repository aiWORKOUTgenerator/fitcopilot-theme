/**
 * DateTime Utilities for Training Calendar
 * 
 * Utility functions for handling datetime formatting, especially for HTML inputs
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

/**
 * Format Date object for datetime-local input
 * Converts Date to format: yyyy-MM-ddThh:mm (no timezone, no milliseconds)
 * 
 * @param date - Date object to format
 * @returns Formatted string for datetime-local input
 */
export const formatForDateTimeLocal = (date: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  
  // Get local date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Parse datetime-local input value to Date object
 * 
 * @param datetimeLocalValue - Value from datetime-local input
 * @returns Date object
 */
export const parseFromDateTimeLocal = (datetimeLocalValue: string): Date | null => {
  if (!datetimeLocalValue || typeof datetimeLocalValue !== 'string') {
    return null;
  }
  
  // datetime-local format: yyyy-MM-ddThh:mm or yyyy-MM-ddThh:mm:ss
  const date = new Date(datetimeLocalValue);
  
  if (isNaN(date.getTime())) {
    return null;
  }
  
  return date;
};

/**
 * Format Date for display purposes
 * 
 * @param date - Date object to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatForDisplay = (
  date: Date, 
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }
): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Get current datetime formatted for datetime-local input
 * 
 * @returns Current datetime in datetime-local format
 */
export const getCurrentDateTimeLocal = (): string => {
  return formatForDateTimeLocal(new Date());
};

/**
 * Add minutes to a date and return datetime-local format
 * 
 * @param date - Base date
 * @param minutes - Minutes to add
 * @returns New date in datetime-local format
 */
export const addMinutesAndFormat = (date: Date, minutes: number): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return formatForDateTimeLocal(newDate);
};

/**
 * Validate datetime-local format
 * 
 * @param value - Value to validate
 * @returns True if valid format
 */
export const isValidDateTimeLocalFormat = (value: string): boolean => {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  // Check format: yyyy-MM-ddThh:mm or yyyy-MM-ddThh:mm:ss
  const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;
  
  if (!datetimeRegex.test(value)) {
    return false;
  }
  
  // Check if it creates a valid date
  const date = new Date(value);
  return !isNaN(date.getTime());
};

/**
 * Convert ISO string to datetime-local format
 * Handles common API response formats
 * 
 * @param isoString - ISO date string (e.g., "2025-06-20T07:10:00.000Z")
 * @returns datetime-local formatted string
 */
export const convertISOToDateTimeLocal = (isoString: string): string => {
  if (!isoString || typeof isoString !== 'string') {
    return '';
  }
  
  try {
    const date = new Date(isoString);
    return formatForDateTimeLocal(date);
  } catch (error) {
    console.warn('Failed to convert ISO string to datetime-local:', isoString, error);
    return '';
  }
};

/**
 * Safe date parsing with fallback
 * 
 * @param value - Date value (string, Date, or number)
 * @returns Date object or null
 */
export const safeParseDate = (value: string | Date | number | null | undefined): Date | null => {
  if (!value) {
    return null;
  }
  
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  
  try {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.warn('Failed to parse date:', value, error);
    return null;
  }
}; 