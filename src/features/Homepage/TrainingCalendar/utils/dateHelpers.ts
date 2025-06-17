/**
 * Date Helper Utilities for Training Calendar
 * 
 * Comprehensive date manipulation and formatting utilities
 * optimized for calendar operations and user interface display
 * 
 * @package FitCopilot
 * @subpackage TrainingCalendar
 * @since 1.0.0
 */

// ===== CONSTANTS =====

export const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
] as const;

export const DAYS_OF_WEEK_SHORT = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
] as const;

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const;

export const TIME_ZONES = {
  EST: 'America/New_York',
  CST: 'America/Chicago',
  MST: 'America/Denver',
  PST: 'America/Los_Angeles',
  UTC: 'UTC'
} as const;

// ===== BASIC DATE OPERATIONS =====

/**
 * Check if a value is a valid date
 */
export const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Parse date from various input formats
 */
export const parseDate = (input: string | Date | number): Date | null => {
  if (input instanceof Date) {
    return isValidDate(input) ? input : null;
  }
  
  if (typeof input === 'number') {
    const date = new Date(input);
    return isValidDate(date) ? date : null;
  }
  
  if (typeof input === 'string') {
    // Handle various string formats
    const date = new Date(input);
    return isValidDate(date) ? date : null;
  }
  
  return null;
};

/**
 * Clone a date object
 */
export const cloneDate = (date: Date): Date => {
  return new Date(date.getTime());
};

/**
 * Get today's date with time set to midnight
 */
export const getToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Get tomorrow's date with time set to midnight
 */
export const getTomorrow = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

/**
 * Get yesterday's date with time set to midnight
 */
export const getYesterday = (): Date => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday;
};

// ===== DATE COMPARISON =====

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

/**
 * Check if date is today
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * Check if date is tomorrow
 */
export const isTomorrow = (date: Date): boolean => {
  return isSameDay(date, getTomorrow());
};

/**
 * Check if date is yesterday
 */
export const isYesterday = (date: Date): boolean => {
  return isSameDay(date, getYesterday());
};

/**
 * Check if date is in the past
 */
export const isPast = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Check if date is in the future
 */
export const isFuture = (date: Date): boolean => {
  return date > new Date();
};

/**
 * Check if date is a weekend
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

/**
 * Check if date is a weekday
 */
export const isWeekday = (date: Date): boolean => {
  return !isWeekend(date);
};

// ===== DATE ARITHMETIC =====

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const newDate = cloneDate(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

/**
 * Subtract days from a date
 */
export const subtractDays = (date: Date, days: number): Date => {
  return addDays(date, -days);
};

/**
 * Add weeks to a date
 */
export const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7);
};

/**
 * Add months to a date
 */
export const addMonths = (date: Date, months: number): Date => {
  const newDate = cloneDate(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

/**
 * Add years to a date
 */
export const addYears = (date: Date, years: number): Date => {
  const newDate = cloneDate(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
};

/**
 * Add hours to a date
 */
export const addHours = (date: Date, hours: number): Date => {
  const newDate = cloneDate(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

/**
 * Add minutes to a date
 */
export const addMinutes = (date: Date, minutes: number): Date => {
  const newDate = cloneDate(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
};

// ===== DATE RANGE OPERATIONS =====

/**
 * Get start of day
 */
export const startOfDay = (date: Date): Date => {
  const newDate = cloneDate(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Get end of day
 */
export const endOfDay = (date: Date): Date => {
  const newDate = cloneDate(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * Get start of week (Sunday)
 */
export const startOfWeek = (date: Date, firstDayOfWeek: number = 0): Date => {
  const newDate = cloneDate(date);
  const currentDay = newDate.getDay();
  const distance = (currentDay - firstDayOfWeek + 7) % 7;
  newDate.setDate(newDate.getDate() - distance);
  return startOfDay(newDate);
};

/**
 * Get end of week (Saturday)
 */
export const endOfWeek = (date: Date, firstDayOfWeek: number = 0): Date => {
  const startWeek = startOfWeek(date, firstDayOfWeek);
  return endOfDay(addDays(startWeek, 6));
};

/**
 * Get start of month
 */
export const startOfMonth = (date: Date): Date => {
  const newDate = cloneDate(date);
  newDate.setDate(1);
  return startOfDay(newDate);
};

/**
 * Get end of month
 */
export const endOfMonth = (date: Date): Date => {
  const newDate = cloneDate(date);
  newDate.setMonth(newDate.getMonth() + 1, 0);
  return endOfDay(newDate);
};

/**
 * Get start of year
 */
export const startOfYear = (date: Date): Date => {
  const newDate = cloneDate(date);
  newDate.setMonth(0, 1);
  return startOfDay(newDate);
};

/**
 * Get end of year
 */
export const endOfYear = (date: Date): Date => {
  const newDate = cloneDate(date);
  newDate.setMonth(11, 31);
  return endOfDay(newDate);
};

// ===== DATE FORMATTING =====

/**
 * Format date as YYYY-MM-DD
 */
export const formatDateISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Format time as HH:MM
 */
export const formatTime24 = (date: Date): string => {
  return date.toTimeString().slice(0, 5);
};

/**
 * Format time as 12-hour format
 */
export const formatTime12 = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format date for display
 */
export const formatDisplayDate = (date: Date, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'short' as const, day: 'numeric' as const },
    medium: { month: 'short' as const, day: 'numeric' as const, year: 'numeric' as const },
    long: { weekday: 'long' as const, month: 'long' as const, day: 'numeric' as const, year: 'numeric' as const }
  }[format];
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format date and time for display
 */
export const formatDisplayDateTime = (date: Date, timeFormat: '12' | '24' = '12'): string => {
  const dateStr = formatDisplayDate(date, 'medium');
  const timeStr = timeFormat === '12' ? formatTime12(date) : formatTime24(date);
  return `${dateStr} at ${timeStr}`;
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (date: Date, relativeTo: Date = new Date()): string => {
  const diffMs = date.getTime() - relativeTo.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);
  
  if (Math.abs(diffSeconds) < 60) {
    return diffSeconds === 0 ? 'now' : `${Math.abs(diffSeconds)} seconds ${diffSeconds > 0 ? 'from now' : 'ago'}`;
  } else if (Math.abs(diffMinutes) < 60) {
    return `${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) !== 1 ? 's' : ''} ${diffMinutes > 0 ? 'from now' : 'ago'}`;
  } else if (Math.abs(diffHours) < 24) {
    return `${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? 's' : ''} ${diffHours > 0 ? 'from now' : 'ago'}`;
  } else if (Math.abs(diffDays) < 7) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ${diffDays > 0 ? 'from now' : 'ago'}`;
  } else {
    return formatDisplayDate(date, 'medium');
  }
};

// ===== CALENDAR-SPECIFIC UTILITIES =====

/**
 * Get days in month
 */
export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * Get calendar grid for month view
 */
export const getCalendarGrid = (date: Date, firstDayOfWeek: number = 0): Date[] => {
  const start = startOfWeek(startOfMonth(date), firstDayOfWeek);
  const end = endOfWeek(endOfMonth(date), firstDayOfWeek);
  
  const days: Date[] = [];
  let currentDate = cloneDate(start);
  
  while (currentDate <= end) {
    days.push(cloneDate(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return days;
};

/**
 * Get week dates for a given date
 */
export const getWeekDates = (date: Date, firstDayOfWeek: number = 0): Date[] => {
  const start = startOfWeek(date, firstDayOfWeek);
  const dates: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    dates.push(addDays(start, i));
  }
  
  return dates;
};

/**
 * Generate time slots for a day
 */
export const generateTimeSlots = (
  start: string = '09:00',
  end: string = '17:00',
  interval: number = 30
): string[] => {
  const slots: string[] = [];
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  
  let currentTime = new Date();
  currentTime.setHours(startHour, startMinute, 0, 0);
  
  const endTime = new Date();
  endTime.setHours(endHour, endMinute, 0, 0);
  
  while (currentTime < endTime) {
    slots.push(formatTime24(currentTime));
    currentTime = addMinutes(currentTime, interval);
  }
  
  return slots;
};

// ===== TIME ZONE UTILITIES =====

/**
 * Convert date to timezone
 */
export const convertToTimezone = (date: Date, timezone: string): Date => {
  try {
    return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  } catch {
    return date;
  }
};

/**
 * Get user's timezone
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// ===== BUSINESS LOGIC HELPERS =====

/**
 * Check if time is within business hours
 */
export const isWithinBusinessHours = (
  date: Date,
  businessHours: { start: string; end: string; daysOfWeek?: number[] }
): boolean => {
  const dayOfWeek = date.getDay();
  
  // Check if day is included in business days
  if (businessHours.daysOfWeek && !businessHours.daysOfWeek.includes(dayOfWeek)) {
    return false;
  }
  
  const timeStr = formatTime24(date);
  return timeStr >= businessHours.start && timeStr <= businessHours.end;
};

/**
 * Get next available business day
 */
export const getNextBusinessDay = (
  date: Date,
  businessDays: number[] = [1, 2, 3, 4, 5] // Monday to Friday
): Date => {
  let nextDay = addDays(date, 1);
  
  while (!businessDays.includes(nextDay.getDay())) {
    nextDay = addDays(nextDay, 1);
  }
  
  return nextDay;
};

/**
 * Calculate duration between dates in various units
 */
export const calculateDuration = (
  start: Date,
  end: Date,
  unit: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' = 'minutes'
): number => {
  const diffMs = end.getTime() - start.getTime();
  
  switch (unit) {
    case 'milliseconds':
      return diffMs;
    case 'seconds':
      return Math.round(diffMs / 1000);
    case 'minutes':
      return Math.round(diffMs / (1000 * 60));
    case 'hours':
      return Math.round(diffMs / (1000 * 60 * 60));
    case 'days':
      return Math.round(diffMs / (1000 * 60 * 60 * 24));
    default:
      return diffMs;
  }
};

/**
 * Check if time slot is available (not conflicting with existing events)
 */
export const isTimeSlotAvailable = (
  startTime: Date,
  endTime: Date,
  existingEvents: { start: Date; end: Date }[]
): boolean => {
  return !existingEvents.some(event => {
    return (startTime < event.end && endTime > event.start);
  });
};

/**
 * Get available time slots for a day
 */
export const getAvailableTimeSlots = (
  date: Date,
  availability: { start: string; end: string },
  sessionDuration: number = 60,
  existingBookings: { start: Date; end: Date }[] = [],
  bufferTime: number = 15
): { start: Date; end: Date }[] => {
  const slots: { start: Date; end: Date }[] = [];
  const [startHour, startMinute] = availability.start.split(':').map(Number);
  const [endHour, endMinute] = availability.end.split(':').map(Number);
  
  let currentTime = cloneDate(date);
  currentTime.setHours(startHour, startMinute, 0, 0);
  
  const dayEnd = cloneDate(date);
  dayEnd.setHours(endHour, endMinute, 0, 0);
  
  while (currentTime < dayEnd) {
    const slotEnd = addMinutes(currentTime, sessionDuration);
    
    // Check if slot extends beyond available hours
    if (slotEnd > dayEnd) {
      break;
    }
    
    // Check if slot conflicts with existing bookings
    const slotStart = cloneDate(currentTime);
    const slotEndWithBuffer = addMinutes(slotEnd, bufferTime);
    
    if (isTimeSlotAvailable(slotStart, slotEndWithBuffer, existingBookings)) {
      slots.push({ start: slotStart, end: slotEnd });
    }
    
    // Move to next potential slot
    currentTime = addMinutes(currentTime, 30); // 30-minute intervals
  }
  
  return slots;
}; 